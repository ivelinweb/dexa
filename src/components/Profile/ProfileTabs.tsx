"use client";

import React, { useState, useEffect } from "react";
import TabsRoot from "../Tabs/TabsRoot";
import TabsHeader from "../Tabs/TabsHeader";
import TabsContent from "../Tabs/TabsContent";
import TabsList from "../Tabs/TabsList";
import UserFeeds from "./UserFeeds";
import { Post } from "@/interfaces/feed.interface";
import { useDexa } from "@/context/dexa.context";
import { useReadContract } from "wagmi";
import { sortPostByDate } from "../Home/Feeds";
import Reminted from "./Reminted";
import EmptyBox from "../ui/EmptyBox";
import { useAuth } from "@/context/auth.context";
import { useSearchParams } from "next/navigation";

function ProfileTabs() {
  const searchParams = useSearchParams();
  const username = searchParams.get("u");
  const [activeTab, setActiveTab] = useState("tab1");
  const [posts, setPosts] = useState<Post[]>([]);
  const [replies, setReplies] = useState<Post[]>([]);
  const { FeedsABI, dexaFeeds } = useDexa();
  const { user } = useAuth();
  const { data: response } = useReadContract({
    abi: FeedsABI,
    address: dexaFeeds,
    functionName: "postByCreator",
    args: [`${username}`],
  });

  useEffect(() => {
    if (response) {
      const _posts = response as Post[];
      const filterReplies = sortPostByDate(_posts.filter((p) => p.isMintable));
      const sortedPost = sortPostByDate(_posts.filter((p) => !p.isMintable));
      setReplies(filterReplies);
      setPosts(sortedPost);
    }
  }, [response]);

  const onTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  return (
    <div className="max-w-5xl w-full mx-auto mt-5">
      <div className="overflow-scroll scrollbar-hide pb-40 lg:pb-10">
        <TabsRoot>
          <TabsList className="border-b border-light overflow-x-auto scrollbar-hide">
            <TabsHeader
              title="Collectibles"
              value="tab1"
              activeTabId={activeTab}
              onTabChange={onTabChange}
            />
            <TabsHeader
              title="Reminted"
              value="tab2"
              activeTabId={activeTab}
              onTabChange={onTabChange}
            />
            <TabsHeader
              title="Replies"
              value="tab3"
              activeTabId={activeTab}
              onTabChange={onTabChange}
            />
            <TabsHeader
              title="Community"
              value="tab4"
              activeTabId={activeTab}
              onTabChange={onTabChange}
            />
            {user?.username == username && (
              <TabsHeader
                title="Tips"
                value="tab5"
                activeTabId={activeTab}
                onTabChange={onTabChange}
              />
            )}
          </TabsList>
          <TabsContent value="tab1" activeTabId={activeTab}>
            <UserFeeds
              posts={posts}
              msg={`${username} haven't minted any collectible yet`}
            />
          </TabsContent>
          <TabsContent value="tab2" activeTabId={activeTab}>
            <Reminted posts={posts} username={`${username}`} />
          </TabsContent>
          <TabsContent value="tab3" activeTabId={activeTab}>
            <UserFeeds
              posts={replies}
              msg={`${username} have not replied any post yet`}
            />
          </TabsContent>
          <TabsContent value="tab4" activeTabId={activeTab}>
            <div>
              <div className="text-center py-20">
                <EmptyBox
                  title="No communities"
                  message={`${username} do not have any active community`}
                />
              </div>
            </div>
          </TabsContent>

          {user?.username == username && (
            <TabsContent value="tab5" activeTabId={activeTab}>
              <div>
                <div className="text-center py-20">
                  <EmptyBox
                    title="No tips"
                    message={`You have no tips yet on your posts`}
                  />
                </div>
              </div>
            </TabsContent>
          )}
        </TabsRoot>
      </div>
    </div>
  );
}

export default ProfileTabs;
