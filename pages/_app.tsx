import "@/styles/globals.css";
import type { AppProps } from "next/app";
import {
  Chain,
  connectorsForWallets,
  midnightTheme,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import {
  metaMaskWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { publicProvider } from "wagmi/providers/public";
import "@rainbow-me/rainbowkit/styles.css";
import { configureChains, createConfig, mainnet, WagmiConfig } from "wagmi";
import { Toaster } from "react-hot-toast";

export default function App({ Component, pageProps }: AppProps) {
  // const bscMainnet: Chain = {
  //   id: 56,
  //   name: "Binance Smart Chain",
  //   network: "bsc",
  //   iconUrl:
  //     "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGLfjGmCCP9RlcGalRVVEph7HO5EuKdB3NkzrN_aM&s",
  //   iconBackground: "#fff",
  //   nativeCurrency: {
  //     decimals: 18,
  //     name: "Binance Coin",
  //     symbol: "BNB",
  //   },
  //   rpcUrls: {
  //     public: { http: ["https://rpc.ankr.com/bsc"] },
  //     default: { http: ["https://rpc.ankr.com/bsc"] },
  //   },
  //   blockExplorers: {
  //     default: { name: "Bscscan", url: "https://bscscan.com" },
  //     etherscan: { name: "Bscscan", url: "https://bscscan.com" },
  //   },
  //   contracts: {
  //     multicall3: {
  //       address: "0xcA11bde05977b3631167028862bE2a173976CA11",
  //     },
  //   },
  //   testnet: false,
  // };

  const Goerli: Chain = {
  id: 5,
  network: 'goerli',
  name: 'Goerli',
  nativeCurrency: { name: 'Goerli Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    alchemy: {
      http: ['https://eth-goerli.g.alchemy.com/v2'],
      webSocket: ['wss://eth-goerli.g.alchemy.com/v2'],
    },
    infura: {
      http: ['https://goerli.infura.io/v3'],
      webSocket: ['wss://goerli.infura.io/ws/v3'],
    },
    default: {
      http: ['https://rpc.ankr.com/eth_goerli'],
    },
    public: {
      http: ['https://rpc.ankr.com/eth_goerli'],
    },
  },
  blockExplorers: {
    etherscan: {
      name: 'Etherscan',
      url: 'https://goerli.etherscan.io',
    },
    default: {
      name: 'Etherscan',
      url: 'https://goerli.etherscan.io',
    },
  },
  contracts: {
    ensRegistry: {
      address: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
    },
    ensUniversalResolver: {
      address: '0x56522D00C410a43BFfDF00a9A569489297385790',
      blockCreated: 8765204,
    },
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 6507670,
    },
  },
  testnet: true,
}

  const availableChains = [mainnet, Goerli];

  const { chains, publicClient } = configureChains(availableChains, [
    publicProvider(),
  ]);

  const connectors = connectorsForWallets([
    {
      groupName: "Recommended",
      wallets: [
        walletConnectWallet({
          projectId: "16293a1f5007277eebc791eff80f1dd8",
          chains,
        }),
        metaMaskWallet({
          chains,
          projectId: "16293a1f5007277eebc791eff80f1dd8",
        }),
      ],
    },
  ]);

  const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
  });

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} theme={midnightTheme()}>
        <Component {...pageProps} />
        <Toaster position="bottom-center" />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
