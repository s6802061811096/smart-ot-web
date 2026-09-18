import React, { useState } from 'react';
import { 
  OTCalculationResult, 
  ApprovalStatus, 
  User, 
  AuditLogEntry
} from '../types';
import { 
  FileCheck2, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Send, 
  ShieldCheck, 
  DollarSign, 
  Search, 
  Filter, 
  MessageSquare,
  History,
  AlertCircle,
  ChevronDown,
  Calendar
} from 'lucide-react';
import { SUPPORTED_SEMESTERS } from '../services/ruleEngine';

interface ApprovalWorkflowProps {
  calculationResults: OTCalculationResult[];
  auditLogs: AuditLogEntry[];
  currentUser: User;
  academicTerm?: string;
  onSelectTerm?: (term: string) => void;
  onUpdateStatus: (teacherId: string, newStatus: ApprovalStatus, comments?: string) => void;
  onUpdateMonthlyStatus?: (teacherId: string, monthId: string, newStatus: ApprovalStatus, comments?: string) => void;
  onBatchApprove?: (teacherIds: string[], newStatus: ApprovalStatus) => void;
}

export const ApprovalWorkflow: React.FC<ApprovalWorkflowProps> = ({
  calculationResults,
  auditLogs,
  currentUser,
  academicTerm = '2/2568',
  onSelectTerm,
  onUpdateStatus,
  onUpdateMonthlyStatus,
  onBatchApprove
}) => {
  const isTeacher = currentUser.role === 'TEACHER';
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedMonth, setSelectedMonth] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeacherIds, setSelectedTeacherIds] = useState<string[]>([]);
  const [actionComment, setActionComment] = useState('');
  const [showHistoryModal, setShowHistoryModal] = useState<string | null>(null);
  const [expandedTeacherId, setExpandedTeacherId] = useState<string | null>(null);

  // Handle month or semester selection
  const handleMonthChange = (val: string) => {
    if (val === 'ALL') {
      setSelectedMonth('ALL');
      return;
    }
    if (val.startsWith('TERM_')) {
      const chosenTerm = val.replace('TERM_', '');
      onSelectTerm?.(chosenTerm);
      setSelectedMonth('ALL');
      return;
    }
    // Check which semester this month belongs to
    const matchedSem = SUPPORTED_SEMESTERS.find(s => s.months.some(m => m.monthId === val));
    if (matchedSem && matchedSem.term !== academicTerm) {
      onSelectTerm?.(matchedSem.term);
    }
    setSelectedMonth(val);
  };

  // Status badges & text
  const statusConfig: Record<ApprovalStatus, { label: string; color: string; step: number }> = {
    DRAFT: { label: 'ร่างข้อมูล (ยังไม่ยื่น)', color: 'bg-slate-100 text-slate-700 border-slate-200', step: 1 },
    SUBMITTED: { label: 'ส่งข้อมูลแล้ว (รอ หน.แผนก)', color: 'bg-blue-100 text-blue-800 border-blue-200', step: 2 },
    HEAD_ENDORSED: { label: 'หน.แผนกรับรองแล้ว (รอวิชาการ)', color: 'bg-amber-100 text-amber-800 border-amber-200', step: 3 },
    ACADEMIC_VERIFIED: { label: 'วิชาการตรวจแล้ว (รอ ผอ.อนุมัติ)', color: 'bg-purple-100 text-purple-800 border-purple-200', step: 4 },
    DIRECTOR_APPROVED: { label: 'ผอ.อนุมัติแล้ว (รอการเงินเบิกจ่าย)', color: 'bg-emerald-100 text-emerald-800 border-emerald-200', step: 5 },
    FINANCE_PAID: { label: 'เบิกจ่ายเงินเรียบร้อยแล้ว', color: 'bg-teal-100 text-teal-800 border-teal-200', step: 6 },
    REJECTED: { label: 'ส่งกลับแก้ไข', color: 'bg-rose-100 text-rose-800 border-rose-200', step: 0 },
  };

  // Determine allowed next action based on current user role
  const getActionForRole = (currentStatus: ApprovalStatus) => {
    if (currentUser.role === 'TEACHER' && (currentStatus === 'DRAFT' || currentStatus === 'REJECTED')) {
      return { nextStatus: 'SUBMITTED' as ApprovalStatus, label: 'ส่งขอเบิก' };
    }
    if (currentUser.role === 'HEAD' && currentStatus === 'SUBMITTED') {
      return { nextStatus: 'HEAD_ENDORSED' as ApprovalStatus, label: 'รับรองข้อมูล' };
    }
    if (currentUser.role === 'ACADEMIC' && currentStatus === 'HEAD_ENDORSED') {
      return { nextStatus: 'ACADEMIC_VERIFIED' as ApprovalStatus, label: 'ตรวจความถูกต้อง' };
    }
    if ((currentUser.role === 'ADMIN' || currentUser.role === 'ACADEMIC') && currentStatus === 'ACADEMIC_VERIFIED') {
      return { nextStatus: 'DIRECTOR_APPROVED' as ApprovalStatus, label: 'อนุมัติเบิกจ่าย (ผอ.)' };
    }
    if (currentUser.role === 'FINANCE' && currentStatus === 'DIRECTOR_APPROVED') {
      return { nextStatus: 'FINANCE_PAID' as ApprovalStatus, label: 'เบิกจ่ายเงิน' };
    }
    if (currentUser.role === 'ADMIN') {
      // Super admin can advance any
      if (currentStatus === 'SUBMITTED') return { nextStatus: 'HEAD_ENDORSED' as ApprovalStatus, label: 'รับรอง (Admin)' };
      if (currentStatus === 'HEAD_ENDORSED') return { nextStatus: 'ACADEMIC_VERIFIED' as ApprovalStatus, label: 'ตรวจผ่าน (Admin)' };
      if (currentStatus === 'ACADEMIC_VERIFIED') return { nextStatus: 'DIRECTOR_APPROVED' as ApprovalStatus, label: 'อนุมัติ (Admin)' };
      if (currentStatus === 'DIRECTOR_APPROVED') return { nextStatus: 'FINANCE_PAID' as ApprovalStatus, label: 'เบิกจ่าย (Admin)' };
    }
    return null;
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedTeacherIds(filteredResults.map(r => r.teacherId));
    } else {
      setSelectedTeacherIds([]);
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedTeacherIds.includes(id)) {
      setSelectedTeacherIds(selectedTeacherIds.filter(i => i !== id));
    } else {
      setSelectedTeacherIds([...selectedTeacherIds, id]);
    }
  };

  const filteredResults = calculationResults.filter(r => {
    // ครูผู้สอน: เห็นได้เฉพาะข้อมูลของตนเอง
    if (isTeacher && currentUser.teacherId) {
      if (r.teacherId !== currentUser.teacherId) return false;
    }
    const matchesSearch = r.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.teacherId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.departmentName.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    let matchesStatus = true;
    if (selectedStatus !== 'ALL') {
      if (selectedMonth === 'ALL') {
        matchesStatus = r.approvalStatus === selectedStatus;
      } else {
        const targetMonth = r.monthlyBreakdown?.find(m => m.monthId === selectedMonth);
        matchesStatus = (targetMonth?.approvalStatus || 'DRAFT') === selectedStatus;
      }
    }
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Teacher Security Notice Banner */}
      {isTeacher && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between text-xs text-emerald-900">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold text-sm block text-emerald-950">
                สถานะการยื่นขอเบิกเงินค่าสอนเกินภาระงานสอนส่วนบุคคล
              </span>
              <span className="text-emerald-800">
                ระบบจำกัดการเข้าถึงเฉพาะข้อมูลการขอเบิกของคุณ ({currentUser.name}) เพื่อความถูกต้องตามระเบียบและความเป็นส่วนตัว
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              กระบวนการตรวจสอบและอนุมัติ (Workflow & Approval)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            ลำดับขั้น: 1.ครูยืนยัน ➔ 2.หน.แผนกรับรอง ➔ 3.งานวิชาการตรวจ ➔ 4.ผอ.สถานศึกษาอนุมัติ ➔ 5.งานการเงินเบิกจ่าย
          </p>
        </div>

        {/* Current Role Context */}
        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-xs">
          <span className="text-slate-500">บทบาทของคุณ:</span>
          <span className="font-bold text-indigo-700">{currentUser.role} ({currentUser.name})</span>
        </div>
      </div>

      {/* 5-Step Visual Pipeline Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4">
          ขั้นตอนการอนุมัติ 5 ลำดับตามระเบียบ สอศ.
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="p-3 rounded-lg border border-blue-200 bg-blue-50/50 text-xs">
            <div className="flex items-center justify-between font-bold text-blue-900">
              <span>1. ครูผู้สอน</span>
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">1</span>
            </div>
            <p className="text-[11px] text-slate-600 mt-1">ยืนยันข้อมูลสอนจริงและเอกสาร</p>
          </div>

          <div className="p-3 rounded-lg border border-amber-200 bg-amber-50/50 text-xs">
            <div className="flex items-center justify-between font-bold text-amber-900">
              <span>2. หน.แผนก</span>
              <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px]">2</span>
            </div>
            <p className="text-[11px] text-slate-600 mt-1">รับรองภาระงานและวิชาในแผนก</p>
          </div>

          <div className="p-3 rounded-lg border border-purple-200 bg-purple-50/50 text-xs">
            <div className="flex items-center justify-between font-bold text-purple-900">
              <span>3. งานวิชาการ</span>
              <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px]">3</span>
            </div>
            <p className="text-[11px] text-slate-600 mt-1">ตรวจเกณฑ์ 2 ระดับ & คำสั่งสอนแทน</p>
          </div>

          <div className="p-3 rounded-lg border border-emerald-200 bg-emerald-50/50 text-xs">
            <div className="flex items-center justify-between font-bold text-emerald-900">
              <span>4. ผอ.อนุมัติ</span>
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">4</span>
            </div>
            <p className="text-[11px] text-slate-600 mt-1">อนุมัติการเบิกจ่ายงบประมาณ</p>
          </div>

          <div className="p-3 rounded-lg border border-teal-200 bg-teal-50/50 text-xs">
            <div className="flex items-center justify-between font-bold text-teal-900">
              <span>5. งานการเงิน</span>
              <span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px]">5</span>
            </div>
            <p className="text-[11px] text-slate-600 mt-1">จัดทำเอกสารและโอนเงินเข้าบัญชี</p>
          </div>
        </div>
      </div>

      {/* Filters and Batch Actions */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="ค้นหาชื่อผู้สอน หรือแผนก..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {/* Month Selector Filter (การยื่นขอเบิกเป็นรายเดือน แบ่งตามภาคเรียนและเดือน/ปี) */}
          <div>
            <select
              aria-label="รอบเดือนที่ขอเบิก"
              value={selectedMonth}
              onChange={(e) => handleMonthChange(e.target.value)}
              className="w-full py-1.5 px-3 rounded-lg border border-indigo-200 text-xs bg-indigo-50/50 text-indigo-900 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="ALL">📅 ตลอดภาคเรียน {academicTerm} (สรุปทั้ง 5 เดือน)</option>
              {SUPPORTED_SEMESTERS.map(sem => (
                <optgroup key={sem.term} label={`ภาคเรียน ${sem.term}`}>
                  <option value={`TERM_${sem.term}`}>
                    📅 ตลอดภาคเรียน {sem.term} (ทั้ง 18 สัปดาห์)
                  </option>
                  {sem.months.map(m => (
                    <option key={m.monthId} value={m.monthId}>
                      {m.monthName} ({m.weekRange.replace('ที่ ', '')})
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div>
            <select
              aria-label="สถานะใน Workflow"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full py-1.5 px-3 rounded-lg border border-slate-200 text-xs bg-white text-slate-700"
            >
              <option value="ALL">ทุกสถานะ ({filteredResults.length} รายการ)</option>
              <option value="DRAFT">ร่างข้อมูล (DRAFT)</option>
              <option value="SUBMITTED">ส่งข้อมูลแล้ว (SUBMITTED)</option>
              <option value="HEAD_ENDORSED">หน.แผนกรับรองแล้ว (HEAD_ENDORSED)</option>
              <option value="ACADEMIC_VERIFIED">วิชาการตรวจแล้ว (ACADEMIC_VERIFIED)</option>
              <option value="DIRECTOR_APPROVED">ผอ.อนุมัติแล้ว (DIRECTOR_APPROVED)</option>
              <option value="FINANCE_PAID">เบิกจ่ายแล้ว (FINANCE_PAID)</option>
              <option value="REJECTED">ส่งกลับแก้ไข (REJECTED)</option>
            </select>
          </div>
        </div>

        {/* Batch Action Toolbar */}
        {selectedTeacherIds.length > 0 && (
          <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-indigo-900">
                เลือกแล้ว {selectedTeacherIds.length} รายการ
              </span>
            </div>

            <div className="flex items-center gap-2">
              {currentUser.role === 'HEAD' && (
                <button
                  onClick={() => onBatchApprove && onBatchApprove(selectedTeacherIds, 'HEAD_ENDORSED')}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg shadow-xs"
                >
                  รับรองพร้อมกัน ({selectedTeacherIds.length})
                </button>
              )}
              {currentUser.role === 'ACADEMIC' && (
                <button
                  onClick={() => onBatchApprove && onBatchApprove(selectedTeacherIds, 'ACADEMIC_VERIFIED')}
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-xs"
                >
                  วิชาการตรวจผ่านพร้อมกัน ({selectedTeacherIds.length})
                </button>
              )}
              {currentUser.role === 'ADMIN' && (
                <button
                  onClick={() => onBatchApprove && onBatchApprove(selectedTeacherIds, 'DIRECTOR_APPROVED')}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-xs"
                >
                  อนุมัติเบิกจ่ายพร้อมกัน ({selectedTeacherIds.length})
                </button>
              )}
              {currentUser.role === 'FINANCE' && (
                <button
                  onClick={() => onBatchApprove && onBatchApprove(selectedTeacherIds, 'FINANCE_PAID')}
                  className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg shadow-xs"
                >
                  บันทึกจ่ายเงินพร้อมกัน ({selectedTeacherIds.length})
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Term & Month Active Info Bar */}
        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-indigo-600" />
            <span className="font-semibold text-slate-800">
              {selectedMonth === 'ALL' 
                ? `สรุปยอดคำขอเบิกตลอดภาคเรียนที่ ${academicTerm} (18 สัปดาห์)` 
                : `คำขอเบิกรายเดือน: ${SUPPORTED_SEMESTERS.flatMap(s => s.months).find(m => m.monthId === selectedMonth)?.monthName || selectedMonth} (ภาคเรียน ${academicTerm})`}
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">
            แสดงข้อมูลผู้สอน {filteredResults.length} ท่าน
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
              <tr>
                <th className="py-3 px-3.5 w-10">
                  <input
                    type="checkbox"
                    aria-label="เลือกผู้สอนทั้งหมดในตาราง"
                    checked={selectedTeacherIds.length === filteredResults.length && filteredResults.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-slate-300 text-indigo-600"
                  />
                </th>
                <th className="py-3 px-3.5">ผู้สอน</th>
                <th className="py-3 px-3.5">แผนกวิชา</th>
                <th className="py-3 px-3.5 text-center">ชม. เบิกได้</th>
                <th className="py-3 px-3.5 text-right">ยอดเงิน (บาท)</th>
                <th className="py-3 px-3.5">สถานะปัจจุบัน</th>
                <th className="py-3 px-3.5 text-right">การดำเนินการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredResults.map((result) => {
                const isSelected = selectedTeacherIds.includes(result.teacherId);
                const isExpanded = expandedTeacherId === result.teacherId;
                
                // If a specific month is selected, extract that month's data
                const targetMonthItem = selectedMonth !== 'ALL' 
                  ? result.monthlyBreakdown?.find(m => m.monthId === selectedMonth) 
                  : null;

                const currentStatus: ApprovalStatus = targetMonthItem 
                  ? (targetMonthItem.approvalStatus || 'DRAFT')
                  : result.approvalStatus;

                const claimHours = targetMonthItem ? targetMonthItem.claimableHours : result.claimableOverloadHours;
                const totalAmount = targetMonthItem ? targetMonthItem.totalAmount : result.totalAmount;

                const status = statusConfig[currentStatus] || statusConfig.DRAFT;
                const action = getActionForRole(currentStatus);

                const handleExecuteAction = (nextStatus: ApprovalStatus) => {
                  if (selectedMonth !== 'ALL' && onUpdateMonthlyStatus) {
                    onUpdateMonthlyStatus(result.teacherId, selectedMonth, nextStatus, actionComment || 'ดำเนินการผ่านระบบ');
                  } else {
                    onUpdateStatus(result.teacherId, nextStatus, actionComment || 'ดำเนินการผ่านระบบ');
                  }
                };

                const handleReject = () => {
                  const reason = prompt('กรุณาระบุเหตุผลการส่งกลับแก้ไข:', 'ข้อมูลตารางสอนไม่ตรงกับบันทึกจริง');
                  if (!reason) return;
                  if (selectedMonth !== 'ALL' && onUpdateMonthlyStatus) {
                    onUpdateMonthlyStatus(result.teacherId, selectedMonth, 'REJECTED', reason);
                  } else {
                    onUpdateStatus(result.teacherId, 'REJECTED', reason);
                  }
                };

                return (
                  <React.Fragment key={result.teacherId}>
                    <tr className={`hover:bg-slate-50 transition-colors ${isSelected ? 'bg-indigo-50/40' : ''}`}>
                      <td className="py-3 px-3.5">
                        <input
                          type="checkbox"
                          aria-label={`เลือกผู้สอน ${result.teacherName}`}
                          checked={isSelected}
                          onChange={() => toggleSelect(result.teacherId)}
                          className="rounded border-slate-300 text-indigo-600"
                        />
                      </td>
                      <td className="py-3 px-3.5 font-medium text-slate-900">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setExpandedTeacherId(isExpanded ? null : result.teacherId)}
                            className="p-0.5 rounded-sm hover:bg-slate-200 text-slate-400 hover:text-slate-700"
                            title="ดูสรุปรายเดือน 5 เดือน"
                          >
                            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                          </button>
                          <div>
                            <span>{result.teacherName}</span>
                            <span className="block text-[10px] text-slate-400 font-normal">
                              {result.teacherId} • {result.category}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3.5 text-slate-600">
                        {result.departmentName}
                        {selectedMonth !== 'ALL' && targetMonthItem && (
                          <span className="block text-[10px] text-indigo-600 font-medium">
                            รอบ: {targetMonthItem.monthName} ({targetMonthItem.weeksCount} สัปดาห์)
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3.5 text-center font-bold text-slate-800">
                        {claimHours} ชม.
                      </td>
                      <td className="py-3 px-3.5 text-right font-bold text-indigo-700">
                        ฿{totalAmount.toLocaleString()}
                      </td>
                      <td className="py-3 px-3.5">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold border ${status.color}`}>
                          {status.label}
                        </span>
                        {selectedMonth !== 'ALL' && (
                          <span className="block text-[9px] text-slate-400 mt-0.5">
                            เฉพาะรอบเดือนนี้
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Quick action button for current role */}
                          {action && (
                            <button
                              onClick={() => handleExecuteAction(action.nextStatus)}
                              className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-[10px] font-semibold transition-colors cursor-pointer"
                            >
                              {action.label}
                            </button>
                          )}

                          {/* Reject button for reviewers */}
                          {['HEAD', 'ACADEMIC', 'ADMIN'].includes(currentUser.role) && 
                           ['SUBMITTED', 'HEAD_ENDORSED', 'ACADEMIC_VERIFIED'].includes(currentStatus) && (
                            <button
                              onClick={handleReject}
                              className="px-2 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-md text-[10px] font-semibold cursor-pointer"
                            >
                              ส่งกลับแก้ไข
                            </button>
                          )}

                          {/* Audit log viewer */}
                          <button
                            onClick={() => setShowHistoryModal(result.teacherId)}
                            className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md"
                            title="ดูประวัติการอนุมัติ (Audit Log)"
                          >
                            <History className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Expandable 5-Month Inline Summary */}
                    {isExpanded && result.monthlyBreakdown && (
                      <tr className="bg-slate-50/70">
                        <td colSpan={7} className="p-3 pl-12 border-b border-slate-200">
                          <div className="bg-white rounded-lg border border-slate-200 p-3 shadow-2xs">
                            <span className="font-bold text-[11px] text-slate-800 block mb-2">
                              📋 รายละเอียดการขอเบิกรายเดือนทั้ง 5 เดือนของผู้สอน ({result.teacherName}):
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs">
                              {result.monthlyBreakdown.map((m) => {
                                const mStatus = statusConfig[m.approvalStatus || 'DRAFT'];
                                const mAction = getActionForRole(m.approvalStatus || 'DRAFT');
                                return (
                                  <div key={m.monthId} className="border border-slate-200 rounded-md p-2 bg-slate-50/50 space-y-1">
                                    <div className="font-bold text-slate-900 text-[11px] flex justify-between">
                                      <span>{m.monthName}</span>
                                      <span className="text-slate-500 font-normal text-[10px]">{m.weeksCount} สัปดาห์</span>
                                    </div>
                                    <div className="text-[10px] text-slate-600">
                                      ชม.เบิก: <strong>{m.claimableHours}</strong> ชม.
                                    </div>
                                    <div className="text-[11px] font-bold text-indigo-700">
                                      ฿{m.totalAmount.toLocaleString()}
                                    </div>
                                    <div className="pt-1">
                                      <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-medium border ${mStatus.color}`}>
                                        {mStatus.label}
                                      </span>
                                    </div>
                                    {mAction && (
                                      <button
                                        onClick={() => {
                                          if (onUpdateMonthlyStatus) {
                                            onUpdateMonthlyStatus(result.teacherId, m.monthId, mAction.nextStatus, actionComment || 'ดำเนินการรายเดือน');
                                          }
                                        }}
                                        className="w-full mt-1.5 py-0.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-[10px] font-medium transition-colors cursor-pointer"
                                      >
                                        {mAction.label}
                                      </button>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Log Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <History className="w-4 h-4 text-indigo-600" />
                <span>ประวัติและบันทึกการตรวจสอบ (Audit Trail) - {showHistoryModal}</span>
              </h3>
              <button 
                onClick={() => setShowHistoryModal(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {auditLogs
                .filter(l => l.targetId === showHistoryModal || l.targetId === 'ALL' || l.targetId === 'SYSTEM')
                .map((log) => (
                  <div key={log.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between font-semibold text-slate-800">
                      <span>{log.userName} ({log.userRole})</span>
                      <span className="text-[10px] text-slate-400 font-mono">{log.timestamp}</span>
                    </div>
                    <div className="text-indigo-600 font-medium">{log.action}</div>
                    <p className="text-slate-600 text-[11px]">{log.details}</p>
                  </div>
                ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 text-right">
              <button
                onClick={() => setShowHistoryModal(null)}
                className="px-4 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-semibold"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
