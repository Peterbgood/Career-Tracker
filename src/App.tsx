import React, { useState, useEffect } from 'react';

const API_URL = 'https://script.google.com/macros/s/AKfycbweu1rWmQkyxLQ-3VvYA-brQeel23cyC6NjFWaIg6fiZ5A9Bu-VWFVp9dsq6Cn04Dk/exec';

function App() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [jobs, setJobs] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    company: '', jobTitle: '', locationType: 'Remote',
    employmentType: 'Full-time', salaryRange: '', description: '', 
    applyUrl: '', status: 'APPLIED', dateApplied: new Date().toISOString().split('T')[0],
    tags: ''
  });

  const fetchJobs = () => {
    setFetching(true);
    const callbackName = 'jsonp_' + Date.now();
    (window as any)[callbackName] = (data: any) => {
      setJobs(Array.isArray(data) ? data.reverse() : []);
      setFetching(false);
      delete (window as any)[callbackName];
    };
    const script = document.createElement('script');
    script.src = `${API_URL}?callback=${callbackName}`;
    document.body.appendChild(script);
  };

  useEffect(() => { fetchJobs(); }, []);

  const getDaysAgo = (dateStr: string) => {
    if (!dateStr) return null;
    const start = new Date(dateStr);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) - 1;
    return diffDays === 0 ? 'today' : `${diffDays}d ago`;
  };

  const formatDateBadge = (dateStr: string) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const id = editingId || Date.now().toString();
    const params = new URLSearchParams();
    params.append('action', 'upsert');
    params.append('id', id);
    Object.entries(formData).forEach(([k, v]) => params.append(k, v));
    params.append('postedAt', new Date().toLocaleString());

    await fetch(API_URL, { method: 'POST', mode: 'no-cors', body: params });
    
    setTimeout(() => {
      fetchJobs(); 
      setEditingId(null);
      setFormData({ company: '', jobTitle: '', locationType: 'Remote', employmentType: 'Full-time', salaryRange: '', description: '', applyUrl: '', status: 'APPLIED', dateApplied: new Date().toISOString().split('T')[0], tags: '' });
      setLoading(false);
    }, 600);
  };

  const handleEdit = (job: any) => {
    setEditingId(job.id);
    setFormData({
      company: job.company || '', jobTitle: job.jobTitle || '', locationType: job.locationType || 'Remote',
      employmentType: job.employmentType || 'Full-time', salaryRange: job.salaryRange || '',
      description: job.description || '', applyUrl: job.applyUrl || '',
      status: job.status || 'APPLIED', dateApplied: job.dateApplied || new Date().toISOString().split('T')[0],
      tags: job.tags || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete listing?")) return;
    const params = new URLSearchParams();
    params.append('action', 'delete');
    params.append('id', id);
    setJobs(jobs.filter(j => j.id !== id));
    await fetch(API_URL, { method: 'POST', mode: 'no-cors', body: params });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4 font-sans text-[#1e293b]">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-8">
        
        <div className="lg:col-span-4">
          <div className="sticky top-8 space-y-6">
            <h1 className="text-3xl font-black tracking-tight text-indigo-950 uppercase">Tracker</h1>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 space-y-4">
              <input className="w-full p-3 bg-slate-50 rounded-xl outline-none border border-slate-100" placeholder="Company Name" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} required />
              <input className="w-full p-3 bg-slate-50 rounded-xl outline-none border border-slate-100" placeholder="Job Title" value={formData.jobTitle} onChange={e => setFormData({...formData, jobTitle: e.target.value})} required />
              <div className="grid grid-cols-2 gap-2">
                <select className="p-3 bg-slate-50 rounded-xl text-sm font-bold outline-none" value={formData.locationType} onChange={e => setFormData({...formData, locationType: e.target.value})}><option>Remote</option><option>On-site</option><option>Hybrid</option></select>
                <select className="p-3 bg-slate-50 rounded-xl text-sm font-bold outline-none" value={formData.employmentType} onChange={e => setFormData({...formData, employmentType: e.target.value})}><option>Full-time</option><option>Contract</option><option>Part-time</option></select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <select className="p-3 bg-slate-50 rounded-xl text-sm font-bold outline-none" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}><option>APPLIED</option><option>INTERVIEW</option><option>OFFER</option><option>REJECTED</option></select>
                <input type="date" className="p-3 bg-slate-50 rounded-xl text-sm font-bold outline-none" value={formData.dateApplied} onChange={e => setFormData({...formData, dateApplied: e.target.value})} />
              </div>
              <input className="w-full p-3 bg-slate-50 rounded-xl outline-none border border-slate-100" placeholder="Salary Range" value={formData.salaryRange} onChange={e => setFormData({...formData, salaryRange: e.target.value})} />
              <input className="w-full p-3 bg-slate-50 rounded-xl outline-none border border-slate-100" placeholder="Job Link" value={formData.applyUrl} onChange={e => setFormData({...formData, applyUrl: e.target.value})} />
              <input className="w-full p-3 bg-slate-50 rounded-xl outline-none border border-slate-100" placeholder="Tags" value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} />
              <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold uppercase tracking-widest">{loading ? 'SAVING...' : 'SAVE JOB'}</button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-4">
          {fetching ? <div className="text-center py-20 text-slate-400 font-bold">LOADING...</div> : jobs.map((job) => (
            <div key={job.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-extrabold text-slate-900">{job.company}</h3>
                  <span className="text-slate-300 text-xl font-light">/</span>
                  <span className="text-slate-400 font-medium">{job.jobTitle}</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {formatDateBadge(job.dateApplied) && <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[11px] font-bold uppercase">{formatDateBadge(job.dateApplied)}</span>}
                  {getDaysAgo(job.dateApplied) && <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[11px] font-bold uppercase">{getDaysAgo(job.dateApplied)}</span>}
                  {job.employmentType && <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[11px] font-bold uppercase">{job.employmentType}</span>}
                  {job.locationType && <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[11px] font-bold uppercase">{job.locationType}</span>}
                  {job.salaryRange && <span className="px-3 py-1 bg-slate-800 text-white rounded-lg text-[11px] font-bold uppercase">{job.salaryRange}</span>}
                  {job.status && <span className={`px-3 py-1 rounded-lg text-[11px] font-black uppercase ${job.status === 'REJECTED' ? 'bg-rose-50 text-rose-500 border border-rose-100' : job.status === 'OFFER' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>{job.status}</span>}
                </div>
              </div>
              <div className="flex items-center gap-3">
                {job.applyUrl && <a href={job.applyUrl} target="_blank" rel="noreferrer" className="w-10 h-10 flex items-center justify-center bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg></a>}
                <button onClick={() => handleEdit(job)} className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold hover:border-indigo-500 hover:text-indigo-600 transition-all">Edit</button>
                <button onClick={() => handleDelete(job.id)} className="text-rose-400 font-bold text-xs hover:text-rose-600 uppercase tracking-widest px-2">Del</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;