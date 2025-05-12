import React from "react";
import ListConnectors from "./ListConnectors";
import Button from "../Form/Button";
import { Wallet2Icon, XIcon } from "lucide-react";
type Props = {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
};
function WalletConnectModal({ setModal }: Props) {
  return (
    <div className="absolute inset-0 bg-dark/20">
      <div className="h-full flex items-center max-w-md mx-auto p-5">
        <div className="bg-light rounded-3xl p-5 w-full transition-transform duration-500">
          <div className="pb-6 flex items-center justify-between">
            <Button
              type={"button"}
              kind={"default"}
              shape={"CIRCLE"}
              className="text-primary bg-primary/20"
            >
              <Wallet2Icon height={18} />
            </Button>
            <p>Connect Wallet</p>
            <Button
              type={"button"}
              kind={"default"}
              shape={"CIRCLE"}
              className="text-dark hover:text-primary hover:bg-primary/20"
              onClick={() => setModal(false)}
            >
              <XIcon height={18} />
            </Button>
          </div>
          <div className="flex flex-col w-full">
            <ListConnectors onCloseModal={setModal} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default WalletConnectModal;
