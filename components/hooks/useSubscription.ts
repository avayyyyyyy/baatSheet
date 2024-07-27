"use client";

import { db } from "@/firebase";
import { useUser } from "@clerk/nextjs";
import { collection, doc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";

const FREE_PLAN = 2;
const PRO_PLAN = 20;

function useSubscription() {
  const { user } = useUser();

  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [isFileLimitOver, setIsFileLimitOver] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [snapshot, loading, error] = useDocument(
    user && doc(db, "users", user.id),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  const [fileSnapShot, fileLoading] = useCollection(
    user && collection(db, "users", user.id, "files")
  );

  useEffect(() => {
    if (!snapshot) return;
    const data = snapshot.data();

    if (!data) return;

    console.log("User subscription data: ", data);

    setHasActiveSubscription(data.hasActiveSubscription);
    setFetching(false);
    console.log(hasActiveSubscription);
  }, [snapshot]);

  useEffect(() => {
    if (!fileSnapShot || hasActiveSubscription === null) return;

    const files = fileSnapShot.docs;
    const userLimit = hasActiveSubscription === "free" ? FREE_PLAN : PRO_PLAN;

    console.log("User files: ", files);
    console.log("User limit: ", userLimit);

    setIsFileLimitOver(files.length >= userLimit);

    console.log("isFileLimitOver: ", files.length >= userLimit);
  }, [fileSnapShot, hasActiveSubscription]);

  return { hasActiveSubscription, isFileLimitOver, fetching, error };
}

export default useSubscription;