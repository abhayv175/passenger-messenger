'use client';

import React from "react";
import { Toaster } from "react-hot-toast";

const ToasterContext = () => {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        className: "!bg-slate-900 !text-slate-100 !border !border-slate-800 !rounded-xl !shadow-2xl !text-sm",
        duration: 3500,
        style: {
          background: "#0f172a",
          color: "#f8fafc",
          border: "1px solid rgba(51, 65, 85, 0.6)",
        },
      }}
    />
  );
};

export default ToasterContext;
