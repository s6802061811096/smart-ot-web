import React, { useState } from 'react';
import { 
  OTCalculationResult, 
  Teacher, 
  CalculationRule, 
  TeachingRate,
  User,
  MonthlyClaimItem,
  ApprovalStatus
} from '../types';
import { 
  Calculator, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Layers, 
  Search, 
  Filter, 
  RefreshCw, 
  Eye, 
  Info,
  ChevronDown,
  Clock,
  Printer,
  Calendar,
  Send,
  CheckCircle,
  FileCheck2,
  FileText
} from 'lucide-react';
import { SUPPORTED_SEMESTERS } from '../services/ruleEngine';

interface CalculationModuleProps {
  calculationResults: OTCalculationResult[];
  teachers: Teacher[];
  rules: CalculationRule[];
  rates: TeachingRate[];
  currentUser?: User;
  academicTerm?: string;
  onSelectTerm?: (term: string) => void;
  onRecalculateAll: () => void;
  onSelectTeacherForReport?: (teacherId: string, monthId?: string) => void;
  onSubmitMonthlyClaim?: (teacherId: string, monthId: string) => void;
}

export const CalculationModule: React.FC<CalculationModuleProps> = ({
  calculationResults,
  teachers,
  rules,
  rates,
  currentUser,
  academicTerm = '2/2568',
  onSelectTerm,
  onRecalculateAll,
  onSelectTeacherForReport,
  onSubmitMonthlyClaim
}) => {
  const isTeacher = currentUser?.role === 'TEACHER';
  const defaultTeacherId = isTeacher && currentUser.teacherId ? currentUser.teacherId : (calculationResults[0]?.teacherId || null);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(defaultTeacherId);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'DUAL' | 'ELIGIBLE' | 'INELIGIBLE'>('ALL');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [showFormulaDetails, setShowFormulaDetails] = useState(false);
  const [selectedMonthFilter, setSelectedMonthFilter] = useState<string>('ALL');
  const [submittedMonths, setSubmittedMonths] = useState<Record<string, boolean>>({});

  // Departments list for filter
  const departments = Array.from(new Set(calculationResults.map(r => r.departmentName)));

  // If teacher, strictly show self or default to self
  const filteredResults = calculationResults.filter(r => {
    if (isTeacher && currentUser.teacherId) {
      return r.teacherId === currentUser.teacherId;
    }
    const matchesSearch = r.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.teacherId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.departmentName.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesType = true;
    if (filterType === 'DUAL') matchesType = r.dualLevel.isDualLevel;
    else if (filterType === 'ELIGIBLE') matchesType = r.passedCheck && r.claimableOverloadHours > 0;
    else if (filterType === 'INELIGIBLE') matchesType = !r.passedCheck;

    let matchesDept = true;
    if (departmentFilter !== 'ALL') matchesDept = r.departmentName === departmentFilter;

    return matchesSearch && matchesType && matchesDept;
  });

  const selectedResult = calculationResults.find(r => r.teacherId === (isTeacher && currentUser.teacherId ? currentUser.teacherId : selectedTeacherId)) || calculationResults[0];
  const selectedTeacher = teachers.find(t => t.id === selectedResult?.teacherId);

  const handleSubmitMonth = (monthId: string) => {
    if (selectedResult) {
      setSubmittedMonths(prev => ({ ...prev, [`${selectedResult.teacherId}-${monthId}`]: true }));
      if (onSubmitMonthlyClaim) {
        onSubmitMonthlyClaim(selectedResult.teacherId, monthId);
      }
    }
  };

  const getStatusBadge = (status: ApprovalStatus = 'DRAFT') => {
    switch (status) {
      case 'SUBMITTED':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-800 border border-blue-200">ยื่นขอเบิกแล้ว (รอ หน.แผนก)</span>;
      case 'HEAD_ENDORSED':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">หน.แผนกรับรองแล้ว</span>;
      case 'ACADEMIC_VERIFIED':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-100 text-purple-800 border border-purple-200">งานวิชาการตรวจแล้ว</span>;
      case 'DIRECTOR_APPROVED':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">ผอ.อนุมัติแล้ว</span>;
      case 'FINANCE_PAID':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-teal-100 text-teal-800 border border-teal-200">เบิกจ่ายเงินแล้ว</span>;
      case 'REJECTED':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-100 text-rose-800 border border-rose-200">ส่งกลับแก้ไข</span>;
      case 'DRAFT':
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">ยังไม่ยื่นขอเบิก</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Bar */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                <Calculator className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                การคำนวณสิทธิ์และชั่วโมงเกินภาระงานสอน
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              ประมวลผลตามระเบียบ สอศ. พ.ศ. 2568 (หมวด 2 ข้อ 16–23) รองรับการสอน 2 ระดับ และการบันทึกชั่วโมงที่ไม่ได้เบิก
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {onSelectTerm && (
              <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200">
                <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                <span className="text-xs font-semibold text-slate-700">ภาคเรียน:</span>
                <select
                  aria-label="เลือกภาคเรียนคำนวณ"
                  value={academicTerm}
                  onChange={(e) => onSelectTerm(e.target.value)}
                  className="text-xs font-bold text-indigo-900 bg-transparent outline-none cursor-pointer"
                >
                  {SUPPORTED_SEMESTERS.map(s => (
                    <option key={s.term} value={s.term}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <button
              onClick={onRecalculateAll}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>ประมวลผลคำนวณใหม่</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search box */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="ค้นหาชื่อผู้สอน รหัส หรือแผนก..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setFilterType('ALL')}
              className={`flex-1 py-1 text-xs font-medium rounded-md transition-all ${
                filterType === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ทั้งหมด ({calculationResults.length})
            </button>
            <button
              onClick={() => setFilterType('DUAL')}
              className={`flex-1 py-1 text-xs font-medium rounded-md transition-all ${
                filterType === 'DUAL' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              สอน 2 ระดับ ({calculationResults.filter(r => r.dualLevel.isDualLevel).length})
            </button>
            <button
              onClick={() => setFilterType('ELIGIBLE')}
              className={`flex-1 py-1 text-xs font-medium rounded-md transition-all ${
                filterType === 'ELIGIBLE' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              มีสิทธิเบิก
            </button>
            <button
              onClick={() => setFilterType('INELIGIBLE')}
              className={`flex-1 py-1 text-xs font-medium rounded-md transition-all ${
                filterType === 'INELIGIBLE' ? 'bg-white text-rose-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ไม่ผ่านเกณฑ์
            </button>
          </div>

          {/* Department Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              aria-label="กรองตามแผนกวิชา"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full py-1.5 px-3 rounded-lg border border-slate-200 text-xs bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="ALL">ทุกแผนกวิชา ({calculationResults.length} คน)</option>
              {departments.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Layout: Left List + Right Deep Auditor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Teacher Calculation Table (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">
              รายชื่อผู้สอน ({filteredResults.length} คน)
            </span>
            <span className="text-[11px] text-slate-500">คลิกเพื่อดูรายละเอียด</span>
          </div>

          <div className="divide-y divide-slate-100 max-h-[750px] overflow-y-auto">
            {filteredResults.map((result) => {
              const isSelected = result.teacherId === selectedResult?.teacherId;
              return (
                <button
                  key={result.teacherId}
                  onClick={() => setSelectedTeacherId(result.teacherId)}
                  className={`w-full text-left p-3.5 transition-all flex items-start justify-between cursor-pointer ${
                    isSelected ? 'bg-indigo-50/70 border-l-4 border-indigo-600' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-slate-900">{result.teacherName}</span>
                      {result.dualLevel.isDualLevel && (
                        <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-sm bg-sky-100 text-sky-800">
                          2 ระดับ
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500">{result.departmentName} • {result.category}</p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-600 pt-0.5">
                      <span>สอนจริง: <strong className="text-slate-800">{result.weeklyActualTaughtHours}</strong> ชม./สัปดาห์</span>
                      <span>เกณฑ์: <strong className="text-slate-800">{result.minTeachingHoursRequired}</strong> ชม.</span>
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    {result.passedCheck ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>เบิกได้ {result.claimableOverloadHours} ชม.</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">
                        <XCircle className="w-3 h-3" />
                        <span>ไม่ผ่านเกณฑ์</span>
                      </span>
                    )}

                    <div className="text-xs font-bold text-slate-900">
                      {result.passedCheck ? `฿${result.totalAmount.toLocaleString()}` : '-'}
                    </div>

                    {result.unclaimedOverloadHours > 0 && (
                      <div className="text-[10px] text-amber-700 font-medium">
                        +ไม่ได้เบิก {result.unclaimedOverloadHours} ชม.
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: In-Depth Calculation & Audit Breakdown (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {selectedResult ? (
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
              {/* Header of Inspector */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-200 gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">{selectedResult.teacherName}</h3>
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                      {selectedResult.teacherId}
                    </span>
                    {selectedResult.dualLevel.isDualLevel && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-sky-100 text-sky-800">
                        สอน 2 ระดับ (ข้อ 17)
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {selectedResult.position} • {selectedResult.departmentName} • {selectedResult.category}
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-500">ยอดเงินเบิกจ่ายรวมทั้งภาคเรียน</div>
                  <div className="text-2xl font-bold text-indigo-700">
                    ฿{selectedResult.totalAmount.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-slate-500">{selectedResult.applicableRateSummary}</div>
                </div>
              </div>

              {/* Status Banner */}
              <div className={`p-4 rounded-xl border text-xs flex items-start gap-3 ${
                selectedResult.passedCheck 
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' 
                  : 'bg-rose-50/70 border-rose-200 text-rose-900'
              }`}>
                {selectedResult.passedCheck ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <div className="font-semibold text-sm">
                    {selectedResult.passedCheck ? 'มีสิทธิเบิกค่าสอนเกินภาระงานสอน' : 'ไม่ผ่านเกณฑ์การเบิกจ่ายค่าสอนเกินภาระงาน'}
                  </div>
                  <p className="mt-0.5 leading-relaxed">{selectedResult.statusReason}</p>
                </div>
              </div>

              {/* Weekly vs Semester Summary Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="text-[11px] text-slate-500 block">สอนจริงต่อสัปดาห์</span>
                  <span className="text-base font-bold text-slate-800">{selectedResult.weeklyActualTaughtHours} ชม.</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">เกณฑ์ {selectedResult.minTeachingHoursRequired} ชม.</span>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="text-[11px] text-slate-500 block">เกินภาระงานต่อสัปดาห์</span>
                  <span className="text-base font-bold text-slate-800">
                    {(selectedResult.grossOverloadHours / 18).toFixed(2)} ชม.
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">ก่อนหักเพดาน</span>
                </div>

                <div className="bg-indigo-50/60 p-3 rounded-lg border border-indigo-200">
                  <span className="text-[11px] text-indigo-700 block font-medium">ชม. มีสิทธิเบิก (18 สัปดาห์)</span>
                  <span className="text-base font-bold text-indigo-900">{selectedResult.claimableOverloadHours} ชม.</span>
                  <span className="text-[10px] text-indigo-600 block mt-0.5">{(selectedResult.claimableOverloadHours / 18).toFixed(1)} ชม./สัปดาห์</span>
                </div>

                <div className="bg-amber-50/60 p-3 rounded-lg border border-amber-200">
                  <span className="text-[11px] text-amber-800 block font-medium">ชม. ไม่ได้เบิก (ข้อ 23)</span>
                  <span className="text-base font-bold text-amber-900">{selectedResult.unclaimedOverloadHours} ชม.</span>
                  <span className="text-[10px] text-amber-700 block mt-0.5">บันทึกสะสมผลงาน</span>
                </div>
              </div>

              {/* Special Section: การสอน 2 ระดับตามข้อ 17 (If applicable) */}
              {selectedResult.dualLevel.isDualLevel && (
                <div className="border border-sky-200 bg-sky-50/40 rounded-xl p-4.5 space-y-3">
                  <div className="flex items-center gap-2 text-sky-900 font-bold text-xs">
                    <Layers className="w-4 h-4 text-sky-600" />
                    <span>การคำนวณกรณีสอน 2 ระดับการศึกษา (ตามระเบียบ สอศ. พ.ศ. 2568 ข้อ 17)</span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    หลักการข้อ 17: แยกพิจารณาชั่วโมงสอนตามระดับการศึกษา ปวช. และ ปวส. โดยปันส่วนภาระงานสอนขั้นต่ำตามสัดส่วนที่สอนจริงในแต่ละระดับ ไม่รวมชั่วโมงคำนวณเป็นระดับเดียว เพื่อให้ได้รับอัตราค่าตอบแทนตรงตามระดับวิชาที่สอน
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {/* ระดับ ปวช. */}
                    <div className="bg-white p-3 rounded-lg border border-sky-200">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-slate-800">ระดับ ปวช.</span>
                        <span className="text-[11px] font-semibold text-indigo-600">฿{selectedResult.dualLevel.pvcRate} / ชม.</span>
                      </div>
                      <div className="text-[11px] text-slate-600 space-y-0.5">
                        <p>สอนจริง: <strong>{selectedResult.dualLevel.pvcActualHours}</strong> ชม./สัปดาห์</p>
                        <p>ภาระงานขั้นต่ำจัดสรร: <strong>{selectedResult.dualLevel.pvcBaseQuota}</strong> ชม./สัปดาห์</p>
                        <p className="text-indigo-700 font-medium">
                          ชั่วโมงที่มีสิทธิเบิก: <strong>{selectedResult.dualLevel.pvcClaimableHours}</strong> ชม. (18 สัปดาห์)
                        </p>
                        <p className="text-slate-900 font-bold pt-1 border-t border-slate-100">
                          ยอดเงิน ปวช.: ฿{selectedResult.dualLevel.pvcAmount.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* ระดับ ปวส. */}
                    <div className="bg-white p-3 rounded-lg border border-sky-200">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-slate-800">ระดับ ปวส.</span>
                        <span className="text-[11px] font-semibold text-indigo-600">฿{selectedResult.dualLevel.pvsRate} / ชม.</span>
                      </div>
                      <div className="text-[11px] text-slate-600 space-y-0.5">
                        <p>สอนจริง: <strong>{selectedResult.dualLevel.pvsActualHours}</strong> ชม./สัปดาห์</p>
                        <p>ภาระงานขั้นต่ำจัดสรร: <strong>{selectedResult.dualLevel.pvsBaseQuota}</strong> ชม./สัปดาห์</p>
                        <p className="text-indigo-700 font-medium">
                          ชั่วโมงที่มีสิทธิเบิก: <strong>{selectedResult.dualLevel.pvsClaimableHours}</strong> ชม. (18 สัปดาห์)
                        </p>
                        <p className="text-slate-900 font-bold pt-1 border-t border-slate-100">
                          ยอดเงิน ปวส.: ฿{selectedResult.dualLevel.pvsAmount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-[11px] text-sky-800 bg-sky-100/60 p-2.5 rounded-lg">
                    <strong>วิธีการคำนวณเทียบหน่วยชั่วโมง:</strong> {selectedResult.dualLevel.conversionMethod}
                  </div>
                </div>
              )}

              {/* Monthly Breakdown & Monthly Submission Section (การยื่นขอเบิกเป็นรายเดือน) */}
              <div className="border border-indigo-100 bg-white rounded-xl shadow-xs overflow-hidden">
                <div className="p-4 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-indigo-400" />
                      <h3 className="font-bold text-sm tracking-tight">
                        การจัดทำและยื่นขอเบิกเงินรายเดือน (Monthly Overload Claims)
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                        ระเบียบ สอศ. 2568
                      </span>
                    </div>
                    <p className="text-slate-300 text-xs mt-0.5">
                      ระบบคำนวณและแยกสรุปรายการเบิกจ่ายเป็นรายเดือน เพื่อประกอบการยื่นขออนุมัติและเบิกจ่ายเงินตามรอบเดือน
                    </p>
                  </div>

                  {/* Month Filter Selector */}
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-300">กรองเดือน:</span>
                    <select
                      value={selectedMonthFilter}
                      onChange={(e) => setSelectedMonthFilter(e.target.value)}
                      className="bg-slate-800 text-white text-xs px-2.5 py-1.5 rounded-lg border border-slate-700 focus:outline-none"
                    >
                      <option value="ALL">แสดงทุกเดือน (5 เดือน)</option>
                      {selectedResult.monthlyBreakdown?.map(m => (
                        <option key={m.monthId} value={m.monthId}>{m.monthName}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Monthly Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                      <tr>
                        <th className="py-2.5 px-3">เดือนที่ขอเบิก</th>
                        <th className="py-2.5 px-2.5 text-center">สัปดาห์</th>
                        <th className="py-2.5 px-2.5 text-center">ชม.สอนจริง</th>
                        <th className="py-2.5 px-2.5 text-center">ภาระขั้นต่ำ</th>
                        <th className="py-2.5 px-2.5 text-center">ชม.เกินภาระ</th>
                        <th className="py-2.5 px-2.5 text-center">ชม.มีสิทธิเบิก</th>
                        <th className="py-2.5 px-3 text-right">ยอดเงินขอเบิก</th>
                        <th className="py-2.5 px-3 text-center">สถานะการยื่นขอเบิก</th>
                        <th className="py-2.5 px-3 text-right">การดำเนินการ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(selectedResult.monthlyBreakdown || [])
                        .filter(m => selectedMonthFilter === 'ALL' || m.monthId === selectedMonthFilter)
                        .map((month) => {
                          const isSubmitted = submittedMonths[`${selectedResult.teacherId}-${month.monthId}`] || month.approvalStatus !== 'DRAFT';
                          const currentStatus = isSubmitted && month.approvalStatus === 'DRAFT' ? 'SUBMITTED' : (month.approvalStatus || 'DRAFT');

                          return (
                            <tr key={month.monthId} className="hover:bg-slate-50/70 transition-colors">
                              <td className="py-3 px-3 font-semibold text-slate-900">
                                {month.monthName}
                                <span className="block text-[10px] text-slate-500 font-normal">
                                  {month.weekRange}
                                </span>
                              </td>
                              <td className="py-3 px-2.5 text-center text-slate-700">
                                <span className="px-2 py-0.5 rounded-md bg-slate-100 font-medium text-[11px]">
                                  {month.weeksCount} สัปดาห์
                                </span>
                              </td>
                              <td className="py-3 px-2.5 text-center font-medium text-slate-800">
                                {month.actualHours} ชม.
                              </td>
                              <td className="py-3 px-2.5 text-center text-slate-600">
                                {month.baseQuotaHours} ชม.
                              </td>
                              <td className="py-3 px-2.5 text-center font-medium text-slate-800">
                                {month.overloadHours} ชม.
                              </td>
                              <td className="py-3 px-2.5 text-center font-bold text-indigo-700">
                                {month.claimableHours} ชม.
                              </td>
                              <td className="py-3 px-3 text-right font-bold text-slate-900">
                                ฿{month.totalAmount.toLocaleString()}
                              </td>
                              <td className="py-3 px-3 text-center">
                                {getStatusBadge(currentStatus)}
                                {month.submissionDate && (
                                  <span className="block text-[9px] text-slate-400 mt-0.5">
                                    ยื่นเมื่อ {month.submissionDate}
                                  </span>
                                )}
                              </td>
                              <td className="py-3 px-3 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  {currentStatus === 'DRAFT' && (
                                    <button
                                      onClick={() => handleSubmitMonth(month.monthId)}
                                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-[11px] font-semibold shadow-xs transition-colors cursor-pointer"
                                      title="ส่งคำขอเบิกเงินประจำเดือน"
                                    >
                                      <Send className="w-3 h-3" />
                                      <span>ยื่นขอเบิก</span>
                                    </button>
                                  )}
                                  <button
                                    onClick={() => onSelectTeacherForReport && onSelectTeacherForReport(selectedResult.teacherId, month.monthId)}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-[11px] font-medium transition-colors cursor-pointer"
                                    title="พิมพ์ใบขอเบิกประจำเดือนนี้"
                                  >
                                    <Printer className="w-3 h-3 text-slate-500" />
                                    <span>พิมพ์ใบขอเบิก</span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                    <tfoot className="bg-slate-50/80 border-t border-slate-200 font-semibold text-slate-900">
                      <tr>
                        <td colSpan={2} className="py-2.5 px-3">
                          รวมตลอดภาคเรียน (18 สัปดาห์)
                        </td>
                        <td className="py-2.5 px-2.5 text-center">{selectedResult.actualTeachingHours} ชม.</td>
                        <td className="py-2.5 px-2.5 text-center">{selectedResult.requiredBaseTeachingHours} ชม.</td>
                        <td className="py-2.5 px-2.5 text-center">{selectedResult.grossOverloadHours} ชม.</td>
                        <td className="py-2.5 px-2.5 text-center text-indigo-700 font-bold">{selectedResult.claimableOverloadHours} ชม.</td>
                        <td className="py-2.5 px-3 text-right text-indigo-700 text-sm font-bold">฿{selectedResult.totalAmount.toLocaleString()}</td>
                        <td colSpan={2} className="py-2.5 px-3 text-right text-slate-500 text-[11px]">
                          {selectedResult.applicableRateSummary}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* 10-Step Rule Engine Audit Trace (Prompt Section 10) */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <button 
                  onClick={() => setShowFormulaDetails(!showFormulaDetails)}
                  className="w-full p-3.5 bg-slate-50 flex items-center justify-between text-xs font-semibold text-slate-800 hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-indigo-600" />
                    <span>ขั้นตอนการตรวจสอบและคำนวณสิทธิ์ 10 ขั้นตอน (Audit Verification Trail)</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showFormulaDetails ? 'rotate-180' : ''}`} />
                </button>

                {showFormulaDetails && (
                  <div className="p-4 space-y-2.5 bg-white text-xs">
                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-[10px] shrink-0">1</span>
                      <div>
                        <strong>ตรวจประเภทและตำแหน่งผู้สอน:</strong> {selectedResult.category} ({selectedResult.position})
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-[10px] shrink-0">2</span>
                      <div>
                        <strong>ตรวจระดับการศึกษาและชั่วโมงสอน:</strong> สอนจริงสัปดาห์ละ {selectedResult.weeklyScheduledHours} ชม.
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-[10px] shrink-0">3</span>
                      <div>
                        <strong>ตรวจชั่วโมงหน้าที่ที่ได้รับมอบหมาย:</strong> {selectedResult.weeklyDutyHours} ชม./สัปดาห์ (เกณฑ์ขั้นต่ำ {selectedResult.minDutyHoursRequired} ชม.)
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-[10px] shrink-0">4</span>
                      <div>
                        <strong>แยกพิจารณา ปวช. และ ปวส.:</strong> {selectedResult.dualLevel.isDualLevel ? `ปวช. ${selectedResult.dualLevel.pvcActualHours} ชม., ปวส. ${selectedResult.dualLevel.pvsActualHours} ชม.` : 'สอนระดับเดียว'}
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-[10px] shrink-0">5</span>
                      <div>
                        <strong>ตรวจกรณีสอน 2 ระดับ (ข้อ 17):</strong> {selectedResult.dualLevel.isDualLevel ? 'เข้าเกณฑ์ข้อ 17 ปันส่วนภาระงานขั้นต่ำแยกตามระดับ' : 'ไม่เข้าเงื่อนไขสอน 2 ระดับ'}
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-[10px] shrink-0">6</span>
                      <div>
                        <strong>ตรวจการสอนแทน/สอนชดเชย:</strong> ได้ชั่วโมงเพิ่ม {selectedResult.weeklySubstitutePlusHours} ชม./สัปดาห์, หักออก {selectedResult.weeklySubstituteMinusHours} ชม./สัปดาห์
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-[10px] shrink-0">7</span>
                      <div>
                        <strong>คำนวณชั่วโมงเกินภาระงาน:</strong> {(selectedResult.grossOverloadHours / 18).toFixed(2)} ชม./สัปดาห์ ({selectedResult.grossOverloadHours} ชม. ตลอดภาคเรียน 18 สัปดาห์)
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-[10px] shrink-0">8</span>
                      <div>
                        <strong>ตรวจเพดานตามระเบียบ:</strong> เบิกได้ {selectedResult.claimableOverloadHours} ชม.
                        {selectedResult.unclaimedOverloadHours > 0 && ` (ส่วนเกินเพดาน ${selectedResult.unclaimedOverloadHours} ชม. จัดเก็บตามข้อ 23)`}
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-[10px] shrink-0">9</span>
                      <div>
                        <strong>คำนวณจำนวนเงินตามอัตรา:</strong> {selectedResult.applicableRateSummary} = <strong>฿{selectedResult.totalAmount.toLocaleString()} บาท</strong>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-[10px] shrink-0">10</span>
                      <div>
                        <strong>เหตุผลประกอบผลการคำนวณ:</strong> {selectedResult.statusReason}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons for this Teacher */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => onSelectTeacherForReport && onSelectTeacherForReport(selectedResult.teacherId)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>พิมพ์แบบขอเบิกเงินรายบุคคล</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
              เลือกผู้สอนเพื่อดูผลการคำนวณ
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
