import React, { useState } from 'react';
import { DutyItem, TeachingRecord, Teacher } from '../types';
import { 
  Briefcase, 
  BookOpen, 
  Plus, 
  Calendar, 
  CheckCircle2, 
  Search, 
  Trash2, 
  X,
  FileText
} from 'lucide-react';

interface DutiesAndRecordsProps {
  duties: DutyItem[];
  teachingRecords: TeachingRecord[];
  teachers: Teacher[];
  onAddDuty: (duty: DutyItem) => void;
  onDeleteDuty: (id: string) => void;
  onAddTeachingRecord: (record: TeachingRecord) => void;
}

export const DutiesAndRecords: React.FC<DutiesAndRecordsProps> = ({
  duties,
  teachingRecords,
  teachers,
  onAddDuty,
  onDeleteDuty,
  onAddTeachingRecord
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'DUTIES' | 'RECORDS'>('DUTIES');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDutyModalOpen, setIsAddDutyModalOpen] = useState(false);
  const [isAddRecordModalOpen, setIsAddRecordModalOpen] = useState(false);

  // Duty Form state
  const [dutyForm, setDutyForm] = useState({
    teacherId: teachers[0]?.id || 'T0001',
    dutyType: 'หัวหน้าแผนกวิชา' as DutyItem['dutyType'],
    title: 'หัวหน้าแผนกวิชาช่างยนต์',
    orderNumber: 'วศ.แต่งตั้ง 101/2568',
    approvedHoursPerWeek: 6,
    startDate: '2026-11-01',
    endDate: '2027-03-31'
  });

  // Record Form state
  const [recordForm, setRecordForm] = useState({
    teacherId: teachers[0]?.id || 'T0001',
    academicTerm: '2/2568',
    weekNumber: 1,
    recordedDate: '2026-11-03',
    subjectCode: '20101-2001',
    level: 'ปวช.' as const,
    scheduledHours: 4,
    actualTaughtHours: 4,
    substituteGivenHours: 0,
    substituteTakenHours: 0,
    compensatoryHours: 0,
    status: 'COMPLETED' as const
  });

  const handleSaveDuty = (e: React.FormEvent) => {
    e.preventDefault();
    const newDuty: DutyItem = {
      id: `DUTY${Date.now()}`,
      teacherId: dutyForm.teacherId || teachers[0]?.id || 'T0001',
      dutyType: dutyForm.dutyType,
      title: dutyForm.title || '',
      orderNumber: dutyForm.orderNumber || '',
      approvedHoursPerWeek: Number(dutyForm.approvedHoursPerWeek) || 4,
      startDate: dutyForm.startDate,
      endDate: dutyForm.endDate,
      status: 'ACTIVE'
    };
    onAddDuty(newDuty);
    setIsAddDutyModalOpen(false);
  };

  const handleSaveRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const newRec: TeachingRecord = {
      id: `REC${Date.now()}`,
      teacherId: recordForm.teacherId || teachers[0]?.id || 'T0001',
      academicTerm: recordForm.academicTerm,
      weekNumber: Number(recordForm.weekNumber) || 1,
      recordedDate: recordForm.recordedDate,
      subjectCode: recordForm.subjectCode,
      level: recordForm.level,
      scheduledHours: Number(recordForm.scheduledHours) || 4,
      actualTaughtHours: Number(recordForm.actualTaughtHours) || 4,
      substituteGivenHours: Number(recordForm.substituteGivenHours) || 0,
      substituteTakenHours: Number(recordForm.substituteTakenHours) || 0,
      compensatoryHours: Number(recordForm.compensatoryHours) || 0,
      status: recordForm.status
    };
    onAddTeachingRecord(newRec);
    setIsAddRecordModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header & Subtabs */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <Briefcase className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              หน้าที่ที่ได้รับมอบหมาย & บันทึกการสอนจริง (Duties & Teaching Records)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            บันทึกภาระงานหน้าที่พิเศษ (หัวหน้าแผนก/หัวหน้างาน) และการบันทึกการสอนจริง 18 สัปดาห์
          </p>
        </div>

        {/* Subtabs and Add buttons */}
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveSubTab('DUTIES')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                activeSubTab === 'DUTIES' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              หน้าที่พิเศษตามคำสั่ง ({duties.length})
            </button>
            <button
              onClick={() => setActiveSubTab('RECORDS')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                activeSubTab === 'RECORDS' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              บันทึกการสอนรายสัปดาห์ ({teachingRecords.length})
            </button>
          </div>

          {activeSubTab === 'DUTIES' ? (
            <button
              onClick={() => setIsAddDutyModalOpen(true)}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>เพิ่มหน้าที่</span>
            </button>
          ) : (
            <button
              onClick={() => setIsAddRecordModalOpen(true)}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>เพิ่มบันทึกสอน</span>
            </button>
          )}
        </div>
      </div>

      {/* SUBTAB 1: DUTIES TABLE */}
      {activeSubTab === 'DUTIES' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-700">
                <tr>
                  <th className="py-3 px-3.5">ผู้สอน</th>
                  <th className="py-3 px-3.5">ประเภทหน้าที่</th>
                  <th className="py-3 px-3.5">ชื่อตำแหน่ง / คำสั่งแต่งตั้ง</th>
                  <th className="py-3 px-3.5">เลขที่คำสั่ง</th>
                  <th className="py-3 px-3.5 text-center">เทียบชั่วโมงภาระงาน</th>
                  <th className="py-3 px-3.5 text-center">ระยะเวลาคำสั่ง</th>
                  <th className="py-3 px-3.5 text-right">การจัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {duties.map((d) => {
                  const teacher = teachers.find(t => t.id === d.teacherId);
                  return (
                    <tr key={d.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3.5 font-medium text-slate-900">
                        {teacher ? `${teacher.prefix}${teacher.firstName} ${teacher.lastName}` : d.teacherId}
                        <span className="block text-[10px] text-slate-400 font-normal">{teacher?.departmentName}</span>
                      </td>
                      <td className="py-3 px-3.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                          {d.dutyType}
                        </span>
                      </td>
                      <td className="py-3 px-3.5 text-slate-800 font-medium">{d.title}</td>
                      <td className="py-3 px-3.5 text-slate-600 font-mono text-[11px]">{d.orderNumber}</td>
                      <td className="py-3 px-3.5 text-center font-bold text-indigo-700">
                        {d.approvedHoursPerWeek} ชม./สัปดาห์
                      </td>
                      <td className="py-3 px-3.5 text-center text-slate-500 text-[11px]">
                        {d.startDate} ถึง {d.endDate}
                      </td>
                      <td className="py-3 px-3.5 text-right">
                        <button
                          onClick={() => onDeleteDuty(d.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded-md cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 2: TEACHING RECORDS TABLE */}
      {activeSubTab === 'RECORDS' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-700">
                <tr>
                  <th className="py-3 px-3.5 text-center">สัปดาห์ที่</th>
                  <th className="py-3 px-3.5">วันที่บันทึก</th>
                  <th className="py-3 px-3.5">ผู้สอน</th>
                  <th className="py-3 px-3.5">รหัสวิชา</th>
                  <th className="py-3 px-3.5 text-center">ระดับ</th>
                  <th className="py-3 px-3.5 text-center">ชั่วโมงตามแผน</th>
                  <th className="py-3 px-3.5 text-center">สอนจริง</th>
                  <th className="py-3 px-3.5 text-center">สอนแทน (+)</th>
                  <th className="py-3 px-3.5 text-center">ลา/ขาด (-)</th>
                  <th className="py-3 px-3.5 text-center">สถานะ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {teachingRecords.map((r) => {
                  const teacher = teachers.find(t => t.id === r.teacherId);
                  return (
                    <tr key={r.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3.5 font-bold text-slate-800 text-center">
                        <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 inline-flex items-center justify-center text-[10px]">
                          {r.weekNumber}
                        </span>
                      </td>
                      <td className="py-3 px-3.5 text-slate-600">{r.recordedDate}</td>
                      <td className="py-3 px-3.5 font-medium text-slate-900">
                        {teacher ? `${teacher.prefix}${teacher.firstName} ${teacher.lastName}` : r.teacherId}
                      </td>
                      <td className="py-3 px-3.5 font-mono text-indigo-600 font-medium">
                        {r.subjectCode}
                      </td>
                      <td className="py-3 px-3.5 text-center font-semibold">{r.level}</td>
                      <td className="py-3 px-3.5 text-center text-slate-600">{r.scheduledHours}</td>
                      <td className="py-3 px-3.5 text-center font-bold text-emerald-700">{r.actualTaughtHours}</td>
                      <td className="py-3 px-3.5 text-center text-emerald-600 font-medium">+{r.substituteGivenHours}</td>
                      <td className="py-3 px-3.5 text-center text-rose-600 font-medium">-{r.substituteTakenHours}</td>
                      <td className="py-3 px-3.5 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Duty Modal */}
      {isAddDutyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h3 className="font-bold text-sm text-slate-900">เพิ่มหน้าที่ที่ได้รับมอบหมายตามคำสั่ง</h3>
              <button onClick={() => setIsAddDutyModalOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSaveDuty} className="space-y-3.5">
              <div>
                <label className="block text-slate-600 font-medium mb-1">ผู้สอน</label>
                <select
                  value={dutyForm.teacherId}
                  onChange={e => setDutyForm({ ...dutyForm, teacherId: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
                >
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.prefix}{t.firstName} {t.lastName} ({t.departmentName})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">ประเภทหน้าที่</label>
                <select
                  value={dutyForm.dutyType}
                  onChange={e => setDutyForm({ ...dutyForm, dutyType: e.target.value as any })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
                >
                  <option value="หัวหน้าแผนกวิชา">หัวหน้าแผนกวิชา (ลดเกณฑ์สอนเหลือ 12 ชม.)</option>
                  <option value="หัวหน้างาน">หัวหน้างาน (ลดเกณฑ์สอนเหลือ 14 ชม.)</option>
                  <option value="หัวหน้าธุรการ">หัวหน้าธุรการ</option>
                  <option value="หน้าที่พิเศษตามคำสั่ง">หน้าที่พิเศษตามคำสั่ง</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">ชื่อหน้าที่ / ตำแหน่ง</label>
                <input
                  type="text"
                  required
                  placeholder="เช่น หัวหน้างานพัฒนาหลักสูตรการเรียนการสอน"
                  value={dutyForm.title}
                  onChange={e => setDutyForm({ ...dutyForm, title: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">เลขที่คำสั่งแต่งตั้ง</label>
                  <input
                    type="text"
                    required
                    placeholder="เช่น วศ. 12/2568"
                    value={dutyForm.orderNumber}
                    onChange={e => setDutyForm({ ...dutyForm, orderNumber: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">เทียบชั่วโมง (ชม./สัปดาห์)</label>
                  <input
                    type="number"
                    required
                    value={dutyForm.approvedHoursPerWeek}
                    onChange={e => setDutyForm({ ...dutyForm, approvedHoursPerWeek: Number(e.target.value) })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 font-bold text-indigo-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">วันที่เริ่มต้น</label>
                  <input
                    type="date"
                    value={dutyForm.startDate}
                    onChange={e => setDutyForm({ ...dutyForm, startDate: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">วันที่สิ้นสุด</label>
                  <input
                    type="date"
                    value={dutyForm.endDate}
                    onChange={e => setDutyForm({ ...dutyForm, endDate: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddDutyModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-xs cursor-pointer"
                >
                  บันทึกหน้าที่
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Record Modal */}
      {isAddRecordModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h3 className="font-bold text-sm text-slate-900">บันทึกการสอนจริงรายสัปดาห์</h3>
              <button onClick={() => setIsAddRecordModalOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSaveRecord} className="space-y-3.5">
              <div>
                <label className="block text-slate-600 font-medium mb-1">ผู้สอน</label>
                <select
                  value={recordForm.teacherId}
                  onChange={e => setRecordForm({ ...recordForm, teacherId: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
                >
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.prefix}{t.firstName} {t.lastName}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">สัปดาห์ที่ (1-18)</label>
                  <input
                    type="number"
                    min={1}
                    max={18}
                    required
                    value={recordForm.weekNumber}
                    onChange={e => setRecordForm({ ...recordForm, weekNumber: Number(e.target.value) })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">วันที่สอน</label>
                  <input
                    type="date"
                    required
                    value={recordForm.recordedDate}
                    onChange={e => setRecordForm({ ...recordForm, recordedDate: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">รหัสวิชา</label>
                  <input
                    type="text"
                    required
                    value={recordForm.subjectCode}
                    onChange={e => setRecordForm({ ...recordForm, subjectCode: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">ระดับ</label>
                  <select
                    value={recordForm.level}
                    onChange={e => setRecordForm({ ...recordForm, level: e.target.value as any })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
                  >
                    <option value="ปวช.">ปวช.</option>
                    <option value="ปวส.">ปวส.</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">ชั่วโมงตามตาราง</label>
                  <input
                    type="number"
                    value={recordForm.scheduledHours}
                    onChange={e => setRecordForm({ ...recordForm, scheduledHours: Number(e.target.value) })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">ชั่วโมงสอนจริง</label>
                  <input
                    type="number"
                    value={recordForm.actualTaughtHours}
                    onChange={e => setRecordForm({ ...recordForm, actualTaughtHours: Number(e.target.value) })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 font-bold"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddRecordModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-xs cursor-pointer"
                >
                  บันทึกข้อมูล
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
