"use client";
import React from "react";

import useSubscription from "./hooks/useSubscription";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { Loader, Trash } from "lucide-react";
import { deleteDocument } from "@/actions/deleteDocument";

const DeleteButton = ({ docId }: { docId: string }) => {
  const { hasActiveSubscription, fetching } = useSubscription();

  return (
    <div>
      {fetching ? (
        <>
          <Button variant="default">
            <Loader className="animate-spin" size={18} />
          </Button>
        </>
      ) : hasActiveSubscription ? (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              className="border border-white hover:bg-white hover:text-orange-500"
              variant="default"
            >
              <Trash size={18} />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Document</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this document? This action
                cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={async () => {
                  await deleteDocument(docId);
                }}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : null}
    </div>
  );
};

export default DeleteButton;
