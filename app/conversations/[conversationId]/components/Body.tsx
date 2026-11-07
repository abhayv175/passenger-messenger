"use client";

import { useEffect, useRef, useState } from "react";
import useConversation from "@/app/hooks/useConversation";
import { FullMessageType } from "@/app/types";
import MessageBox from "./MessageBox";
import axios from "axios";
import { pusherClient } from "@/app/libs/pusher";
import { find } from "lodash";

interface BodyProps {
  initialMessages: FullMessageType[];
}

const Body: React.FC<BodyProps> = ({ initialMessages }) => {
  const [messages, setMessages] = useState<FullMessageType[]>(initialMessages);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { conversationId } = useConversation();

  useEffect(() => {
    if (conversationId) {
      axios.post(`/api/conversations/${conversationId}/seen`).catch(() => {});
    }
  }, [conversationId]);

  useEffect(() => {
    bottomRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!conversationId) return;

    const channel = pusherClient.subscribe(conversationId);
    bottomRef?.current?.scrollIntoView({ behavior: "smooth" });

    const messageHandler = (message: FullMessageType) => {
      axios.post(`/api/conversations/${conversationId}/seen`).catch(() => {});

      setMessages((current) => {
        if (find(current, { id: message.id })) {
          return current;
        }
        return [...current, message];
      });

      bottomRef?.current?.scrollIntoView({ behavior: "smooth" });
    };

    const updateMessageHandler = (newMessage: FullMessageType) => {
      setMessages((current) =>
        current.map((currentMessage) => {
          if (currentMessage.id === newMessage.id) {
            return newMessage;
          }
          return currentMessage;
        })
      );
    };

    channel.bind("messages:new", messageHandler);
    channel.bind("message:update", updateMessageHandler);

    return () => {
      channel.unbind("messages:new", messageHandler);
      channel.unbind("message:update", updateMessageHandler);
      pusherClient.unsubscribe(conversationId);
    };
  }, [conversationId]);

  return (
    <div
      className="
        flex-1
        overflow-y-auto
        py-4
        bg-gradient-to-b
        from-slate-950
        via-slate-900/40
        to-slate-950
        relative
      "
    >
      {messages.length === 0 ? (
        <div className="flex h-full items-center justify-center text-center p-8">
          <div className="max-w-xs space-y-2">
            <div className="h-10 w-10 mx-auto rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              💬
            </div>
            <p className="text-sm font-medium text-slate-300">
              No messages yet
            </p>
            <p className="text-xs text-slate-500">
              Send a greeting or image below to kick off the conversation.
            </p>
          </div>
        </div>
      ) : (
        messages.map((message, i) => (
          <MessageBox
            isLast={i === messages.length - 1}
            key={message.id}
            data={message}
          />
        ))
      )}
      <div ref={bottomRef} className="pt-2" />
    </div>
  );
};

export default Body;
