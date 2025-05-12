import { useAuth } from "@/context/auth.context";
import { walletToLowercase } from "@/libs/helpers";
import { WifiOffIcon } from "lucide-react";
import React from "react";

type Props = {
  hostId: string;
  isStreaming: boolean;
  username?: boolean;
};

function OfflineStream({ hostId, isStreaming, username }: Props) {
  const { user } = useAuth();
  const isCreator =
    walletToLowercase(`${user?.wallet}`) === walletToLowercase(hostId);

  return (
    <div className="bg-dark px-10 h-full w-full flex items-center justify-center">
      {isCreator && isStreaming ? (
        <div className="text-white text-sm text-center">
          <div>
            <div className="border-dark mx-auto h-10 w-10 animate-spin rounded-full border-4 border-t-medium mb-4" />
          </div>
          <p className="py-1">Connect streaming software to go live</p>
          <p className="py-1 text-medium">
            Viewers will be able to find your stream once you go live on Dexa
          </p>
          <p className="py-2 text-primary font-semibold bg-white mt-4">
            DO YOU NEED HELP?
          </p>
        </div>
      ) : (
        <div className="text-white text-center">
          <div className="mx-auto flex items-center justify-center">
            <WifiOffIcon size={60} className="text-light" />
          </div>
          <p className="mt-5 font-semibold">{hostId}</p>
          <p className="">is currently offline.</p>
        </div>
      )}
    </div>
  );
}

export default OfflineStream;
