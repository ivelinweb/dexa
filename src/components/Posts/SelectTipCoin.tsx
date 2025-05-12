import React, { useEffect, useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { ChevronDownIcon } from "lucide-react";
import { Coin } from "@/interfaces/feed.interface";
import { Tokens } from "@/config/tokens";

type SelectTipProps = {
  onSelect: (value: Coin) => void;
};

function SelectTipCoin({ onSelect }: SelectTipProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [token, setToken] = useState<Coin>(Tokens[0]);

  useEffect(() => {
    if (token) onSelect(token);
  }, [token]);

  const selectToken = (token: any) => {
    setToken(token);
    setIsOpen(false);
    onSelect(token);
  };

  return (
    <Popover.Root open={isOpen}>
      <Popover.Trigger
        className="outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-1">
          <token.icon />
          <ChevronDownIcon size={18} />
        </div>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="shadow-xl z-50 w-40 outline-none border border-medium/20 bg-white overflow-hidden rounded-md"
          sideOffset={5}
        >
          {Tokens.map((token, i) => (
            <div
              key={i}
              onClick={() => selectToken(token)}
              className="flex items-center gap-2 p-2 hover:bg-light cursor-pointer border-b last:border-none border-medium/20"
            >
              <token.icon />
              <span>{token.name}</span>
            </div>
          ))}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

export default SelectTipCoin;
