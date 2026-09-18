import React, { useState } from 'react';
import { ScheduleItem, Teacher, EducationLevel } from '../types';
import { 
  Calendar, 
  Clock, 
  Upload, 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  Check, 
  Download,
  AlertCircle,
  X
} from 'lucide-react';

interface ScheduleManagementProps {
  schedules: ScheduleItem[];
  teachers: Teacher[];
  onAddSchedule: (schedule: ScheduleItem) => void;
  onDeleteSchedule: (id: string) => void;
  onImportSchedules?: (newSchedules: ScheduleItem[]) => void;
}

export const ScheduleManagement: React.FC<ScheduleManagementProps> = ({
  schedules,
  teachers,
  onAddSchedule,
  onDeleteSchedule,
  onImportSchedules
}) => {
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('ALL');
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [selectedDay, setSelectedDay] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'LIST' | 'TIMETABLE'>('LIST');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Partial<ScheduleItem>>({
    teacherId: teachers[0]?.id || 'T0001',
    dayOfWeek: 'จันทร์',
    startTime: '08:30',
    endTime: '12:30',
    subjectCode: '',
    subjectName: '',
    level: 'ปวช.',
    classGroup: '',
    room: '',
    periodHours: 4,
    isOnlineApproved: false,
    academicTerm: '2/2568'
  });

  const days: ('จันทร์' | 'อังคาร' | 'พุธ' | 'พฤหัสบดี' | 'ศุกร์' | 'เสาร์' | 'อาทิตย์')[] = [
    'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์', 'อาทิตย์'
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newSchedule: ScheduleItem = {
      id: `S${Date.now()}`,
      teacherId: formData.teacherId || teachers[0]?.id || 'T0001',
      dayOfWeek: formData.dayOfWeek || 'จันทร์',
      startTime: formData.startTime || '08:30',
      endTime: formData.endTime || '12:30',
      subjectCode: formData.subjectCode || '20000-0000',
      subjectName: formData.subjectName || 'วิชาใหม่',
      level: formData.level as EducationLevel || 'ปวช.',
      classGroup: formData.classGroup || 'กลุ่ม 1',
      room: formData.room || 'ห้องเรียน',
      periodHours: Number(formData.periodHours) || 4,
      isOnlineApproved: Boolean(formData.isOnlineApproved),
      academicTerm: '2/2568'
    };
    onAddSchedule(newSchedule);
    setIsAddModalOpen(false);
  };

  const handleSimulateImport = () => {
    if (onImportSchedules) {
      // Mock importing 2 new schedule items from CSV
      const sampleImport: ScheduleItem[] = [
        {
          id: `S-IMP-${Date.now()}-1`,
          teacherId: teachers[0]?.id || 'T0001',
          dayOfWeek: 'ศุกร์',
          startTime: '08:30',
          endTime: '11:30',
          subjectCode: '20101-2010',
          subjectName: 'งานเครื่องมือกลเบื้องต้น (นำเข้าจาก Excel)',
          level: 'ปวช.',
          classGroup: 'ชย.1/1',
          room: 'โรงฝึกงาน 1',
          periodHours: 3,
          isOnlineApproved: false,
          academicTerm: '2/2568'
        }
      ];
      onImportSchedules(sampleImport);
      alert('นำเข้าตารางสอนจากไฟล์จำลองเรียบร้อยแล้ว (เพิ่ม 1 รายการ)');
      setIsImportModalOpen(false);
    }
  };

  const filteredSchedules = schedules.filter(s => {
    const matchesTeacher = selectedTeacherId === 'ALL' || s.teacherId === selectedTeacherId;
    const matchesLevel = selectedLevel === 'ALL' || s.level === selectedLevel;
    const matchesDay = selectedDay === 'ALL' || s.dayOfWeek === selectedDay;
    return matchesTeacher && matchesLevel && matchesDay;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Action Controls */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Calendar className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              การจัดการตารางสอน (Teaching Schedule)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            รองรับการกรอกข้อมูลในระบบ การนำเข้าจาก Excel/CSV และการคำนวณชั่วโมงตามระดับ ปวช./ปวส.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('LIST')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                viewMode === 'LIST' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              มุมมองตารางรายการ
            </button>
            <button
              onClick={() => setViewMode('TIMETABLE')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                viewMode === 'TIMETABLE' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              มุมมองผังตารางสอน
            </button>
          </div>

          <button
            onClick={() => setIsImportModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>นำเข้า Excel/CSV</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>เพิ่มตารางสอน</span>
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 mb-1">เลือกผู้สอน</label>
          <select
            aria-label="เลือกผู้สอน"
            value={selectedTeacherId}
            onChange={(e) => setSelectedTeacherId(e.target.value)}
            className="w-full py-1.5 px-3 rounded-lg border border-slate-200 text-xs bg-white text-slate-700 font-medium"
          >
            <option value="ALL">ผู้สอนทุกคน ({schedules.length} คาบ/วิชา)</option>
            {teachers.map(t => (
              <option key={t.id} value={t.id}>
                {t.id}: {t.prefix}{t.firstName} {t.lastName} ({t.departmentName})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-500 mb-1">ระดับการศึกษา</label>
          <select
            aria-label="ระดับการศึกษา"
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="w-full py-1.5 px-3 rounded-lg border border-slate-200 text-xs bg-white text-slate-700"
          >
            <option value="ALL">ทุกระดับ (ปวช. และ ปวส.)</option>
            <option value="ปวช.">เฉพาะระดับ ปวช.</option>
            <option value="ปวส.">เฉพาะระดับ ปวส.</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-500 mb-1">วันในสัปดาห์</label>
          <select
            aria-label="วันในสัปดาห์"
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            className="w-full py-1.5 px-3 rounded-lg border border-slate-200 text-xs bg-white text-slate-700"
          >
            <option value="ALL">ทุกวัน (จันทร์-ศุกร์/เสาร์)</option>
            {days.map(d => (
              <option key={d} value={d}>วัน{d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main View: List Mode (Prompt Section 8 Table) */}
      {viewMode === 'LIST' ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <tr>
                  <th className="py-3 px-3.5">วัน</th>
                  <th className="py-3 px-3.5">เวลา</th>
                  <th className="py-3 px-3.5">รหัสวิชา</th>
                  <th className="py-3 px-3.5">ชื่อรายวิชา</th>
                  <th className="py-3 px-3.5 text-center">ระดับ</th>
                  <th className="py-3 px-3.5">กลุ่มเรียน</th>
                  <th className="py-3 px-3.5">ห้องเรียน</th>
                  <th className="py-3 px-3.5 text-center">จำนวนชั่วโมง</th>
                  <th className="py-3 px-3.5">ผู้สอน</th>
                  <th className="py-3 px-3.5 text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSchedules.map((s) => {
                  const teacher = teachers.find(t => t.id === s.teacherId);
                  return (
                    <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3.5 font-bold text-slate-800">{s.dayOfWeek}</td>
                      <td className="py-3 px-3.5 text-slate-600 font-mono text-[11px]">{s.startTime} - {s.endTime}</td>
                      <td className="py-3 px-3.5 font-mono text-indigo-600 font-semibold">{s.subjectCode}</td>
                      <td className="py-3 px-3.5 font-medium text-slate-900">
                        {s.subjectName}
                        {s.isOnlineApproved && (
                          <span className="ml-1.5 px-1.5 py-0.2 rounded-sm text-[10px] bg-sky-100 text-sky-800 font-normal">
                            ออนไลน์อนุมัติ
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3.5 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          s.level === 'ปวช.' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'
                        }`}>
                          {s.level}
                        </span>
                      </td>
                      <td className="py-3 px-3.5 text-slate-600">{s.classGroup}</td>
                      <td className="py-3 px-3.5 text-slate-600">{s.room}</td>
                      <td className="py-3 px-3.5 text-center font-bold text-slate-800">{s.periodHours} ชม.</td>
                      <td className="py-3 px-3.5 text-slate-700">
                        {teacher ? `${teacher.prefix}${teacher.firstName} ${teacher.lastName}` : s.teacherId}
                      </td>
                      <td className="py-3 px-3.5 text-right">
                        <button
                          onClick={() => onDeleteSchedule(s.id)}
                          className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-slate-100"
                          title="ลบ"
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
      ) : (
        /* Timetable Grid View */
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 overflow-x-auto">
          <div className="space-y-4 min-w-[700px]">
            {days.map((day) => {
              const daySchedules = filteredSchedules.filter(s => s.dayOfWeek === day);
              if (daySchedules.length === 0 && selectedDay !== 'ALL') return null;

              return (
                <div key={day} className="border border-slate-200 rounded-lg p-3 bg-slate-50/50">
                  <div className="font-bold text-xs text-slate-800 mb-2.5 flex items-center justify-between">
                    <span className="bg-slate-200 text-slate-800 px-2.5 py-0.5 rounded-md">วัน{day}</span>
                    <span className="text-[11px] text-slate-500 font-normal">
                      รวม {daySchedules.reduce((sum, s) => sum + s.periodHours, 0)} ชั่วโมง
                    </span>
                  </div>

                  {daySchedules.length === 0 ? (
                    <div className="text-xs text-slate-400 italic py-2 pl-2">ไม่มีการเรียนการสอนในวันนี้</div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                      {daySchedules.map((item) => {
                        const teacher = teachers.find(t => t.id === item.teacherId);
                        return (
                          <div 
                            key={item.id} 
                            className={`p-3 rounded-lg border text-xs bg-white ${
                              item.level === 'ปวช.' ? 'border-blue-200' : 'border-purple-200'
                            }`}
                          >
                            <div className="flex items-center justify-between font-mono text-[11px] text-slate-500 mb-1">
                              <span>{item.startTime} - {item.endTime}</span>
                              <span className={`px-1.5 py-0.2 rounded-xs font-bold text-[10px] ${
                                item.level === 'ปวช.' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'
                              }`}>
                                {item.level} ({item.periodHours} ชม.)
                              </span>
                            </div>
                            <div className="font-semibold text-slate-900">{item.subjectCode}</div>
                            <div className="text-slate-700 line-clamp-1">{item.subjectName}</div>
                            <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                              <span>{item.classGroup} • {item.room}</span>
                              <span className="font-medium text-slate-700">
                                {teacher ? `${teacher.prefix}${teacher.firstName}` : ''}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Schedule Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4">
              <h3 className="font-bold text-base text-slate-900">เพิ่มรายการตารางสอน</h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">ผู้สอน</label>
                <select
                  value={formData.teacherId}
                  onChange={e => setFormData({ ...formData, teacherId: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
                >
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.id}: {t.prefix}{t.firstName} {t.lastName} ({t.departmentName})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">วันในสัปดาห์</label>
                  <select
                    value={formData.dayOfWeek}
                    onChange={e => setFormData({ ...formData, dayOfWeek: e.target.value as any })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
                  >
                    {days.map(d => (
                      <option key={d} value={d}>วัน{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">เวลาเริ่ม</label>
                  <input
                    type="time"
                    required
                    value={formData.startTime}
                    onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">เวลาสิ้นสุด</label>
                  <input
                    type="time"
                    required
                    value={formData.endTime}
                    onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">รหัสวิชา</label>
                  <input
                    type="text"
                    required
                    placeholder="เช่น 20101-2001"
                    value={formData.subjectCode}
                    onChange={e => setFormData({ ...formData, subjectCode: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">ระดับ</label>
                  <select
                    value={formData.level}
                    onChange={e => setFormData({ ...formData, level: e.target.value as EducationLevel })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-semibold"
                  >
                    <option value="ปวช.">ปวช.</option>
                    <option value="ปวส.">ปวส.</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">ชื่อรายวิชา</label>
                <input
                  type="text"
                  required
                  placeholder="เช่น งานเครื่องยนต์แก๊สโซลีน"
                  value={formData.subjectName}
                  onChange={e => setFormData({ ...formData, subjectName: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">กลุ่มเรียน</label>
                  <input
                    type="text"
                    required
                    placeholder="เช่น ชย.1/1"
                    value={formData.classGroup}
                    onChange={e => setFormData({ ...formData, classGroup: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">ห้องเรียน</label>
                  <input
                    type="text"
                    required
                    placeholder="เช่น อาคาร 101"
                    value={formData.room}
                    onChange={e => setFormData({ ...formData, room: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">จำนวนชั่วโมง (ชม.)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={12}
                    value={formData.periodHours}
                    onChange={e => setFormData({ ...formData, periodHours: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 font-bold"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="onlineApproved"
                  checked={formData.isOnlineApproved}
                  onChange={e => setFormData({ ...formData, isOnlineApproved: e.target.checked })}
                  className="rounded border-slate-300 text-indigo-600"
                />
                <label htmlFor="onlineApproved" className="text-slate-700">
                  การสอนในรูปแบบออนไลน์ที่ได้รับอนุมัติจากสถานศึกษา (ข้อ 21)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-xs"
                >
                  บันทึกตารางสอน
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Upload className="w-4 h-4 text-indigo-600" />
                <span>นำเข้าตารางสอนจาก Excel / CSV</span>
              </h3>
              <button onClick={() => setIsImportModalOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <p className="text-slate-600 mb-3 leading-relaxed">
              รองรับไฟล์ตารางสอนจากระบบงานวิชาการ (RMS / ศธ.02) หัวตารางมาตรฐาน: วัน, เวลา, รหัสวิชา, ชื่อรายวิชา, ระดับ, กลุ่มเรียน, ห้องเรียน, จำนวนชั่วโมง, ผู้สอน
            </p>

            <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center bg-slate-50/50 mb-4">
              <Upload className="w-8 h-8 mx-auto text-slate-400 mb-2" />
              <p className="font-semibold text-slate-700">ลากไฟล์มาวางที่นี่ หรือคลิกเพื่อเลือกไฟล์</p>
              <p className="text-[10px] text-slate-400 mt-1">ไฟล์ .xlsx, .xls หรือ .csv</p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <span className="text-[11px] text-slate-500">มีไฟล์ตัวอย่างตารางสอน สอศ.</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600"
                >
                  ปิด
                </button>
                <button
                  type="button"
                  onClick={handleSimulateImport}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-xs"
                >
                  ทดลองนำเข้าข้อมูลตัวอย่าง
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
