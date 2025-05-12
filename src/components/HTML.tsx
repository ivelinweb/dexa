"use client";

import React, { useState, useEffect } from "react";
import { NextFont } from "next/dist/compiled/@next/font";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type State, WagmiProvider, deserialize, serialize } from "wagmi";
import { config } from "@/config/wagmi.config";
import { DexaProvider } from "@/context/dexa.context";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { store } from "@/store";
import { AuthProvider } from "@/context/auth.context";
import SwitchChain from "./Auth/SwitchChain";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import "swiper/css";
import { DexaMessengerProvider } from "@/context/dexa-messenger.context";
import { StreamProvider } from "@/context/stream.context";
import { CookiesProvider } from "react-cookie";
import { ConverterProvider } from "@/context/currency.context";
import {
  PersistQueryClientProvider,
  Persister,
} from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
});

export default function HTML({
  children,
  font,
  initialState,
}: Readonly<{
  children: React.ReactNode;
  font: NextFont;
  initialState?: State;
}>) {
  const [persister, setPersister] = useState<Persister | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      try {
        const syncPersister = createSyncStoragePersister({
          serialize,
          storage: window.localStorage,
          deserialize,
        });
        setPersister(syncPersister);
      } catch (error) {
        console.error("Error creating persister:", error);
      }
    }
  }, []);

  return (
    <div className={font.className}>
      <Provider store={store}>
        <WagmiProvider config={config}>
          {isClient && persister ? (
            <PersistQueryClientProvider
              client={queryClient}
              persistOptions={{ persister }}
            >
              <CookiesProvider defaultSetOptions={{ path: "/" }}>
                <AuthProvider>
                  <DexaProvider>
                    <DexaMessengerProvider>
                      <StreamProvider>
                        <ConverterProvider>
                          <ProgressBar
                            height="4px"
                            color="#4338ca"
                            options={{ showSpinner: false }}
                            shallowRouting
                          />
                          <SwitchChain />
                          <main>{children}</main>
                          <Toaster />
                        </ConverterProvider>
                      </StreamProvider>
                    </DexaMessengerProvider>
                  </DexaProvider>
                </AuthProvider>
              </CookiesProvider>
            </PersistQueryClientProvider>
          ) : (
            <QueryClientProvider client={queryClient}>
              <CookiesProvider defaultSetOptions={{ path: "/" }}>
                <AuthProvider>
                  <DexaProvider>
                    <DexaMessengerProvider>
                      <StreamProvider>
                        <ConverterProvider>
                          <ProgressBar
                            height="4px"
                            color="#4338ca"
                            options={{ showSpinner: false }}
                            shallowRouting
                          />
                          <SwitchChain />
                          <main>{children}</main>
                          <Toaster />
                        </ConverterProvider>
                      </StreamProvider>
                    </DexaMessengerProvider>
                  </DexaProvider>
                </AuthProvider>
              </CookiesProvider>
            </QueryClientProvider>
          )}
        </WagmiProvider>
      </Provider>
    </div>
  );
}
