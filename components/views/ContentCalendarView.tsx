
import React, { useState, useContext, useEffect } from 'react';
import { ProjectContext } from '../../contexts/ProjectContext';
import { getItem, setItem } from '../../utils/localStorage';

interface CalendarEvent {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  type: 'Post' | 'Reel' | 'Story' | 'Video' | 'Ad' | 'Article' | 'Podcast';
  platform: string;
  status: 'planned' | 'drafted' | 'published';
  note?: string;
}

const CALENDAR_KEY = 'postly_calendar_v1';

const PLATFORMS = ['Instagram', 'TikTok', 'YouTube', 'X (Twitter)', 'LinkedIn', 'Facebook', 'Snapchat', 'Pinterest', 'Blog'];
const CONTENT_TYPES: CalendarEvent['type'][] = ['Post', 'Reel', 'Story', 'Video', 'Ad', 'Article', 'Podcast'];
const STATUS_COLORS = {
  planned: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  drafted: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  published: 'bg-green-500/20 text-green-300 border-green-500/30',
};
const TYPE_COLORS: Record<string, string> = {
  Post: 'bg-purple-500',
  Reel: 'bg-pink-500',
  Story: 'bg-blue-400',
  Video: 'bg-red-500',
  Ad: 'bg-orange-500',
  Article: 'bg-teal-500',
  Podcast: 'bg-indigo-500',
};

const ContentCalendarView: React.FC = () => {
  const { appLanguage, theme } = useContext(ProjectContext);
  const isAr = appLanguage === 'ar';
  const isDark = theme === 'dark';
  const isLight = theme === 'light';

  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [events, setEvents] = useState<CalendarEvent[]>(() => getItem<CalendarEvent[]>(CALENDAR_KEY) || []);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const [form, setForm] = useState<Partial<CalendarEvent>>({
    type: 'Post', platform: 'Instagram', status: 'planned', title: '', note: ''
  });

  useEffect(() => { setItem(CALENDAR_KEY, events); }, [events]);

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
  };

  const formatDate = (y: number, m: number, d: number) =>
    `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

  const eventsOnDate = (date: string) => events.filter(e => e.date === date);

  const handleDayClick = (day: number) => {
    const date = formatDate(currentYear, currentMonth, day);
    setSelectedDate(date);
    setForm({ type: 'Post', platform: 'Instagram', status: 'planned', title: '', note: '', date });
    setEditingEvent(null);
    setShowAddModal(true);
  };

  const handleSave = () => {
    if (!form.title?.trim() || !form.date) return;
    if (editingEvent) {
      setEvents(prev => prev.map(e => e.id === editingEvent.id ? { ...e, ...form } as CalendarEvent : e));
    } else {
      const newEvent: CalendarEvent = {
        id: Date.now().toString(),
        date: form.date!,
        title: form.title!,
        type: form.type || 'Post',
        platform: form.platform || 'Instagram',
        status: form.status || 'planned',
        note: form.note,
      };
      setEvents(prev => [...prev, newEvent]);
    }
    setShowAddModal(false);
    setEditingEvent(null);
    setForm({ type: 'Post', platform: 'Instagram', status: 'planned', title: '', note: '' });
  };

  const handleDelete = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    setShowAddModal(false);
  };

  const handleEdit = (event: CalendarEvent) => {
    setEditingEvent(event);
    setForm({ ...event });
    setShowAddModal(true);
  };

  const monthNames = isAr
    ? ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر']
    : ['January','February','March','April','May','June','July','August','September','October','November','December'];

  const dayNames = isAr
    ? ['أح','إث','ثل','أر','خم','جم','سب']
    : ['Su','Mo','Tu','We','Th','Fr','Sa'];

  const cardBase = isDark ? 'bg-white/5 border-white/10' : isLight ? 'bg-white border-gray-200 shadow-sm' : 'bg-[#FFFCF8] border-[#D7CCC8]';
  const textPrimary = isDark ? 'text-white' : isLight ? 'text-[#0a1e3c]' : 'text-[#3E2723]';
  const textSecondary = isDark ? 'text-white/50' : isLight ? 'text-gray-500' : 'text-[#795548]';
  const inputClass = isDark
    ? 'bg-black/30 border-white/20 text-white placeholder-white/30'
    : isLight
    ? 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
    : 'bg-[#FFFCF8] border-[#BCAAA4] text-[#3E2723] placeholder-[#A1887F]';

  // Upcoming events (next 7 days)
  const upcoming = events
    .filter(e => {
      const d = new Date(e.date);
      const diff = (d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
      return diff >= 0 && diff <= 7;
    })
    .filter(e => filterStatus === 'all' || e.status === filterStatus)
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="space-y-6 animate-fade-in pb-20" dir={isAr ? 'rtl' : 'ltr'}>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className={`text-3xl font-black ${isDark ? 'text-[#bf8339]' : 'text-[#bf8339]'}`}>
            📅 {isAr ? 'تقويم المحتوى' : 'Content Calendar'}
          </h2>
          <p className={`text-sm mt-1 ${textSecondary}`}>
            {isAr ? 'خطط ونظم محتواك الأسبوعي والشهري' : 'Plan and organize your weekly and monthly content'}
          </p>
        </div>
        <button
          onClick={() => { setSelectedDate(formatDate(today.getFullYear(), today.getMonth(), today.getDate())); setForm({ type: 'Post', platform: 'Instagram', status: 'planned', title: '', note: '', date: formatDate(today.getFullYear(), today.getMonth(), today.getDate()) }); setEditingEvent(null); setShowAddModal(true); }}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#bf8339] hover:bg-[#a66e2c] text-white rounded-xl font-bold text-sm transition hover:scale-105 active:scale-95 shadow-lg shadow-[#bf8339]/30"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          {isAr ? 'إضافة محتوى' : 'Add Content'}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Calendar */}
        <div className={`xl:col-span-2 rounded-2xl border p-5 ${cardBase}`}>
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-5">
            <button onClick={prevMonth} className={`p-2 rounded-lg transition ${isDark ? 'hover:bg-white/10 text-white/60' : 'hover:bg-gray-100 text-gray-500'}`}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <h3 className={`text-lg font-bold ${textPrimary}`}>
              {monthNames[currentMonth]} {currentYear}
            </h3>
            <button onClick={nextMonth} className={`p-2 rounded-lg transition ${isDark ? 'hover:bg-white/10 text-white/60' : 'hover:bg-gray-100 text-gray-500'}`}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>

          {/* Day Names */}
          <div className="grid grid-cols-7 mb-2">
            {dayNames.map(d => (
              <div key={d} className={`text-center text-xs font-bold py-1 ${textSecondary}`}>{d}</div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells before first day */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`} />)}

            {/* Days */}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
              const date = formatDate(currentYear, currentMonth, day);
              const dayEvents = eventsOnDate(date);
              const isToday = date === formatDate(today.getFullYear(), today.getMonth(), today.getDate());

              return (
                <button
                  key={day}
                  onClick={() => handleDayClick(day)}
                  className={`relative min-h-[60px] rounded-xl p-1.5 border transition-all duration-150 text-start hover:scale-[1.02] group ${
                    isToday
                      ? isDark ? 'border-[#bf8339] bg-[#bf8339]/10' : 'border-[#bf8339] bg-amber-50'
                      : isDark ? 'border-white/5 hover:border-white/20 hover:bg-white/5' : 'border-gray-100 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <span className={`text-xs font-bold ${isToday ? 'text-[#bf8339]' : textSecondary}`}>{day}</span>
                  <div className="mt-1 space-y-0.5">
                    {dayEvents.slice(0, 2).map(ev => (
                      <div
                        key={ev.id}
                        onClick={e => { e.stopPropagation(); handleEdit(ev); }}
                        className={`w-full h-1.5 rounded-full ${TYPE_COLORS[ev.type] || 'bg-gray-500'} opacity-80`}
                        title={ev.title}
                      />
                    ))}
                    {dayEvents.length > 2 && (
                      <span className={`text-[8px] ${textSecondary}`}>+{dayEvents.length - 2}</span>
                    )}
                  </div>
                  <div className="absolute bottom-1 end-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className={`w-3 h-3 ${textSecondary}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-5 flex flex-wrap gap-3">
            {CONTENT_TYPES.map(t => (
              <div key={t} className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${TYPE_COLORS[t]}`} />
                <span className={`text-xs ${textSecondary}`}>{t}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Panel */}
        <div className="space-y-4">
          {/* Stats */}
          <div className={`rounded-2xl border p-4 ${cardBase}`}>
            <h4 className={`text-sm font-bold mb-3 ${textPrimary}`}>{isAr ? 'إحصائيات الشهر' : 'Month Stats'}</h4>
            <div className="grid grid-cols-3 gap-3">
              {(['planned', 'drafted', 'published'] as const).map(s => {
                const count = events.filter(e => {
                  const d = new Date(e.date);
                  return d.getMonth() === currentMonth && d.getFullYear() === currentYear && e.status === s;
                }).length;
                return (
                  <div key={s} className={`rounded-xl p-3 border text-center ${STATUS_COLORS[s]}`}>
                    <p className="text-xl font-black">{count}</p>
                    <p className="text-[10px] font-semibold capitalize">{isAr ? (s === 'planned' ? 'مخطط' : s === 'drafted' ? 'مسودة' : 'منشور') : s}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming */}
          <div className={`rounded-2xl border p-4 ${cardBase}`}>
            <div className="flex items-center justify-between mb-3">
              <h4 className={`text-sm font-bold ${textPrimary}`}>{isAr ? 'المحتوى القادم (7 أيام)' : 'Upcoming (7 days)'}</h4>
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className={`text-xs px-2 py-1 rounded-lg border outline-none ${inputClass}`}
              >
                <option value="all">{isAr ? 'الكل' : 'All'}</option>
                <option value="planned">{isAr ? 'مخطط' : 'Planned'}</option>
                <option value="drafted">{isAr ? 'مسودة' : 'Drafted'}</option>
                <option value="published">{isAr ? 'منشور' : 'Published'}</option>
              </select>
            </div>

            {upcoming.length === 0 ? (
              <div className={`text-center py-8 ${textSecondary}`}>
                <p className="text-3xl mb-2">📭</p>
                <p className="text-xs">{isAr ? 'لا يوجد محتوى مخطط' : 'No content planned'}</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto custom-scrollbar">
                {upcoming.map(ev => (
                  <button
                    key={ev.id}
                    onClick={() => handleEdit(ev)}
                    className={`w-full flex items-start gap-3 p-3 rounded-xl border transition hover:scale-[1.01] text-start ${isDark ? 'border-white/5 hover:border-white/15 hover:bg-white/5' : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'}`}
                  >
                    <div className={`w-2 h-full min-h-[36px] rounded-full ${TYPE_COLORS[ev.type] || 'bg-gray-500'} shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-bold truncate ${textPrimary}`}>{ev.title}</p>
                      <p className={`text-[10px] mt-0.5 ${textSecondary}`}>{ev.platform} · {ev.date}</p>
                    </div>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full border shrink-0 ${STATUS_COLORS[ev.status]}`}>
                      {isAr ? (ev.status === 'planned' ? 'مخطط' : ev.status === 'drafted' ? 'مسودة' : 'منشور') : ev.status}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center px-4" onClick={() => setShowAddModal(false)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div
            className={`relative w-full max-w-md rounded-2xl border shadow-2xl p-6 animate-fade-in ${cardBase}`}
            onClick={e => e.stopPropagation()}
          >
            <h3 className={`text-lg font-bold mb-5 ${textPrimary}`}>
              {editingEvent
                ? (isAr ? 'تعديل المحتوى' : 'Edit Content')
                : (isAr ? `إضافة محتوى — ${form.date}` : `Add Content — ${form.date}`)}
            </h3>

            <div className="space-y-4">
              {/* Title */}
              <input
                type="text"
                value={form.title || ''}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder={isAr ? 'عنوان المحتوى...' : 'Content title...'}
                className={`w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#bf8339] transition ${inputClass}`}
                dir={isAr ? 'rtl' : 'ltr'}
              />

              {/* Type & Platform */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`text-xs font-semibold mb-1 block ${textSecondary}`}>{isAr ? 'النوع' : 'Type'}</label>
                  <select
                    value={form.type}
                    onChange={e => setForm(f => ({ ...f, type: e.target.value as CalendarEvent['type'] }))}
                    className={`w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:border-[#bf8339] transition ${inputClass}`}
                  >
                    {CONTENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className={`text-xs font-semibold mb-1 block ${textSecondary}`}>{isAr ? 'المنصة' : 'Platform'}</label>
                  <select
                    value={form.platform}
                    onChange={e => setForm(f => ({ ...f, platform: e.target.value }))}
                    className={`w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:border-[#bf8339] transition ${inputClass}`}
                  >
                    {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              {/* Status */}
              <div>
                <label className={`text-xs font-semibold mb-1 block ${textSecondary}`}>{isAr ? 'الحالة' : 'Status'}</label>
                <div className="flex gap-2">
                  {(['planned', 'drafted', 'published'] as const).map(s => (
                    <button
                      key={s}
                      onClick={() => setForm(f => ({ ...f, status: s }))}
                      className={`flex-1 py-2 rounded-xl border text-xs font-bold transition ${form.status === s ? STATUS_COLORS[s] : isDark ? 'border-white/10 text-white/40 hover:border-white/20' : 'border-gray-200 text-gray-400 hover:border-gray-300'}`}
                    >
                      {isAr ? (s === 'planned' ? 'مخطط' : s === 'drafted' ? 'مسودة' : 'منشور') : s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Note */}
              <textarea
                value={form.note || ''}
                onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
                placeholder={isAr ? 'ملاحظة اختيارية...' : 'Optional note...'}
                rows={2}
                className={`w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#bf8339] transition resize-none ${inputClass}`}
                dir={isAr ? 'rtl' : 'ltr'}
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-5">
              {editingEvent && (
                <button
                  onClick={() => handleDelete(editingEvent.id)}
                  className="px-4 py-2.5 rounded-xl text-sm font-bold bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition"
                >
                  {isAr ? 'حذف' : 'Delete'}
                </button>
              )}
              <button
                onClick={() => setShowAddModal(false)}
                className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-bold border transition ${isDark ? 'border-white/10 text-white/50 hover:bg-white/5' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                onClick={handleSave}
                disabled={!form.title?.trim()}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold bg-[#bf8339] hover:bg-[#a66e2c] text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editingEvent ? (isAr ? 'حفظ التعديلات' : 'Save Changes') : (isAr ? 'إضافة' : 'Add')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentCalendarView;
