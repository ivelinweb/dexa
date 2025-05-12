"use client";

import React, { useEffect } from "react";
import Button from "@/components/Form/Button";
import { Link2Icon, MailIcon, Share2Icon } from "lucide-react";
import { Post } from "@/interfaces/feed.interface";
import * as Popover from "@radix-ui/react-popover";
import {
  EmailShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";
import {
  FacebookIcon,
  LinkedinIcon,
  TelegramIcon,
  WhatsappIcon,
  XIcon,
} from "react-share";
import { HOSTNAME } from "@/config/env";
import useClipBoard from "@/hooks/clipboard.hook";
import useToast from "@/hooks/toast.hook";

type Props = {
  post: Post;
};

function ShareButton({ post }: Props) {
  const { copy, isCopied } = useClipBoard();
  const { success } = useToast();

  useEffect(() => {
    if (isCopied) {
      success({ msg: "Copied to clipboard" });
    }
  }, [isCopied]);

  const prevent = (
    e:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.stopPropagation();
  };

  return (
    <>
      <Popover.Root>
        <Popover.Trigger onClick={prevent} className="outline-none">
          <Button
            type={"button"}
            kind={"default"}
            shape={"CIRCLE"}
            className="text-dark group-hover:text-primary group-hover:bg-primary/20"
            hoverColor={false}
            title="Share"
          >
            <Share2Icon size={18} />
          </Button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            className="shadow-xl z-50 outline-none border border-medium/20 bg-white overflow-hidden rounded-lg"
            sideOffset={5}
          >
            <div className="flex flex-col">
              <div
                role="button"
                onClick={(e) => {
                  copy(`${HOSTNAME}/mints/?id=${post.id}`);
                  prevent(e);
                }}
                className="px-4 flex items-center gap-x-2 py-2 cursor-pointer hover:bg-light"
              >
                <Link2Icon />
                <p className="font-semibold">Copy link</p>
              </div>
              <EmailShareButton
                url={`${HOSTNAME}/mints/?id=${post.id}`}
                //onClick={prevent}
              >
                <div className="px-4 flex items-center gap-x-2 py-2 cursor-pointer hover:bg-light">
                  <MailIcon />
                  <p className="font-semibold">Send to mail</p>
                </div>
              </EmailShareButton>

              <div className="px-4 flex items-center border-t border-light gap-x-3 py-3 cursor-pointer">
                <WhatsappShareButton
                  onClick={prevent}
                  url={`${HOSTNAME}/mints/?id=${post.id}`}
                >
                  <WhatsappIcon className="rounded-lg" size={30} />
                </WhatsappShareButton>
                <TelegramShareButton
                  onClick={prevent}
                  url={`${HOSTNAME}/mints/?id=${post.id}`}
                >
                  <TelegramIcon className="rounded-lg" size={30} />
                </TelegramShareButton>
                <TwitterShareButton
                  onClick={prevent}
                  url={`${HOSTNAME}/mints/?id=${post.id}`}
                >
                  <XIcon className="rounded-lg" size={30} />
                </TwitterShareButton>
                <FacebookShareButton
                  onClick={prevent}
                  url={`${HOSTNAME}/mints/?id=${post.id}`}
                >
                  <FacebookIcon className="rounded-lg" size={30} />
                </FacebookShareButton>
                <LinkedinShareButton
                  onClick={prevent}
                  url={`${HOSTNAME}/mints/?id=${post.id}`}
                >
                  <LinkedinIcon className="rounded-lg" size={30} />
                </LinkedinShareButton>
              </div>
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </>
  );
}

export default ShareButton;
