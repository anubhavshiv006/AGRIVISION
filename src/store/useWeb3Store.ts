import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  Web3Transaction,
  CropNFTMetaData,
  EscrowDeal,
  InsurancePolicy,
  RWALoan,
  SoulboundBadge,
  generateTxHash,
  generateIPFSCid,
  generateWalletAddress,
  connectBrowserWallet
} from '../lib/web3';

interface Web3State {
  walletAddress: string | null;
  isConnected: boolean;
  walletType: 'MetaMask' | 'SmartWallet' | null;
  network: string;
  
  // Balances
  agriBalance: number;
  maticBalance: number;
  usdcBalance: number;
  onChainCreditScore: number;

  // On-Chain Records
  nfts: CropNFTMetaData[];
  escrows: EscrowDeal[];
  insurancePolicies: InsurancePolicy[];
  rwaLoans: RWALoan[];
  soulboundBadges: SoulboundBadge[];
  transactions: Web3Transaction[];

  // Modals
  isWalletModalOpen: boolean;
  setWalletModalOpen: (open: boolean) => void;

  // Wallet Actions
  connectMetaMask: () => Promise<boolean>;
  connectSmartWallet: () => void;
  disconnectWallet: () => void;
  switchNetwork: (networkName: string) => void;

  // Web3 Actions
  earnAgriTokens: (amount: number, reason: string) => void;
  mintCropNFT: (cropName: string, healthStatus: string, confidence: string, imageUrl?: string) => Promise<CropNFTMetaData>;
  createEscrow: (cropName: string, sellerAddr: string, amount: number, symbol: 'USDC' | 'MATIC' | 'AGRI') => Promise<EscrowDeal>;
  releaseEscrow: (escrowId: string) => Promise<boolean>;
  purchaseInsurance: (cropType: string, region: string, coverageUSDT: number) => Promise<InsurancePolicy>;
  triggerInsuranceClaim: (policyId: string) => Promise<boolean>;
  applyRWALoan: (cropYieldKg: number, cropType: string, requestedUSDC: number) => Promise<RWALoan>;
  repayRWALoan: (loanId: string) => Promise<boolean>;
  mintSoulboundBadge: (title: string, description: string, badgeType: SoulboundBadge['badgeType']) => Promise<SoulboundBadge>;
}

export const useWeb3Store = create<Web3State>()(
  persist(
    (set, get) => ({
      walletAddress: null,
      isConnected: false,
      walletType: null,
      network: 'Polygon Amoy Testnet',

      agriBalance: 250,
      maticBalance: 1.45,
      usdcBalance: 500,
      onChainCreditScore: 720,

      nfts: [
        {
          id: 'nft-1',
          name: 'Healthy Wheat Batch #409',
          cropType: 'Wheat',
          healthStatus: 'Healthy (98%)',
          confidence: 'High',
          ipfsCid: 'QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco',
          mintTxHash: '0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b',
          mintedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
          ownerAddress: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
        }
      ],

      escrows: [
        {
          id: 'escrow-101',
          cropName: 'Organic Punjab Wheat (500kg)',
          sellerAddress: '0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc',
          buyerAddress: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
          amountCrypto: 350,
          cryptoSymbol: 'USDC',
          status: 'locked',
          txHash: '0x3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a',
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        }
      ],

      insurancePolicies: [
        {
          id: 'ins-202',
          cropType: 'Rice (Paddy)',
          coveredAmount: 1000,
          premium: 25,
          region: 'North Punjab',
          weatherCondition: 'Drought',
          status: 'Active',
          contractAddress: '0x1234567890abcdef1234567890abcdef12345678',
          triggerRainfallMm: 50,
          currentRainfallMm: 72,
        }
      ],

      rwaLoans: [
        {
          id: 'loan-301',
          cropYieldKg: 2000,
          cropType: 'Cotton',
          loanAmountUSDC: 400,
          interestRate: 4.5,
          collateralNFTId: 'nft-1',
          status: 'Active',
          dueDate: new Date(Date.now() + 86400000 * 60).toISOString(),
        }
      ],

      soulboundBadges: [
        {
          id: 'sbt-1',
          title: 'Verified Agri Visionary',
          description: 'Official Web3 verified farmer identity badge on Polygon',
          badgeType: 'Verified Farmer',
          mintedAt: new Date(Date.now() - 86400000 * 10).toISOString(),
          tokenId: '1001',
          icon: 'ShieldCheck'
        },
        {
          id: 'sbt-2',
          title: 'AI Health Champion',
          description: 'Contributed 5+ verified crop health scans to DePIN AI network',
          badgeType: 'AI Health Champion',
          mintedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
          tokenId: '1002',
          icon: 'Award'
        }
      ],

      transactions: [
        {
          hash: '0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b',
          type: 'NFT_MINT',
          title: 'Minted Crop NFT Passport #409',
          timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
          status: 'confirmed',
          blockNumber: 4210984,
          explorerUrl: 'https://amoy.polygonscan.com/tx/0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b'
        },
        {
          hash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
          type: 'REWARD_EARNED',
          title: 'Received +50 $AGRI Data-to-Earn Reward',
          amount: '+50 $AGRI',
          timestamp: new Date(Date.now() - 86400000 * 1).toISOString(),
          status: 'confirmed',
          blockNumber: 4212390,
          explorerUrl: 'https://amoy.polygonscan.com/tx/0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b'
        }
      ],

      isWalletModalOpen: false,
      setWalletModalOpen: (open) => set({ isWalletModalOpen: open }),

      connectMetaMask: async () => {
        const addr = await connectBrowserWallet();
        if (addr) {
          set({
            walletAddress: addr,
            isConnected: true,
            walletType: 'MetaMask',
          });
          return true;
        }
        return false;
      },

      connectSmartWallet: () => {
        const smartAddr = generateWalletAddress();
        set({
          walletAddress: smartAddr,
          isConnected: true,
          walletType: 'SmartWallet',
        });
      },

      disconnectWallet: () => {
        set({
          walletAddress: null,
          isConnected: false,
          walletType: null,
        });
      },

      switchNetwork: (networkName) => {
        set({ network: networkName });
      },

      earnAgriTokens: (amount, reason) => {
        const txHash = generateTxHash();
        const newTx: Web3Transaction = {
          hash: txHash,
          type: 'REWARD_EARNED',
          title: `Reward: ${reason}`,
          amount: `+${amount} $AGRI`,
          timestamp: new Date().toISOString(),
          status: 'confirmed',
          blockNumber: Math.floor(4200000 + Math.random() * 100000),
          explorerUrl: `https://amoy.polygonscan.com/tx/${txHash}`
        };

        set((state) => ({
          agriBalance: state.agriBalance + amount,
          onChainCreditScore: Math.min(850, state.onChainCreditScore + 5),
          transactions: [newTx, ...state.transactions]
        }));
      },

      mintCropNFT: async (cropName, healthStatus, confidence, imageUrl) => {
        const state = get();
        const owner = state.walletAddress || '0x71C7656EC7ab88b098defB751B7401B5f6d8976F';
        const ipfsCid = generateIPFSCid();
        const txHash = generateTxHash();

        const newNFT: CropNFTMetaData = {
          id: `nft-${Date.now()}`,
          name: `${cropName} Passport #${Math.floor(100 + Math.random() * 900)}`,
          cropType: cropName,
          healthStatus,
          confidence,
          ipfsCid,
          mintTxHash: txHash,
          mintedAt: new Date().toISOString(),
          ownerAddress: owner,
          imageUrl
        };

        const newTx: Web3Transaction = {
          hash: txHash,
          type: 'NFT_MINT',
          title: `Minted NFT Passport: ${newNFT.name}`,
          timestamp: new Date().toISOString(),
          status: 'confirmed',
          blockNumber: Math.floor(4200000 + Math.random() * 100000),
          explorerUrl: `https://amoy.polygonscan.com/tx/${txHash}`
        };

        set((state) => ({
          nfts: [newNFT, ...state.nfts],
          agriBalance: state.agriBalance + 50, // +50 $AGRI Data-to-Earn
          onChainCreditScore: Math.min(850, state.onChainCreditScore + 10),
          transactions: [newTx, ...state.transactions]
        }));

        return newNFT;
      },

      createEscrow: async (cropName, sellerAddr, amount, symbol) => {
        const state = get();
        const buyer = state.walletAddress || generateWalletAddress();
        const txHash = generateTxHash();

        const newEscrow: EscrowDeal = {
          id: `escrow-${Date.now()}`,
          cropName,
          sellerAddress: sellerAddr,
          buyerAddress: buyer,
          amountCrypto: amount,
          cryptoSymbol: symbol,
          status: 'locked',
          txHash,
          createdAt: new Date().toISOString()
        };

        const newTx: Web3Transaction = {
          hash: txHash,
          type: 'ESCROW_DEPOSIT',
          title: `Escrow Locked for ${cropName}`,
          amount: `${amount} ${symbol}`,
          timestamp: new Date().toISOString(),
          status: 'confirmed',
          blockNumber: Math.floor(4200000 + Math.random() * 100000),
          explorerUrl: `https://amoy.polygonscan.com/tx/${txHash}`
        };

        set((state) => ({
          escrows: [newEscrow, ...state.escrows],
          usdcBalance: symbol === 'USDC' ? Math.max(0, state.usdcBalance - amount) : state.usdcBalance,
          transactions: [newTx, ...state.transactions]
        }));

        return newEscrow;
      },

      releaseEscrow: async (escrowId) => {
        const txHash = generateTxHash();
        const escrow = get().escrows.find((e) => e.id === escrowId);
        if (!escrow) return false;

        const newTx: Web3Transaction = {
          hash: txHash,
          type: 'ESCROW_RELEASE',
          title: `Escrow Released: ${escrow.cropName}`,
          amount: `${escrow.amountCrypto} ${escrow.cryptoSymbol}`,
          timestamp: new Date().toISOString(),
          status: 'confirmed',
          blockNumber: Math.floor(4200000 + Math.random() * 100000),
          explorerUrl: `https://amoy.polygonscan.com/tx/${txHash}`
        };

        set((state) => ({
          escrows: state.escrows.map((e) => (e.id === escrowId ? { ...e, status: 'completed' } : e)),
          agriBalance: state.agriBalance + 100, // Trade reward
          onChainCreditScore: Math.min(850, state.onChainCreditScore + 15),
          transactions: [newTx, ...state.transactions]
        }));

        return true;
      },

      purchaseInsurance: async (cropType, region, coverageUSDT) => {
        const txHash = generateTxHash();
        const premium = Math.round(coverageUSDT * 0.03);

        const newPolicy: InsurancePolicy = {
          id: `ins-${Date.now()}`,
          cropType,
          coveredAmount: coverageUSDT,
          premium,
          region,
          weatherCondition: 'Drought',
          status: 'Active',
          contractAddress: `0x${generateTxHash().substring(2, 42)}`,
          triggerRainfallMm: 50,
          currentRainfallMm: 68
        };

        const newTx: Web3Transaction = {
          hash: txHash,
          type: 'INSURANCE_CLAIM',
          title: `Web3 Parametric Insurance Active (${cropType})`,
          amount: `-${premium} USDC`,
          timestamp: new Date().toISOString(),
          status: 'confirmed',
          blockNumber: Math.floor(4200000 + Math.random() * 100000),
          explorerUrl: `https://amoy.polygonscan.com/tx/${txHash}`
        };

        set((state) => ({
          insurancePolicies: [newPolicy, ...state.insurancePolicies],
          usdcBalance: Math.max(0, state.usdcBalance - premium),
          transactions: [newTx, ...state.transactions]
        }));

        return newPolicy;
      },

      triggerInsuranceClaim: async (policyId) => {
        const policy = get().insurancePolicies.find((p) => p.id === policyId);
        if (!policy || policy.status !== 'Active') return false;

        const txHash = generateTxHash();
        const payout = policy.coveredAmount;

        const newTx: Web3Transaction = {
          hash: txHash,
          type: 'INSURANCE_CLAIM',
          title: `Oracle Claim Payout: ${policy.cropType} Weather Insurance`,
          amount: `+${payout} USDC`,
          timestamp: new Date().toISOString(),
          status: 'confirmed',
          blockNumber: Math.floor(4200000 + Math.random() * 100000),
          explorerUrl: `https://amoy.polygonscan.com/tx/${txHash}`
        };

        set((state) => ({
          insurancePolicies: state.insurancePolicies.map((p) =>
            p.id === policyId ? { ...p, status: 'Claimed', currentRainfallMm: 32 } : p
          ),
          usdcBalance: state.usdcBalance + payout,
          transactions: [newTx, ...state.transactions]
        }));

        return true;
      },

      applyRWALoan: async (cropYieldKg, cropType, requestedUSDC) => {
        const txHash = generateTxHash();
        const newLoan: RWALoan = {
          id: `loan-${Date.now()}`,
          cropYieldKg,
          cropType,
          loanAmountUSDC: requestedUSDC,
          interestRate: 4.5,
          collateralNFTId: `nft-${Date.now()}`,
          status: 'Active',
          dueDate: new Date(Date.now() + 86400000 * 90).toISOString()
        };

        const newTx: Web3Transaction = {
          hash: txHash,
          type: 'LOAN_BORROW',
          title: `RWA Yield Loan Disbursed (${cropType})`,
          amount: `+${requestedUSDC} USDC`,
          timestamp: new Date().toISOString(),
          status: 'confirmed',
          blockNumber: Math.floor(4200000 + Math.random() * 100000),
          explorerUrl: `https://amoy.polygonscan.com/tx/${txHash}`
        };

        set((state) => ({
          rwaLoans: [newLoan, ...state.rwaLoans],
          usdcBalance: state.usdcBalance + requestedUSDC,
          transactions: [newTx, ...state.transactions]
        }));

        return newLoan;
      },

      repayRWALoan: async (loanId) => {
        const loan = get().rwaLoans.find((l) => l.id === loanId);
        if (!loan || loan.status !== 'Active') return false;

        const txHash = generateTxHash();
        const totalRepay = Math.round(loan.loanAmountUSDC * (1 + loan.interestRate / 100));

        const newTx: Web3Transaction = {
          hash: txHash,
          type: 'LOAN_BORROW',
          title: `Repaid RWA Crop Loan #${loan.id}`,
          amount: `-${totalRepay} USDC`,
          timestamp: new Date().toISOString(),
          status: 'confirmed',
          blockNumber: Math.floor(4200000 + Math.random() * 100000),
          explorerUrl: `https://amoy.polygonscan.com/tx/${txHash}`
        };

        set((state) => ({
          rwaLoans: state.rwaLoans.map((l) => (l.id === loanId ? { ...l, status: 'Repaid' } : l)),
          usdcBalance: Math.max(0, state.usdcBalance - totalRepay),
          onChainCreditScore: Math.min(850, state.onChainCreditScore + 25),
          transactions: [newTx, ...state.transactions]
        }));

        return true;
      },

      mintSoulboundBadge: async (title, description, badgeType) => {
        const txHash = generateTxHash();
        const newSBT: SoulboundBadge = {
          id: `sbt-${Date.now()}`,
          title,
          description,
          badgeType,
          mintedAt: new Date().toISOString(),
          tokenId: `${Math.floor(1000 + Math.random() * 9000)}`,
          icon: 'ShieldCheck'
        };

        const newTx: Web3Transaction = {
          hash: txHash,
          type: 'NFT_MINT',
          title: `Minted Soulbound Badge (SBT): ${title}`,
          timestamp: new Date().toISOString(),
          status: 'confirmed',
          blockNumber: Math.floor(4200000 + Math.random() * 100000),
          explorerUrl: `https://amoy.polygonscan.com/tx/${txHash}`
        };

        set((state) => ({
          soulboundBadges: [newSBT, ...state.soulboundBadges],
          onChainCreditScore: Math.min(850, state.onChainCreditScore + 30),
          transactions: [newTx, ...state.transactions]
        }));

        return newSBT;
      }
    }),
    {
      name: 'agrivision-web3-storage',
      version: 1
    }
  )
);
