import React, { useState } from 'react';
import { useApp } from '../../App.jsx';
import { 
  LayoutDashboard,
  Package,
  ScanLine,
  FileCheck2,
  Clock,
  BookOpen,
  FileText,
  AlertCircle,
  FolderOpen,
  Bell,
  User,
  Shield,
  Building2,
  Sparkles,
  ExternalLink,
  LogOut,
  Menu,
  X,
  CheckCircle2,
  ChevronRight,
  Search,
  Plus,
  Home,
  FileSpreadsheet,
  AlertTriangle,
  Users,
  Settings,
  HelpCircle,
  Sliders,
  ArrowLeft
} from 'lucide-react';

export const FboLayout = ({ children }) => {
  const { 
    currentPage, 
    navigate, 
    goBack,
    fboNotifications = [], 
    fboProfile,
    logout
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const unreadCount = fboNotifications.filter(n => !n.read).length;

  const sidebarLinks = [
    { label: 'Pre-Release Portal', page: 'fbo-dashboard', icon: LayoutDashboard, badge: 'Core Hub' },
    { label: 'Compliance History', page: 'fbo-history', icon: Clock },
    { label: 'Product Catalog', page: 'fbo-products', icon: Package },
    { label: 'Company Profile & FSSAI', page: 'fbo-profile', icon: User },
  ];

  const handleNav = (page) => {
    navigate(page);
    setMobileMenuOpen(false);
  };

  const businessName = fboProfile?.businessName || 'Apex Nutrition & Agro Foods Pvt. Ltd.';
  const brandName = fboProfile?.brandName || 'Apex Naturals';
  const fssaiLic = fboProfile?.fssaiLicenseNo || '10020022001948';

  return (
    <div className="min-h-screen bg-[#F4F7F5] text-slate-900 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Main Framework Grid */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Deep Forest Emerald Green Sidebar (#063A2A / #04251A) matching the LexiScan screenshot */}
        <aside className="hidden lg:flex flex-col w-64 bg-[#05291D] text-white select-none border-r border-[#0A4D38] shrink-0 justify-between">
          
          <div className="p-4 space-y-4">
            {/* Top Brand Header matching screenshot: [Icon] FBO Portal [X / toggle] */}
            <div className="flex items-center justify-between pb-1">
              <div 
                onClick={() => handleNav('fbo-dashboard')}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-xl bg-[#047857] border border-emerald-400/40 text-white flex items-center justify-center shadow-xs">
                  <Building2 className="w-5 h-5 text-emerald-100" />
                </div>
                <div>
                  <span className="font-extrabold text-white text-base tracking-wide block">FBO Portal</span>
                  <span className="text-[10px] text-emerald-400 font-mono tracking-wider">LexiScan Enterprise</span>
                </div>
              </div>
            </div>

            {/* Quick Action Button: + New Label Screening */}
            <div>
              <button
                onClick={() => {
                  handleNav('fbo-dashboard');
                  window.dispatchEvent(new CustomEvent('focus-fbo-upload-artwork'));
                  setTimeout(() => {
                    const el = document.getElementById('fbo-upload-artwork-box');
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      el.classList.add('ring-4', 'ring-[#065F46]/50', 'bg-emerald-50/70');
                      setTimeout(() => el.classList.remove('ring-4', 'ring-[#065F46]/50', 'bg-emerald-50/70'), 2500);
                    }
                  }, 150);
                }}
                className="w-full py-2.5 px-4 bg-[#059669] hover:bg-[#047857] text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-950/40 flex items-center justify-center gap-2 transition-all cursor-pointer group active:scale-[0.98] border border-emerald-400/30"
              >
                <Sparkles className="w-4 h-4 text-emerald-200 group-hover:rotate-12 transition-transform" />
                <span>New Label Screening</span>
              </button>
            </div>

            {/* Nav Menu Items */}
            <nav className="space-y-1 pt-1">
              {sidebarLinks.map((item, idx) => {
                const isActive = (item.label === 'Pre-Release Portal' && currentPage === 'fbo-dashboard') ||
                                 (item.label === 'Compliance History' && currentPage === 'fbo-history') ||
                                 (item.label === 'Product Catalog' && currentPage === 'fbo-products') ||
                                 (item.label === 'Company Profile & FSSAI' && currentPage === 'fbo-profile');
                
                const Icon = item.icon;

                return (
                  <button
                    key={`${item.label}-${idx}`}
                    onClick={() => handleNav(item.page)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-[#047857] text-white shadow-sm ring-1 ring-emerald-400/40 font-bold' 
                        : 'text-[#A3D9C2] hover:bg-[#084734] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#8BBEA8]'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full font-mono ${
                        isActive 
                          ? 'bg-[#04251a] text-emerald-200 border border-emerald-400/30' 
                          : 'bg-[#04251a] text-[#34D399] border border-emerald-500/20'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Bottom Sign Out styled with red/rose accent matching the screenshot */}
          <div className="p-4 border-t border-[#0A4D38] bg-[#042017]">
            <button
              onClick={() => {
                if (logout) logout();
                navigate('login');
              }}
              title="Sign Out"
              className="w-full py-2.5 px-3 rounded-xl text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 flex items-center justify-center gap-2 transition-all cursor-pointer border border-transparent hover:border-rose-500/20"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>

        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          
          {/* Top Sticky Header */}
          <header className="bg-white border-b border-slate-200/90 sticky top-0 z-20 px-3 sm:px-8 py-2.5 sm:py-3.5 flex items-center justify-between gap-2 sm:gap-4 shadow-2xs">
            
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <button
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open mobile navigation menu"
                className="lg:hidden p-2 rounded-xl text-[#063A2A] hover:bg-emerald-50 active:bg-emerald-100 cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center shrink-0"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="text-[10px] sm:text-xs font-bold text-[#065F46] bg-emerald-50 px-2 sm:px-2.5 py-0.5 rounded-lg border border-emerald-200 font-mono shrink-0">
                    FBO Enterprise
                  </span>
                  <span className="text-[11px] sm:text-xs font-semibold text-slate-600 truncate hidden xs:inline">
                    {sidebarLinks.find(l => l.page === currentPage)?.label || 'Pre-Release Portal'}
                  </span>
                </div>
                <h1 className="text-sm sm:text-lg lg:text-xl font-bold text-slate-900 tracking-tight truncate max-w-[140px] xs:max-w-[220px] sm:max-w-[340px] md:max-w-none">
                  {businessName}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
              
              {/* Quick Action: New Scan button */}
              <button
                onClick={() => {
                  handleNav('fbo-dashboard');
                  window.dispatchEvent(new CustomEvent('focus-fbo-upload-artwork'));
                  setTimeout(() => {
                    const el = document.getElementById('fbo-upload-artwork-box');
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      el.classList.add('ring-4', 'ring-[#065F46]/50', 'bg-emerald-50/70');
                      setTimeout(() => el.classList.remove('ring-4', 'ring-[#065F46]/50', 'bg-emerald-50/70'), 2500);
                    }
                  }, 150);
                }}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 bg-[#065F46] hover:bg-[#047857] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Label Scan</span>
              </button>

              {/* FSSAI Verified Chip */}
              <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Lic #{fssaiLic} Verified</span>
              </div>

              {/* Top Right Home Button */}
              <button
                onClick={() => navigate('landing')}
                title="Go to Home"
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 min-h-[38px] bg-[#05291D] hover:bg-[#063A2A] text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer border border-[#0A4D38]"
              >
                <Home className="w-3.5 h-3.5 text-emerald-300" />
                <span className="hidden xs:inline">Home</span>
              </button>
            </div>
          </header>

          {/* Body Content */}
          <main className="p-3 sm:p-6 lg:p-8 flex-1 max-w-7xl w-full mx-auto">
            {children}
          </main>

          {/* Footer */}
          <footer className="bg-white border-t border-slate-200 px-4 sm:px-8 py-3.5 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
            <div>
              <strong>Legal Metrology & FBO Packaging Compliance Portal (LexiScan)</strong> — Ministry of Consumer Affairs, Food & Public Distribution.
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">LexiScan Standard v2.6</span>
            </div>
          </footer>

        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden bg-slate-900/60 backdrop-blur-xs transition-opacity">
          <div className="w-72 max-w-[85vw] bg-[#063A2A] text-white p-4 flex flex-col justify-between h-full shadow-2xl border-r border-[#0A4D38] overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#0A4D38]">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#047857] flex items-center justify-center text-white font-bold border border-emerald-400/40 shadow-xs">
                    <Building2 className="w-5 h-5 text-emerald-100" />
                  </div>
                  <div>
                    <span className="font-bold text-base text-white block leading-tight">FBO Portal</span>
                    <span className="text-[10px] text-emerald-400 font-mono">LexiScan Enterprise</span>
                  </div>
                </div>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close navigation menu"
                  className="p-2 text-emerald-300 hover:text-white rounded-xl hover:bg-white/10 min-h-[40px] min-w-[40px] flex items-center justify-center cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-4">
                <button
                  onClick={() => {
                    handleNav('fbo-dashboard');
                    window.dispatchEvent(new CustomEvent('focus-fbo-upload-artwork'));
                  }}
                  className="w-full py-3 px-3.5 bg-[#059669] hover:bg-[#047857] text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-950/40 flex items-center justify-center gap-2 border border-emerald-400/30 cursor-pointer min-h-[44px]"
                >
                  <Sparkles className="w-4 h-4 text-emerald-200" />
                  <span>New Label Screening</span>
                </button>
              </div>

              <nav className="space-y-1.5">
                {sidebarLinks.map((item, idx) => {
                  const isActive = (item.label === 'Pre-Release Portal' && currentPage === 'fbo-dashboard') ||
                                   (item.label === 'Compliance History' && currentPage === 'fbo-history') ||
                                   (item.label === 'Product Catalog' && currentPage === 'fbo-products') ||
                                   (item.label === 'Company Profile & FSSAI' && currentPage === 'fbo-profile');
                  const Icon = item.icon;
                  return (
                    <button
                      key={`mob-${item.label}-${idx}`}
                      onClick={() => handleNav(item.page)}
                      className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold min-h-[44px] cursor-pointer transition-all ${
                        isActive 
                          ? 'bg-[#047857] text-white font-bold ring-1 ring-emerald-400/40 shadow-xs' 
                          : 'text-[#A3D9C2] hover:bg-[#084734] hover:text-white active:bg-[#084734]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full font-mono ${
                          isActive 
                            ? 'bg-[#04251a] text-emerald-200 border border-emerald-400/30' 
                            : 'bg-[#04251a] text-[#34D399] border border-emerald-500/20'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-[#0A4D38]">
              <button
                onClick={() => {
                  if (logout) logout();
                  navigate('login');
                }}
                className="w-full py-3 text-xs text-rose-400 hover:text-rose-300 font-bold flex items-center justify-center gap-2 rounded-xl hover:bg-rose-500/10 min-h-[44px] cursor-pointer transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

    </div>
  );
};
