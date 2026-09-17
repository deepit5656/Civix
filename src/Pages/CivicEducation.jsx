import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  ChevronUp, 
  Users, 
  Vote, 
  Building, 
  Heart, 
  BookOpen, 
  CheckCircle, 
  RotateCcw, 
  Trophy, 
  Star, 
  Target, 
  Lightbulb, 
  Award, 
  TrendingUp, 
  Bookmark, 
  Zap, 
  Shield, 
  Scale, 
  FileText, 
  Activity, 
  Sparkles, 
  Flame,
  ArrowRight,
  HelpCircle,
  Layers,
  GraduationCap,
  BookMarked
} from 'lucide-react';

const CivicEducation = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [activeAccordion, setActiveAccordion] = useState('civic-rights');
  const [bookmarkedSections, setBookmarkedSections] = useState([]);
  const [readingProgress, setReadingProgress] = useState(0);

  // Gamification state
  const [userXP, setUserXP] = useState(0);
  const [userLevel, setUserLevel] = useState(1);
  const [streakCount, setStreakCount] = useState(1);

  // Quiz state
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizScore, setQuizScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Fact ticker state
  const [factIndex, setFactIndex] = useState(0);

  const didYouKnowFacts = [
    {
      fact: "The right to vote is considered one of the most fundamental civic rights in democratic societies.",
      icon: Vote,
      category: "Electoral Rights"
    },
    {
      fact: "Local governments handle essential services including water supply, sanitation, parks, and local roads.",
      icon: Building,
      category: "Municipal Services"
    },
    {
      fact: "Citizens can attend open city council sessions and submit public petitions on community issues.",
      icon: Users,
      category: "Public Participation"
    },
    {
      fact: "The Right to Information (RTI) empowers citizens to request records from government bodies.",
      icon: FileText,
      category: "Transparency"
    },
    {
      fact: "Community civic participation correlates directly with higher quality public infrastructure.",
      icon: TrendingUp,
      category: "Civic Impact"
    }
  ];

  useEffect(() => {
    const savedBookmarks = localStorage.getItem('civicEducationBookmarks');
    const savedXP = localStorage.getItem('civicEducationXP');
    const savedLevel = localStorage.getItem('civicEducationLevel');

    if (savedBookmarks) setBookmarkedSections(JSON.parse(savedBookmarks));
    if (savedXP) setUserXP(parseInt(savedXP, 10));
    if (savedLevel) setUserLevel(parseInt(savedLevel, 10));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(100, Math.max(0, Math.round((scrollTop / docHeight) * 100)));
      setReadingProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setFactIndex((prev) => (prev + 1) % didYouKnowFacts.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [didYouKnowFacts.length]);

  const awardXP = (points) => {
    const newXP = userXP + points;
    const newLevel = Math.floor(newXP / 100) + 1;
    setUserXP(newXP);
    setUserLevel(newLevel);
    localStorage.setItem('civicEducationXP', newXP.toString());
    localStorage.setItem('civicEducationLevel', newLevel.toString());
  };

  const toggleBookmark = (sectionId) => {
    const isBookmarked = bookmarkedSections.includes(sectionId);
    const updated = isBookmarked
      ? bookmarkedSections.filter(id => id !== sectionId)
      : [...bookmarkedSections, sectionId];

    setBookmarkedSections(updated);
    localStorage.setItem('civicEducationBookmarks', JSON.stringify(updated));
    if (!isBookmarked) awardXP(15);
  };

  // Educational Modules Data
  const modules = [
    {
      id: 'civic-rights',
      title: 'Fundamental Rights & Freedoms',
      category: 'rights',
      icon: Shield,
      readTime: '4 min',
      summary: 'Essential freedoms guaranteed to every citizen under constitutional law.',
      details: [
        {
          heading: 'Right to Equality',
          description: 'Guarantees equal treatment before law, prohibition of discrimination based on religion, race, caste, sex, or place of birth.'
        },
        {
          heading: 'Right to Freedom of Speech & Expression',
          description: 'Protects citizen rights to express views freely, assemble peacefully, form associations, and move freely nationwide.'
        },
        {
          heading: 'Right Against Exploitation',
          description: 'Prohibits human trafficking, forced labor, and child employment in hazardous environments.'
        },
        {
          heading: 'Right to Constitutional Remedies',
          description: 'Allows citizens to move supreme or high courts to enforce fundamental rights through judicial writs.'
        }
      ]
    },
    {
      id: 'responsibilities',
      title: 'Duties & Responsibilities of Citizens',
      category: 'duties',
      icon: Heart,
      readTime: '3 min',
      summary: 'Active participation obligations that keep democratic societies strong and accountable.',
      details: [
        {
          heading: 'Informed Voting',
          description: 'Cast responsible votes in local, state, and national elections based on candidate track records and civic issues.'
        },
        {
          heading: 'Upholding Public Order & Property',
          description: 'Safeguard public assets, maintain public cleanliness, and respect community safety protocols.'
        },
        {
          heading: 'Tax Compliance & Civic Honesty',
          description: 'Pay legitimate taxes on time to fund public infrastructure, schools, emergency services, and hospitals.'
        },
        {
          heading: 'Environmental Stewardship',
          description: 'Protect natural resources, reduce waste, and participate in local neighborhood cleanups.'
        }
      ]
    },
    {
      id: 'local-gov',
      title: 'How Local Governance Works',
      category: 'governance',
      icon: Building,
      readTime: '5 min',
      summary: 'Understanding municipal bodies, mayor functions, ward councilors, and city budgets.',
      details: [
        {
          heading: 'Municipal Corporations & Councils',
          description: 'City governing bodies responsible for urban planning, road repair, street lighting, waste disposal, and public health.'
        },
        {
          heading: 'Ward Members & Public Meetings',
          description: 'Local elected representatives who voice neighborhood grievances in council sessions.'
        },
        {
          heading: 'Public Petitions & Right to Information',
          description: 'Formal mechanisms for requesting official municipal records, tracking budget allocations, and auditing works.'
        }
      ]
    },
    {
      id: 'rti-act',
      title: 'Right to Information (RTI) Guide',
      category: 'rights',
      icon: FileText,
      readTime: '4 min',
      summary: 'Step-by-step guide on filing RTI applications to enforce public transparency.',
      details: [
        {
          heading: 'What You Can Request',
          description: 'Contracts, government office expenditures, project timelines, tender documents, and inspection reports.'
        },
        {
          heading: 'How to Submit an Application',
          description: 'Address Public Information Officer (PIO), state specific questions clearly, and attach nominal application fee.'
        },
        {
          heading: 'Response Timelines',
          description: 'Statutory 30-day limit for standard requests; 48 hours for matters directly concerning life and liberty.'
        }
      ]
    }
  ];

  // Quiz Questions Data
  const quizQuestions = [
    {
      question: "Which of the following is considered a core Fundamental Right?",
      options: [
        "Right to Freedom of Speech",
        "Right to Free Unlimited Broadband",
        "Right to Commercial Monopoly",
        "Right to Private Property Ownership"
      ],
      correct: 0,
      explanation: "Freedom of Speech & Expression is a foundational constitutional right in democratic systems."
    },
    {
      question: "What is the primary responsibility of a Municipal Corporation?",
      options: [
        "Defending national borders",
        "Managing local city roads, waste, and public health",
        "Issuing international passports",
        "Printing paper currency"
      ],
      correct: 1,
      explanation: "Municipal Corporations manage local civic infrastructure including roads, waste disposal, and street lights."
    },
    {
      question: "Under standard Right to Information (RTI) regulations, what is the default response time for PIOs?",
      options: [
        "7 Days",
        "30 Days",
        "90 Days",
        "6 Months"
      ],
      correct: 1,
      explanation: "Public Information Officers (PIOs) are legally bound to reply to RTI queries within 30 days."
    },
    {
      question: "What is the minimum voting age for citizens in democratic elections?",
      options: [
        "16 Years",
        "18 Years",
        "21 Years",
        "25 Years"
      ],
      correct: 1,
      explanation: "Citizens aged 18 and above possess universal adult suffrage rights."
    }
  ];

  const handleAnswerSelect = (optionIdx) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(optionIdx);
    const isCorrect = optionIdx === quizQuestions[currentQuestionIndex].correct;
    if (isCorrect) {
      setQuizScore(prev => prev + 1);
      awardXP(25);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
    } else {
      setShowResult(true);
      setQuizSubmitted(true);
      awardXP(50);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setQuizScore(0);
    setShowResult(false);
    setQuizSubmitted(false);
    setQuizStarted(true);
  };

  const filteredModules = modules.filter(m => {
    if (activeTab === 'rights') return m.category === 'rights';
    if (activeTab === 'duties') return m.category === 'duties';
    if (activeTab === 'governance') return m.category === 'governance';
    if (activeTab === 'bookmarks') return bookmarkedSections.includes(m.id);
    return true;
  });

  const currentFact = didYouKnowFacts[factIndex];
  const FactIcon = currentFact.icon;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
      
      {/* TOP PROGRESS BAR */}
      <div className="fixed top-0 left-0 w-full h-1 bg-slate-200 dark:bg-slate-800 z-50">
        <div 
          className="h-full bg-emerald-600 transition-all duration-200" 
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* HERO & GAMIFICATION HEADER */}
      <section className="bg-slate-900 text-white border-b border-slate-800 pt-12 pb-14 px-4 sm:px-6 lg:px-8 relative shadow-md">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-emerald-400 font-semibold text-xs tracking-wide shadow-sm">
              <GraduationCap className="w-4 h-4 text-emerald-400" />
              <span>Civic Academy & Citizen Rights</span>
            </div>

            {/* User XP & Level Badge */}
            <div className="flex items-center gap-3 bg-slate-800/90 border border-slate-700 px-4 py-2 rounded-2xl">
              <div className="flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-slate-200">Level {userLevel}</span>
              </div>
              <div className="w-px h-4 bg-slate-700" />
              <div className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-orange-400" />
                <span className="text-xs font-bold text-slate-200">{userXP} XP</span>
              </div>
              <div className="w-px h-4 bg-slate-700" />
              <div className="flex items-center gap-1.5">
                <BookMarked className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-slate-200">{bookmarkedSections.length} Saved</span>
              </div>
            </div>
          </div>

          <div className="max-w-3xl space-y-3">
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Know Your Rights.{' '}
              <span className="text-emerald-400">Strengthen Your Democracy.</span>
            </h1>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              Explore fundamental constitutional rights, citizen responsibilities, local governance frameworks, and interactive civic knowledge modules.
            </p>
          </div>

          {/* FACT TICKER CARD */}
          <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 sm:p-5 flex items-center gap-4 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center justify-center shrink-0">
              <FactIcon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                  {currentFact.category}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">Did You Know?</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 truncate font-medium">
                {currentFact.fact}
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* MAIN CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* TAB NAVIGATION */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'All Topics', icon: Layers },
              { id: 'rights', label: 'Rights', icon: Shield },
              { id: 'duties', label: 'Duties', icon: Heart },
              { id: 'governance', label: 'Governance', icon: Building },
              { id: 'bookmarks', label: `Saved (${bookmarkedSections.length})`, icon: Bookmark },
            ].map(tab => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-emerald-500'
                  }`}
                >
                  <TabIcon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => {
              const quizElement = document.getElementById('civic-quiz-section');
              if (quizElement) quizElement.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white font-bold text-xs hover:bg-emerald-600 transition-all active:scale-95"
          >
            <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Take Knowledge Quiz</span>
          </button>
        </div>

        {/* EDUCATIONAL MODULES ACCORDION GRID */}
        <div className="space-y-4">
          {filteredModules.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
              <BookMarked className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <p className="text-base font-bold text-slate-900 dark:text-white">No saved topics yet</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Bookmark any learning section below to access it quickly here.</p>
            </div>
          ) : (
            filteredModules.map((module) => {
              const ModuleIcon = module.icon;
              const isExpanded = activeAccordion === module.id;
              const isBookmarked = bookmarkedSections.includes(module.id);

              return (
                <div
                  key={module.id}
                  className={`bg-white dark:bg-slate-900 border transition-all duration-300 rounded-2xl overflow-hidden shadow-sm ${
                    isExpanded 
                      ? 'border-emerald-500 ring-2 ring-emerald-500/20' 
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  {/* Module Accordion Header */}
                  <div 
                    onClick={() => setActiveAccordion(isExpanded ? null : module.id)}
                    className="p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer group"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                        <ModuleIcon className="w-6 h-6" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                            {module.readTime} read
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {module.title}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          {module.summary}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleBookmark(module.id);
                        }}
                        className={`p-2 rounded-xl border transition-all ${
                          isBookmarked 
                            ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800' 
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 hover:text-slate-600 dark:hover:text-slate-200'
                        }`}
                        title={isBookmarked ? "Remove Bookmark" : "Bookmark Section"}
                      >
                        <Bookmark className="w-4 h-4" fill={isBookmarked ? "currentColor" : "none"} />
                      </button>

                      <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Body Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-slate-100 dark:border-slate-800 p-6 bg-slate-50/50 dark:bg-slate-900/50 space-y-4"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {module.details.map((detail, idx) => (
                            <div 
                              key={idx} 
                              className="bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 rounded-xl p-4 space-y-2 shadow-sm"
                            >
                              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                                <CheckCircle className="w-4 h-4 shrink-0" />
                                <span>{detail.heading}</span>
                              </div>
                              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-6">
                                {detail.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </div>

        {/* INTERACTIVE QUIZ SECTION */}
        <div id="civic-quiz-section" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Civic Rights Knowledge Check</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Test your understanding of citizen rights and earned XP rewards.</p>
              </div>
            </div>

            {!quizStarted && (
              <button
                onClick={() => setQuizStarted(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl shadow-md active:scale-95 transition-all text-xs"
              >
                Start Quiz (+50 XP)
              </button>
            )}
          </div>

          {quizStarted && !showResult && (
            <div className="space-y-6">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                <span>Question {currentQuestionIndex + 1} of {quizQuestions.length}</span>
                <span>Score: {quizScore}</span>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {quizQuestions[currentQuestionIndex].question}
                </h3>

                <div className="space-y-2.5">
                  {quizQuestions[currentQuestionIndex].options.map((option, idx) => {
                    const isSelected = selectedAnswer === idx;
                    const isCorrect = idx === quizQuestions[currentQuestionIndex].correct;

                    let btnStyle = "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-slate-900 dark:text-white";
                    if (selectedAnswer !== null) {
                      if (isCorrect) btnStyle = "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 border-emerald-500 font-bold";
                      else if (isSelected) btnStyle = "bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-200 border-rose-500 font-bold";
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleAnswerSelect(idx)}
                        disabled={selectedAnswer !== null}
                        className={`w-full p-4 rounded-xl border text-left text-sm transition-all flex items-center justify-between ${btnStyle}`}
                      >
                        <span>{option}</span>
                        {selectedAnswer !== null && isCorrect && <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {selectedAnswer !== null && (
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">Explanation: </span>
                    {quizQuestions[currentQuestionIndex].explanation}
                  </p>

                  <button
                    onClick={handleNextQuestion}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs active:scale-95 transition-all flex items-center gap-1.5 ml-auto"
                  >
                    <span>{currentQuestionIndex < quizQuestions.length - 1 ? 'Next Question' : 'View Results'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}

          {showResult && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto border border-emerald-200 dark:border-emerald-800">
                <Trophy className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Quiz Completed!</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                You scored <span className="font-bold text-emerald-600 dark:text-emerald-400">{quizScore} out of {quizQuestions.length}</span>! You earned +50 XP.
              </p>

              <button
                onClick={restartQuiz}
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-sm text-xs active:scale-95 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retake Quiz</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default CivicEducation;