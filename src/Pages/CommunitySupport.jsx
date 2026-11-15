import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, HandHelping, Users, MapPin, Phone, Plus, CheckCircle } from 'lucide-react';
import BackButton from '../components/ui/BackButton';
import { communityRequestAPI } from '../utils/api';
import { useAuthContext } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const requestTypes = [
  { value: 'blood', label: 'Blood donation', icon: HeartPulse, description: 'Find or request urgent blood support.' },
  { value: 'help', label: 'Ask for help', icon: HandHelping, description: 'Request food, medicine, transport, or shelter.' },
  { value: 'volunteer', label: 'Volunteer activity', icon: Users, description: 'Offer your time for a local initiative.' },
];

export default function CommunitySupport() {
  const { isAuthenticated } = useAuthContext();
  const [type, setType] = useState('blood');
  const [requests, setRequests] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', bloodGroup: '', urgency: 'normal', location: '', contact: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadRequests = async () => {
    try {
      const data = await communityRequestAPI.getAll();
      setRequests(data.requests || []);
    } catch (error) {
      toast.error(error.message || 'Could not load community requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadRequests(); }, []);

  const updateForm = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const submitRequest = async (event) => {
    event.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please sign in to create a request');
      return;
    }
    setSaving(true);
    try {
      await communityRequestAPI.create({ ...form, type });
      setForm({ title: '', description: '', bloodGroup: '', urgency: 'normal', location: '', contact: '' });
      toast.success('Community request published');
      loadRequests();
    } catch (error) {
      toast.error(error.message || 'Could not publish request');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 dark:bg-slate-950 dark:text-white">
      <div className="mx-auto max-w-6xl">
        <BackButton />
        <header className="mb-8 mt-6">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">Community support</p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Turn local goodwill into useful action</h1>
          <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-400">Request urgent support, offer help, or join a verified neighborhood activity. Keep personal contact details limited to what you are comfortable sharing.</p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-5 flex items-center gap-2"><Plus className="text-emerald-600" /><h2 className="text-xl font-bold">Create a request</h2></div>
            <div className="mb-5 grid gap-2 sm:grid-cols-3">
              {requestTypes.map(({ value, label, icon: Icon }) => (
                <button key={value} type="button" onClick={() => setType(value)} className={`rounded-2xl border p-3 text-left text-xs font-semibold transition ${type === value ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300' : 'border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-400'}`}>
                  <Icon className="mb-2 h-5 w-5" />{label}
                </button>
              ))}
            </div>
            <form onSubmit={submitRequest} className="space-y-3">
              <input required name="title" value={form.title} onChange={updateForm} placeholder={type === 'blood' ? 'e.g. O+ blood needed at City Hospital' : 'Short request title'} className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800" />
              <textarea required name="description" value={form.description} onChange={updateForm} rows={4} placeholder="Explain what is needed and when." className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800" />
              {type === 'blood' && <select name="bloodGroup" value={form.bloodGroup} onChange={updateForm} required className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800"><option value="">Select blood group</option>{['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((group) => <option key={group}>{group}</option>)}</select>}
              <div className="grid gap-3 sm:grid-cols-2">
                <select name="urgency" value={form.urgency} onChange={updateForm} className="rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800"><option value="normal">Normal</option><option value="urgent">Urgent</option><option value="critical">Critical</option></select>
                <input required name="location" value={form.location} onChange={updateForm} placeholder="Area or hospital" className="rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800" />
              </div>
              <input name="contact" value={form.contact} onChange={updateForm} placeholder="Optional contact method" className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800" />
              <button disabled={saving} className="w-full rounded-xl bg-emerald-600 py-3 font-semibold text-white hover:bg-emerald-500 disabled:opacity-60">{saving ? 'Publishing...' : 'Publish request'}</button>
            </form>
            {!isAuthenticated && <p className="mt-3 text-center text-xs text-slate-500">Sign in is required to publish. You can still browse active requests.</p>}
          </section>

          <section>
            <div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-bold">Active requests</h2><Link to="/nearby-services" className="text-sm font-semibold text-emerald-600 hover:underline">Find verified services</Link></div>
            {loading && <p className="text-slate-500">Loading requests...</p>}
            {!loading && requests.length === 0 && <div className="rounded-3xl border border-dashed border-slate-300 p-10 text-center text-slate-500 dark:border-slate-700">No active requests yet.</div>}
            <div className="space-y-3">
              {requests.map((request) => (
                <article key={request._id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wider text-emerald-600">{request.type}</p><h3 className="mt-1 font-bold">{request.title}</h3></div><span className={`rounded-full px-2 py-1 text-[11px] font-bold ${request.urgency === 'critical' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}>{request.urgency}</span></div>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{request.description}</p>
                  <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-500"><span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{request.location}</span>{request.contact && <span className="inline-flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{request.contact}</span>}<span className="inline-flex items-center gap-1"><CheckCircle className="h-3.5 w-3.5" />{request.status}</span></div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
