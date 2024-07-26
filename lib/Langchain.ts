import { ChatOpenAI } from "@langchain/openai";
import { OpenAIEmbeddings } from "@langchain/openai";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import pineconeClient from "./pincone";
import { PineconeStore } from "@langchain/pinecone";
import { PineconeConflictError } from "@pinecone-database/pinecone/dist/errors";
import { Index, RecordMetadata } from "@pinecone-database/pinecone";
import { auth } from "@clerk/nextjs/server";
import { doc } from "firebase/firestore";
import { adminDB } from "@/firebaseAdmin";

const model = new ChatOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  modelName: "gpt-3.5-turbo",
});

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

  const downloadURL = await docRef.data()?.url;

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

  // split the document into smaller chunks

  console.log("----Splitting Document into smaller chunks----");

  const splitter = new RecursiveCharacterTextSplitter();

  const chunks = await splitter.splitDocuments(docs);

  console.log(`----Splitting Done, ${chunks.length} chunks found----`);

  return chunks;
}

async function namespaceexist(index: Index<RecordMetadata>, namespace: string) {
  if (!namespace) {
    throw new Error("Namespace not found");
  }

  const { namespaces } = await index.describeIndexStats();

  return namespaces?.[namespace] !== undefined;
}

export const indexName = "baatsheet";

export async function generateEmbeddingsInPineconeVectorDB(docID: string) {
  const userId = await auth();
  if (!userId) {
    throw new Error("User not found");
  }

  let pineconeVectorStore;

  console.log("----Generating Embeddings in Pinecone Vector DB----");

  const embeddings = new OpenAIEmbeddings({
    model: "text-embedding-3-small",
  });

  const index = await pineconeClient.index(indexName);

  const nameSpaceAlreadyExists = await namespaceexist(index, docID);

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
    // if the namespace does not exist, download the pdf from firebase storage via the download URL and generate embeddings and then store them in pinecone

    const slpitDocs = await generateDocs(docID);

    console.log(
      `Storing the embeddings in ${docID} in the ${indexName} Pinecone Vector DB`
    );

    pineconeVectorStore = await PineconeStore.fromDocuments(
      slpitDocs,
      embeddings,
      {
        pineconeIndex: index,
        namespace: docID,
      }
    );
    return pineconeVectorStore;
  }
}
