"use client";

import React, { useState, useCallback } from "react";
import { LoaderCircleIcon, Search, XIcon } from "lucide-react";
import Input from "../Form/Input";
import { debounce } from "lodash";
import { useDexa } from "@/context/dexa.context";
import { isAddress } from "ethers";
import { useReadContract } from "wagmi";
import { UserInterface } from "@/interfaces/user.interface";
import CreatorPFP from "../Posts/ListPost/CreatorPFP";
import { isLikelyUsername, isValidPostID } from "@/libs/helpers";
import { Post } from "@/interfaces/feed.interface";
import { routes } from "@/libs/routes";
import Link from "next/link";

function SearchComponent() {
  const [loading, setLoading] = useState<boolean>(false);
  const [focused, setFocused] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [user, setUser] = useState<UserInterface>();
  const [post, setPost] = useState<Post>();
  const { CreatorABI, dexaCreator, dexaFeeds, FeedsABI } = useDexa();

  const { refetch: findCreatorByUsername } = useReadContract({
    abi: CreatorABI,
    address: dexaCreator,
    functionName: "findCreatorByUsername",
    args: [query],
    query: { enabled: false },
  });

  const { refetch: findPostBygnfdId } = useReadContract({
    abi: FeedsABI,
    address: dexaFeeds,
    functionName: "postBygnfdId",
    args: [query],
    query: { enabled: false },
  });

  const { refetch: findCreatorByAddress } = useReadContract({
    abi: CreatorABI,
    address: dexaCreator,
    functionName: "findCreator",
    args: [query],
    query: { enabled: false },
  });

  const search = useCallback(
    debounce(async (query) => {
      if (query) {
        if (isAddress(query)) {
          const userRes = await findCreatorByAddress();
          setLoading(false);
          setUser(userRes.data as UserInterface);
          return;
        }
        if (isLikelyUsername(query)) {
          const userRes = await findCreatorByUsername();
          setLoading(false);
          setUser(userRes.data as UserInterface);
          return;
        }
        if (isValidPostID(query)) {
          const postRes = await findPostBygnfdId();
          setLoading(false);
          setPost(postRes.data as Post);
          return;
        }
      }
    }, 5000),
    []
  );

  const clearInput = () => {
    setQuery("");
    setFocused(true);
    resetFields();
  };

  const resetFields = () => {
    setPost(undefined);
    setUser(undefined);
  };

  return (
    <div className="relative">
      <div
        className={`flex items-center relative bg-light rounded-full px-4 duration-100 ease-linear transition-all ${
          focused ? "ring-2 ring-primary" : "ring-0"
        }`}
      >
        <Search
          size={22}
          className={`${focused ? "text-primary" : "text-medium"}  z-10`}
        />
        <Input
          type="text"
          className="bg-light text-sm z-10 flex-1 peer rounded-full"
          placeholder="Looking for something..."
          isOutline={false}
          onChange={(e) => {
            setQuery(e.currentTarget.value);
            search(e.currentTarget.value);
            setLoading(true);
            resetFields();
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
      <div
        className={`rounded-xl ${
          focused ? "flex" : "hidden"
        } mt-1 bg-white border border-light overflow-hidden shadow-md absolute left-0 right-0 z-10`}
      >
        {query.length > 0 ? (
          <div className="w-full">
            {loading && (
              <div className="px-5 pt-3 pb-20 flex justify-center">
                <LoaderCircleIcon
                  size={25}
                  className="stroke-medium animate-spin duration-500"
                />
              </div>
            )}

            {user && (
              <Link
                prefetch={true}
                href={routes.app.profile(`${user.username}`)}
                className="px-5 py-3 hover:bg-light cursor-pointer flex w-full gap-2 items-center"
              >
                <CreatorPFP
                  username={user?.username}
                  pfp={user?.pfp}
                  name={user?.name}
                />
                <div>
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-medium -mt-1 text-sm">@{user.username}</p>
                </div>
              </Link>
            )}
            {post && <div>Post</div>}
          </div>
        ) : (
          <div className="px-5 pt-3 pb-20">
            <p className="text-medium text-sm">
              Search for address, username or token
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchComponent;
