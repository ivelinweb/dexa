import metamask from "@/assets/images/metamask.png";
import walletconnect from "@/assets/images/walletconnect.webp";
import coinbase from "@/assets/images/coinbase.webp";
import brave from "@/assets/images/brave.png";


import Icon from "@/assets/logo/icon.png";

export const connectorIcons: any = {
  coinbaseWalletSDK: {
    key: "coinbaseWallet",
    icon: coinbase,
  },
  walletConnect: {
    key: "walletConnect",
    icon: walletconnect,
  },
  metaMaskSDK: {
    key: "io.metamask",
    icon: metamask,
  },
  "com.brave.wallet": {
    key: "com.brave.wallet",
    icon: brave,
  },
};

export const favicon = {
  main: Icon,
};
