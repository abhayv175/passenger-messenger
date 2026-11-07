"use client";

import Button from "@/app/components/Button";
import Modal from "@/app/components/Modal";
import useConversation from "@/app/hooks/useConversation";
import { DialogTitle } from "@headlessui/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "react-hot-toast";
import { FiAlertTriangle } from "react-icons/fi";

interface ConfirmModalProps {
  isOpen?: boolean;
  onClose: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { conversationId } = useConversation();
  const [isLoading, setIsLoading] = useState(false);

  const onDelete = useCallback(() => {
    setIsLoading(true);

    axios
      .delete(`/api/conversations/${conversationId}`)
      .then(() => {
        toast.success("Dialogue deleted");
        onClose();
        router.push("/conversations");
        router.refresh();
      })
      .catch(() => toast.error("Could not delete dialogue!"))
      .finally(() => setIsLoading(false));
  }, [conversationId, router, onClose]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="sm:flex sm:items-start">
        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/20 sm:mx-0 sm:h-10 sm:w-10">
          <FiAlertTriangle className="h-5 w-5 text-rose-500" />
        </div>
        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
          <DialogTitle
            as="h3"
            className="text-lg font-bold text-slate-100"
          >
            Delete Dialogue
          </DialogTitle>
          <div className="mt-2">
            <p className="text-sm text-slate-400 leading-relaxed">
              Are you certain you wish to purge this conversation? This will permanently delete all transmitted messages for all participants.
            </p>
          </div>
        </div>
      </div>
      <div className="mt-6 sm:flex sm:flex-row-reverse gap-3">
        <Button disabled={isLoading} danger onClick={onDelete}>
          Delete Permanently
        </Button>
        <Button disabled={isLoading} secondary onClick={onClose}>
          Keep Conversation
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
