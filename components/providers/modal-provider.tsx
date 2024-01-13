"use client";
import { useState, useEffect } from "react";
import { CreateServerModal } from "@/components/modals/create-server-modal";
export const ModalProvider = () => {
  const [mount, setMount] = useState(false);
  useEffect(() => {
    setMount(true);
  }, []);
  if (!mount) {
    return;
  }
  return (
    <>
      <CreateServerModal />
    </>
  );
};
