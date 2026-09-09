import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useProject } from '../../context/ProjectContext';
import { askCopilot } from '../../services/api';
import { Sparkles, Send, X, Bot, User, BookOpen, ShieldAlert, Loader2 } from 'lucide-react';

interface AIOfficerCopilotProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  citations?: string[];
  timestamp: string;
}

export const AIOfficerCopilot: React.FC<AIOfficerCopilotProps> = ({ isOpen, onClose }) => {
  const { language, t } = useLanguage();
  const { activeProject } = useProject();

  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'assistant',
      text: language === 'hi' 
        ? `नमस्ते। मैं **राष्ट्रीय भूमि एवं अवसंरचना आसूचना प्रणाली (NLIIS)** का एआई सहायक हूँ। आप ${activeProject?.name || 'परियोजना'} के भूमि अधिग्रहण, खसरा विवाद, मुआवजा, न्यायालयीन प्रकरण, रूट तुलना या रोजगार प्रभाव के बारे में प्रश्न पूछ सकते हैं।`
        : `Greetings Officer. I am the **NLIIS AI Decision Support Copilot**. You can query project bottlenecks, Khasra dispute dossiers, compensation pendency, e-Courts litigation, route comparisons, or macroeconomic job creation for ${activeProject?.name || 'this infrastructure project'}.`,
      citations: ["NLIIS Master Database", "RFCTLARR 2013 Statutory Matrix"],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickPrompts = [
    { label: language === 'hi' ? "परियोजना में देरी क्यों हो रही है?" : "Why is this project delayed?", query: "Why is Jaipur-Ajmer project delayed?" },
    { label: language === 'hi' ? "पार्सल P127 का विवरण दें" : "What is blocking Parcel P127?", query: "What is blocking Parcel P127?" },
    { label: language === 'hi' ? "मुआवजा संवितरण सारांश" : "How much compensation is pending?", query: "How much compensation is pending?" },
    { label: language === 'hi' ? "रूट A और B की तुलना करें" : "Compare Route A and Route B", query: "Compare Route A vs Route B" },
    { label: language === 'hi' ? "रोजगार एवं आर्थिक प्रभाव" : "Employment & Economic Impact", query: "What is the employment generation estimate?" }
  ];

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputMessage;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!queryText) setInputMessage('');
    setIsLoading(true);

    try {
      const response = await askCopilot(textToSend, activeProject?.id || 'jaipur-ajmer-nh48', language);
      const assistantMsg: ChatMessage = {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        text: response.answer,
        citations: response.citations,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 sm:w-[440px] h-[580px] bg-white rounded-xl shadow-2xl border border-slate-300 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
      
      {/* Copilot Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-gov-navy to-slate-900 text-white flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-amber-300" />
          </div>
          <div>
            <h3 className="font-bold text-xs flex items-center gap-1.5">
              <span>NLIIS AI Officer Copilot</span>
              <span className="text-[10px] font-mono bg-blue-900 text-blue-200 px-1.5 py-0.2 rounded">RAG Grounded</span>
            </h3>
            <p className="text-[11px] text-slate-300">
              {activeProject?.name.slice(0, 32)}...
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Prompts Bar */}
      <div className="p-2 bg-slate-50 border-b border-slate-200 flex gap-1.5 overflow-x-auto text-[11px]">
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(qp.query)}
            className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white border border-slate-300 hover:border-gov-blue hover:text-gov-blue text-slate-700 font-medium transition shadow-2xs"
          >
            {qp.label}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs bg-slate-50/50">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[88%] rounded-lg p-3 leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-gov-navy text-white font-medium'
                  : 'bg-white text-slate-800 border border-slate-200 shadow-2xs'
              }`}
            >
              <div className="whitespace-pre-line">
                {msg.text}
              </div>

              {msg.citations && msg.citations.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-slate-100 text-[11px] text-slate-500 space-y-0.5">
                  <div className="font-semibold text-slate-600 flex items-center gap-1">
                    <BookOpen className="w-3 h-3 text-gov-blue" />
                    <span>Official Data Sources Cited:</span>
                  </div>
                  {msg.citations.map((cite, cIdx) => (
                    <div key={cIdx} className="font-mono text-[10px] text-slate-600 truncate">
                      • {cite}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <span className="text-[10px] text-slate-400 mt-1 px-1">
              {msg.timestamp}
            </span>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-slate-500 text-xs p-2">
            <Loader2 className="w-4 h-4 animate-spin text-gov-blue" />
            <span>Consulting project records and RFCTLARR database...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input & Disclaimer */}
      <div className="p-3 bg-white border-t border-slate-200 space-y-1.5">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder={language === 'hi' ? "परियोजना से संबंधित प्रश्न पूछें..." : "Ask a query about land, cases, or compensation..."}
            value={inputMessage}
            onChange={e => setInputMessage(e.target.value)}
            className="flex-1 border border-slate-300 rounded-md px-3 py-2 text-xs focus:ring-1 focus:ring-gov-blue outline-none"
          />
          <button
            type="submit"
            disabled={isLoading || !inputMessage.trim()}
            className="bg-gov-navy hover:bg-slate-800 text-white p-2 rounded-md disabled:opacity-50 transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <p className="text-[10px] text-slate-400 text-center leading-tight">
          Decision Support System • Grounded strictly in project records.
        </p>
      </div>

    </div>
  );
};
