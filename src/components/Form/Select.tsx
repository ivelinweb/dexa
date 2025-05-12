import React, { Fragment, useEffect, useState, useRef } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronDown, CircleCheckBigIcon } from "lucide-react";

export interface Options extends Record<string, any> {
  name: string;
  icon?: ({}) => React.JSX.Element;
  value: string;
}

interface Props {
  options: Options[];
  placeholder?: string;
  onSelect: (option: Options) => void;
  isReset?: boolean;
}

export default function Select({
  options,
  placeholder = "Select Option",
  onSelect,
  isReset = false,
}: Props) {
  const defaultValue = {
    name: placeholder,
    value: "",
  };
  const [selectedOption, setSelectedOption] = useState<Options>(defaultValue);
  const prevIsResetRef = useRef<boolean>();

  useEffect(() => {
    if (prevIsResetRef.current && !isReset) {
      setSelectedOption(defaultValue);
    }
    prevIsResetRef.current = isReset;
  }, [isReset]);

  const onChange = (option: Options) => {
    setSelectedOption(option);
    onSelect(option);
  };

  return (
    <Listbox value={selectedOption} onChange={onChange}>
      <div className="relative mt-1">
        <Listbox.Button
          className={`w-full px-4 text-left bg-light text-base h-[3.2rem] flex items-center justify-between`}
        >
          <div className="flex items-center gap-2 w-full overflow-hidden">
            {selectedOption?.icon && (
              <div className="h-8 w-8 rounded-full flex items-center justify-center">
                <selectedOption.icon />
              </div>
            )}
            {selectedOption && selectedOption.name != placeholder ? (
              <span className="truncate capitalize flex-1">
                {selectedOption.name}
              </span>
            ) : (
              <span className="truncate capitalize text-medium text-sm flex-1">
                {placeholder}
              </span>
            )}
          </div>
          <ChevronDown size={18} className="text-medium" aria-hidden="true" />
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options
            className={`bg-light mt-1 rounded-md shadow-sm absolute overflow-hidden z-50 right-0 left-0`}
          >
            {options.map((option, i) => (
              <Listbox.Option
                key={i}
                value={option}
                className={`hover:cursor-pointer hover:bg-primary/5 border-b last-of-type:border-0 border-medium/10`}
              >
                {({ selected, active }) => (
                  <div
                    className={`flex items-center justify-between py-2 px-3 ${
                      selected ? "bg-primary/5" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      {option.icon && (
                        <div className="h-8 w-8 rounded-full flex items-center justify-center">
                          <option.icon />
                        </div>
                      )}
                      <span
                        title={option.name}
                        className={`truncate capitalize flex-1 ${
                          selected || option.value == selectedOption?.value
                            ? "font-semibold text-primary"
                            : ""
                        }`}
                      >
                        {option.name}
                      </span>
                    </div>
                    {selected || option.value == selectedOption?.value ? (
                      <CircleCheckBigIcon size={20} className="text-primary" />
                    ) : (
                      <></>
                    )}
                  </div>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}
