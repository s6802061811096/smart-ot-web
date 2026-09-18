import React, { useState } from 'react';
import { 
  OTCalculationResult, 
  Teacher, 
  Department, 
  ScheduleItem, 
  SubstituteRecord,
  User
} from '../types';
import { 
  Printer, 
  Download, 
  FileText, 
  FileSpreadsheet, 
  Users, 
  Layers, 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  Search,
  Filter,
  XCircle,
  Building,
  Calendar
} from 'lucide-react';
import { SUPPORTED_SEMESTERS } from '../services/ruleEngine';

interface OfficialReportsProps {
  calculationResults: OTCalculationResult[];
  teachers: Teacher[];
  departments: Department[];
  schedules: ScheduleItem[];
  substitutes: SubstituteRecord[];
  academicTerm: string;
  onSelectTerm?: (term: string) => void;
  currentUser?: User;
  initialTeacherId?: string | null;
  initialMonthId?: string | null;
}

export type ReportType = 
  | 'INDIVIDUAL' 
  | 'DEPARTMENT' 
  | 'COLLEGE_SUMMARY' 
  | 'WEEKLY_DETAIL' 
  | 'INELIGIBLE_LIST' 
  | 'UNCLAIMED_HOURS' 
  | 'SUBSTITUTE_REPORT' 
  | 'FINANCE_DISBURSE';

export const OfficialReports: React.FC<OfficialReportsProps> = ({
  calculationResults,
  teachers,
  departments,
  schedules,
  substitutes,
  academicTerm,
  onSelectTerm,
  currentUser,
  initialTeacherId,
  initialMonthId
}) => {
  const isTeacher = currentUser?.role === 'TEACHER';
  const myTeacherId = currentUser?.teacherId || 'T0001';
  const defaultTeacherId = isTeacher ? myTeacherId : (initialTeacherId || calculationResults[0]?.teacherId || 'T0001');

  const [selectedReport, setSelectedReport] = useState<ReportType>('INDIVIDUAL');
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>(defaultTeacherId);
  const [selectedDeptId, setSelectedDeptId] = useState<string>('ALL');
  const [selectedMonth, setSelectedMonth] = useState<string>(initialMonthId || 'ALL');

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
    const matchedSem = SUPPORTED_SEMESTERS.find(s => s.months.some(m => m.monthId === val));
    if (matchedSem && matchedSem.term !== academicTerm) {
      onSelectTerm?.(matchedSem.term);
    }
    setSelectedMonth(val);
  };

  const selectedResult = calculationResults.find(r => r.teacherId === selectedTeacherId) || calculationResults[0];
  const selectedTeacher = teachers.find(t => t.id === selectedResult?.teacherId);
  const teacherSchedules = schedules.filter(s => s.teacherId === selectedTeacherId);

  const targetMonthItem = selectedMonth !== 'ALL'
    ? selectedResult?.monthlyBreakdown?.find(m => m.monthId === selectedMonth)
    : null;

  const reportsList = [
    { id: 'INDIVIDUAL', title: '1. แบบขอเบิกเงินค่าสอนเกินภาระงานรายบุคคล', desc: 'ใบขอนุมัติเบิกเงินทางการ พร้อมตารางวิชาและ 5 ลายมือชื่อ' },
    { id: 'DEPARTMENT', title: '2. รายงานสรุปค่าสอนเกินภาระงานแยกตามแผนกวิชา', desc: 'รวบรวมชั่วโมงและยอดเงินของผู้สอนในแผนก' },
    { id: 'COLLEGE_SUMMARY', title: '3. สรุปภาพรวมสถานศึกษาเสนอ ผอ. อนุมัติ', desc: 'Summary Sheet รวมทั้งวิทยาลัยเพื่อเบิกจ่ายงบประมาณ' },
    { id: 'WEEKLY_DETAIL', title: '4. รายงานการจัดการเรียนการสอนรายสัปดาห์ (18 สัปดาห์)', desc: 'บันทึกชั่วโมงสอนจริงตลอดภาคเรียน' },
    { id: 'INELIGIBLE_LIST', title: '5. รายงานผู้ไม่ผ่านเกณฑ์การเบิกจ่ายและเหตุผล', desc: 'แสดงรายชื่อและสาเหตุ เช่น ชั่วโมงสอนไม่ถึงเกณฑ์' },
    { id: 'UNCLAIMED_HOURS', title: '6. หนังสือรับรองชั่วโมงสอนเกินภาระงานที่ไม่ได้เบิก (ข้อ 23)', desc: 'เอกสารสะสมผลงานเพื่อใช้ประเมินวิทยฐานะ' },
    { id: 'SUBSTITUTE_REPORT', title: '7. รายงานสรุปการสอนแทนและสอนชดเชย', desc: 'รวบรวมสถิติ คำสั่งอนุมัติ และการปรับยอดชั่วโมง' },
    { id: 'FINANCE_DISBURSE', title: '8. รายงานบัญชีประกอบการเบิกจ่ายสำหรับงานการเงิน', desc: 'บัญชีรายชื่อ ยอดเงินสุทธิ และเลขที่บัญชีธนาคาร' },
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,\uFEFF';
    csvContent += 'รหัสผู้สอน,ชื่อ-สกุล,แผนกวิชา,ประเภท,สอนจริงต่อสัปดาห์,ภาระงานขั้นต่ำ,ชั่วโมงเกินภาระงาน(18สัปดาห์),ชั่วโมงที่มีสิทธิเบิก,ชั่วโมงไม่ได้เบิก(ข้อ23),ยอดเงินรวม(บาท),สถานะ\n';
    
    calculationResults.forEach(r => {
      csvContent += `"${r.teacherId}","${r.teacherName}","${r.departmentName}","${r.category}",${r.weeklyActualTaughtHours},${r.minTeachingHoursRequired},${r.grossOverloadHours},${r.claimableOverloadHours},${r.unclaimedOverloadHours},${r.totalAmount},"${r.passedCheck ? 'มีสิทธิเบิก' : 'ไม่ผ่านเกณฑ์'}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `smart_ot_report_term_${academicTerm.replace('/', '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Controller: Report Selector & Actions */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              รายงานและเอกสารทางการ (Official Reports & Forms)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            แบบคำขอเบิกเงินและรายงานผลรวม 8 ประเภท ถูกต้องตามระเบียบ สอศ. พ.ศ. 2568
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>ส่งออก CSV (Excel)</span>
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>พิมพ์รายงาน / บันทึก PDF</span>
          </button>
        </div>
      </div>

      {/* Report Type Selector Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 no-print">
        {reportsList.map((r) => (
          <button
            key={r.id}
            onClick={() => setSelectedReport(r.id as ReportType)}
            className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
              selectedReport === r.id
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
            }`}
          >
            <div className={`font-bold text-xs ${selectedReport === r.id ? 'text-white' : 'text-slate-900'}`}>
              {r.title}
            </div>
            <p className={`text-[10px] mt-1 line-clamp-2 ${selectedReport === r.id ? 'text-indigo-100' : 'text-slate-500'}`}>
              {r.desc}
            </p>
          </button>
        ))}
      </div>

      {/* Parameters Row (if needed by report) */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-3 no-print">
        {(selectedReport === 'INDIVIDUAL' || selectedReport === 'UNCLAIMED_HOURS') && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-600">เลือกครูผู้สอน:</span>
            <select
              aria-label="เลือกครูผู้สอนสำหรับรายงาน"
              value={selectedTeacherId}
              onChange={(e) => setSelectedTeacherId(e.target.value)}
              disabled={isTeacher}
              className={`px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold ${isTeacher ? 'bg-slate-100 text-slate-700 cursor-not-allowed' : 'bg-white text-slate-800'}`}
            >
              {calculationResults
                .filter(r => !isTeacher || r.teacherId === myTeacherId)
                .map(r => (
                  <option key={r.teacherId} value={r.teacherId}>
                    {r.teacherId}: {r.teacherName} ({r.departmentName}) - {r.passedCheck ? `เบิกได้ ฿${r.totalAmount.toLocaleString()}` : 'ไม่ผ่านเกณฑ์'}
                  </option>
              ))}
            </select>
            {isTeacher && (
              <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-medium border border-emerald-200">
                ล็อกตามบัญชีผู้สอนของคุณ
              </span>
            )}
          </div>
        )}

        {/* Month Selector Filter for Monthly Claim Documents */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-indigo-900 font-semibold whitespace-nowrap">รอบการยื่นขอเบิก:</span>
          <select
            aria-label="เลือกรอบการยื่นขอเบิกรายเดือน"
            value={selectedMonth}
            onChange={(e) => handleMonthChange(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-indigo-200 text-xs bg-indigo-50/50 text-indigo-900 font-bold focus:outline-none"
          >
            <option value="ALL">📅 ตลอดภาคเรียน {academicTerm} (รวมทั้ง 18 สัปดาห์)</option>
            {SUPPORTED_SEMESTERS.map(sem => (
              <optgroup key={sem.term} label={`ภาคเรียน ${sem.term}`}>
                <option value={`TERM_${sem.term}`}>
                  📅 ตลอดภาคเรียน {sem.term} (ทั้ง 18 สัปดาห์)
                </option>
                {sem.months.map(m => (
                  <option key={m.monthId} value={m.monthId}>
                    {m.monthName} ({m.weekRange.replace('ที่ ', '')} • {m.weeksCount} สัปดาห์)
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        {selectedReport === 'DEPARTMENT' && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-600">แผนกวิชา:</span>
            <select
              aria-label="เลือกแผนกวิชา"
              value={selectedDeptId}
              onChange={(e) => setSelectedDeptId(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white text-slate-800"
            >
              <option value="ALL">ทุกแผนกวิชา</option>
              {departments.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* REPORT 1: INDIVIDUAL OFFICIAL FORM (แบบคำขอเบิกเงินค่าสอนเกินภาระงานสอน) */}
      {selectedReport === 'INDIVIDUAL' && selectedResult && (
        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-xs text-slate-900 font-serif print:border-none print:shadow-none print:p-0 max-w-4xl mx-auto">
          {/* Official Document Header */}
          <div className="text-center space-y-1 mb-6 border-b-2 border-slate-900 pb-4">
            <h1 className="text-base font-bold tracking-tight">
              แบบคำขอเบิกเงินค่าสอนเกินภาระงานสอน {targetMonthItem ? `(ประจำเดือน ${targetMonthItem.monthName})` : ''}
            </h1>
            <p className="text-xs">
              ตามระเบียบสำนักงานคณะกรรมการการอาชีวศึกษา ว่าด้วยการจัดการเรียนการสอน การเบิกจ่ายเงินค่าสอนพิเศษ ค่าสอนเกินภาระงานสอน พ.ศ. 2568
            </p>
            <p className="text-xs font-semibold text-indigo-900">
              {targetMonthItem ? (
                <span>รอบการเบิกจ่าย: เดือน{targetMonthItem.monthName} ({targetMonthItem.weekRange} • รวม {targetMonthItem.weeksCount} สัปดาห์) ภาคเรียนที่ {academicTerm}</span>
              ) : (
                <span>ประจำภาคเรียนที่ {academicTerm} ปีการศึกษา 2568 (รวมตลอดภาคเรียน 18 สัปดาห์)</span>
              )}
            </p>
          </div>

          {/* Teacher Profile Section */}
          <div className="grid grid-cols-2 gap-y-1.5 text-xs mb-6">
            <div><strong>ข้าพเจ้า:</strong> {selectedResult.teacherName}</div>
            <div><strong>รหัสประจำตัวผู้สอน:</strong> {selectedResult.teacherId}</div>
            <div><strong>ตำแหน่ง:</strong> {selectedResult.position}</div>
            <div><strong>แผนกวิชา:</strong> {selectedResult.departmentName}</div>
            <div><strong>ประเภทผู้สอน:</strong> {selectedResult.category}</div>
            <div><strong>ภาระงานสอนขั้นต่ำตามเกณฑ์:</strong> {selectedResult.minTeachingHoursRequired} ชั่วโมง/สัปดาห์</div>
            <div><strong>ภาระงานหน้าที่ได้รับมอบหมาย:</strong> {selectedResult.weeklyDutyHours} ชั่วโมง/สัปดาห์</div>
            <div><strong>ชั่วโมงสอนตามตารางจริง:</strong> {selectedResult.weeklyActualTaughtHours} ชั่วโมง/สัปดาห์</div>
          </div>

          {/* Teaching Schedule Table */}
          <div className="mb-6">
            <h3 className="text-xs font-bold mb-2">ตารางรายวิชาที่จัดการเรียนการสอนจริงในรอบคำขอนี้</h3>
            <table className="w-full border-collapse border border-slate-800 text-xs">
              <thead>
                <tr className="bg-slate-100 text-center">
                  <th className="border border-slate-800 p-1.5">ที่</th>
                  <th className="border border-slate-800 p-1.5">รหัสวิชา</th>
                  <th className="border border-slate-800 p-1.5">ชื่อรายวิชา</th>
                  <th className="border border-slate-800 p-1.5">ระดับ</th>
                  <th className="border border-slate-800 p-1.5">กลุ่มเรียน</th>
                  <th className="border border-slate-800 p-1.5">วัน/เวลา</th>
                  <th className="border border-slate-800 p-1.5">ชม./สัปดาห์</th>
                  <th className="border border-slate-800 p-1.5">
                    {targetMonthItem ? `รวม ${targetMonthItem.weeksCount} สัปดาห์` : 'รวม 18 สัปดาห์'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {teacherSchedules.map((s, idx) => {
                  const weeks = targetMonthItem ? targetMonthItem.weeksCount : 18;
                  return (
                    <tr key={s.id}>
                      <td className="border border-slate-800 p-1.5 text-center">{idx + 1}</td>
                      <td className="border border-slate-800 p-1.5 font-mono">{s.subjectCode}</td>
                      <td className="border border-slate-800 p-1.5">{s.subjectName}</td>
                      <td className="border border-slate-800 p-1.5 text-center">{s.level}</td>
                      <td className="border border-slate-800 p-1.5 text-center">{s.classGroup}</td>
                      <td className="border border-slate-800 p-1.5 text-center">{s.dayOfWeek} ({s.startTime}-{s.endTime})</td>
                      <td className="border border-slate-800 p-1.5 text-center font-bold">{s.periodHours}</td>
                      <td className="border border-slate-800 p-1.5 text-center">{s.periodHours * weeks}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Calculation Summary Table */}
          <div className="mb-6 border border-slate-800 p-4 rounded-sm bg-slate-50/50">
            <h3 className="text-xs font-bold mb-2">
              สรุปการคำนวณเงินค่าสอนเกินภาระงานสอน {targetMonthItem ? `(ประจำเดือน ${targetMonthItem.monthName})` : '(ตลอดภาคเรียน 18 สัปดาห์)'}
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>• ชั่วโมงสอนจริงต่อสัปดาห์: <strong>{selectedResult.weeklyActualTaughtHours} ชม.</strong></div>
              <div>• ภาระงานสอนขั้นต่ำตามเกณฑ์: <strong>{selectedResult.minTeachingHoursRequired} ชม.</strong></div>
              <div>
                • ชั่วโมงสอนจริงในรอบคำขอนี้: <strong>{targetMonthItem ? targetMonthItem.actualHours : selectedResult.actualTeachingHours} ชม.</strong>
              </div>
              <div>
                • ภาระงานขั้นต่ำในรอบคำขอนี้: <strong>{targetMonthItem ? targetMonthItem.baseQuotaHours : selectedResult.requiredBaseTeachingHours} ชม.</strong>
              </div>
              <div>
                • ชั่วโมงเกินภาระงานในรอบคำขอนี้: <strong>{targetMonthItem ? targetMonthItem.overloadHours : selectedResult.grossOverloadHours} ชม.</strong>
              </div>
              <div>
                • ชั่วโมงที่มีสิทธิเบิกจ่าย: <strong className="text-indigo-900">{targetMonthItem ? targetMonthItem.claimableHours : selectedResult.claimableOverloadHours} ชม.</strong>
              </div>
              <div className="col-span-2 pt-2 border-t border-slate-300">
                • อัตราค่าตอบแทน: <strong>{selectedResult.applicableRateSummary}</strong>
              </div>
              <div className="col-span-2 text-sm font-bold text-slate-900 pt-1">
                • จำนวนเงินที่ขออนุมัติเบิกจ่ายในรอบนี้: <span className="underline decoration-double text-indigo-700">
                  ฿{(targetMonthItem ? targetMonthItem.totalAmount : selectedResult.totalAmount).toLocaleString()} บาท
                </span>
              </div>
            </div>
          </div>

          {/* 5-Step Official Signature Blocks (ตามระเบียบราชการไทย) */}
          <div className="pt-4 border-t border-slate-800">
            <h3 className="text-xs font-bold mb-4 text-center">การรับรองและการอนุมัติตามลำดับขั้น (5 ขั้นตอน)</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-[11px] text-center">
              {/* 1. ครูผู้สอน */}
              <div className="border border-slate-300 p-3 rounded-xs space-y-2">
                <p className="font-bold">1. ครูผู้สอน (ผู้ขอเบิก)</p>
                <p className="text-[10px]">ขอรับรองว่าได้ปฏิบัติการสอนจริงถูกต้อง</p>
                <div className="h-10 border-b border-dashed border-slate-400"></div>
                <p>({selectedResult.teacherName})</p>
                <p>ตำแหน่ง {selectedResult.position}</p>
                <p>วันที่ ...../...../ 2568</p>
              </div>

              {/* 2. หัวหน้าแผนกวิชา */}
              <div className="border border-slate-300 p-3 rounded-xs space-y-2">
                <p className="font-bold">2. หัวหน้าแผนกวิชา</p>
                <p className="text-[10px]">ได้ตรวจสอบตารางสอนและภาระงานแล้ว</p>
                <div className="h-10 border-b border-dashed border-slate-400"></div>
                <p>(........................................................)</p>
                <p>หัวหน้าแผนกวิชา{selectedResult.departmentName}</p>
                <p>วันที่ ...../...../ 2568</p>
              </div>

              {/* 3. งานพัฒนาหลักสูตร/วิชาการ */}
              <div className="border border-slate-300 p-3 rounded-xs space-y-2">
                <p className="font-bold">3. งานพัฒนาหลักสูตรการเรียนการสอน</p>
                <p className="text-[10px]">ตรวจสอบหลักเกณฑ์ 2 ระดับและคำสั่งแล้ว</p>
                <div className="h-10 border-b border-dashed border-slate-400"></div>
                <p>(........................................................)</p>
                <p>หัวหน้างานพัฒนาหลักสูตรฯ</p>
                <p>วันที่ ...../...../ 2568</p>
              </div>

              {/* 4. งานการเงิน */}
              <div className="border border-slate-300 p-3 rounded-xs space-y-2">
                <p className="font-bold">4. งานการเงิน</p>
                <p className="text-[10px]">ได้ตรวจสอบงบประมาณและสิทธิเบิกจ่าย</p>
                <div className="h-10 border-b border-dashed border-slate-400"></div>
                <p>(........................................................)</p>
                <p>หัวหน้างานการเงิน</p>
                <p>วันที่ ...../...../ 2568</p>
              </div>

              {/* 5. ผู้อำนวยการสถานศึกษา */}
              <div className="border border-slate-300 p-3 rounded-xs space-y-2 col-span-2 sm:col-span-2">
                <p className="font-bold">5. ความเห็นและคำสั่งผู้อำนวยการสถานศึกษา</p>
                <p className="text-[10px]">[ / ] อนุมัติให้เบิกจ่ายเงินได้ตามระเบียบ สอศ. พ.ศ. 2568 เป็นเงิน ฿{selectedResult.totalAmount.toLocaleString()} บาท</p>
                <div className="h-10 border-b border-dashed border-slate-400"></div>
                <p>(........................................................)</p>
                <p>ผู้อำนวยการวิทยาลัยเทคนิค / อาชีวศึกษา</p>
                <p>วันที่ ...../...../ 2568</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REPORT 2: DEPARTMENT SUMMARY */}
      {selectedReport === 'DEPARTMENT' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-1">
            รายงานสรุปค่าสอนเกินภาระงานสอนจำแนกตามแผนกวิชา ประจำภาคเรียนที่ {academicTerm}
          </h3>
          <p className="text-xs text-slate-500 mb-4">สถานศึกษาในสังกัดสำนักงานคณะกรรมการการอาชีวศึกษา</p>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-700">
                <tr>
                  <th className="py-2.5 px-3">แผนกวิชา</th>
                  <th className="py-2.5 px-3 text-center">จำนวนผู้สอน</th>
                  <th className="py-2.5 px-3 text-center">ผ่านเกณฑ์</th>
                  <th className="py-2.5 px-3 text-center">ไม่ผ่าน</th>
                  <th className="py-2.5 px-3 text-right">ชม. สอนปกติรวม</th>
                  <th className="py-2.5 px-3 text-right">ชม. เกินภาระงาน</th>
                  <th className="py-2.5 px-3 text-right">ชม. เบิกได้</th>
                  <th className="py-2.5 px-3 text-right">รวมเงิน (บาท)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {departments.map((dept) => {
                  const deptResults = calculationResults.filter(r => r.departmentName.includes(dept.name) || dept.name.includes(r.departmentName));
                  const teachersCount = deptResults.length;
                  const eligible = deptResults.filter(r => r.passedCheck && r.claimableOverloadHours > 0).length;
                  const ineligible = deptResults.filter(r => !r.passedCheck).length;
                  const base = deptResults.reduce((acc, r) => acc + r.requiredBaseTeachingHours, 0);
                  const gross = deptResults.reduce((acc, r) => acc + r.grossOverloadHours, 0);
                  const claim = deptResults.reduce((acc, r) => acc + r.claimableOverloadHours, 0);
                  const total = deptResults.reduce((acc, r) => acc + r.totalAmount, 0);

                  return (
                    <tr key={dept.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{dept.name}</td>
                      <td className="py-2.5 px-3 text-center">{teachersCount}</td>
                      <td className="py-2.5 px-3 text-center text-emerald-700 font-bold">{eligible}</td>
                      <td className="py-2.5 px-3 text-center text-rose-700">{ineligible}</td>
                      <td className="py-2.5 px-3 text-right">{base.toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-right">{gross.toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-indigo-700">{claim.toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-slate-900">฿{total.toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REPORT 3: COLLEGE SUMMARY (SUMMARY SHEET สำหรับ ผอ. และการเงิน) */}
      {selectedReport === 'COLLEGE_SUMMARY' && (
        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-xs max-w-4xl mx-auto">
          <div className="text-center space-y-1 mb-6 border-b pb-4">
            <h2 className="text-base font-bold">บันทึกข้อความสรุปการเบิกจ่ายค่าสอนเกินภาระงานสอน</h2>
            <p className="text-xs">เสนอ ผู้อำนวยการสถานศึกษาเพื่อโปรดพิจารณาอนุมัติเบิกจ่ายเงิน</p>
            <p className="text-xs font-semibold">ภาคเรียนที่ {academicTerm} (เริ่มใช้ระเบียบ สอศ. พ.ศ. 2568)</p>
          </div>

          <div className="space-y-3 text-xs text-slate-800 leading-relaxed mb-6">
            <p>
              ตามที่สถานศึกษาได้จัดการเรียนการสอน ประจำภาคเรียนที่ {academicTerm} และงานพัฒนาหลักสูตรการจัดการเรียนการสอนได้ทำการรวบรวม ตรวจสอบ และประมวลผลข้อมูลการสอนเกินภาระงานสอนของผู้สอนทุกแผนกวิชาตามระเบียบ สอศ. พ.ศ. 2568 เสร็จสิ้นแล้วนั้น
            </p>
            <p>
              ขอรายงานสรุปภาพรวมเพื่อประกอบการพิจารณาอนุมัติดังนี้:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>จำนวนผู้สอนที่มีสิทธิเบิกจ่ายทั้งสิ้น: <strong>{calculationResults.filter(r => r.passedCheck).length} คน</strong></li>
              <li>จำนวนชั่วโมงสอนเกินภาระงานที่มีสิทธิเบิกจ่ายรวม: <strong>{calculationResults.reduce((a, b) => a + b.claimableOverloadHours, 0).toLocaleString()} ชั่วโมง</strong></li>
              <li>ชั่วโมงสอน 2 ระดับ (ปวช./ปวส.) ตามข้อ 17 รวม: <strong>{calculationResults.filter(r => r.dualLevel.isDualLevel).length} รายการ</strong></li>
              <li>ชั่วโมงสอนเกินเพดานที่ไม่ได้เบิก (บันทึกสะสมผลงานตามข้อ 23): <strong>{calculationResults.reduce((a, b) => a + b.unclaimedOverloadHours, 0).toLocaleString()} ชั่วโมง</strong></li>
              <li>ยอดเงินรวมงบประมาณที่ขออนุมัติเบิกจ่ายทั้งสิ้น: <strong className="text-base text-indigo-900 underline">฿{calculationResults.reduce((a, b) => a + b.totalAmount, 0).toLocaleString()} บาท</strong></li>
            </ul>
          </div>

          <div className="pt-8 border-t border-slate-200 flex justify-end">
            <div className="text-center text-xs space-y-2">
              <p>จึงเรียนมาเพื่อโปรดพิจารณาอนุมัติ</p>
              <div className="h-12"></div>
              <p>(ลงชื่อ)........................................................</p>
              <p>รองผู้อำนวยการฝ่ายวิชาการ</p>
            </div>
          </div>
        </div>
      )}

      {/* REPORT 5: INELIGIBLE TEACHERS & REASONS */}
      {selectedReport === 'INELIGIBLE_LIST' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-1">
            รายงานผู้ไม่ผ่านเกณฑ์การเบิกจ่ายค่าสอนเกินภาระงานสอน
          </h3>
          <p className="text-xs text-slate-500 mb-4">แสดงเหตุผลประกอบเพื่อความโปร่งใสและตรวจสอบย้อนหลังได้</p>

          <div className="space-y-3">
            {calculationResults.filter(r => !r.passedCheck).map((item) => (
              <div key={item.teacherId} className="p-4 rounded-lg border border-rose-200 bg-rose-50/50 text-xs flex items-start gap-3">
                <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold text-slate-900">
                    {item.teacherName} ({item.teacherId}) - {item.departmentName}
                  </div>
                  <p className="text-slate-600">
                    ประเภท: {item.category} • ภาระงานขั้นต่ำ: {item.minTeachingHoursRequired} ชม. • สอนจริง: {item.weeklyActualTaughtHours} ชม.
                  </p>
                  <p className="text-rose-800 font-semibold mt-1">
                    เหตุผล: {item.statusReason}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* REPORT 6: UNCLAIMED HOURS CERTIFICATE (ข้อ 23) */}
      {selectedReport === 'UNCLAIMED_HOURS' && selectedResult && (
        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-xs max-w-4xl mx-auto text-xs text-slate-900 leading-relaxed font-serif">
          <div className="text-center space-y-1 mb-8 border-b pb-4">
            <h2 className="text-base font-bold">หนังสือรับรองชั่วโมงการปฏิบัติงานสอนเกินภาระงานสอนที่ไม่ได้เบิกจ่ายเงิน</h2>
            <p>ตามระเบียบสำนักงานคณะกรรมการการอาชีวศึกษา พ.ศ. 2568 (ข้อ 23)</p>
            <p>เพื่อใช้เป็นหลักฐานประกอบการประเมินวิทยฐานะและรางวัลทางวิชาชีพ</p>
          </div>

          <div className="space-y-4 mb-8">
            <p>
              หนังสือฉบับนี้ให้ไว้เพื่อรับรองว่า <strong>{selectedResult.teacherName}</strong> ตำแหน่ง <strong>{selectedResult.position}</strong> แผนกวิชา <strong>{selectedResult.departmentName}</strong>
            </p>
            <p>
              ได้ปฏิบัติหน้าที่การสอนในภาคเรียนที่ {academicTerm} มีชั่วโมงสอนจริงเฉลี่ยสัปดาห์ละ <strong>{selectedResult.weeklyActualTaughtHours}</strong> ชั่วโมง โดยมีภาระงานสอนเกินกว่าเกณฑ์ภาระงานสอนขั้นต่ำ และส่วนหนึ่งเป็นชั่วโมงสอนที่เกินกว่าเพดานอัตราการเบิกจ่ายที่ระเบียบกำหนด ซึ่งมิได้รับเงินค่าตอบแทนจำนวน <strong>{selectedResult.unclaimedOverloadHours}</strong> ชั่วโมง (ตลอดภาคเรียน 18 สัปดาห์)
            </p>
            <p>
              สถานศึกษาจึงออกหนังสือรับรองฉบับนี้ไว้เพื่อเป็นหลักฐานแสดงความทุ่มเทในการปฏิบัติงานสอน และสะสมเป็นผลงานทางวิชาการตามระเบียบ สอศ. พ.ศ. 2568 ข้อ 23 ต่อไป
            </p>
          </div>

          <div className="pt-12 flex justify-end text-center">
            <div className="space-y-2">
              <p>ให้ไว้ ณ วันที่ ..... เดือน .................... พ.ศ. 2568</p>
              <div className="h-12"></div>
              <p>(........................................................)</p>
              <p>ผู้อำนวยการวิทยาลัย</p>
            </div>
          </div>
        </div>
      )}

      {/* REPORT 7: SUBSTITUTE TEACHING REPORT */}
      {selectedReport === 'SUBSTITUTE_REPORT' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-1">
            รายงานสรุปการสอนแทนและการสอนชดเชยที่มีผลต่อภาระงาน
          </h3>
          <p className="text-xs text-slate-500 mb-4">แสดงสถิติการสอนแทน ผู้ได้รับชั่วโมงเพิ่ม และเลขที่คำสั่งอนุมัติ</p>

          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-700">
              <tr>
                <th className="py-2.5 px-3">วันที่สอนแทน</th>
                <th className="py-2.5 px-3">วิชา</th>
                <th className="py-2.5 px-3">ผู้สอนเดิม (หักออก)</th>
                <th className="py-2.5 px-3">ผู้สอนแทน (ได้เพิ่ม)</th>
                <th className="py-2.5 px-3 text-center">ชั่วโมง</th>
                <th className="py-2.5 px-3">เลขที่คำสั่งอนุมัติ</th>
                <th className="py-2.5 px-3 text-center">สถานะ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {substitutes.map(s => {
                const orig = teachers.find(t => t.id === s.originalTeacherId);
                const sub = teachers.find(t => t.id === s.substituteTeacherId);
                return (
                  <tr key={s.id}>
                    <td className="py-2.5 px-3">{s.actualTaughtDate}</td>
                    <td className="py-2.5 px-3">{s.subjectCode} {s.subjectName}</td>
                    <td className="py-2.5 px-3 text-rose-700">{orig?.firstName} {orig?.lastName}</td>
                    <td className="py-2.5 px-3 text-emerald-700 font-bold">{sub?.firstName} {sub?.lastName}</td>
                    <td className="py-2.5 px-3 text-center font-bold">{s.hours}</td>
                    <td className="py-2.5 px-3">{s.orderNumber || 'ยังไม่มีคำสั่ง'}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${s.verified ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                        {s.verified ? 'รับรองแล้ว' : 'รอตรวจสอบ'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* REPORT 8: FINANCE DISBURSEMENT REPORT */}
      {selectedReport === 'FINANCE_DISBURSE' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-1">
            รายงานบัญชีรายละเอียดการโอนเงินค่าสอนเกินภาระงานสอนสำหรับงานการเงิน
          </h3>
          <p className="text-xs text-slate-500 mb-4">ประกอบฎีกาเบิกเงินประจำภาคเรียนที่ {academicTerm}</p>

          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-700">
              <tr>
                <th className="py-2.5 px-3">ที่</th>
                <th className="py-2.5 px-3">ชื่อ-สกุล ผู้สอน</th>
                <th className="py-2.5 px-3">แผนกวิชา</th>
                <th className="py-2.5 px-3 text-center">ชั่วโมงเบิกได้</th>
                <th className="py-2.5 px-3 text-right">จำนวนเงินสุทธิ (บาท)</th>
                <th className="py-2.5 px-3 text-center">สถานะการจ่าย</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {calculationResults.filter(r => r.passedCheck && r.claimableOverloadHours > 0).map((r, idx) => (
                <tr key={r.teacherId} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 text-center">{idx + 1}</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-900">{r.teacherName}</td>
                  <td className="py-2.5 px-3 text-slate-600">{r.departmentName}</td>
                  <td className="py-2.5 px-3 text-center font-bold text-slate-800">{r.claimableOverloadHours} ชม.</td>
                  <td className="py-2.5 px-3 text-right font-bold text-indigo-700">฿{r.totalAmount.toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                      พร้อมเบิกจ่าย
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100 font-bold text-slate-900">
                <td colSpan={4} className="py-3 px-3 text-right">ยอดรวมเงินงบประมาณทั้งสิ้น:</td>
                <td className="py-3 px-3 text-right text-sm text-indigo-900">
                  ฿{calculationResults.reduce((acc, r) => acc + r.totalAmount, 0).toLocaleString()}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      {/* REPORT 4: WEEKLY DETAIL */}
      {selectedReport === 'WEEKLY_DETAIL' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-1">
            รายงานการจัดการเรียนการสอนรายสัปดาห์ (18 สัปดาห์)
          </h3>
          <p className="text-xs text-slate-500 mb-4">แสดงยอดชั่วโมงสอนเฉลี่ยต่อสัปดาห์และผลคูณภาคเรียน</p>

          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-700">
              <tr>
                <th className="py-2.5 px-3">ผู้สอน</th>
                <th className="py-2.5 px-3">แผนกวิชา</th>
                <th className="py-2.5 px-3 text-center">สัปดาห์ที่ 1-18 (ชม./สัปดาห์)</th>
                <th className="py-2.5 px-3 text-center">รวม 18 สัปดาห์</th>
                <th className="py-2.5 px-3 text-center">เกณฑ์ปกติ</th>
                <th className="py-2.5 px-3 text-right">ชั่วโมงเกินภาระงาน</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {calculationResults.map(r => (
                <tr key={r.teacherId}>
                  <td className="py-2.5 px-3 font-semibold text-slate-900">{r.teacherName}</td>
                  <td className="py-2.5 px-3 text-slate-600">{r.departmentName}</td>
                  <td className="py-2.5 px-3 text-center font-bold text-slate-700">{r.weeklyActualTaughtHours} ชม.</td>
                  <td className="py-2.5 px-3 text-center">{r.weeklyActualTaughtHours * 18} ชม.</td>
                  <td className="py-2.5 px-3 text-center">{r.minTeachingHoursRequired * 18} ชม.</td>
                  <td className="py-2.5 px-3 text-right font-bold text-indigo-700">{r.grossOverloadHours} ชม.</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
