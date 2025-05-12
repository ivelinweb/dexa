"use client";

import {
  EllipsisVerticalIcon,
  MessageSquareMoreIcon,
  PlusIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import FriendList from "./FriendList";
import { useDexaMessenger } from "@/context/dexa-messenger.context";

function ChatSidebar() {
  const [width, setWidth] = useState(0);
  const { messages, currentMsg, setMessages, isMsgBoxOn } = useDexaMessenger();

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (currentMsg) {
      const isExist = messages.find(
        (f) => f.profile?.id == currentMsg.profile?.id
      );
      if (!isExist) {
        setMessages((prev) => {
          const temp = [...prev];
          temp.push(currentMsg);
          return temp;
        });
      }
    }
  }, [currentMsg, messages]);

  const newContact = () => {};

  return (
    <div
      className={`w-full ${width < 1024 ? "w-full" : "w-4/5"} ${
        isMsgBoxOn && width <= 1024 && "hidden"
      } lg:w-[20rem] xl:w-[25rem] border-r border-light relative`}
    >
      <div className="overflow-y-scroll h-screen">
        <header className="sticky top-0">
          <div className="flex items-center justify-between h-14 bg-primary/40 px-4">
            <div className="flex space-x-2">
              <p className="text-xl font-semibold">Messages</p>
            </div>
            <div className="flex items-center space-x-2 justify-between">
              <button className="h-10 w-10 rounded-full hover:bg-light/80 flex items-center justify-center">
                <MessageSquareMoreIcon
                  size={18}
                  className="h-6 w-6 dark:text-gray-200"
                />
              </button>
              <button className="h-10 w-10 rounded-full hover:bg-light/80 flex items-center justify-center">
                <EllipsisVerticalIcon
                  size={18}
                  className="h-6 w-6 dark:text-gray-200"
                />
              </button>
            </div>
          </div>
          <div className="px-4 bg-primary/15 h-14 flex items-center">
            <input
              type="search"
              name=""
              placeholder="search messages"
              className="w-full outline-none px-3 rounded-md h-10"
            />
          </div>
        </header>
        <section className="overflow-y-scroll">
          {messages && messages.length > 0 ? (
            <>
              {messages.map((contact, index) => (
                <div
                  key={index}
                  className={`hover:cursor-pointer border-b border-light hover:bg-primary/5 py-2 px-4`}
                >
                  <FriendList
                    contact={contact.profile}
                    messages={contact.chats}
                  />
                </div>
              ))}
            </>
          ) : (
            <div className="py-2 px-5 text-center">
              <h1 className="font-normal text-lg">No Connect</h1>
              <p className="font-normal text-medium text-sm">
                You do not have any connect yet, send someone a message now.
              </p>
            </div>
          )}
        </section>
        <div className="absolute bottom-20 xs:bottom-5 right-5">
          <button
            onClick={newContact}
            className="w-14 flex items-center justify-center h-14 bg-gradient-to-r from-primary via-primary to-primary/60 text-white rounded-full"
          >
            <PlusIcon size={18} className="h-10 w-10" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatSidebar;
