"use client";

import useConversation from "@/app/hooks/useConversation";
import axios from "axios";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { HiPaperAirplane, HiPhoto } from "react-icons/hi2";
import { BsEmojiSmile } from "react-icons/bs";
import { CldUploadButton } from "next-cloudinary";
import { useState } from "react";
import MessageInput from "./MessageInput";

const QUICK_EMOJIS = ["😀", "😂", "😍", "👍", "🎉", "🔥", "🚀", "❤️", "💯", "✨"];

const Form = () => {
  const { conversationId } = useConversation();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    setFocus,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      message: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    if (!data.message?.trim()) return;
    setValue("message", "", { shouldValidate: true });

    axios.post("/api/messages", {
      ...data,
      conversationId,
    });
  };

  const handleUpload = (result: any) => {
    axios.post("/api/messages", {
      image: result?.info?.secure_url,
      conversationId,
    });
  };

  const handleSelectEmoji = (emoji: string) => {
    const current = getValues("message") || "";
    setValue("message", current + emoji, { shouldValidate: true });
    setShowEmojiPicker(false);
    setFocus("message");
  };

  const cloudName =
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "demo";
  const uploadPreset =
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_PRESET || "gq4u6y4n";

  const submitForm = handleSubmit(onSubmit);

  return (
    <div
      className="
        relative
        py-3
        px-3
        sm:px-6
        backdrop-blur-xl
        bg-slate-900/90
        border-t
        border-slate-800/80
        flex
        items-center
        gap-2
        lg:gap-3
        w-full
        z-20
      "
    >
      {/* Quick Emoji Picker Drawer / Menu */}
      {showEmojiPicker && (
        <div className="absolute bottom-16 left-6 z-30 p-2 rounded-2xl backdrop-blur-2xl bg-slate-900/95 border border-slate-700/80 shadow-2xl flex gap-1.5 animate-in fade-in zoom-in-95 duration-150">
          {QUICK_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => handleSelectEmoji(emoji)}
              className="text-lg hover:scale-125 transition-transform p-1.5 rounded-lg hover:bg-slate-800 cursor-pointer"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Cloudinary Photo Upload */}
      <CldUploadButton
        options={{ maxFiles: 1 }}
        config={{ cloud: { cloudName } }}
        onSuccess={handleUpload}
        onError={(err: any) => console.error("Cloudinary upload error:", err)}
        uploadPreset={uploadPreset}
      >
        <span
          title="Attach Image"
          className="
            p-2.5
            rounded-xl
            bg-slate-800/70
            hover:bg-slate-700/80
            text-slate-300
            hover:text-indigo-400
            border
            border-slate-700/50
            flex
            items-center
            justify-center
            transition-all
            duration-200
            cursor-pointer
          "
        >
          <HiPhoto size={20} />
        </span>
      </CldUploadButton>

      {/* Emoji Picker Button */}
      <button
        type="button"
        title="Insert Emoji"
        onClick={() => setShowEmojiPicker((prev) => !prev)}
        className="
          p-2.5
          rounded-xl
          bg-slate-800/70
          hover:bg-slate-700/80
          text-slate-300
          hover:text-indigo-400
          border
          border-slate-700/50
          flex
          items-center
          justify-center
          transition-all
          duration-200
          cursor-pointer
        "
      >
        <BsEmojiSmile size={19} />
      </button>

      {/* Main Message Form */}
      <form
        onSubmit={submitForm}
        className="flex items-center gap-2 lg:gap-3 w-full"
      >
        <MessageInput
          id="message"
          register={register}
          errors={errors}
          required
          placeholder="Transmit a message... (Enter to send, Shift+Enter for new line)"
          onEnterSubmit={submitForm}
        />
        <button
          type="submit"
          title="Send"
          className="
            rounded-2xl
            p-3
            bg-gradient-to-r
            from-indigo-600
            via-indigo-500
            to-violet-600
            hover:from-indigo-500
            hover:to-violet-500
            text-white
            shadow-lg
            shadow-indigo-950/40
            cursor-pointer
            transition-all
            duration-200
            active:scale-95
            shrink-0
          "
        >
          <HiPaperAirplane size={18} className="transform rotate-0" />
        </button>
      </form>
    </div>
  );
};

export default Form;
