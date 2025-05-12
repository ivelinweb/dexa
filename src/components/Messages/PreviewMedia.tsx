"use client";

import React, { Fragment, useEffect, useState, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Button from "../Form/Button";
import {
  ImageIcon,
  ImagesIcon,
  SendHorizonalIcon,
  SmilePlusIcon,
  XIcon,
} from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import FileSelector from "../ui/FileSelector";
import MediaPreview from "../ui/MediaPreview";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import Input from "../Form/Input";

type Props = {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  msg?: string;
  setMsg: React.Dispatch<React.SetStateAction<string | undefined>>;
  onSubmit: () => Promise<void>;
  isDisabled: boolean;
};

function PreviewMedia({
  isOpen,
  setIsOpen,
  files,
  setFiles,
  msg,
  setMsg,
  onSubmit,
  isDisabled,
}: Props) {
  const { control } = useForm();
  const mediaRef = useRef<HTMLInputElement>(null);

  function closeModal() {
    setIsOpen(false);
    setFiles([]);
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() => setIsOpen(true)}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-dark/40" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-start pt-10 justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-xl flex flex-col justify-between transform overflow-hidden rounded-2xl bg-white p-4 text-left align-middle max-h-[40rem] shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg flex pb-10 bg-white justify-between items-center leading-6 m-0 text-dark/80"
                >
                  <div className="flex items-center gap-x-2">
                    <Button
                      shape={"CIRCLE"}
                      kind="clear"
                      type={"button"}
                      onClick={closeModal}
                      className={"hover:bg-medium/20 bg-medium/10"}
                    >
                      <XIcon size={22} className="text-primary" />
                    </Button>
                  </div>
                </Dialog.Title>

                {files && (
                  <div className="flex-1 overflow-hidden relative flex items-center justify-center">
                    {files.length > 1 && (
                      <div className="absolute bg-dark/70 z-10 h-10 w-10 rounded-full flex items-center justify-center">
                        <p className="text-white text-lg">{files.length}</p>
                      </div>
                    )}
                    {files.length > 1 ? (
                      <Swiper slidesPerView={1} loop={false} speed={100}>
                        {files.map((file, index) => (
                          <SwiperSlide key={index}>
                            <MediaPreview file={file} key={index} />
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    ) : (
                      <div className="flex-1 flex flex-col relative">
                        {files.map((file, i) => (
                          <MediaPreview file={file} key={i} />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="flex flex-col justify-between pt-10">
                  <div className="flex bg-primary/5 border border-light overflow-hidden rounded-3xl">
                    <>
                      <FileSelector
                        onSelect={(ev) => {
                          if (ev.target.files) {
                            const file = ev.target.files;
                            const arr = Array.from(file);
                            setFiles([...arr, ...files]);
                          }
                        }}
                        ref={mediaRef}
                        accept="image/png, image/jpeg"
                        multiple={true}
                      />
                      <Button
                        onClick={() => mediaRef.current?.click()}
                        type={"button"}
                        kind={"clear"}
                        className="bg-transparent"
                      >
                        <ImagesIcon size={18} className="text-primary" />
                      </Button>
                    </>

                    <Input
                      onChange={(e) => setMsg(e.currentTarget.value)}
                      placeholder="Add a caption"
                      className="outline-[0] px-[0] border-0 flex-1 bg-transparent h-10 text-sm"
                      value={msg}
                    />
                    <Button
                      type={"button"}
                      kind={"clear"}
                      className="bg-transparent"
                    >
                      <SmilePlusIcon size={18} className="text-primary" />
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2 justify-between mt-5">
                    <div className="bg-primary/30 px-3 py-1 rounded-3xl">
                      <p className="text-primary text-sm">Elon Musk</p>
                    </div>
                    <Button
                      type={"button"}
                      kind={"primary"}
                      shape={"CIRCLE"}
                      onClick={onSubmit}
                      disabled={isDisabled}
                    >
                      <SendHorizonalIcon size={14} />
                    </Button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default PreviewMedia;
