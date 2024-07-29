"use client";

import { db } from "@/firebase";
import { useUser } from "@clerk/nextjs";
import { collection, doc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";

const FREE_PLAN = 5;
const PRO_PLAN = 20;

function useSubscription() {
  const { user } = useUser();

  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [subscriptionType, setSubscriptionType] = useState<string | null>(null);
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
    if (loading) return; // Ensure loading state is checked
    if (!snapshot) {
      setFetching(false); // Set fetching to false if no snapshot
      return;
    }
    const data = snapshot.data();
    if (!data) {
      setFetching(false); // Set fetching to false if no data
      return;
    }

    // console.log("User subscription data: ", data);

    setHasActiveSubscription(data.hasActiveSubscription);
    setSubscriptionType(data.subscriptionType || "free");
    setFetching(false);
  }, [snapshot, loading]);

  useEffect(() => {
    if (fileLoading || subscriptionType === null) return; // Ensure file loading state is checked
    if (!fileSnapShot) {
      setFetching(false); // Set fetching to false if no file snapshot
      return;
    }

    const files = fileSnapShot.docs;
    const userLimit = subscriptionType === "free" ? FREE_PLAN : PRO_PLAN;

    // console.log("User files: ", files.length);
    // console.log("User limit: ", userLimit);

    setIsFileLimitOver(files.length >= userLimit);

    // console.log("isFileLimitOver hooks: ", files.length >= userLimit);
  }, [fileSnapShot, fileLoading, subscriptionType]);

  return { hasActiveSubscription, isFileLimitOver, fetching, error };
}

export default useSubscription;
