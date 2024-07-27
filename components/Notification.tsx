"use client";

import { useEffect } from "react";
import { toast } from "sonner";

interface NotificationProps {
  upgrade: string | null;
}

const Notification = ({ upgrade }: NotificationProps) => {
  useEffect(() => {
    if (upgrade === "true") {
      toast("Congratulations! 🥳 You have successfully become the pro member.");
    }
  }, [upgrade]);

  return null;
};

export default Notification;
