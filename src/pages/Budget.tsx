import { useState } from 'react';
import { useStore, Transaction } from '../store/useStore';
import { Wallet, TrendingUp, TrendingDown, Plus, Trash2, IndianRupee } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Budget() {
  const { language, transactions, addTransaction, deleteTransaction } = useStore();
  const isEn = language === 'en';

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
    </div>
  );
}
