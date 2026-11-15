import { useEffect, useState } from 'react';
import { ArrowLeft, HeartPulse, Save, Phone, Hospital, ShieldCheck, Pill, AlertTriangle, User2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { profileAPI } from '../utils/api';

const emptyMedical = {
  bloodGroup: '',
  allergies: [],
  medications: [],
  conditions: [],
  doctor: { name: '', phone: '', hospital: '' },
  emergencyContacts: [{ name: '', phone: '' }],
};

const MedicalInfo = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [medical, setMedical] = useState(emptyMedical);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    profileAPI.getMe()
      .then((data) => {
        if (!active) return;
        const user = data?.user || data;
        setProfile(user);
        setMedical({ ...emptyMedical, ...(user?.medical || {}), doctor: { ...emptyMedical.doctor, ...(user?.medical?.doctor || {}) }, emergencyContacts: user?.medical?.emergencyContacts?.length ? user.medical.emergencyContacts : emptyMedical.emergencyContacts });
      })
      .catch(() => {
        if (active) toast.error('Could not load your medical profile');
      })
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  const listValue = (items) => items.join(', ');
  const parseList = (value) => value.split(',').map((item) => item.trim()).filter(Boolean);
  const updateList = (field, value) => setMedical((current) => ({ ...current, [field]: parseList(value) }));

  const saveMedical = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      const response = await profileAPI.updateMe({
        name: profile.name || profile.username,
        email: profile.email,
        location: profile.location || 'Not provided',
        medical,
      });
      setProfile(response?.user || profile);
      setEditing(false);
      toast.success('Medical information saved');
    } catch (error) {
      toast.error(error.message || 'Could not save medical information');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-600 dark:text-slate-300">Loading your medical profile...</div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <button type="button" onClick={() => (window.history.state?.idx > 0 ? navigate(-1) : navigate('/user/dashboard'))} className="inline-flex items-center gap-2 text-slate-700 dark:text-slate-200">
          <ArrowLeft className="w-5 h-5" /> Back
        </button>
        <div className="rounded-2xl bg-emerald-700 text-white p-6 shadow-md">
          <h1 className="text-3xl font-bold">{profile?.name || profile?.username || 'Your medical profile'}</h1>
          <p className="mt-1">Keep emergency information available for people you trust.</p>
          {medical.bloodGroup && <span className="mt-3 inline-block bg-white text-emerald-700 font-semibold px-3 py-1 rounded-full">Blood group: {medical.bloodGroup}</span>}
        </div>

        <div className="flex justify-end">
          <button type="button" onClick={() => (editing ? saveMedical() : setEditing(true))} disabled={saving} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50">
            {editing ? <Save className="w-4 h-4" /> : <HeartPulse className="w-4 h-4" />}
            {saving ? 'Saving...' : editing ? 'Save medical information' : 'Edit medical information'}
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <section className="rounded-2xl border bg-white dark:bg-slate-900 dark:border-slate-800 shadow-sm p-6">
              <h2 className="font-semibold text-xl mb-4 flex items-center gap-2 dark:text-white"><HeartPulse className="text-rose-500" /> Health information</h2>
              {editing && <label className="block mb-4 text-sm font-medium dark:text-slate-200">Blood group<input value={medical.bloodGroup} onChange={(e) => setMedical({ ...medical, bloodGroup: e.target.value })} className="mt-1 w-full rounded-lg border p-2 dark:bg-slate-800 dark:border-slate-700" placeholder="e.g. B+" /></label>}
              <div className="grid sm:grid-cols-2 gap-4">
                <MedicalCard title="Allergies" icon={<AlertTriangle className="text-red-500 w-4 h-4" />} items={medical.allergies} editing={editing} onChange={(value) => updateList('allergies', value)} />
                <MedicalCard title="Medications" icon={<Pill className="text-green-500 w-4 h-4" />} items={medical.medications} editing={editing} onChange={(value) => updateList('medications', value)} />
                <MedicalCard title="Conditions" icon={<ShieldCheck className="text-blue-500 w-4 h-4" />} items={medical.conditions} editing={editing} onChange={(value) => updateList('conditions', value)} />
              </div>
            </section>

            <section className="rounded-2xl border bg-white dark:bg-slate-900 dark:border-slate-800 shadow-sm p-6">
              <h2 className="flex items-center gap-3 font-semibold text-lg dark:text-white"><Hospital className="text-rose-600" /> Primary doctor</h2>
              {editing ? <div className="grid sm:grid-cols-3 gap-3 mt-4">{[['name', 'Name'], ['phone', 'Phone'], ['hospital', 'Hospital']].map(([key, label]) => <input key={key} aria-label={label} value={medical.doctor[key]} onChange={(e) => setMedical({ ...medical, doctor: { ...medical.doctor, [key]: e.target.value } })} placeholder={label} className="rounded-lg border p-2 dark:bg-slate-800 dark:border-slate-700" />)}</div> : <><p className="mt-3 text-lg font-medium dark:text-white">{medical.doctor.name || 'Not added'}</p><p className="text-slate-600 dark:text-slate-400">{medical.doctor.hospital}</p>{medical.doctor.phone && <a href={`tel:${medical.doctor.phone}`} className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg bg-indigo-600 text-white"><Phone className="w-4 h-4" /> Call doctor</a>}</>}
            </section>
          </div>

          <section className="rounded-2xl border bg-white dark:bg-slate-900 dark:border-slate-800 shadow-sm p-6 h-fit">
            <h2 className="font-semibold mb-4 text-lg flex items-center gap-2 dark:text-white"><User2 className="text-indigo-600" /> Emergency contacts</h2>
            {editing ? medical.emergencyContacts.map((contact, index) => <div key={index} className="space-y-2 mb-4"><input aria-label={`Contact ${index + 1} name`} value={contact.name} onChange={(e) => setMedical({ ...medical, emergencyContacts: medical.emergencyContacts.map((item, i) => i === index ? { ...item, name: e.target.value } : item) })} placeholder="Name" className="w-full rounded-lg border p-2 dark:bg-slate-800 dark:border-slate-700" /><input aria-label={`Contact ${index + 1} phone`} value={contact.phone} onChange={(e) => setMedical({ ...medical, emergencyContacts: medical.emergencyContacts.map((item, i) => i === index ? { ...item, phone: e.target.value } : item) })} placeholder="Phone" className="w-full rounded-lg border p-2 dark:bg-slate-800 dark:border-slate-700" /></div>) : medical.emergencyContacts.filter((contact) => contact.name || contact.phone).map((contact, index) => <div key={index} className="flex items-center justify-between mb-4"><div><p className="font-medium dark:text-white">{contact.name}</p><p className="text-sm text-slate-600 dark:text-slate-400">{contact.phone}</p></div>{contact.phone && <a className="px-3 py-2 rounded-lg bg-rose-600 text-white" href={`tel:${contact.phone}`}>Call</a>}</div>)}
            {!editing && !medical.emergencyContacts.some((contact) => contact.name || contact.phone) && <p className="text-sm text-slate-500">No emergency contacts added.</p>}
          </section>
        </div>
      </div>
    </div>
  );
};

function MedicalCard({ title, icon, items, editing, onChange }) {
  return <div className="rounded-xl border p-4 bg-slate-50 dark:bg-slate-800 dark:border-slate-700"><div className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-200">{icon}{title}</div>{editing ? <input aria-label={title} value={listValue(items)} onChange={(e) => onChange(e.target.value)} placeholder="Separate items with commas" className="mt-2 w-full rounded-lg border p-2 dark:bg-slate-900 dark:border-slate-700" /> : items.length ? <ul className="mt-2 list-disc ml-5 text-sm text-slate-700 dark:text-slate-300 space-y-1">{items.map((item) => <li key={item}>{item}</li>)}</ul> : <p className="mt-2 text-sm text-slate-500">Not added.</p>}</div>;
}

export default MedicalInfo;
