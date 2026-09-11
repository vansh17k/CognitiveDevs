import React, { useState } from 'react';
import { useApp } from '../App.jsx';
import { 
  UserCheck, 
  UserPlus, 
  Search, 
  ShieldCheck, 
  Mail, 
  MapPin, 
  CheckCircle2, 
  AlertCircle,
  MoreVertical,
  Plus,
  X,
  ShieldAlert
} from 'lucide-react';
import { INITIAL_USERS } from '../data.js';

const INITIAL_OFFICERS = [
  { id: '1', name: 'Inspector Rajesh Sharma', email: 'inspector@lmcc.demo', role: 'Field Inspector', division: 'Central Zone - District 1', scansCount: 428, status: 'Active' },
  { id: '2', name: 'Dr. Anita Verma (DLMO)', email: 'admin@lmcc.demo', role: 'DLMO(District Legal Metrology Officer)', division: 'Central Authority & Legal Metrology HQ', scansCount: 1248, status: 'Active' },
  { id: '3', name: 'Inspector Vikram Joshi', email: 'v.joshi@lmcc.demo', role: 'Field Inspector', division: 'Northern Division', scansCount: 312, status: 'Active' },
  { id: '4', name: 'Inspector Priya Patel', email: 'p.patel@lmcc.demo', role: 'Field Inspector', division: 'Western Sector', scansCount: 260, status: 'Active' },
  { id: '5', name: 'Supervisory Officer Amit Roy', email: 'a.roy@lmcc.demo', role: 'DLMO(District Legal Metrology Officer)', division: 'Southern Zonal Hub', scansCount: 180, status: 'Active' },
];

export const Users = () => {
  const { addToast } = useApp();
  const [officers, setOfficers] = useState(INITIAL_OFFICERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Officer Form State
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('Field Inspector');
  const [newDivision, setNewDivision] = useState('Central Zone - District 2');

  const filteredOfficers = officers.filter(o => {
    const s = (searchTerm || '').toLowerCase();
    return (o.name || '').toLowerCase().includes(s) ||
      (o.email || '').toLowerCase().includes(s) ||
      (o.division || '').toLowerCase().includes(s) ||
      (o.role || '').toLowerCase().includes(s);
  });

  const handleAddOfficer = (e) => {
    e.preventDefault();
    const newOfficer = {
      id: String(Date.now()),
      name: newName,
      email: newEmail,
      role: newRole,
      division: newDivision,
      scansCount: 0,
      status: 'Active'
    };
    setOfficers(prev => [newOfficer, ...prev]);
    setIsAddModalOpen(false);
    setNewName('');
    setNewEmail('');
    addToast({
      type: 'success',
      title: 'Officer Registered',
      description: `${newName} added as ${newRole} in ${newDivision}.`
    });
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Top Header */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded">
              Statutory Directory
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-800 mt-1">
            Enforcement Personnel & DLMO(District Legal Metrology Officer) Roster
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Authorized Legal Metrology field inspectors, DLMO(District Legal Metrology Officer), and inspection jurisdictions.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#0d4734] hover:bg-[#083325] text-white font-medium text-xs rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Register New Officer</span>
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search officers by name, role (DLMO / Inspector), email, or division..."
            className="w-full text-xs pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-[#0d4734] focus:outline-hidden"
          />
        </div>
      </div>

      {/* OFFICERS TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px] font-mono">
              <tr>
                <th className="py-2.5 px-3.5">Officer Name</th>
                <th className="py-2.5 px-3.5">Designation</th>
                <th className="py-2.5 px-3.5">Division / Zone</th>
                <th className="py-2.5 px-3.5 text-center">Total Scans</th>
                <th className="py-2.5 px-3.5">Status</th>
                <th className="py-2.5 px-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOfficers.map((officer) => (
                <tr key={officer.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-md bg-emerald-50 text-[#0d4734] border border-emerald-200 flex items-center justify-center font-bold text-xs">
                        {officer.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-xs">{officer.name}</p>
                        <p className="text-[10px] font-mono text-slate-400">{officer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5 px-3.5">
                    <span className={`inline-flex items-center gap-1 font-semibold text-[11px] px-2 py-0.5 rounded ${
                      officer.role.includes('DLMO') || officer.role.includes('DGM') || officer.role.includes('Deputy General Manager')
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        : 'bg-slate-100 text-slate-800'
                    }`}>
                      {officer.role.includes('DLMO') || officer.role.includes('DGM') || officer.role.includes('Deputy General Manager') ? (
                        <ShieldCheck className="w-3 h-3 text-emerald-700" />
                      ) : (
                        <UserCheck className="w-3 h-3 text-slate-500" />
                      )}
                      {officer.role}
                    </span>
                  </td>
                  <td className="py-2.5 px-3.5 text-slate-600 text-xs">{officer.division}</td>
                  <td className="py-2.5 px-3.5 text-center font-bold font-mono text-slate-800 text-xs">{officer.scansCount}</td>
                  <td className="py-2.5 px-3.5">
                    <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold text-emerald-800 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded">
                      ✓ Active
                    </span>
                  </td>
                  <td className="py-2.5 px-3.5 text-right">
                    <button
                      onClick={() => addToast({ type: 'info', title: 'Officer Profile', description: `${officer.name} (${officer.role}) profile verified.` })}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-medium transition-colors cursor-pointer"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD OFFICER MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 sm:p-6 max-w-md w-full border border-slate-200 shadow-xl space-y-3.5">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800">Register New Enforcement Officer</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddOfficer} className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-slate-700 block mb-1 text-xs">Full Name & Title</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Inspector R. K. Nair"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-[#0d4734] focus:outline-hidden text-xs"
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1 text-xs">Official Email</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="r.nair@lmcc.demo"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-[#0d4734] focus:outline-hidden text-xs font-mono"
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1 text-xs">Designation / Authority Level</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:bg-white focus:ring-2 focus:ring-[#0d4734] focus:outline-hidden text-xs cursor-pointer"
                >
                  <option value="Field Inspector">Field Inspector</option>
                  <option value="DLMO(District Legal Metrology Officer)">DLMO(District Legal Metrology Officer) - Central Authority</option>
                </select>
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1 text-xs">Assigned Division</label>
                <input
                  type="text"
                  required
                  value={newDivision}
                  onChange={(e) => setNewDivision(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-[#0d4734] focus:outline-hidden text-xs"
                />
              </div>

              <div className="pt-2.5 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-[#0d4734] hover:bg-[#083325] text-white font-medium rounded-lg text-xs shadow-2xs transition-colors cursor-pointer"
                >
                  Register Officer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
