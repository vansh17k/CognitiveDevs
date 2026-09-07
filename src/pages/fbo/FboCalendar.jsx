import React, { useState } from 'react';
import { useApp } from '../../App.jsx';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  ShieldCheck, 
  Filter, 
  Plus, 
  ExternalLink,
  ArrowRight,
  Info,
  X
} from 'lucide-react';

export const FboCalendar = () => {
  const { 
    fboCalendarEvents = [], 
    setFboCalendarEvents, 
    navigate, 
    addToast 
  } = useApp();

  const [currentMonth, setCurrentMonth] = useState('September 2026');
  const [viewMode, setViewMode] = useState('month'); // 'month' | 'agenda'
  const [filterType, setFilterType] = useState('All');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);

  // New Event Form State
  const [newEvent, setNewEvent] = useState({
    title: '',
    type: 'corrective_action',
    date: '2026-09-20',
    time: '12:00 IST',
    product: 'General Compliance',
    description: ''
  });

  const filterOptions = [
    { id: 'All', label: 'All Events' },
    { id: 'corrective_action', label: 'Corrective Action Deadlines' },
    { id: 'document_submission', label: 'Document Submissions' },
    { id: 'inspection', label: 'Official Inspections' },
    { id: 'license_renewal', label: 'License Renewals' }
  ];

  const filteredEvents = fboCalendarEvents.filter(e => {
    if (filterType === 'All') return true;
    return e.type === filterType;
  });

  const getEventBadgeClass = (color) => {
    switch (color) {
      case 'red': return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'orange': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'yellow': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'green': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const handleCreateEvent = (e) => {
    e.preventDefault();
    if (!newEvent.title) return;

    const created = {
      id: `cal-${Date.now()}`,
      title: newEvent.title,
      type: newEvent.type,
      colorCategory: 'yellow',
      status: 'Upcoming',
      date: newEvent.date,
      time: newEvent.time,
      product: newEvent.product,
      description: newEvent.description,
      actionRequired: 'Internal Compliance Task'
    };

    setFboCalendarEvents(prev => [...prev, created]);
    setIsAddEventOpen(false);
    addToast({
      type: 'success',
      title: 'Event Scheduled',
      description: `Added "${created.title}" for ${created.date}.`
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-[#0d4734]" />
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Compliance Calendar & Deadlines
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Track statutory filing deadlines, inspection visits, CAPA submission time limits, and license renewals.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* View Toggle */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-semibold">
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'month' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
              }`}
            >
              Month View
            </button>
            <button
              onClick={() => setViewMode('agenda')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'agenda' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
              }`}
            >
              Agenda List
            </button>
          </div>

          <button
            onClick={() => setIsAddEventOpen(true)}
            className="px-4 py-2 bg-[#0d4734] hover:bg-[#083325] text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Event</span>
          </button>
        </div>
      </div>

      {/* Color Code Legend & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        
        {/* Color Legend */}
        <div className="flex items-center gap-4 flex-wrap">
          <span className="font-bold text-slate-700 text-[11px] uppercase tracking-wider">Legend:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span className="text-slate-600 text-[11px]">Red = Overdue / High Priority</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-slate-600 text-[11px]">Orange = Due Soon</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
            <span className="text-slate-600 text-[11px]">Yellow = Upcoming</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-600 text-[11px]">Green = Completed</span>
          </div>
        </div>

        {/* Filter Dropdown */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:bg-white focus:ring-2 focus:ring-[#0d4734]"
          >
            {filterOptions.map(opt => (
              <option key={opt.id} value={opt.id}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Calendar / Agenda View */}
      {viewMode === 'agenda' ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
          <h3 className="font-bold text-base text-slate-900">Upcoming Compliance Schedule</h3>
          
          <div className="space-y-3">
            {filteredEvents.map(event => (
              <div
                key={event.id}
                onClick={() => setSelectedEvent(event)}
                className="p-4 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/20 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex flex-col items-center justify-center font-mono shrink-0 border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-500">{event.date.split('-')[1]}</span>
                    <span className="text-sm font-bold text-slate-900">{event.date.split('-')[2]}</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.2 rounded border uppercase tracking-wider ${getEventBadgeClass(event.colorCategory)}`}>
                        {event.status}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">{event.time}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm mt-1">{event.title}</h4>
                    <p className="text-xs text-slate-600 mt-0.5">{event.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <span className="text-xs font-semibold text-[#0d4734] flex items-center gap-1">
                    <span>View Action</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Month View Grid */
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
          
          {/* Month Header Navigation */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h3 className="font-bold text-base sm:text-lg text-slate-900">
              {currentMonth}
            </h3>

            <div className="flex items-center gap-1">
              <button 
                onClick={() => setCurrentMonth('August 2026')}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setCurrentMonth('September 2026')}
                className="px-3 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700"
              >
                Today
              </button>
              <button 
                onClick={() => setCurrentMonth('October 2026')}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-px bg-slate-200 rounded-xl overflow-hidden text-center text-xs font-bold text-slate-600">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <div key={day} className="bg-slate-50 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* 30-Day Grid */}
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 30 }).map((_, i) => {
              const dayNumber = i + 1;
              const dateStr = `2026-09-${dayNumber < 10 ? '0' + dayNumber : dayNumber}`;
              const dayEvents = filteredEvents.filter(e => e.date === dateStr);

              return (
                <div 
                  key={i}
                  className={`min-h-[100px] p-2 rounded-xl border flex flex-col justify-between transition-colors ${
                    dayEvents.length > 0 ? 'bg-emerald-50/40 border-emerald-200' : 'bg-white border-slate-100 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className={`font-bold ${dayNumber === 2 ? 'w-5 h-5 rounded-full bg-[#0d4734] text-white flex items-center justify-center text-[10px]' : 'text-slate-700'}`}>
                      {dayNumber}
                    </span>
                    {dayEvents.length > 0 && (
                      <span className="w-2 h-2 rounded-full bg-[#0d4734]" />
                    )}
                  </div>

                  <div className="space-y-1 mt-1">
                    {dayEvents.map(evt => (
                      <div
                        key={evt.id}
                        onClick={() => setSelectedEvent(evt)}
                        className={`text-[10px] p-1 rounded font-semibold leading-tight truncate cursor-pointer transition-transform hover:scale-102 border ${getEventBadgeClass(evt.colorCategory)}`}
                        title={evt.title}
                      >
                        {evt.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-xs space-y-4">
            
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${getEventBadgeClass(selectedEvent.colorCategory)}`}>
                  {selectedEvent.status}
                </span>
                <h3 className="font-bold text-base text-slate-900 mt-1">
                  {selectedEvent.title}
                </h3>
              </div>
              <button onClick={() => setSelectedEvent(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-slate-700">
              <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-50 rounded-xl">
                <div>
                  <span className="text-[10px] text-slate-400 block">Date & Time</span>
                  <span className="font-bold text-slate-800">{selectedEvent.date} ({selectedEvent.time})</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Related Subject</span>
                  <span className="font-bold text-slate-800 truncate block">{selectedEvent.product}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50/80 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Description</span>
                <p className="text-xs text-slate-700 leading-relaxed">{selectedEvent.description}</p>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-950">
                <span className="text-[10px] font-bold text-[#0d4734] uppercase tracking-wider block">Action Required</span>
                <p className="text-xs font-semibold">{selectedEvent.actionRequired}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-semibold"
              >
                Close
              </button>
              {selectedEvent.type === 'corrective_action' && (
                <button
                  onClick={() => {
                    setSelectedEvent(null);
                    navigate('fbo-corrective-action');
                  }}
                  className="px-5 py-2 bg-[#0d4734] text-white rounded-xl font-semibold hover:bg-[#083325] shadow-xs flex items-center gap-1.5"
                >
                  <span>Submit Action Plan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Add Event Modal */}
      {isAddEventOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Schedule Compliance Reminder</h3>
              <button onClick={() => setIsAddEventOpen(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="mt-4 space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lab Testing Report Due for Batch 2026-B"
                  value={newEvent.title}
                  onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Event Category</label>
                  <select
                    value={newEvent.type}
                    onChange={e => setNewEvent({ ...newEvent, type: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="corrective_action">Corrective Action</option>
                    <option value="document_submission">Document Submission</option>
                    <option value="inspection">Internal Audit / Inspection</option>
                    <option value="license_renewal">License Renewal</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Date *</label>
                  <input
                    type="date"
                    required
                    value={newEvent.date}
                    onChange={e => setNewEvent({ ...newEvent, date: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description / Requirements</label>
                <textarea
                  rows={2}
                  value={newEvent.description}
                  onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
                  placeholder="Details of required statutory actions..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddEventOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0d4734] text-white rounded-xl font-semibold hover:bg-[#083325] shadow-xs"
                >
                  Save Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
