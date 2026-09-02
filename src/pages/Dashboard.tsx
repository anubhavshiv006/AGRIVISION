import { useState } from 'react';
import { useStore } from '../store/useStore';
import { LayoutDashboard, History, CheckCircle2, Circle, Plus, Calendar, Crown } from 'lucide-react';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';
import { WeatherWidget } from '../components/WeatherWidget';

export default function Dashboard() {
  const { language, history, plans, addPlan, toggleTask, setProModalOpen } = useStore();
  const isEn = language === 'en';
  
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const generatePlan = async (historyId: string, crop: string, problem: string) => {
    setLoadingPlan(historyId);
    try {
      const res = await fetch('/api/gemini/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ crop, problem, language })
      });
      if (!res.ok) throw new Error('Failed to generate plan');
      const tasks = await res.json();
      
      addPlan({
        id: historyId,
        crop,
        problem,
        createdAt: new Date().toISOString(),
        tasks: tasks.map((t: any) => ({ ...t, completed: false }))
      });
    } catch (error) {
      console.error(error);
      alert(isEn ? 'Failed to generate plan.' : 'योजना बनाने में विफल।');
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      <div className="flex items-center gap-3 mb-8">
        <LayoutDashboard className="w-8 h-8 text-emerald-600" />
        <h1 className="text-3xl font-bold text-gray-900">
          {isEn ? 'My Farm Dashboard' : 'मेरा फार्म डैशबोर्ड'}
        </h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Column: Plans */}
        <div className="lg:col-span-2 space-y-8 min-w-0">
          <WeatherWidget />
          <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-3xl p-6 text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-md">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-full shrink-0">
                <Crown className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold">{isEn ? 'Upgrade to KisanMitra PRO' : 'किसानमित्र प्रो में अपग्रेड करें'}</h3>
                <p className="text-sm text-amber-50 mt-1">{isEn ? 'Get unlimited AI analysis, priority weather alerts, and 7-day action plans.' : 'असीमित एआई विश्लेषण, प्राथमिकता वाले मौसम अलर्ट और 7-दिवसीय कार्य योजनाएं प्राप्त करें।'}</p>
              </div>
            </div>
            <button onClick={() => setProModalOpen(true)} className="bg-white text-orange-600 px-6 py-2 rounded-xl font-bold shrink-0 hover:bg-gray-50 transition-colors shadow-sm">
              {isEn ? 'Upgrade Now' : 'अभी अपग्रेड करें'}
            </button>
          </div>


          <section className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-emerald-600" />
              {isEn ? 'Active Action Plans' : 'सक्रिय कार्य योजनाएं'}
            </h2>
            
            {plans.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                <p className="text-gray-500 mb-4">
                  {isEn ? 'No active plans. Generate a plan from your crop analysis.' : 'कोई सक्रिय योजना नहीं। अपने फसल विश्लेषण से एक योजना बनाएं।'}
                </p>
                <Link to="/doctor" className="inline-flex items-center gap-2 text-emerald-600 font-medium hover:text-emerald-700">
                  <Plus className="w-4 h-4" /> {isEn ? 'Analyze Crop' : 'फसल का विश्लेषण करें'}
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {plans.map(plan => (
                  <div key={plan.id} className="border border-gray-100 rounded-2xl p-6 bg-emerald-50/30">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{plan.crop}</h3>
                        <p className="text-gray-600 text-sm">
                          {isEn ? 'Issue:' : 'समस्या:'} <span className="font-medium text-gray-900">{plan.problem}</span>
                        </p>
                      </div>
                      <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-md border border-gray-200">
                        {new Date(plan.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      {plan.tasks.map(task => (
                        <div 
                          key={task.day}
                          onClick={() => toggleTask(plan.id, task.day)}
                          className={cn(
                            "flex gap-4 p-4 rounded-xl cursor-pointer transition-colors border",
                            task.completed ? "bg-white border-green-200 opacity-60" : "bg-white border-gray-100 hover:border-emerald-300 shadow-sm"
                          )}
                        >
                          <div className="shrink-0 mt-0.5">
                            {task.completed ? (
                              <CheckCircle2 className="w-6 h-6 text-green-500" />
                            ) : (
                              <Circle className="w-6 h-6 text-gray-300" />
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-gray-900">
                              {isEn ? `Day ${task.day}` : `दिन ${task.day}`}: {task.title}
                            </div>
                            <div className={cn("text-sm mt-1", task.completed ? "text-gray-400" : "text-gray-600")}>
                              {task.description}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right Column: History */}
        <div className="lg:col-span-1 min-w-0">
          <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <History className="w-5 h-5 text-gray-500" />
              {isEn ? 'Recent Analysis' : 'हाल का विश्लेषण'}
            </h2>
            {history.length === 0 ? (
              <p className="text-gray-500 text-center py-8 text-sm">
                {isEn ? 'No previous analyses found.' : 'कोई पिछला विश्लेषण नहीं मिला।'}
              </p>
            ) : (
              <div className="space-y-4">
                {history.map(item => (
                  <div key={item.id} className="border border-gray-100 rounded-2xl overflow-hidden hover:border-gray-200 transition-colors">
                    <img src={item.imageUrl} alt={item.crop} className="w-full h-32 object-cover bg-gray-50" referrerPolicy="no-referrer" />
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-gray-900">{item.crop}</h3>
                        <span className="text-xs text-gray-500">{new Date(item.date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3 truncate" title={item.result.possibleProblem}>
                        {item.result.possibleProblem}
                      </p>
                      
                      {!plans.some(p => p.id === item.id) && (
                        <button
                          onClick={() => generatePlan(item.id, item.crop, item.result.possibleProblem)}
                          disabled={loadingPlan === item.id}
                          className="w-full py-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                        >
                          {loadingPlan === item.id 
                            ? (isEn ? 'Generating...' : 'बना रहा है...') 
                            : (isEn ? 'Create 7-Day Plan' : '7-दिवसीय योजना बनाएं')}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
