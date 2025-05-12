import React from "react";

import { getFirstLetters, stringToColor } from "@/libs/helpers";
import { ReceivedChatMessage } from "@livekit/components-react";
import Moment from "react-moment";

type Props = {
  msg: ReceivedChatMessage;
};

function ChatItem({ msg }: Props) {
  const color = stringToColor(`${msg.from?.name}`);
  return (
    <div className={`flex items-start py-2 gap-x-2`}>
      <div
        className={`h-6 w-6 flex items-center justify-center rounded-full`}
        style={{ backgroundColor: color }}
      >
        <p className="text-xs text-white">
          {getFirstLetters(`${msg.from?.name}`)}
        </p>
      </div>
      <div className="flex flex-col flex-1">
        <p className="text-xs text-medium">
          <span className="font-semibold" style={{ color: color }}>
            {msg.from?.name}
          </span>
          <span className="text-xs pl-2">
            <Moment format="hh:mm A">{new Date(msg.timestamp)}</Moment>
          </span>
        </p>
        <p className="text-sm">{msg.message}</p>
      </div>
    </div>
  );
}

export default ChatItem;
