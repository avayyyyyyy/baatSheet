import { ChatOpenAI } from "@langchain/openai";
import { OpenAIEmbeddings } from "@langchain/openai";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { PineconeStore } from "@langchain/pinecone";
import { Index, RecordMetadata } from "@pinecone-database/pinecone";
import { auth } from "@clerk/nextjs/server";
import { adminDB } from "@/firebaseAdmin";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import pineconeClient from "./pincone";

const model = new ChatOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  modelName: "gpt-3.5-turbo",
});

export async function fetchMessageFromDB(docID: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not found");
  }

  const chatRef = await adminDB
    .collection("users")
    .doc(userId)
    .collection("files")
    .doc(docID)
    .collection("chat")
    .orderBy("createdAt", "desc")
    .get();

  const chatHistory = chatRef.docs.map((doc) =>
    doc.data().role === "human"
      ? new HumanMessage(doc.data().message)
      : new AIMessage(doc.data().message)
  );

  console.log(`Fetched ${chatHistory.length} messages from the database`);
  console.log(chatHistory.map((msg) => msg.content.toString()));
  return chatHistory;
}

export async function generateDocs(docID: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not found");
  }

  const docRef = await adminDB
    .collection("users")
    .doc(userId)
    .collection("files")
    .doc(docID)
    .get();

  const downloadURL = docRef.data()?.url;

  console.log(docRef.data()?.url);

  if (!downloadURL) {
    throw new Error("Download URL not found");
  }

  console.log("----Download URL Found Successfully----");

  const response = await fetch(downloadURL);

  const data = await response.blob();

  console.log("----Loading PDF Document----");

  const pdfLoader = new PDFLoader(data);

  const docs = await pdfLoader.load();

  console.log("----Splitting Document into smaller chunks----");

  const splitter = new RecursiveCharacterTextSplitter();

  const chunks = await splitter.splitDocuments(docs);

  console.log(`----Splitting Done, ${chunks.length} chunks found----`);

  return chunks;
}

async function namespaceExists(
  index: Index<RecordMetadata>,
  namespace: string
) {
  if (!namespace) {
    throw new Error("Namespace not found");
  }

  const { namespaces } = await index.describeIndexStats();

  return namespaces?.[namespace] !== undefined;
}

export const indexName = "baatsheet";

export async function generateEmbeddingsInPineconeVectorDB(docID: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not found");
  }

  let pineconeVectorStore;

  console.log("----Generating Embeddings in Pinecone Vector DB----");

  const embeddings = new OpenAIEmbeddings({
    model: "text-embedding-ada-002",
  });

  const index = await pineconeClient.index(indexName);

  const nameSpaceAlreadyExists = await namespaceExists(index, docID);

  if (nameSpaceAlreadyExists) {
    console.log(
      `---Namespace ${docID} already exists, reusing existing embeddings...---`
    );
    pineconeVectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex: index,
      namespace: docID,
    });
    return pineconeVectorStore;
  } else {
    const splitDocs = await generateDocs(docID);

    console.log(
      `Storing the embeddings in ${docID} in the ${indexName} Pinecone Vector DB`
    );

    pineconeVectorStore = await PineconeStore.fromDocuments(
      splitDocs,
      embeddings,
      {
        pineconeIndex: index,
        namespace: docID,
      }
    );
    return pineconeVectorStore;
  }
}

const generateLangchainCompletion = async (docID: string, question: string) => {
  let pineconeStore;

  pineconeStore = await generateEmbeddingsInPineconeVectorDB(docID);
  console.log("----Creating Langchain Retriever----");
  const retrievalChain = pineconeStore.asRetriever();

  const chatHistory = await fetchMessageFromDB(docID);

  console.log("Defining a prompt template");

  const historyAwarePromptTemplate = ChatPromptTemplate.fromMessages([
    ...chatHistory,
    ["user", "{input}"],
    [
      "user",
      "Given the conversation above, provide a search query to look up relevant information from the conversation.",
    ],
  ]);

  const historyAwareRetrieverChain = await createHistoryAwareRetriever({
    llm: model,
    retriever: retrievalChain,
    rephrasePrompt: historyAwarePromptTemplate,
  });

  console.log("---Defining a prompt template to answer the question---");

  const questionPromptTemplate = ChatPromptTemplate.fromMessages([
    [
      "system",
      "Answer the user question based on the below content: \n\n {context}",
    ],
    ...chatHistory,
    ["user", question],
  ]);

  const historyCombinedDocsChain = await createStuffDocumentsChain({
    llm: model,
    prompt: questionPromptTemplate,
  });

  console.log("Creating the main retrieval chain");

  const conversationalRetrievalChain = await createRetrievalChain({
    retriever: historyAwareRetrieverChain,
    combineDocsChain: historyCombinedDocsChain,
  });

  const result = await conversationalRetrievalChain.invoke({
    chat_history: chatHistory,
    input: question,
  });

  console.log(result);
  return result.answer;
};

export { model, generateLangchainCompletion };
