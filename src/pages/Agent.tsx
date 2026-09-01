import { useState, useRef, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Bot, Mic, Send, MicOff, AlertCircle, Volume2, VolumeX } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { cn } from '../lib/utils';
import { useLocation } from 'react-router-dom';

// Simple polyfill check for SpeechRecognition
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

interface Message {
  role: 'user' | 'model';
  content: string;
}

export default function Agent() {
  const { language } = useStore();
  const isEn = language === 'en';
  const location = useLocation();
  const initialPrompt = location.state?.initialPrompt;

  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: isEn ? 'Hello! I am KisanMitra, your AI Farming Agent. How can I help you with your crops today?' : 'नमस्ते! मैं किसानमित्र, आपका एआई खेती एजेंट हूँ। आज मैं आपकी फसलों में कैसे मदद कर सकता हूँ?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechError, setSpeechError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const recognition = useRef<any>(null);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    }
  }, []);

  const speakText = (text: string) => {
    window.speechSynthesis.cancel(); // Stop any ongoing speech
    
    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text.replace(/[*#]/g, '')); // Strip markdown
    utterance.lang = isEn ? 'en-IN' : 'hi-IN';
    
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (SpeechRecognition) {
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = false;
      recognition.current.interimResults = false;
      
      recognition.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognition.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setSpeechError(isEn ? 'Microphone error. Please try typing.' : 'माइक्रोफ़ोन त्रुटि। कृपया टाइप करने का प्रयास करें।');
        setIsListening(false);
      };

      recognition.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [isEn]);

  useEffect(() => {
    if (initialPrompt && messages.length === 1) {
      handleSend(initialPrompt);
    }
  }, [initialPrompt]);

  const toggleListen = () => {
    if (!recognition.current) {
      setSpeechError(isEn ? 'Voice input not supported in this browser.' : 'इस ब्राउज़र में ध्वनि इनपुट समर्थित नहीं है।');
      return;
    }
    setSpeechError('');
    if (isListening) {
      recognition.current.stop();
      setIsListening(false);
    } else {
      recognition.current.lang = isEn ? 'en-IN' : 'hi-IN';
      recognition.current.start();
      setIsListening(true);
    }
  };

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;
    
    const newMessages = [...messages, { role: 'user' as const, content: text.trim() }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          language
        })
      });

      if (!res.ok) throw new Error('Failed to chat');
      
      const data = await res.json();
      setMessages([...newMessages, { role: 'model', content: data.text }]);
    } catch (error) {
      console.error(error);
      setMessages([...newMessages, { 
        role: 'model', 
        content: isEn ? 'Sorry, I am having trouble connecting right now. Please try again later.' : 'क्षमा करें, मुझे अभी कनेक्ट करने में समस्या हो रही है। कृपया बाद में पुनः प्रयास करें।' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      <div className="text-center space-y-2 mb-6 shrink-0">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">
          <Bot className="w-8 h-8 text-purple-600" />
          {isEn ? 'KisanMitra AI Agent' : 'किसानमित्र एआई एजेंट'}
        </h1>
        <p className="text-gray-600">
          {isEn ? 'Ask questions and get practical farming guidance.' : 'प्रश्न पूछें और व्यावहारिक खेती मार्गदर्शन प्राप्त करें।'}
        </p>
      </div>

      <div className="flex-1 bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={cn("flex max-w-[85%]", msg.role === 'user' ? "ml-auto justify-end" : "mr-auto justify-start")}>
              <div className={cn(
                "p-4 rounded-2xl shadow-sm relative group", 
                msg.role === 'user' 
                  ? "bg-orange-500 text-white rounded-tr-sm" 
                  : "bg-gray-100 text-gray-800 rounded-tl-sm markdown-body"
              )}>
                {msg.role === 'model' && (
                  <button
                    onClick={() => speakText(msg.content)}
                    className="absolute -right-10 top-2 p-2 text-gray-400 hover:text-green-600 transition-colors opacity-0 group-hover:opacity-100"
                    title={isEn ? "Read Aloud" : "बोलकर सुनाएं"}
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                )}
                {msg.role === 'model' ? (
                  <div className="markdown-body">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  msg.content
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex max-w-[85%] mr-auto justify-start">
              <div className="p-4 rounded-2xl bg-gray-100 text-gray-800 rounded-tl-sm flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 shrink-0">
          {speechError && (
            <div className="mb-2 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" /> {speechError}
            </div>
          )}
          <div className="flex items-end gap-2 bg-white p-2 rounded-2xl border border-gray-200 shadow-sm focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500 transition-shadow">
            <button
              onClick={toggleListen}
              className={cn(
                "p-3 rounded-xl transition-colors shrink-0",
                isListening ? "bg-red-100 text-red-600 animate-pulse" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              )}
              title="Voice Input"
            >
              {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </button>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={isListening ? (isEn ? "Listening..." : "सुन रहा है...") : (isEn ? "Type your farming question here..." : "अपना खेती का सवाल यहां टाइप करें...")}
              className="flex-1 max-h-32 min-h-[50px] p-2 bg-transparent outline-none resize-none"
              rows={1}
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || loading}
              className="p-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-xl transition-colors shrink-0"
            >
              <Send className="w-6 h-6" />
            </button>
          </div>
          <div className="mt-2 text-center text-xs text-gray-500">
            {isEn ? 'AI can make mistakes. Verify important guidance with an expert.' : 'एआई गलतियाँ कर सकता है। किसी विशेषज्ञ के साथ महत्वपूर्ण मार्गदर्शन सत्यापित करें।'}
          </div>
        </div>
      </div>
    </div>
  );
}
