"use client";

import React, { useRef } from "react";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

interface MessageInputProps {
  placeholder?: string;
  id: string;
  type?: string;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  onEnterSubmit?: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  placeholder,
  id,
  required,
  register,
  onEnterSubmit,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const { ref, onChange, ...rest } = register(id, { required });

  const adjustHeight = (el: HTMLTextAreaElement) => {
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onEnterSubmit?.();
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  return (
    <div className="relative w-full flex items-center">
      <textarea
        id={id}
        rows={1}
        autoComplete="off"
        placeholder={placeholder}
        onKeyDown={handleKeyDown}
        {...rest}
        ref={(e) => {
          ref(e);
          textareaRef.current = e;
        }}
        onChange={(e) => {
          onChange(e);
          adjustHeight(e.target);
        }}
        className="
          w-full
          resize-none
          max-h-32
          rounded-2xl
          bg-slate-950/70
          border
          border-slate-800
          py-2.5
          px-4
          text-sm
          text-slate-100
          placeholder:text-slate-500
          focus:outline-none
          focus:border-indigo-500
          focus:ring-2
          focus:ring-indigo-500/20
          transition-all
          duration-150
        "
      />
    </div>
  );
};

export default MessageInput;
