"use client";

import React, { Fragment, useEffect, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, EarthLockIcon, EarthIcon, LucideIcon } from "lucide-react";
import { GnfVisibility } from "@/interfaces/bucket.interface";

type Options = {
  id: GnfVisibility;
  title: string;
  icon: LucideIcon;
};

const options: Options[] = [
  {
    id: GnfVisibility.VISIBILITY_TYPE_PUBLIC_READ,
    title: "Public",
    icon: EarthIcon,
  },
  {
    id: GnfVisibility.VISIBILITY_TYPE_PRIVATE,
    title: "Private",
    icon: EarthLockIcon,
  },
];

type Props = {
  onSelect: (option: Options) => void;
};

function ToggleMintType({ onSelect }: Props) {
  const [selected, setSelected] = useState(options[0]);

  useEffect(() => {
    onSelect(selected);
  }, [selected]);

  const onChange = (option: Options) => {
    setSelected(option);
    onSelect(option);
  };

  return (
    <Listbox value={selected} onChange={onChange}>
      <div className="relative">
        <Listbox.Button className="relative w-full cursor-pointer group flex items-center space-x-1">
          <selected.icon
            size={18}
            className="text-primary group-hover:text-primary/90"
          />
          <p className="text-primary font-semibold group-hover:text-primary/90">
            {selected.title}
          </p>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute mt-1 max-h-60 w-[20rem] bg-white overflow-auto rounded-xl shadow-lg ring-1 ring-dark/5 focus:outline-none sm:text-sm">
            <div className="px-4 pt-3 pb-3">
              <p className="font-bold">Choose your audient?</p>
              <p className="text-medium">
                Select who can view this post when it goes life on-chain.
              </p>
            </div>
            {options.map((option, index) => (
              <Listbox.Option
                key={index}
                className="py-2 hover:bg-light px-4 cursor-pointer"
                value={option}
              >
                {({ selected }) => (
                  <div className="flex items-center justify-between space-x-14">
                    <div className="flex items-center space-x-3">
                      <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center">
                        <option.icon size={18} className="text-white" />
                      </div>
                      <p
                        className={`${
                          selected ? "text-primary" : "text-dark"
                        } font-semibold`}
                      >
                        {option.title}
                      </p>
                    </div>
                    {selected ? (
                      <span className="text-primary">
                        <CheckIcon size={18} aria-hidden="true" />
                      </span>
                    ) : null}
                  </div>
                )}
              </Listbox.Option>
            ))}
            <div className="mt-2"></div>
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}

export default ToggleMintType;
