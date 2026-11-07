"use client";

import Modal from "@/app/components/Modal";
import Image from "next/image";

interface ImageModalProps {
  isOpen?: boolean;
  onClose: () => void;
  src?: string | null;
}

const ImageModal: React.FC<ImageModalProps> = ({ isOpen, onClose, src }) => {
  if (!src) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="relative w-full h-[400px] sm:h-[500px] rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center">
        <Image
          alt="Shared Image Preview"
          className="object-contain"
          fill
          sizes="(max-width: 768px) 100vw, 600px"
          src={src}
        />
      </div>
    </Modal>
  );
};

export default ImageModal;
