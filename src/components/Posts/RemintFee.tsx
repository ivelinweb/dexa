import React, { useEffect } from "react";
import * as Popover from "@radix-ui/react-popover";
import Input from "../Form/Input";
import { Tokens } from "@/config/tokens";
import Label from "../Form/Label";
import { Coin } from "@/interfaces/feed.interface";

type Props = {
  onInput: (value: string) => void;
  value?: string;
  selectedCoin?: Coin;
  onSelectCoin: (token: Coin) => void;
};

function RemintFee({ onInput, value, selectedCoin, onSelectCoin }: Props) {

  useEffect(() => {
    if (!selectedCoin) {
      onSelectCoin(Tokens[1]);
    }
  }, [selectedCoin]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onInput(e.target.value);
  };

  return (
    <Popover.Root>
      <Popover.Trigger className="outline-none">
        <div className="flex items-center gap-1 border border-primary px-2 rounded-md">
          <p className="text-sm text-primary font-semibold">Remint Fee</p>
        </div>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="shadow-xl z-50 pt-3 w-60 outline-none border border-medium/20 bg-white overflow-hidden rounded-lg"
          sideOffset={5}
        >
          <div className="pb-1 text-sm px-4">
            <p className="font-bold">Setup remint fee</p>
            <p className="text-medium">
              What will users pay to remint your post?
            </p>
          </div>
          <div className="flex flex-col mt-2 outline-primary rounded-lg overflow-hidden bg-white">
            <div className="px-4">
              <Label title="Set Price" isRequired={true} />
            </div>
            <Input
              type={"tel"}
              className="text-xl p-0 h-[2rem] select-none"
              isOutline={false}
              onChange={onChange}
              value={value}
              placeholder="0.00"
              autoFocus={false}
            />
          </div>
          <div className="flex gap-2 px-4 mt-2 mb-3">
            {Tokens.map((token, i) => (
              <div
                key={i}
                onClick={() => onSelectCoin(token)}
                className={`flex border border-medium/20 hover:bg-primary/20 items-center gap-2 p-2 cursor-pointer ${
                  token.symbol == selectedCoin?.symbol
                    ? "bg-primary/20"
                    : "bg-white"
                }`}
              >
                <token.icon />
              </div>
            ))}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

export default RemintFee;
