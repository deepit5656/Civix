import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { aiAPI } from '../../utils/api';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  ArrowRight,
  HelpCircle,
  AlertTriangle,
  FileText,
  MapPin,
  Vote,
  Compass,
  RefreshCw
  ,Mic, Volume2, VolumeX
} from 'lucide-react';

const CIVIC_FAQS = [
  {
    keywords: ['lost', 'found', 'missing', 'lost item', 'find item', 'lost and found', 'lost & found', 'misplaced', 'lost phone', 'lost wallet', 'lost bag', 'lost keys'],
    question: 'How do I find my lost item or report a found item?',
    answer: 'Civix has a dedicated Lost & Found section! You can post about a lost item to alert the community, or report something you\'ve found so the owner can claim it. Browse existing lost & found listings nearby and connect directly with people in your area.',
    actionLabel: 'Go to Lost & Found',
    actionRoute: '/lost-found'
  },
  {
    keywords: ['report', 'issue', 'complaint', 'file', 'lodge', 'pothole', 'garbage', 'light'],
    question: 'How do I report a civic issue?',
    answer: 'To report an issue, click "Report Issue" in the navigation or dashboard. Provide details, attach a photo, and click "Get Current GPS Location" to auto-tag coordinates. The municipal department will be notified immediately.',
    actionLabel: 'Guide me through a report',
    guidedAction: 'report'
  },
  {
    keywords: ['track', 'status', 'check', 'progress', 'my complaint', 'ticket'],
    question: 'How can I track my complaints?',
    answer: 'Head to "My Complaints" in your profile dropdown or dashboard. Every complaint displays real-time progress: Pending ➔ In Progress ➔ Resolved, complete with timestamps and officer notes.',
    actionLabel: 'View My Complaints',
    actionRoute: '/complaints'
  },
  {
    keywords: ['vote', 'voting', 'community', 'priority', 'upvote', 'neighborhood'],
    question: 'How does Community Voting work?',
    answer: 'In the "Community Voting" section, citizens can review local civic hazards. You can filter by "In My City/Area" or view nationwide. Upvoting critical issues escalates their priority on municipal repair boards.',
    actionLabel: 'Go to Community Voting',
    actionRoute: '/community-voting'
  },
  {
    keywords: ['emergency', 'sos', 'danger', 'help', 'police', 'ambulance', 'hospital'],
    question: 'What do I do in an emergency?',
    answer: 'Click the red "SOS" button in the top navigation bar or go to the SOS page. It offers one-tap emergency calls (112, 100, 108), quick location sharing, medical info, and emergency audio recording.',
    actionLabel: 'Emergency SOS Hub',
    actionRoute: '/sos'
  },
  {
    keywords: ['scheme', 'welfare', 'subsidy', 'government', 'yojana', 'benefits'],
    question: 'Where can I find government schemes?',
    answer: 'Explore the "Government Schemes" portal in Civix to browse verified central and state welfare initiatives, eligibility criteria, required documents, and official application portals.',
    actionLabel: 'Explore Govt Schemes',
    actionRoute: '/govt-schemes'
  },
  {
    keywords: ['near', 'hospital', 'transit', 'bus', 'station', 'police station', 'services'],
    question: 'How do I find nearby public services?',
    answer: 'Civix integrates live OpenStreetMap GPS services. Visit "Nearby Services" or "Transit" to pinpoint the nearest hospitals, police stations, fire stations, metro stops, and bus depots within 5-10km.',
    actionLabel: 'Find Nearby Services',
    actionRoute: '/nearby-services'
  },
  {
    keywords: ['blood', 'donor', 'donation', 'volunteer', 'food', 'medicine', 'shelter', 'help request'],
    question: 'How can I ask for or offer community support?',
    answer: 'Open Community Support to request blood or practical help, or publish a volunteer activity. Nearby Services can help you find hospitals, blood banks, pharmacies, shelters, and food banks.',
    actionLabel: 'Open Community Support',
    actionRoute: '/community-support'
  },
  {
    keywords: ['forgot password', 'reset password', 'password reset', 'cannot login'],
    question: 'How do I reset my password?',
    answer: 'Use Forgot password on the login screen. Civix will send a one-time code to your registered email so you can set a new password.',
    actionLabel: 'Reset Password',
    actionRoute: '/forgot-password'
  },
  {
    keywords: ['budget', 'tax', 'sdrf', 'disaster', 'finance', 'money'],
    question: 'How can I view civic budgets and disaster relief?',
    answer: 'Civix provides open data visualizers for the Union Budget allocations, State Disaster Response Fund (SDRF) disbursements, and personal Tax Impact breakdown calculators.',
    actionLabel: 'View Union Budget',
    actionRoute: '/budget'
  }
];

const SUGGESTED_PROMPTS = [
  'I want to report a pothole',
  'How can I find my lost item?',
  'How does community voting escalate issues?',
  'Where can I find nearby emergency hospitals?',
  'How do I track my submitted complaint status?'
];

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('civix-ai-chat') || '[]');
    } catch {
      return [];
    }
  });
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [guidedFlow, setGuidedFlow] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const navigate = useNavigate();

  const speakText = (text) => {
    if (!('speechSynthesis' in window) || !text) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const addBotMessage = (message) => {
    setMessages((prev) => [...prev, {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ...message,
    }]);
    if (message.text) speakText(message.text);
  };

  const startGuidedReport = () => {
    setGuidedFlow({ step: 'consent', data: {} });
    addBotMessage({ text: 'I can guide you through a report and fill the form for your review. Would you like me to help? Please say or type yes or no.' });
  };

  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      addBotMessage({ text: 'Voice input is not supported in this browser. You can still type your request below.' });
      return;
    }
    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = document.documentElement.lang || 'en-IN';
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputValue(transcript);
      handleSend(transcript);
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognitionRef.current = recognition;
    setIsListening(true);
    recognition.start();
  };

  const handleGuidedReply = (query) => {
    const lower = query.toLowerCase();
    const current = guidedFlow;
    if (current.step === 'consent') {
      if (/\b(yes|sure|okay|ok|help|please)\b/.test(lower)) {
        setGuidedFlow({ step: 'title', data: {} });
        addBotMessage({ text: 'Great. What is the issue? For example: broken streetlight near the school.' });
      } else {
        setGuidedFlow(null);
        addBotMessage({ text: 'No problem. You can choose Report Issue whenever you are ready.' });
      }
      return true;
    }
    const data = { ...current.data };
    if (current.step === 'title') {
      data.title = query;
      setGuidedFlow({ step: 'description', data });
      addBotMessage({ text: 'Please describe what is happening and how it affects people.' });
    } else if (current.step === 'description') {
      data.description = query;
      setGuidedFlow({ step: 'location', data });
      addBotMessage({ text: 'Where is the issue located? You can give an address, landmark, or area.' });
    } else if (current.step === 'location') {
      data.location = query;
      setGuidedFlow({ step: 'phone', data });
      addBotMessage({ text: 'What phone number should the municipality use to contact you? You may say skip.' });
    } else if (current.step === 'phone') {
      data.phone = lower === 'skip' ? '' : query;
      setGuidedFlow(null);
      addBotMessage({ text: 'Your report details are ready. I will open the form so you can add a photo, review everything, and submit it.' });
      navigate('/report-issue', { state: { prefill: data } });
      setIsOpen(false);
    }
    return true;
  };

  // Initialize with greeting if opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          sender: 'bot',
          text: 'Hello! I am your Civix AI Assistant 🏛️. How can I help you today with civic issue reporting, live tracking, community voting, or public welfare services?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          quickActions: [
            { label: 'Report Issue', route: '/report-issue' },
            { label: 'Community Voting', route: '/community-voting' },
            { label: 'Emergency SOS', route: '/sos' },
            { label: 'Nearby Services', route: '/nearby-services' }
          ]
        }
      ]);
    }
  }, [isOpen, messages.length]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  useEffect(() => {
    if (messages.length > 0) localStorage.setItem('civix-ai-chat', JSON.stringify(messages.slice(-30)));
  }, [messages]);

  const toggleChat = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSend = async (textToSend) => {
    const query = (textToSend || inputValue).trim();
    if (!query) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      if (guidedFlow && handleGuidedReply(query)) {
        setIsTyping(false);
        return;
      }
      // 1. Check quick FAQ match first for instant responses
      const lower = query.toLowerCase();
      let matchedFaq = CIVIC_FAQS.find((faq) =>
        faq.keywords.some((kw) => lower.includes(kw))
      );

      if (matchedFaq) {
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: `bot-${Date.now()}`,
              sender: 'bot',
              text: matchedFaq.answer,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              actionLabel: matchedFaq.actionLabel,
              actionRoute: matchedFaq.actionRoute,
              guidedAction: matchedFaq.guidedAction,
              aiEngine: 'Civix Verified Knowledge'
            }
          ]);
          speakText(matchedFaq.answer);
          setIsTyping(false);
        }, 500);
        return;
      }

      // 2. Query Backend AI Service
      const res = await aiAPI.chat({
        message: query,
        conversationHistory: messages
      });

      if (res && res.reply) {
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            sender: 'bot',
            text: res.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            actionLabel: res.actionLabel,
            actionRoute: res.actionRoute,
            aiEngine: res.aiEngine || 'Civix AI'
          }
        ]);
      } else {
        throw new Error('No AI reply returned');
      }
    } catch (err) {
      console.warn('AI Chat API fallback:', err.message);
      // Fallback local response
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: `I'm here to assist with civic issues, municipal welfare, and emergency services. You can file a new report, track tickets, or find emergency services anytime.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          quickActions: [
            { label: 'Report Issue', route: '/report-issue' },
            { label: 'My Complaints', route: '/complaints' },
            { label: 'Emergency SOS', route: '/sos' }
          ],
          aiEngine: 'Civix Offline Assistant'
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleActionClick = (route) => {
    if (route) {
      navigate(route);
      setIsOpen(false);
    }
  };

  const handleGuidedAction = (action) => {
    if (action === 'report') startGuidedReport();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-inter">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="relative group flex items-center justify-center w-14 h-14 rounded-full bg-emerald-700 hover:bg-emerald-600 text-white shadow-xl shadow-emerald-950/20 hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none"
          title="Open Civix AI Assistant"
          aria-label="Open Civix AI Assistant"
        >
          <div className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-400 border-2 border-white dark:border-slate-900"></span>
          </div>
          <Sparkles className="w-6 h-6 animate-pulse" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[90vw] sm:w-[380px] h-[520px] max-h-[85vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          
          {/* Header */}
          <div className="bg-emerald-700 px-4 py-3.5 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-tight flex items-center gap-1.5">
                  <span>Civix AI Assistant</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-emerald-400 text-emerald-950 font-extrabold uppercase">Live</span>
                </h3>
                <p className="text-[11px] text-emerald-100/90">Instant Civic & Municipal Help</p>
              </div>
            </div>

            <button
              onClick={toggleChat}
              className="p-1 rounded-lg hover:bg-white/10 text-white transition-colors"
              aria-label="Close Assistant"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/60 dark:bg-slate-950/40">
            {messages.map((msg) => {
              const isBot = msg.sender === 'bot';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${isBot ? 'justify-start' : 'justify-end'}`}
                >
                  {isBot && (
                    <div className="w-6 h-6 rounded-md bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-sm ${
                      isBot
                        ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/80'
                        : 'bg-emerald-600 text-white font-medium'
                    }`}
                  >
                    <p>{msg.text}</p>
                    
                    {/* Action Route Button */}
                    {msg.actionRoute && (
                      <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-700">
                        <button
                          onClick={() => handleActionClick(msg.actionRoute)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900 border border-emerald-300 dark:border-emerald-700 rounded-lg text-[11px] font-bold transition-all"
                        >
                          <span>{msg.actionLabel || 'View Details'}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                    {msg.guidedAction && (
                      <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-700">
                        <button onClick={() => handleGuidedAction(msg.guidedAction)} className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-[11px] font-bold text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300">
                          {msg.actionLabel} <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    )}

                    {/* Quick Action Chips */}
                    {msg.quickActions && (
                      <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-700 flex flex-wrap gap-1.5">
                        {msg.quickActions.map((act, i) => (
                          <button
                            key={i}
                            onClick={() => handleActionClick(act.route)}
                            className="px-2 py-1 bg-slate-100 dark:bg-slate-700/80 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 text-slate-700 dark:text-slate-200 hover:text-emerald-600 rounded-md text-[10px] font-semibold transition-colors"
                          >
                            {act.label}
                          </button>
                        ))}
                      </div>
                    )}

                    <span className="block text-[9px] text-right mt-1 opacity-60">
                      {msg.timestamp}
                    </span>
                  </div>

                  {!isBot && (
                    <div className="w-6 h-6 rounded-md bg-slate-700 text-white flex items-center justify-center flex-shrink-0 mt-1">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 text-slate-400 text-xs pl-2">
                <div className="w-5 h-5 rounded-md bg-emerald-600 text-white flex items-center justify-center">
                  <Bot className="w-3 h-3" />
                </div>
                <div className="flex gap-1 py-1 px-2.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}

            {/* Suggested Prompts if chat is short */}
            {messages.length <= 2 && !isTyping && (
              <div className="pt-2">
                <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Suggested Questions:</p>
                <div className="space-y-1.5">
                  {SUGGESTED_PROMPTS.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(prompt)}
                      className="w-full text-left p-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200/80 dark:border-slate-700/80 text-xs text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-400 transition-all leading-snug"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 rounded-xl px-3 py-2 border border-slate-200 dark:border-slate-700 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition-all">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Civix AI Assistant..."
                className="flex-1 bg-transparent text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
              />
              <button onClick={handleVoiceInput} className={`p-1.5 rounded-lg ${isListening ? 'bg-rose-600' : 'bg-slate-200 dark:bg-slate-700'} text-slate-700 dark:text-white`} aria-label={isListening ? 'Stop voice input' : 'Start voice input'} title={isListening ? 'Stop listening' : 'Speak your request'}>
                <Mic className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => isSpeaking ? window.speechSynthesis.cancel() : speakText(messages.filter((message) => message.sender === 'bot').at(-1)?.text)} className="p-1.5 rounded-lg bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-white" aria-label={isSpeaking ? 'Stop voice output' : 'Read last answer aloud'} title={isSpeaking ? 'Stop speaking' : 'Read last answer aloud'}>
                {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => handleSend()}
                disabled={!inputValue.trim()}
                className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-40 disabled:hover:bg-emerald-600 transition-all"
                aria-label="Send message"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex items-center justify-between mt-1.5 px-1 text-[10px] text-slate-400 dark:text-slate-500">
              <span>Civix Smart Assistance</span>
              <span>Available 24/7</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;