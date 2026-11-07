"use client";

import { User } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import Modal from "../Modal";
import Input from "../inputs/Input";
import Image from "next/image";
import { CldUploadButton } from "next-cloudinary";
import Button from "../Button";
import { HiCamera } from "react-icons/hi2";

interface SettingsModalProps {
  isOpen?: boolean;
  onClose: () => void;
  currentUser: User;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentUser,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: currentUser?.name || "",
      image: currentUser?.image || "",
    },
  });

  const image = watch("image");

  const handleUpload = (result: any) => {
    setValue("image", result?.info?.secure_url, {
      shouldValidate: true,
    });
  };

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    axios
      .post("/api/settings", data)
      .then(() => {
        toast.success("Profile updated!");
        router.refresh();
        onClose();
      })
      .catch(() => toast.error("Something went wrong!"))
      .finally(() => setIsLoading(false));
  };

  const cloudName =
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "demo";
  const uploadPreset =
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_PRESET || "gq4u6y4n";

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-6">
          <div className="border-b border-slate-800 pb-6">
            <h2 className="text-xl font-bold text-slate-100">
              Passenger Profile
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Personalize how your identity appears across conversations.
            </p>

            <div className="mt-6 flex flex-col gap-y-6">
              <Input
                disabled={isLoading}
                label="Display Name"
                id="name"
                errors={errors}
                required
                register={register}
                placeholder="Your name"
              />

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Profile Photo
                </label>
                <div className="flex items-center gap-x-4">
                  <div className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-indigo-500/50 bg-slate-800">
                    <Image
                      fill
                      sizes="64px"
                      className="object-cover"
                      src={image || currentUser?.image || "/images/placeholder.jpg"}
                      alt="Avatar"
                    />
                  </div>
                  <CldUploadButton
                    options={{ maxFiles: 1 }}
                    config={{ cloud: { cloudName } }}
                    onSuccess={handleUpload}
                    onError={(error: any) => {
                      console.error("Cloudinary upload error:", error);
                      toast.error("Upload failed");
                    }}
                    uploadPreset={uploadPreset}
                  >
                    <span className="inline-flex items-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-slate-200 border border-slate-700/60 px-4 py-2 text-sm font-medium transition cursor-pointer">
                      <HiCamera size={18} className="text-indigo-400" />
                      Upload New
                    </span>
                  </CldUploadButton>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-x-3 pt-2">
            <Button disabled={isLoading} secondary onClick={onClose}>
              Cancel
            </Button>
            <Button disabled={isLoading} type="submit">
              Save Changes
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default SettingsModal;
