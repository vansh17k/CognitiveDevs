import React, { useState } from 'react';
import { useApp } from '../../App.jsx';
import { 
  Building2, 
  ShieldCheck, 
  Mail, 
  Phone, 
  MapPin, 
  FileText, 
  Package, 
  Save, 
  CheckCircle2, 
  Edit3, 
  Lock, 
  ExternalLink,
  Award,
  Layers
} from 'lucide-react';

export const FboProfile = () => {
  const { 
    fboProfile, 
    setFboProfile, 
    fboProducts = [], 
    addToast 
  } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...fboProfile });

  const handleSave = (e) => {
    e.preventDefault();
    setFboProfile(formData);
    setIsEditing(false);
    addToast({
      type: 'success',
      title: 'Profile Updated',
      description: 'FBO profile and contact records updated successfully.'
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#0d4734]" />
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Food Business Operator Profile
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Official FSSAI Central License details, registered manufacturing premises, authorized signatory, and compliance credentials.
          </p>
        </div>

        <button
          onClick={() => {
            if (isEditing) {
              setFormData({ ...fboProfile });
              setIsEditing(false);
            } else {
              setIsEditing(true);
            }
          }}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-center"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>{isEditing ? 'Cancel Editing' : 'Edit Contact Info'}</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Main 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Business & License Details */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* License Details Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#0d4734]" />
                  <h3 className="font-bold text-sm sm:text-base text-slate-900">
                    FSSAI License & Statutory Identifiers
                  </h3>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {fboProfile?.licenseStatus || 'Active & Verified'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">FSSAI 14-Digit License No.</label>
                  <span className="font-mono font-bold text-slate-900 text-sm block mt-0.5">
                    {fboProfile?.fssaiLicenseNo || '10020022001948'}
                  </span>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">FBO System ID</label>
                  <span className="font-mono font-bold text-[#0d4734] block mt-0.5">
                    {fboProfile?.fboId || 'FBO-IND-2024-8839'}
                  </span>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">License Type</label>
                  <span className="font-semibold text-slate-800 block mt-0.5">
                    {fboProfile?.licenseType || 'FSSAI Central Manufacturing License'}
                  </span>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">License Validity</label>
                  <span className="font-bold text-slate-800 block mt-0.5">
                    Until {fboProfile?.licenseValidity || '15 Oct 2027'}
                  </span>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Issuing Authority</label>
                  <span className="font-medium text-slate-700 block mt-0.5">
                    {fboProfile?.issuingAuthority || 'FSSAI Western Regional Licensing Authority'}
                  </span>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Kind of Business (KoB)</label>
                  <span className="font-medium text-slate-700 block mt-0.5">
                    {fboProfile?.businessCategory || 'Food Processing & Packaged Commodities Manufacturer'}
                  </span>
                </div>
              </div>
            </div>

            {/* Manufacturing Facilities */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-[#0d4734]" />
                  <h3 className="font-bold text-sm sm:text-base text-slate-900">
                    Registered Manufacturing & Packaging Units
                  </h3>
                </div>
                <span className="text-xs font-semibold text-slate-500">2 Premises</span>
              </div>

              <div className="space-y-3">
                {fboProfile?.manufacturingUnits?.map((unit) => (
                  <div key={unit.unitId} className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{unit.name}</span>
                      <span className="font-mono text-[10px] font-bold text-[#0d4734] bg-emerald-50 px-2 py-0.2 rounded border border-emerald-200">
                        {unit.unitId}
                      </span>
                    </div>
                    <p className="text-slate-600">{unit.address}</p>
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      {unit.certifications?.map((c, i) => (
                        <span key={i} className="text-[10px] font-semibold bg-white text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Contact & Authorized Person */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Contact Person Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
              <h3 className="font-bold text-sm sm:text-base text-slate-900 pb-3 border-b border-slate-100">
                Authorized Regulatory Contact
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Company Legal Name</label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.businessName}
                    onChange={e => setFormData({ ...formData, businessName: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl disabled:opacity-75 focus:ring-2 focus:ring-[#0d4734]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Commercial Brand Name</label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.brandName}
                    onChange={e => setFormData({ ...formData, brandName: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl disabled:opacity-75 focus:ring-2 focus:ring-[#0d4734]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Authorized Signatory Name</label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.contactPerson}
                    onChange={e => setFormData({ ...formData, contactPerson: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl disabled:opacity-75 focus:ring-2 focus:ring-[#0d4734]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Official Email</label>
                  <input
                    type="email"
                    disabled={!isEditing}
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl disabled:opacity-75 focus:ring-2 focus:ring-[#0d4734]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mobile Hotline</label>
                  <input
                    type="tel"
                    disabled={!isEditing}
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl disabled:opacity-75 focus:ring-2 focus:ring-[#0d4734]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Registered Address</label>
                  <textarea
                    rows={3}
                    disabled={!isEditing}
                    value={formData.registeredAddress}
                    onChange={e => setFormData({ ...formData, registeredAddress: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl disabled:opacity-75 text-slate-700 focus:ring-2 focus:ring-[#0d4734]"
                  />
                </div>

                {isEditing && (
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#0d4734] hover:bg-[#083325] text-white rounded-xl font-bold shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Contact Changes</span>
                  </button>
                )}
              </div>
            </div>

            {/* Quick Stats Summary */}
            <div className="bg-gradient-to-br from-[#0d4734] to-[#06241a] text-white p-6 rounded-2xl shadow-sm space-y-3">
              <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider block">
                Portfolio Summary
              </span>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-emerald-100/70 block text-[10px]">Registered SKUs</span>
                  <span className="text-xl font-bold text-white">{fboProducts.length} Products</span>
                </div>
                <div>
                  <span className="text-emerald-100/70 block text-[10px]">Compliance Health</span>
                  <span className="text-xl font-bold text-emerald-300">84% Mostly Compliant</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </form>

    </div>
  );
};
