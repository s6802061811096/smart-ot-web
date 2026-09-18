import React, { useState } from 'react';
import { AnomalyItem } from '../types';
import { 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  RefreshCw, 
  Filter, 
  Search, 
  Check, 
  Clock,
  Layers,
  ArrowRight
} from 'lucide-react';

type AnomalySeverity = 'DANGER' | 'WARNING' | 'INFO';

interface AnomalyCheckerProps {
  anomalies: AnomalyItem[];
  onResolveAnomaly: (id: string) => void;
  onRunScan?: () => void;
  onNavigateToTeacher?: (teacherId: string) => void;
}

export const AnomalyChecker: React.FC<AnomalyCheckerProps> = ({
  anomalies,
  onResolveAnomaly,
  onRunScan,
  onNavigateToTeacher
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<'ALL' | 'DANGER' | 'WARNING' | 'INFO'>('ALL');
  const [filterCode, setFilterCode] = useState<string>('ALL');

  const filtered = anomalies.filter(item => {
    const text = `${item.teacherName} ${item.teacherId} ${item.title} ${item.detail} ${item.code}`.toLowerCase();
    const matchesSearch = text.includes(searchTerm.toLowerCase());
    const matchesSeverity = filterSeverity === 'ALL' || item.severity === filterSeverity;
    const matchesCode = filterCode === 'ALL' || item.code === filterCode;
    return matchesSearch && matchesSeverity && matchesCode;
  });

  const severityBadges: Record<AnomalySeverity, { bg: string; text: string; border: string; label: string }> = {
    DANGER: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', label: 'ข้อผิดพลาดร้ายแรง' },
    WARNING: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', label: 'แจ้งเตือนเฝ้าระวัง' },
    INFO: { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200', label: 'ข้อมูลประกอบ' },
  };

  const codeLabels: Record<string, string> = {
    HOURS_BELOW_QUOTA: 'ชั่วโมงสอนไม่ถึงเกณฑ์ขั้นต่ำ',
    INCOMPLETE_DATA: 'ข้อมูลผู้สอนหรือวิชาไม่ครบถ้วน',
    SCHEDULE_RECORD_MISMATCH: 'ตารางสอนไม่ตรงกับบันทึกการสอนจริง',
    MISSING_ORDER_NO: 'ไม่มีเลขที่คำสั่งสอนแทน/ชดเชย',
    EXCEED_CAP: 'ชั่วโมงสอนเกินเพดานที่ระเบียบกำหนด',
    DUPLICATE_TIME: 'วัน/เวลาสอนซ้ำซ้อนในตารางสอน',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-rose-50 text-rose-600">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              ระบบตรวจสอบความถูกต้องและแจ้งเตือนความผิดปกติ (Anomaly Checker)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            ตรวจจับความขัดแย้งของข้อมูลตามข้อ 16-23 ก่อนส่งเบิกจ่าย ป้องกันข้อทักท้วงจากหน่วยงานตรวจสอบ
          </p>
        </div>

        <button
          onClick={onRunScan}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>สแกนตรวจสอบข้อมูลใหม่</span>
        </button>
      </div>

      {/* Overview Metric Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-rose-50/70 border border-rose-200 p-4 rounded-xl">
          <div className="text-xs font-semibold text-rose-800">ร้ายแรง (Danger / Block Payment)</div>
          <div className="text-2xl font-bold text-rose-900 mt-1">
            {anomalies.filter(a => a.severity === 'DANGER').length} รายการ
          </div>
          <p className="text-[11px] text-rose-700 mt-0.5">ต้องแก้ไขก่อนจึงจะสามารถส่งเบิกจ่ายได้</p>
        </div>

        <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-xl">
          <div className="text-xs font-semibold text-amber-800">แจ้งเตือน (Warning)</div>
          <div className="text-2xl font-bold text-amber-900 mt-1">
            {anomalies.filter(a => a.severity === 'WARNING').length} รายการ
          </div>
          <p className="text-[11px] text-amber-700 mt-0.5">เช่น ไม่มีคำสั่งสอนแทน หรือเกินเพดาน</p>
        </div>

        <div className="bg-sky-50/70 border border-sky-200 p-4 rounded-xl">
          <div className="text-xs font-semibold text-sky-800">ข้อสังเกต (Info)</div>
          <div className="text-2xl font-bold text-sky-900 mt-1">
            {anomalies.filter(a => a.severity === 'INFO').length} รายการ
          </div>
          <p className="text-[11px] text-sky-700 mt-0.5">บันทึกชั่วโมงที่ไม่สามารถเบิกได้ (ข้อ 23)</p>
        </div>
      </div>

      {/* Filter Row */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="ค้นหาชื่อผู้สอน หรือเนื้อหาข้อผิดปกติ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div>
          <select
            aria-label="ระดับความรุนแรง"
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value as any)}
            className="w-full py-1.5 px-3 rounded-lg border border-slate-200 text-xs bg-white text-slate-700"
          >
            <option value="ALL">ทุกระดับความรุนแรง</option>
            <option value="DANGER">ร้ายแรง (Danger)</option>
            <option value="WARNING">แจ้งเตือน (Warning)</option>
            <option value="INFO">ข้อมูลประกอบ (Info)</option>
          </select>
        </div>

        <div>
          <select
            aria-label="ประเภทข้อผิดปกติ"
            value={filterCode}
            onChange={(e) => setFilterCode(e.target.value)}
            className="w-full py-1.5 px-3 rounded-lg border border-slate-200 text-xs bg-white text-slate-700"
          >
            <option value="ALL">ทุกประเภทข้อผิดปกติ (All Codes)</option>
            <option value="HOURS_BELOW_QUOTA">ชั่วโมงสอนไม่ถึงเกณฑ์</option>
            <option value="MISSING_ORDER_NO">ไม่มีเลขที่คำสั่งสอนแทน</option>
            <option value="EXCEED_CAP">เกินเพดานที่กำหนด</option>
            <option value="DUPLICATE_TIME">เวลาซ้ำซ้อนในตาราง</option>
          </select>
        </div>
      </div>

      {/* Anomaly List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-500 mb-2" />
            <h3 className="font-bold text-slate-800 text-sm">ไม่พบข้อผิดปกติในเงื่อนไขที่เลือก</h3>
            <p className="text-xs text-slate-500 mt-1">ข้อมูลทั้งหมดเป็นไปตามระเบียบ สอศ. พ.ศ. 2568</p>
          </div>
        ) : (
          filtered.map((item) => {
            const badge = severityBadges[item.severity];
            return (
              <div 
                key={item.id}
                className={`p-4 rounded-xl border bg-white shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${badge.border}`}
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${badge.bg} ${badge.text} ${badge.border}`}>
                      {badge.label}
                    </span>
                    <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {item.code}
                    </span>
                    <span className="font-bold text-xs text-slate-900">{item.teacherName}</span>
                    <span className="text-[11px] text-slate-500">({item.teacherId})</span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-800">{item.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.detail}</p>
                  
                  {item.suggestion && (
                    <div className="text-[11px] text-indigo-700 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 mt-1">
                      <strong>แนวทางแก้ไข:</strong> {item.suggestion}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {onNavigateToTeacher && (
                    <button
                      onClick={() => onNavigateToTeacher(item.teacherId)}
                      className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-100 rounded-lg flex items-center gap-1"
                    >
                      <span>ตรวจสอบผู้สอน</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => onResolveAnomaly(item.id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>รับทราบ / แก้ไขแล้ว</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
