import React from 'react';
import { useWeb3Store } from '../store/useWeb3Store';
import { shortenAddress } from '../lib/web3';
import { Wallet, ShieldCheck, ExternalLink, RefreshCw, X, Coins, Sparkles, CheckCircle2, Globe, Cpu } from 'lucide-react';

export const Web3WalletModal: React.FC = () => {
  const {
    isWalletModalOpen,
    setWalletModalOpen,
    isConnected,
    walletAddress,
    walletType,
    network,
    agriBalance,
    maticBalance,
    usdcBalance,
    onChainCreditScore,
    transactions,
    connectMetaMask,
    connectSmartWallet,
    disconnectWallet,
    switchNetwork
  } = useWeb3Store();

  if (!isWalletModalOpen) return null;

  const networks = [
    'Polygon Amoy Testnet',
    'Base Sepolia',
    'Arbitrum One',
    'AgriChain Local Node'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-emerald-500/30 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl transition-all">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-5 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-xl">
              <Wallet className="w-6 h-6 text-emerald-200" />
            </div>
            <div>
              <h2 className="text-lg font-bold">AgriVision Web3 Hub</h2>
              <p className="text-xs text-emerald-100/90">Decentralized Finance & On-Chain Identity</p>
            </div>
          </div>
          <button
            onClick={() => setWalletModalOpen(false)}
            className="p-1.5 rounded-lg text-emerald-100 hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Connection Status Card */}
          {isConnected ? (
            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                  <span className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">
                    Connected ({walletType})
                  </span>
                </div>
                <button
                  onClick={disconnectWallet}
                  className="text-xs text-rose-600 hover:text-rose-700 dark:text-rose-400 font-medium hover:underline"
                >
                  Disconnect
                </button>
              </div>

              <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Wallet Address</div>
                  <div className="font-mono text-sm font-bold text-slate-800 dark:text-slate-200">
                    {shortenAddress(walletAddress || '')}
                  </div>
                </div>
                <a
                  href={`https://amoy.polygonscan.com/address/${walletAddress}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400"
                  title="View on Polygonscan"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              {/* Balances Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-emerald-100 dark:border-slate-700 text-center">
                  <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">🌾 $AGRI</div>
                  <div className="text-lg font-black text-slate-800 dark:text-white">{agriBalance}</div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-purple-100 dark:border-slate-700 text-center">
                  <div className="text-xs text-purple-600 dark:text-purple-400 font-medium">💎 MATIC</div>
                  <div className="text-lg font-black text-slate-800 dark:text-white">{maticBalance}</div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-blue-100 dark:border-slate-700 text-center">
                  <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">💵 USDC</div>
                  <div className="text-lg font-black text-slate-800 dark:text-white">${usdcBalance}</div>
                </div>
              </div>

              {/* On-Chain Credit Score */}
              <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    On-Chain Farmer Reputation Score
                  </span>
                </div>
                <div className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                  {onChainCreditScore} / 850
                </div>
              </div>
            </div>
          ) : (
            /* Connect Wallet Options */
            <div className="space-y-4">
              <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                Connect your browser wallet or generate a 1-click Web3 Smart Wallet to unlock on-chain crop passports, escrow trading, and parametric insurance.
              </p>

              <div className="grid grid-cols-1 gap-3">
                {/* MetaMask */}
                <button
                  onClick={connectMetaMask}
                  className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 rounded-xl bg-white dark:bg-slate-800 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-orange-100 dark:bg-orange-950/50 rounded-lg text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform">
                      <Wallet className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-slate-800 dark:text-white text-sm">MetaMask / Browser Wallet</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Connect via window.ethereum extension</div>
                    </div>
                  </div>
                  <Sparkles className="w-5 h-5 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>

                {/* Embedded Smart Wallet */}
                <button
                  onClick={connectSmartWallet}
                  className="flex items-center justify-between p-4 border border-emerald-500/40 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 hover:border-emerald-500 rounded-xl transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-600 rounded-lg text-white group-hover:scale-110 transition-transform shadow-md">
                      <Cpu className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-emerald-950 dark:text-emerald-100 text-sm flex items-center gap-1.5">
                        AgriVision Web3 Smart Wallet
                        <span className="text-[10px] bg-emerald-600 text-white font-semibold px-2 py-0.5 rounded-full">Recommended</span>
                      </div>
                      <div className="text-xs text-emerald-700 dark:text-emerald-300">1-Click instant setup (No browser extension needed)</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Network Switcher */}
          <div>
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">
              Select Blockchain Network
            </label>
            <div className="grid grid-cols-2 gap-2">
              {networks.map((net) => (
                <button
                  key={net}
                  onClick={() => switchNetwork(net)}
                  className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all flex items-center justify-between ${
                    network === net
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5" />
                    {net}
                  </span>
                  {network === net && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                </button>
              ))}
            </div>
          </div>

          {/* Recent On-Chain Transactions */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Recent On-Chain Activity
            </h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {transactions.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No on-chain transactions yet.</p>
              ) : (
                transactions.slice(0, 5).map((tx) => (
                  <div
                    key={tx.hash}
                    className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                        {tx.title}
                      </div>
                      <div className="text-[10px] text-slate-400">{new Date(tx.timestamp).toLocaleString()}</div>
                    </div>
                    <div className="text-right">
                      {tx.amount && <div className="font-bold text-emerald-600 dark:text-emerald-400">{tx.amount}</div>}
                      <a
                        href={tx.explorerUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] text-blue-500 hover:underline inline-flex items-center gap-0.5"
                      >
                        Tx Explorer <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-50 dark:bg-slate-800/80 px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            Secured by Polygon & IPFS
          </span>
          <button
            onClick={() => setWalletModalOpen(false)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
