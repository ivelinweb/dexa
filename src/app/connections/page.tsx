"use client";

import Section from "@/components/Layouts/Section";
import Aside from "@/components/Layouts/Aside";
import { useState } from "react";
import { useAuth } from "@/context/auth.context";
import BackButton from "@/components/ui/BackButton";
import { formatWalletAddress } from "@/libs/helpers";
import TabsRoot from "@/components/Tabs/TabsRoot";
import TabsList from "@/components/Tabs/TabsList";
import TabsHeader from "@/components/Tabs/TabsHeader";
import TabsContent from "@/components/Tabs/TabsContent";
import ListRequest from "@/components/Connections/ListRequest";
import EmtpyBox from "@/components/ui/EmptyBox";
import ListConnection from "@/components/Connections/ListConnection";
import { useDexaMessenger } from "@/context/dexa-messenger.context";
import AuthMainLayout from "@/components/Layouts/AuthMainLayout";

export default function Connections() {
  const [activeTab, setActiveTab] = useState("tab1");
  const { requests, connections } = useDexaMessenger();
  const { user } = useAuth();

  const onTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  return (
    <AuthMainLayout>
      <div className="flex space-x-5">
        <Section>
          <div>
            <div className="py-3 px-2 bg-white xl:bg-white/95 sticky z-50 top-0">
              <div className="flex items-center justify-start space-x-2">
                <BackButton />
                <div>
                  <p className="text-xl font-semibold">{user?.name}</p>
                  {user && user.wallet && (
                    <p className="text-xs text-medium">
                      {formatWalletAddress(user.wallet)}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="overflow-scroll scrollbar-hide">
              <TabsRoot>
                <TabsList className="border-b border-light">
                  <TabsHeader
                    title="Connections"
                    value="tab1"
                    activeTabId={activeTab}
                    onTabChange={onTabChange}
                  />
                  <TabsHeader
                    title={`Invitations (${requests.length})`}
                    value="tab2"
                    activeTabId={activeTab}
                    onTabChange={onTabChange}
                  />
                </TabsList>
                <TabsContent value="tab1" activeTabId={activeTab}>
                  {connections && connections.length > 0 ? (
                    <>
                      {connections.map((conn, i) => (
                        <div
                          key={i}
                          className="border-b border-light last-of-type:border-none"
                        >
                          <ListConnection connection={conn} />
                        </div>
                      ))}
                    </>
                  ) : (
                    <EmtpyBox
                      title="No connections"
                      message="You have no connection yet, try connecting with people"
                    />
                  )}
                </TabsContent>
                <TabsContent value="tab2" activeTabId={activeTab}>
                  {requests && requests.length > 0 ? (
                    <>
                      {requests.map((req, i) => (
                        <div
                          key={i}
                          className="border-b border-light last-of-type:border-none"
                        >
                          <ListRequest request={req} index={i} />
                        </div>
                      ))}
                    </>
                  ) : (
                    <EmtpyBox
                      title="No request"
                      message="You do not have any pending connection request"
                    />
                  )}
                </TabsContent>
              </TabsRoot>
            </div>
          </div>
        </Section>
        <Aside>
          <div>Here</div>
        </Aside>
      </div>
    </AuthMainLayout>
  );
}
