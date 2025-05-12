import { http, createConfig, cookieStorage, createStorage } from "wagmi";
import { metaMask, walletConnect, injected } from "wagmi/connectors";
import { pharosTestnet } from "./wallet";

export const config = createConfig({
  chains: [pharosTestnet],
  ssr: false,
  // storage: createStorage({
  //   storage: cookieStorage,
  // }),
  connectors: [
    metaMask({
      dappMetadata: { url: "https://dexa.ink", name: "Dexa App", iconUrl: "" },
      // checkInstallationImmediately: false,
      // forceInjectProvider: false,
      // extensionOnly: false
    }),
    // injected(),
    walletConnect({
      projectId: "020eb0ca134f43e7080c5727412239d3",
    }),
  ],
  transports: {
    [pharosTestnet.id]: http(),
  },
  multiInjectedProviderDiscovery: true,
});
