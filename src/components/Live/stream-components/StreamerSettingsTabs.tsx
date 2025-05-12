"use client";
import React, { useState, useEffect } from "react";
import TabsList from "@/components/Tabs/TabsList";
import TabsRoot from "@/components/Tabs/TabsRoot";
import TabsHeader from "@/components/Tabs/TabsHeader";
import TabsContent from "@/components/Tabs/TabsContent";
import { IStreamCredentials } from "@/interfaces/stream.interface";
import { QueryKeys } from "@/libs/enum";
import StreamKeyForm from "@/components/Live/StreamKeyForm";
import { useQuery } from "@tanstack/react-query";
import { getStreamCredentials } from "@/actions/stream.action";
import { useAuth } from "@/context/auth.context";
import RequestKey from "../RequestKey";

function StreamerSettingsTabs() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("tab1");
  const [credentials, setCredentials] = useState<IStreamCredentials>();

  const { data, refetch } = useQuery({
    queryKey: [QueryKeys.STREAM_AUTH],
    queryFn: getStreamCredentials,
    enabled: user ? true : false,
  });

  const onTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  useEffect(() => {
    if (data?.data && data.status == true) {
      const { serverUrl, streamKey, ingressId } =
        data.data as IStreamCredentials;
      setCredentials({ serverUrl, streamKey, ingressId });
    }
  }, [data]);

  return (
    <TabsRoot className="overflow-hidden h-full">
      <TabsList className="justify-start">
        <TabsHeader
          isActiveBg={true}
          isActiveText={true}
          title="Stream key"
          value="tab1"
          activeTabId={activeTab}
          onTabChange={onTabChange}
          isCenter={false}
        />
        <TabsHeader
          isActiveBg={true}
          isActiveText={true}
          title="Settings"
          value="tab2"
          activeTabId={activeTab}
          onTabChange={onTabChange}
          isCenter={false}
        />
      </TabsList>
      <TabsContent
        value="tab1"
        activeTabId={activeTab}
        className="overflow-scroll scrollbar-hide"
      >
        {credentials ? (
          <div className="py-5 px-5 max-w-2xl">
            <StreamKeyForm credentials={credentials} />
          </div>
        ) : (
          <RequestKey setCredentials={setCredentials} />
        )}
      </TabsContent>
      <TabsContent
        value="tab2"
        activeTabId={activeTab}
        className="overflow-scroll scrollbar-hide"
      >
        <div></div>
      </TabsContent>
    </TabsRoot>
  );
}

export default StreamerSettingsTabs;
