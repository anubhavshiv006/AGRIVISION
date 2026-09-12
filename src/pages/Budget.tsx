import { useState } from 'react';
import { useStore, Transaction } from '../store/useStore';
import { useWeb3Store } from '../store/useWeb3Store';
import { Wallet, TrendingUp, TrendingDown, Plus, Trash2, IndianRupee, Cpu, Sparkles, ShieldCheck, Coins, ArrowUpRight } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Budget() {
  const { language, transactions, addTransaction, deleteTransaction } = useStore();
  const { rwaLoans, applyRWALoan, repayRWALoan, isConnected, connectSmartWallet } = useWeb3Store();
  const isEn = language === 'en';

  const [loanYieldKg, setLoanYieldKg] = useState('2000');
  const [loanCrop, setLoanCrop] = useState('Cotton');
  const [loanUSDC, setLoanUSDC] = useState('500');
  const [isApplyingLoan, setIsApplyingLoan] = useState(false);

  const handleApplyLoan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loanYieldKg || !loanUSDC) return;
    setIsApplyingLoan(true);
    try {
      if (!isConnected) connectSmartWallet();
      await applyRWALoan(parseFloat(loanYieldKg), loanCrop, parseFloat(loanUSDC));
    } catch (err) {
      console.error(err);
    } finally {
      setIsApplyingLoan(false);
    }
  };

  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    type: 'expense' as 'income' | 'expense',
    amount: '',
    category: '',
    note: ''
  });

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
  const balance = totalIncome - totalExpense;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.category) return;
    
    addTransaction({
      type: formData.type,
      amount: Number(formData.amount),
      category: formData.category,
      note: formData.note,
      date: new Date().toISOString()
    });
    
    setIsAdding(false);
    setFormData({ type: 'expense', amount: '', category: '', note: '' });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      <div className="flex items-center gap-3 mb-8">
        <Wallet className="w-8 h-8 text-emerald-600" />
        <h1 className="text-3xl font-bold text-gray-900">
          {isEn ? 'Farm Budget Book' : 'खेत का बजट बुक'}
        </h1>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl p-6 text-white shadow-sm">
          <div className="text-emerald-100 text-sm font-medium mb-1">{isEn ? 'Current Balance' : 'वर्तमान शेष'}</div>
          <div className="text-4xl font-black flex items-center">
            <IndianRupee className="w-8 h-8 mr-1 opacity-80" />
            {balance.toLocaleString('en-IN')}
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-2 text-gray-500 text-sm font-medium mb-1">
            <TrendingUp className="w-4 h-4 text-green-500" /> {isEn ? 'Total Income' : 'कुल आय'}
          </div>
          <div className="text-2xl font-bold text-gray-900">₹{totalIncome.toLocaleString('en-IN')}</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-2 text-gray-500 text-sm font-medium mb-1">
            <TrendingDown className="w-4 h-4 text-red-500" /> {isEn ? 'Total Expenses' : 'कुल खर्च'}
          </div>
          <div className="text-2xl font-bold text-gray-900">₹{totalExpense.toLocaleString('en-IN')}</div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 md:p-8 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">
            {isEn ? 'Transactions' : 'लेन-देन'}
          </h2>
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl font-bold hover:bg-emerald-100 transition-colors"
          >
            <Plus className="w-4 h-4" />
            {isEn ? 'Add Entry' : 'प्रविष्टि जोड़ें'}
          </button>
        </div>

        {isAdding && (
          <form onSubmit={handleSubmit} className="p-6 md:p-8 bg-gray-50 border-b border-gray-100 grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2 flex gap-4 mb-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" checked={formData.type === 'expense'} onChange={() => setFormData({...formData, type: 'expense'})} className="text-red-500 focus:ring-red-500 w-4 h-4" />
                <span className="font-medium text-gray-700">{isEn ? 'Expense' : 'खर्च'}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" checked={formData.type === 'income'} onChange={() => setFormData({...formData, type: 'income'})} className="text-green-500 focus:ring-green-500 w-4 h-4" />
                <span className="font-medium text-gray-700">{isEn ? 'Income' : 'आय'}</span>
              </label>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{isEn ? 'Amount (₹)' : 'राशि (₹)'}</label>
              <input required type="number" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} className="w-full rounded-xl border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-2 border" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{isEn ? 'Category' : 'श्रेणी'}</label>
              <select required value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full rounded-xl border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-2 border bg-white">
                <option value="">{isEn ? 'Select category...' : 'श्रेणी चुनें...'}</option>
                {formData.type === 'expense' ? (
                  <>
                    <option value="Seeds">{isEn ? 'Seeds' : 'बीज'}</option>
                    <option value="Fertilizer/Pesticide">{isEn ? 'Fertilizer & Pesticide' : 'उर्वरक और कीटनाशक'}</option>
                    <option value="Labor">{isEn ? 'Labor' : 'मज़दूरी'}</option>
                    <option value="Machinery">{isEn ? 'Machinery/Fuel' : 'मशीनरी/ईंधन'}</option>
                    <option value="Other">{isEn ? 'Other' : 'अन्य'}</option>
                  </>
                ) : (
                  <>
                    <option value="Crop Sale">{isEn ? 'Crop Sale' : 'फसल बिक्री'}</option>
                    <option value="Govt Scheme">{isEn ? 'Govt Scheme/Subsidy' : 'सरकारी योजना/सब्सिडी'}</option>
                    <option value="Other">{isEn ? 'Other' : 'अन्य'}</option>
                  </>
                )}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">{isEn ? 'Note (Optional)' : 'नोट (वैकल्पिक)'}</label>
              <input type="text" value={formData.note} onChange={(e) => setFormData({...formData, note: e.target.value})} className="w-full rounded-xl border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-2 border" />
            </div>

            <div className="md:col-span-2 flex gap-3 mt-2">
              <button type="submit" className="bg-emerald-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-emerald-700 transition-colors">
                {isEn ? 'Save' : 'सहेजें'}
              </button>
              <button type="button" onClick={() => setIsAdding(false)} className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-xl font-bold hover:bg-gray-50 transition-colors">
                {isEn ? 'Cancel' : 'रद्द करें'}
              </button>
            </div>
          </form>
        )}

        <div className="divide-y divide-gray-100">
          {transactions.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              {isEn ? 'No transactions yet. Add your first income or expense.' : 'अभी तक कोई लेन-देन नहीं। अपनी पहली आय या खर्च जोड़ें।'}
            </div>
          ) : (
            transactions.map((t) => (
              <div key={t.id} className="p-4 md:p-6 flex items-center justify-between hover:bg-gray-50 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className={cn("w-12 h-12 rounded-full flex items-center justify-center shrink-0", t.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600')}>
                    {t.type === 'income' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{t.category}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(t.date).toLocaleDateString()} {t.note && `• ${t.note}`}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className={cn("font-black text-lg", t.type === 'income' ? 'text-green-600' : 'text-gray-900')}>
                    {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN')}
                  </div>
                  <button onClick={() => deleteTransaction(t.id)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Web3 RWA Crop Yield Tokenization & Micro-Loans */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-teal-950 text-white p-6 md:p-8 rounded-3xl border border-emerald-500/40 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-emerald-500/30 pb-6">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-emerald-500/20 border border-emerald-400/30 rounded-2xl">
              <Cpu className="w-8 h-8 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-2xl font-black flex items-center gap-2">
                RWA Crop Yield Tokenization & DeFi Loans
                <span className="text-xs bg-emerald-500 text-slate-950 font-black px-2.5 py-0.5 rounded-full uppercase">
                  4.5% APR Low-Interest
                </span>
              </h2>
              <p className="text-xs text-emerald-200 mt-1">
                Tokenize your upcoming harvest yield into Real-World Asset (RWA) smart contracts to borrow instant liquidity in USDC. Repay anytime with your crop sale profits.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Apply Form */}
          <form onSubmit={handleApplyLoan} className="bg-emerald-950/60 border border-emerald-500/30 p-5 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-emerald-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Tokenize Yield & Borrow USDC
            </h3>

            <div>
              <label className="block text-xs text-emerald-300 mb-1">Expected Crop Yield (Kg)</label>
              <input
                type="number"
                required
                value={loanYieldKg}
                onChange={(e) => setLoanYieldKg(e.target.value)}
                className="w-full bg-slate-900 border border-emerald-500/40 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-emerald-300 mb-1">Crop Type</label>
              <select
                value={loanCrop}
                onChange={(e) => setLoanCrop(e.target.value)}
                className="w-full bg-slate-900 border border-emerald-500/40 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none"
              >
                <option value="Cotton">Cotton</option>
                <option value="Wheat">Wheat</option>
                <option value="Rice (Basmati)">Rice (Basmati)</option>
                <option value="Soybean">Soybean</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-emerald-300 mb-1">Requested USDC Loan Amount</label>
              <input
                type="number"
                required
                value={loanUSDC}
                onChange={(e) => setLoanUSDC(e.target.value)}
                className="w-full bg-slate-900 border border-emerald-500/40 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isApplyingLoan}
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {isApplyingLoan ? 'Disbursing USDC Loan...' : 'Tokenize & Disburse USDC Loan'}
            </button>
          </form>

          {/* Active RWA Loans */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-sm font-bold text-emerald-300">Active RWA Yield Loans</h3>
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {rwaLoans.map((loan) => (
                <div
                  key={loan.id}
                  className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-white text-sm">
                        {loan.cropYieldKg}kg {loan.cropType} Collateral
                      </span>
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-full text-[10px] font-black uppercase",
                          loan.status === 'Active'
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                            : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                        )}
                      >
                        {loan.status}
                      </span>
                    </div>
                    <div className="text-emerald-300 text-[11px] mt-1">
                      Collateral NFT ID: <code className="text-emerald-200">{loan.collateralNFTId}</code> | Interest Rate: {loan.interestRate}% APR
                    </div>
                    <div className="text-slate-400 text-[10px] mt-1">
                      Due Date: {new Date(loan.dueDate).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-right">
                      <div className="text-base font-black text-emerald-400">${loan.loanAmountUSDC} USDC</div>
                      <div className="text-[10px] text-slate-400">Total Payable: ${Math.round(loan.loanAmountUSDC * 1.045)}</div>
                    </div>
                    {loan.status === 'Active' && (
                      <button
                        onClick={() => repayRWALoan(loan.id)}
                        className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-[11px] shadow transition-colors shrink-0"
                      >
                        Repay Loan
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
