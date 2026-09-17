import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Vote, 
  BarChart3, 
  Users, 
  TrendingUp,
  CheckCircle2,
  Sparkles,
  Layers,
  Send
} from 'lucide-react';
import VotingFeedbackModal from '../components/voting/VotingFeedbackModal';
import toast from 'react-hot-toast';

const VotingSystem = () => {
  const [activeTab, setActiveTab] = useState('browse');
  const [polls, setPolls] = useState([
    {
      id: 1,
      title: "Should the city prioritize installing solar streetlights along West Avenue?",
      options: ["Yes, install solar lights", "No, keep existing electric grid", "Need more information"],
      votes: [42, 12, 5],
      category: "Infrastructure"
    },
    {
      id: 2,
      title: "Proposed community park renovation in Sector 4",
      options: ["Add children's playground", "Create walking track & gardens", "Install open-air gymnasium"],
      votes: [28, 35, 19],
      category: "Community"
    }
  ]);
  const [newTitle, setNewTitle] = useState('');
  const [newOptions, setNewOptions] = useState('');
  const [votedPolls, setVotedPolls] = useState(new Set());
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [currentPollForFeedback, setCurrentPollForFeedback] = useState(null);

  const handleVote = (pollId, optionIndex) => {
    if (votedPolls.has(pollId)) {
      toast.error('You have already voted on this poll!');
      return;
    }
    setPolls((prevPolls) =>
      prevPolls.map((poll) => {
        if (poll.id === pollId) {
          const updatedVotes = [...poll.votes];
          updatedVotes[optionIndex] = (updatedVotes[optionIndex] || 0) + 1;
          return { ...poll, votes: updatedVotes };
        }
        return poll;
      })
    );
    setVotedPolls(prev => new Set([...prev, pollId]));
    const poll = polls.find(p => p.id === pollId);
    setCurrentPollForFeedback(poll);
    setShowFeedbackModal(true);
    toast.success('Vote recorded successfully!');
  };

  const handleFeedbackSubmit = async (formData) => {
    try {
      toast.success('Thank you for your civic feedback!');
    } catch (error) {
      toast.error('Failed to submit feedback. Please try again.');
    }
  };

  const handleCreatePoll = (e) => {
    e.preventDefault();
    const optionsArray = newOptions.split('\n').map(opt => opt.trim()).filter(opt => opt);
    if (!newTitle.trim() || optionsArray.length < 2) {
      toast.error('Please enter a valid title and at least two options.');
      return;
    }
    const newPoll = {
      id: Date.now(),
      title: newTitle.trim(),
      options: optionsArray,
      votes: Array(optionsArray.length).fill(0),
      category: "General"
    };
    setPolls((prevPolls) => [newPoll, ...prevPolls]);
    setNewTitle('');
    setNewOptions('');
    setActiveTab('browse');
    toast.success('Poll created successfully!');
  };

  const getTotalVotes = (poll) => poll.votes.reduce((a, v) => a + v, 0);
  const getVotePercentage = (votes, total) => total > 0 ? Math.round((votes / total) * 100) : 0;

  const totalAllVotes = polls.reduce((sum, p) => sum + getTotalVotes(p), 0);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* HEADER SECTION */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-600 text-white rounded-2xl shadow-md mx-auto">
            <Vote className="w-8 h-8" />
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Community Voting System
          </h1>
          <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            Vote on local civic initiatives, share your voice on infrastructure spending, and create transparent community polls.
          </p>
        </div>

        {/* STATS BAR */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:border-emerald-500/50 hover:-translate-y-1 transition-all duration-300 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">{polls.length}</div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Active Polls</div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:border-emerald-500/50 hover:-translate-y-1 transition-all duration-300 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">{totalAllVotes}</div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Total Votes Cast</div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:border-emerald-500/50 hover:-translate-y-1 transition-all duration-300 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">{votedPolls.size}</div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Your Participated Votes</div>
            </div>
          </div>
        </div>

        {/* TAB CONTROLS */}
        <div className="flex justify-center">
          <div className="bg-slate-200/80 dark:bg-slate-800 p-1.5 rounded-xl border border-slate-300/60 dark:border-slate-700/60 flex items-center gap-2 max-w-sm w-full">
            <button
              onClick={() => setActiveTab('browse')}
              className={`flex-1 py-2 px-4 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                activeTab === 'browse'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Browse Polls</span>
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`flex-1 py-2 px-4 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                activeTab === 'create'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Create Poll</span>
            </button>
          </div>
        </div>

        {/* MAIN TAB CONTENT */}
        <AnimatePresence mode="wait">
          {activeTab === 'browse' ? (
            <motion.div
              key="browse"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {polls.map((poll) => {
                const totalVotes = getTotalVotes(poll);
                const hasVoted = votedPolls.has(poll.id);

                return (
                  <div
                    key={poll.id}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-xl hover:border-emerald-500/50 transition-all duration-300 space-y-6"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                      <div>
                        <span className="inline-block px-2.5 py-1 text-[11px] font-bold rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 mb-2">
                          {poll.category || "General"}
                        </span>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-snug">
                          {poll.title}
                        </h3>
                      </div>
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 shrink-0">
                        {totalVotes} total votes
                      </span>
                    </div>

                    {/* Options list */}
                    <div className="space-y-3">
                      {poll.options.map((option, idx) => {
                        const count = poll.votes[idx] || 0;
                        const percentage = getVotePercentage(count, totalVotes);

                        return (
                          <div key={idx} className="space-y-1.5">
                            <button
                              onClick={() => handleVote(poll.id, idx)}
                              disabled={hasVoted}
                              className={`w-full p-4 rounded-xl border text-left font-semibold text-sm transition-all flex items-center justify-between group ${
                                hasVoted
                                  ? 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 cursor-default'
                                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/40 text-slate-900 dark:text-white'
                              }`}
                            >
                              <span className="flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs flex items-center justify-center font-bold">
                                  {idx + 1}
                                </span>
                                <span>{option}</span>
                              </span>
                              
                              {!hasVoted && (
                                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                  Vote
                                </span>
                              )}
                            </button>

                            {/* Vote progress bar */}
                            {hasVoted && (
                              <div className="space-y-1 px-1">
                                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
                                  <span>{count} votes</span>
                                  <span>{percentage}%</span>
                                </div>
                                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                  <div
                                    className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="create"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm"
            >
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Create a New Civic Poll</h2>

              <form onSubmit={handleCreatePoll} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Poll Question / Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Should the city add a bike lane on 5th Street?"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Voting Options (One per line)
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder={`Option 1\nOption 2\nOption 3`}
                    value={newOptions}
                    onChange={(e) => setNewOptions(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-md active:scale-95 transition-all text-sm flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Publish Community Poll</span>
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {showFeedbackModal && (
          <VotingFeedbackModal
            isOpen={showFeedbackModal}
            onClose={() => setShowFeedbackModal(false)}
            onSubmit={handleFeedbackSubmit}
            poll={currentPollForFeedback}
          />
        )}
      </div>
    </div>
  );
};

export default VotingSystem;
