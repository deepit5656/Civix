import { useState } from "react";
import { Send, MessageSquare, Loader2, Star, Sparkles, AlertCircle, CheckCircle, ThumbsUp } from "lucide-react";
import { motion } from "framer-motion";

const Feedback = () => {
  const [formData, setFormData] = useState({
    category: "",
    rating: 0,
    feedback: "",
    name: "",
    email: "",
    phone: ""
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});

  const { category, rating, feedback, name, email, phone } = formData;

  const emojis = ["😡", "😞", "😐", "🙂", "🤩"];
  const ratingsLabels = ["Very Poor", "Poor", "Average", "Good", "Excellent"];

  const validateForm = () => {
    const newErrors = {};
    if (!category.trim()) newErrors.category = "Please select a category";
    if (rating === 0) newErrors.rating = "Please rate your experience";
    if (!feedback.trim()) newErrors.feedback = "Please provide your feedback";
    else if (feedback.trim().length < 10) newErrors.feedback = "Feedback must be at least 10 characters long";
    else if (feedback.trim().length > 500) newErrors.feedback = "Feedback must be less than 500 characters";
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Please enter a valid email address";
    if (phone && !/^[\+]?[1-9][\d]{0,15}$/.test(phone.replace(/\s/g, ''))) newErrors.phone = "Please enter a valid phone number";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const handleBlur = (field) => setTouched(prev => ({ ...prev, [field]: true }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
      setFormData({ category: "", rating: 0, feedback: "", name: "", email: "", phone: "" });
      setErrors({});
      setTouched({});
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-600 text-white rounded-2xl shadow-md mx-auto">
            <MessageSquare className="w-8 h-8" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Share Your Voice
          </h1>
          <p className="text-slate-600 dark:text-slate-300 max-w-md mx-auto text-base">
            Your feedback shapes better civic governance. Help us refine Civix to serve your community better.
          </p>
        </div>

        {!submitted ? (
          <motion.form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Category Selection */}
            <div>
              <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">
                Feedback Category <span className="text-red-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                onBlur={() => handleBlur("category")}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              >
                <option value="">Select Category</option>
                <option value="Bug Report">Bug Report</option>
                <option value="Feature Request">Feature Request</option>
                <option value="User Experience">User Experience</option>
                <option value="City Services Integration">City Services Integration</option>
                <option value="Other">Other</option>
              </select>
              {touched.category && errors.category && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.category}
                </p>
              )}
            </div>

            {/* Satisfaction Rating */}
            <div>
              <label className="block text-sm font-bold text-slate-900 dark:text-white mb-3">
                How would you rate your experience? <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center justify-between gap-2">
                {emojis.map((emoji, idx) => {
                  const ratingValue = idx + 1;
                  const isSelected = rating === ratingValue;

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleInputChange("rating", ratingValue)}
                      className={`flex-1 py-3 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                        isSelected
                          ? "bg-emerald-600 text-white border-emerald-600 shadow-md scale-105"
                          : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      <span className="text-2xl">{emoji}</span>
                      <span className={`text-[10px] font-bold ${isSelected ? "text-white" : "text-slate-500 dark:text-slate-400"}`}>
                        {ratingsLabels[idx]}
                      </span>
                    </button>
                  );
                })}
              </div>
              {touched.rating && errors.rating && (
                <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.rating}
                </p>
              )}
            </div>

            {/* Detailed Feedback Text */}
            <div>
              <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">
                Your Comments & Feedback <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                value={feedback}
                onChange={(e) => handleInputChange("feedback", e.target.value)}
                onBlur={() => handleBlur("feedback")}
                placeholder="Share your thoughts, suggested improvements, or issue details..."
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all resize-none"
              />
              <div className="flex justify-between items-center mt-1">
                {touched.feedback && errors.feedback ? (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.feedback}
                  </p>
                ) : <span />}
                <span className="text-[11px] text-slate-400">
                  {feedback.length}/500
                </span>
              </div>
            </div>

            {/* Contact Details (Optional) */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-4">
              <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Contact Details (Optional)
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Your Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="john@example.com"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white font-bold py-3.5 px-6 rounded-xl shadow-md active:scale-95 transition-all text-sm flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Feedback</span>
                </>
              )}
            </button>
          </motion.form>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center shadow-sm space-y-5"
          >
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto border border-emerald-200 dark:border-emerald-800">
              <ThumbsUp className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Thank You for Your Feedback!
            </h2>

            <p className="text-slate-600 dark:text-slate-300 text-sm max-w-md mx-auto">
              We appreciate your time and insight. Your responses help our team continuously improve the Civix platform.
            </p>

            <button
              onClick={() => setSubmitted(false)}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-sm text-sm active:scale-95 transition-all"
            >
              Submit Another Response
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Feedback;