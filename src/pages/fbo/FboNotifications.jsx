import React, { useState } from 'react';
import { useApp } from '../../App.jsx';
import { 
  Bell, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  FileText, 
  Calendar, 
  Sparkles, 
  ArrowRight, 
  Check, 
  Filter 
} from 'lucide-react';

export const FboNotifications = () => {
  const { 
    fboNotifications = [], 
    setFboNotifications, 
    navigate, 
    addToast 
  } = useApp();

  const [activeFilter, setActiveFilter] = useState('all');

  const filteredNotifs = fboNotifications.filter(n => {
    if (activeFilter === 'unread') return !n.read;
    if (activeFilter === 'deadlines') return n.type === 'deadline';
    if (activeFilter === 'reviews') return n.type === 'review_status';
    return true;
  });

  const handleMarkAllRead = () => {
    setFboNotifications(prev => prev.map(n => ({ ...n, read: true })));
    addToast({
      type: 'info',
      title: 'Notifications Cleared',
      description: 'All notifications marked as read.'
    });
  };

  const getIcon = (type) => {
    switch (type) {
      case 'deadline': return <Clock className="w-4 h-4 text-rose-600" />;
      case 'review_status': return <FileText className="w-4 h-4 text-[#0d4734]" />;
      case 'inspector_request': return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'inspection_schedule': return <Calendar className="w-4 h-4 text-emerald-700" />;
      case 'ai_check': return <Sparkles className="w-4 h-4 text-emerald-600" />;
      default: return <Bell className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#0d4734]" />
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              FBO Notifications & Alert Center
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time compliance alerts, statutory deadline counters, inspector communications, and review status updates.
          </p>
        </div>

        <button
          onClick={handleMarkAllRead}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-center"
        >
          <Check className="w-3.5 h-3.5" />
          <span>Mark All as Read</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'all', label: 'All Notifications' },
          { id: 'unread', label: 'Unread Only' },
          { id: 'deadlines', label: 'Deadlines & Urgent' },
          { id: 'reviews', label: 'Review Updates' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeFilter === tab.id
                ? 'bg-[#0d4734] text-white shadow-2xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifs.map(notif => (
          <div
            key={notif.id}
            onClick={() => {
              if (notif.link) navigate(notif.link);
            }}
            className={`bg-white p-5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              !notif.read
                ? 'border-emerald-200 bg-emerald-50/20 shadow-xs'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 mt-0.5 border border-slate-200">
                {getIcon(notif.type)}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-slate-900">
                    {notif.title}
                  </h4>
                  {!notif.read && (
                    <span className="w-2 h-2 rounded-full bg-[#0d4734]" />
                  )}
                </div>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  {notif.message}
                </p>
                <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                  {notif.time}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              <span className="text-xs font-semibold text-[#0d4734] flex items-center gap-1">
                <span>View Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
