import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  baseSepolia
} from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Exeed Me NFT',
  projectId: 'exxedmenft',
  chains: [
    baseSepolia,
    ...(process.env.REACT_APP_ENABLE_TESTNETS === 'true' ? [baseSepolia] : []),
  ],
});
