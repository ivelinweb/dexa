import { LockIcon } from "lucide-react";
import React from "react";

function EmptyChat() {
  return (
    <div className="w-auto hidden lg:block bg-primary/5 min-h-screen">
      <div className="text-dark border-b-4 border-primary flex items-center flex-col justify-between text-center min-h-screen">
        <div></div>
        <div>
          <h1 className="text-2xl font-medium">Dexa Messenger</h1>
          <p className="text-dark/40 font-normal mt-4">
            <span className="block">
              You can now send and recieved encrypted and unsensored
            </span>
            <span className="block">
              messages on the blockchain with Metachat Messenger
            </span>
          </p>
        </div>
        <p className="py-3 flex items-center">
          <LockIcon size={18} className="text-primary h-5 w-5" /> Unsensored
          Messenger
        </p>
      </div>
    </div>
  );
}

export default EmptyChat;
