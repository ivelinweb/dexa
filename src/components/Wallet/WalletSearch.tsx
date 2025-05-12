"use client";

import { Search, XIcon } from "lucide-react";
import React, { useState } from "react";
import Input from "../Form/Input";

function WalletSearch() {
  const [focused, setFocused] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");

  const clearInput = () => {
    setQuery("");
    setFocused(true);
  };

  return (
    <div
      className={`flex flex-1 items-center relative bg-light rounded-md px-4 duration-100 ease-linear transition-all ${
        focused ? "ring-2 ring-primary" : "ring-0"
      }`}
    >
      <Search
        size={22}
        className={`${focused ? "text-primary" : "text-medium"}  z-10`}
      />
      <Input
        type="text"
        className="bg-light text-sm z-10 flex-1 peer"
        placeholder="Search"
        isOutline={false}
        onChange={(e) => {
          // setQuery(e.currentTarget.value);
          // search(e.currentTarget.value);
          // setLoading(true);
          // resetFields();
        }}
        value={query}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      <XIcon
        size={20}
        onClick={clearInput}
        className={`stroke-primary cursor-pointer ${
          query.length > 0 ? "block" : "hidden"
        }`}
      />
    </div>
  );
}

export default WalletSearch;
