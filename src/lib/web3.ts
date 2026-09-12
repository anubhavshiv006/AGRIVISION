// Web3 & Blockchain Core Utilities for AgriVision

export interface Web3Transaction {
  hash: string;
  type: 'NFT_MINT' | 'ESCROW_DEPOSIT' | 'ESCROW_RELEASE' | 'INSURANCE_CLAIM' | 'LOAN_BORROW' | 'REWARD_EARNED';
  title: string;
  amount?: string;
  timestamp: string;
  status: 'confirmed' | 'pending' | 'failed';
  blockNumber: number;
  explorerUrl: string;
}

export interface CropNFTMetaData {
  id: string;
  name: string;
  cropType: string;
  healthStatus: string;
  confidence: string;
  ipfsCid: string;
  mintTxHash: string;
  mintedAt: string;
  ownerAddress: string;
  imageUrl?: string;
}

export interface EscrowDeal {
  id: string;
  cropName: string;
  sellerAddress: string;
  buyerAddress: string;
  amountCrypto: number;
  cryptoSymbol: 'USDC' | 'MATIC' | 'AGRI';
  status: 'locked' | 'completed' | 'refunded';
  txHash: string;
  createdAt: string;
}

export interface InsurancePolicy {
  id: string;
  cropType: string;
  coveredAmount: number; // in USDT / $AGRI
  premium: number;
  region: string;
  weatherCondition: 'Drought' | 'Heavy Rainfall' | 'Frost' | 'Heatwave';
  status: 'Active' | 'Claimed' | 'Expired';
  contractAddress: string;
  triggerRainfallMm: number;
  currentRainfallMm: number;
}

export interface RWALoan {
  id: string;
  cropYieldKg: number;
  cropType: string;
  loanAmountUSDC: number;
  interestRate: number; // e.g. 4.5%
  collateralNFTId: string;
  status: 'Active' | 'Repaid';
  dueDate: string;
}

export interface SoulboundBadge {
  id: string;
  title: string;
  description: string;
  badgeType: 'Verified Farmer' | 'Organic Certified' | 'AI Health Champion' | 'DeFi Trusted';
  mintedAt: string;
  tokenId: string;
  icon: string;
}

// Generate realistic Web3 cryptographic hashes
export function generateTxHash(): string {
  const chars = '0123456789abcdef';
  let hash = '0x';
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

export function generateIPFSCid(): string {
  const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let cid = 'Qm';
  for (let i = 0; i < 44; i++) {
    cid += chars[Math.floor(Math.random() * chars.length)];
  }
  return cid;
}

export function generateWalletAddress(): string {
  const chars = '0123456789abcdef';
  let addr = '0x';
  for (let i = 0; i < 40; i++) {
    addr += chars[Math.floor(Math.random() * chars.length)];
  }
  return addr;
}

export function shortenAddress(address: string): string {
  if (!address || address.length < 10) return address;
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

// Check window.ethereum support for MetaMask / Coinbase Wallet
export async function connectBrowserWallet(): Promise<string | null> {
  if (typeof window !== 'undefined' && (window as any).ethereum) {
    try {
      const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
      return accounts[0] || null;
    } catch (err) {
      console.error('User rejected wallet connection', err);
      return null;
    }
  }
  return null;
}
