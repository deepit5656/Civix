// src/Pages/NewIssue.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import CharacterCounter from '../components/ui/CharacterCounter';
import SubmissionConfirmation from '../components/modals/SubmissionConfirmation';

export default function NewIssue() {
  const navigate = useNavigate();
  const [description, setDescription] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="mb-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-600 transition-all group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back</span>
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <textarea 
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded dark:bg-gray-800"
          rows={5}
        />
        <CharacterCounter value={description} />
        <button type="submit" className="mt-4 bg-emerald-600 text-white px-4 py-2 rounded font-medium hover:bg-emerald-700">
          Submit Issue
        </button>
      </form>

      <SubmissionConfirmation
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        issueId={123}
        onViewIssue={() => window.location.href = `/issues/123`}
        onReportAnother={() => setDescription('')}
      />
    </div>
  );
}