import { useState, useRef } from 'react';
import { useStore } from '../store/useStore';
import { Camera, Upload, AlertCircle, CheckCircle2, ChevronRight, X, AlertTriangle, Bot } from 'lucide-react';
import Webcam from 'react-webcam';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';

const CROPS = ['Wheat', 'Rice', 'Maize/Corn', 'Tomato', 'Potato', 'Cotton', 'Soybean'];
const CROPS_HI = ['गेहूं', 'चावल', 'मक्का', 'टमाटर', 'आलू', 'कपास', 'सोयाबीन'];

export default function CropDoctor() {
  const { language, addHistory } = useStore();
  const navigate = useNavigate();
  const isEn = language === 'en';
  
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [showWebcam, setShowWebcam] = useState(false);
  const webcamRef = useRef<Webcam>(null);
  
  const [cropType, setCropType] = useState('Wheat');
  const [symptoms, setSymptoms] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null);
      setError('');
    }
  };

  const capture = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      // Convert base64 to file
      fetch(imageSrc)
        .then(res => res.blob())
        .then(blob => {
          const f = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
          setFile(f);
          setPreview(imageSrc);
          setShowWebcam(false);
          setResult(null);
          setError('');
        });
    }
  };

  const analyzeImage = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    setResult(null);

    const formData = new FormData();
    formData.append('image', file);
    formData.append('cropType', cropType);
    formData.append('symptoms', symptoms);
    formData.append('language', language);

    try {
      const res = await fetch('/api/gemini/analyze-crop', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to analyze image');
      
      const data = await res.json();
      setResult(data);

      if (data.isImageValid && data.possibleProblem) {
        addHistory({
          id: Date.now().toString(),
          date: new Date().toISOString(),
          crop: cropType,
          imageUrl: preview!,
          result: {
            possibleProblem: data.possibleProblem,
            confidence: data.confidence,
            nextSteps: data.nextSteps || [],
          }
        });
      }
    } catch (err: any) {
      setError(isEn ? 'Analysis failed. Please try again later.' : 'विश्लेषण विफल रहा। कृपया बाद में पुनः प्रयास करें।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">
          <Camera className="w-8 h-8 text-green-600" />
          {isEn ? 'AI Crop Doctor' : 'एआई फसल डॉक्टर'}
        </h1>
        <p className="text-gray-600">
          {isEn ? 'Upload a photo of your crop for instant AI analysis.' : 'त्वरित एआई विश्लेषण के लिए अपनी फसल का फोटो अपलोड करें।'}
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-200">
        {!preview && !showWebcam ? (
          <div className="space-y-6">
            <div className="border-2 border-dashed border-green-200 bg-green-50/50 rounded-2xl p-8 text-center hover:bg-green-50 transition-colors">
              <Upload className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <p className="text-gray-700 font-medium mb-4">
                {isEn ? 'Drag and drop an image, or' : 'एक छवि खींचें और छोड़ें, या'}
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <label className="cursor-pointer bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors shadow-sm">
                  {isEn ? 'Upload Photo' : 'फोटो अपलोड करें'}
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </label>
                <button 
                  onClick={() => setShowWebcam(true)}
                  className="bg-green-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-700 transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  <Camera className="w-5 h-5" />
                  {isEn ? 'Use Camera' : 'कैमरा उपयोग करें'}
                </button>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800">
              <strong className="flex items-center gap-2 mb-2">
                <Camera className="w-4 h-4" /> 
                {isEn ? 'Photography Tips' : 'फोटोग्राफी टिप्स'}
              </strong>
              <ul className="list-disc pl-5 space-y-1">
                <li>{isEn ? 'Capture the affected leaf clearly' : 'प्रभावित पत्ती को स्पष्ट रूप से लें'}</li>
                <li>{isEn ? 'Use natural daylight' : 'प्राकृतिक दिन के प्रकाश का उपयोग करें'}</li>
                <li>{isEn ? 'Keep the camera steady' : 'कैमरा स्थिर रखें'}</li>
              </ul>
            </div>
          </div>
        ) : showWebcam ? (
          <div className="space-y-4">
            <div className="relative rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{ facingMode: "environment" }}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex justify-center gap-4">
              <button onClick={() => setShowWebcam(false)} className="px-6 py-3 rounded-xl font-medium text-gray-600 bg-gray-100 hover:bg-gray-200">
                 {isEn ? 'Cancel' : 'रद्द करें'}
              </button>
              <button onClick={capture} className="px-6 py-3 rounded-xl font-bold text-white bg-green-600 hover:bg-green-700 flex items-center gap-2">
                 <Camera className="w-5 h-5" />
                 {isEn ? 'Capture' : 'फोटो लें'}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="relative rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center h-64 md:h-80">
              <img src={preview!} alt="Preview" className="w-full h-full object-contain" />
              <button 
                onClick={() => { setPreview(null); setFile(null); setResult(null); }}
                className="absolute top-4 right-4 bg-white/80 backdrop-blur p-2 rounded-full text-gray-700 hover:bg-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!result && (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {isEn ? 'Select Crop' : 'फसल चुनें'}
                  </label>
                  <select 
                    value={cropType} 
                    onChange={e => setCropType(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-shadow"
                  >
                    {CROPS.map((c, i) => (
                      <option key={c} value={c}>{isEn ? c : CROPS_HI[i]}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {isEn ? 'Any visible symptoms? (Optional)' : 'कोई दिखाई देने वाले लक्षण? (वैकल्पिक)'}
                  </label>
                  <input 
                    type="text" 
                    value={symptoms}
                    onChange={e => setSymptoms(e.target.value)}
                    placeholder={isEn ? "e.g. yellow leaves, brown spots" : "जैसे पीली पत्तियां, भूरे धब्बे"}
                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-shadow"
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3">
                <AlertCircle className="w-5 h-5" />
                {error}
              </div>
            )}

            {!result && (
              <button 
                onClick={analyzeImage}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-70 text-white font-bold text-lg py-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {isEn ? 'Analyzing Crop...' : 'फसल का विश्लेषण कर रहा है...'}
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    {isEn ? 'Analyze Crop Image' : 'फसल की छवि का विश्लेषण करें'}
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Results Section */}
      {result && (
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-200 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {result.isDemo && (
             <div className="mb-4 inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
               Demo analysis – for hackathon demonstration
             </div>
          )}

          {!result.isImageValid ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                {isEn ? 'Image Quality Check Failed' : 'छवि गुणवत्ता जांच विफल'}
              </h2>
              <p className="text-gray-600 max-w-md mx-auto">
                {result.invalidMessage || (isEn ? 'The image is not clear enough for reliable identification. Please upload a clearer image showing the affected area.' : 'छवि विश्वसनीय पहचान के लिए पर्याप्त स्पष्ट नहीं है। कृपया प्रभावित क्षेत्र को दिखाते हुए एक स्पष्ट छवि अपलोड करें।')}
              </p>
              <button 
                onClick={() => { setPreview(null); setResult(null); }}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-2 rounded-xl font-medium mt-4"
              >
                {isEn ? 'Try Again' : 'पुनः प्रयास करें'}
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-gray-100">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{result.possibleProblem}</h2>
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-sm font-bold",
                      result.confidence === 'High' ? "bg-green-100 text-green-700" :
                      result.confidence === 'Moderate' ? "bg-yellow-100 text-yellow-700" :
                      "bg-red-100 text-red-700"
                    )}>
                      {isEn ? `${result.confidence} Confidence` : `${result.confidence} आत्मविश्वास`}
                    </span>
                  </div>
                </div>
                
                <button 
                  onClick={() => navigate('/agent', { state: { initialPrompt: `I just analyzed my ${cropType} and the AI suspects ${result.possibleProblem}. What should I do?` } })}
                  className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors"
                >
                  <Bot className="w-5 h-5" />
                  {isEn ? 'Discuss with AI Agent' : 'एआई एजेंट से चर्चा करें'}
                </button>
              </div>

              {result.confidence === 'Low' && (
                <div className="bg-red-50 text-red-800 p-4 rounded-xl flex items-start gap-3 text-sm">
                  <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p>
                    {isEn 
                      ? "I'm not confident enough to identify this reliably. Please upload a clearer image or consult an agricultural expert before taking action." 
                      : "मैं इसे मज़बूती से पहचानने के लिए पर्याप्त आश्वस्त नहीं हूँ। कृपया एक स्पष्ट छवि अपलोड करें या कार्रवाई करने से पहले कृषि विशेषज्ञ से परामर्श लें।"}
                  </p>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  {result.visibleSymptoms?.length > 0 && (
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-3">{isEn ? 'Visible Symptoms' : 'दिखाई देने वाले लक्षण'}</h3>
                      <ul className="list-disc pl-5 space-y-1 text-gray-600">
                        {result.visibleSymptoms.map((s: string, i: number) => <li key={i}>{s}</li>)}
                      </ul>
                    </div>
                  )}
                  {result.possibleCauses?.length > 0 && (
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-3">{isEn ? 'Possible Causes' : 'संभावित कारण'}</h3>
                      <ul className="list-disc pl-5 space-y-1 text-gray-600">
                        {result.possibleCauses.map((s: string, i: number) => <li key={i}>{s}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
                
                <div className="space-y-6 bg-gray-50 p-6 rounded-2xl">
                  {result.nextSteps?.length > 0 && (
                    <div>
                      <h3 className="text-lg font-bold text-green-800 mb-3">{isEn ? 'Recommended Next Steps' : 'अनुशंसित अगले कदम'}</h3>
                      <ul className="space-y-3">
                        {result.nextSteps.map((s: string, i: number) => (
                          <li key={i} className="flex gap-3 text-gray-700 bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                            <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Responsible AI Disclaimer */}
              <div className="bg-gray-100 p-4 rounded-xl text-sm text-gray-600 text-center flex items-center justify-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {isEn 
                  ? 'AI analysis is for informational guidance and should be verified with a qualified agricultural expert before taking major action.' 
                  : 'एआई विश्लेषण सूचनात्मक मार्गदर्शन के लिए है और बड़ी कार्रवाई करने से पहले योग्य कृषि विशेषज्ञ से सत्यापित किया जाना चाहिए।'}
              </div>
              
              {/* Action buttons */}
              <div className="flex justify-center pt-4 border-t border-gray-100">
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="text-green-600 font-bold hover:text-green-700 flex items-center gap-1"
                >
                  {isEn ? 'Generate 7-Day Farm Plan' : '7-दिवसीय फार्म योजना बनाएं'}
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

            </div>
          )}
        </div>
      )}
    </div>
  );
}
