import React, { useState } from 'react';
import { SubstituteRecord, Teacher, EducationLevel } from '../types';
import { 
  Clock, 
  Plus, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Filter, 
  Trash2,
  X
} from 'lucide-react';

interface SubstituteTeachingProps {
  substitutes: SubstituteRecord[];
  teachers: Teacher[];
  onAddSubstitute: (sub: SubstituteRecord) => void;
  onDeleteSubstitute: (id: string) => void;
  onVerifySubstitute: (id: string, verified: boolean) => void;
}

export const SubstituteTeaching: React.FC<SubstituteTeachingProps> = ({
  substitutes,
  teachers,
  onAddSubstitute,
  onDeleteSubstitute,
  onVerifySubstitute
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterReason, setFilterReason] = useState('ALL');
  const [filterVerified, setFilterVerified] = useState<'ALL' | 'VERIFIED' | 'UNVERIFIED'>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState<Partial<SubstituteRecord>>({
    academicTerm: '2/2568',
    originalDate: '2026-11-20',
    originalTime: '08:30 - 12:30',
    subjectCode: '20101-2001',
    subjectName: 'งานเครื่องยนต์แก๊สโซลีน',
    level: 'ปวช.',
    hours: 4,
    reason: 'ไปราชการ',
    originalTeacherId: teachers[0]?.id || 'T0001',
    substituteTeacherId: teachers[1]?.id || 'T0002',
    actualTaughtDate: '2026-11-20',
    orderNumber: 'วศ.สอนแทน 60/2568',
    documentRef: 'แนบคำสั่งไปราชการและบันทึกขออนุญาต',
    verified: true,
    notes: 'ทำการสอนแทนตามแผนการสอน'
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: SubstituteRecord = {
      id: `SUB${Date.now()}`,
      academicTerm: formData.academicTerm || '2/2568',
      originalDate: formData.originalDate || '',
      originalTime: formData.originalTime || '',
      subjectCode: formData.subjectCode || '',
      subjectName: formData.subjectName || '',
      level: formData.level as EducationLevel || 'ปวช.',
      hours: Number(formData.hours) || 2,
      reason: formData.reason as any || 'ไปราชการ',
      originalTeacherId: formData.originalTeacherId || '',
      substituteTeacherId: formData.substituteTeacherId || '',
      actualTaughtDate: formData.actualTaughtDate || '',
      orderNumber: formData.orderNumber || '',
      documentRef: formData.documentRef || '',
      verified: Boolean(formData.orderNumber && formData.orderNumber.trim() !== ''),
      notes: formData.notes || ''
    };

    onAddSubstitute(newRecord);
    setIsModalOpen(false);
  };

  const filtered = substitutes.filter(s => {
    const orig = teachers.find(t => t.id === s.originalTeacherId);
    const sub = teachers.find(t => t.id === s.substituteTeacherId);
    const searchString = `${s.subjectCode} ${s.subjectName} ${orig?.firstName || ''} ${sub?.firstName || ''} ${s.orderNumber}`.toLowerCase();
    const matchesSearch = searchString.includes(searchTerm.toLowerCase());
    const matchesReason = filterReason === 'ALL' || s.reason === filterReason;
    const matchesVerified = 
      filterVerified === 'ALL' || 
      (filterVerified === 'VERIFIED' && s.verified) || 
      (filterVerified === 'UNVERIFIED' && !s.verified);

    return matchesSearch && matchesReason && matchesVerified;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <Clock className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              การสอนแทนและการสอนชดเชย (Substitute / Compensatory Teaching)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            ตามระเบียบ สอศ. พ.ศ. 2568 (ข้อ 21–22) ต้องมีคำสั่งหรือบันทึกอนุมัติทางการ จึงจะนำมานับเป็นภาระงานสอนเพื่อเบิกจ่ายได้
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>บันทึกการสอนแทน / ชดเชย</span>
        </button>
      </div>

      {/* Info card on regulation rule */}
      <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">เงื่อนไขตามระเบียบข้อ 22:</span>
          <p className="mt-0.5 leading-relaxed text-slate-700">
            1) ผู้สอนแทนจะได้รับชั่วโมงสอนเพิ่มเพื่อนำไปคำนวณค่าสอนเกินภาระงานสอน
            <br />
            2) ผู้สอนเดิมที่ติดภารกิจ/ลา จะถูกหักชั่วโมงสอนออก เว้นแต่จะทำการสอนชดเชยครบถ้วนตามหลักเกณฑ์
            <br />
            3) รายการที่ยังไม่มีเลขที่คำสั่งอนุมัติจากผู้มีอำนาจ ระบบจะแจ้งเตือนเป็น Anomaly และยังไม่นับชั่วโมงให้จนกว่าจะตรวจสอบผ่าน
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="ค้นหาวิชา ผู้สอน หรือเลขที่คำสั่ง..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div>
          <select
            aria-label="สาเหตุการสอนแทน"
            value={filterReason}
            onChange={(e) => setFilterReason(e.target.value)}
            className="w-full py-1.5 px-3 rounded-lg border border-slate-200 text-xs bg-white text-slate-700"
          >
            <option value="ALL">ทุกสาเหตุ</option>
            <option value="ไปราชการ">ไปราชการ</option>
            <option value="ลาป่วย">ลาป่วย</option>
            <option value="ลากิจ">ลากิจ</option>
            <option value="กิจกรรมสถานศึกษา">กิจกรรมสถานศึกษา</option>
          </select>
        </div>

        <div>
          <select
            aria-label="สถานะการรับรอง"
            value={filterVerified}
            onChange={(e) => setFilterVerified(e.target.value as any)}
            className="w-full py-1.5 px-3 rounded-lg border border-slate-200 text-xs bg-white text-slate-700"
          >
            <option value="ALL">สถานะทั้งหมด</option>
            <option value="VERIFIED">ตรวจสอบและมีคำสั่งแล้ว</option>
            <option value="UNVERIFIED">รอตรวจสอบ / ยังไม่มีคำสั่ง</option>
          </select>
        </div>
      </div>

      {/* Table (Prompt Section 12) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
              <tr>
                <th className="py-3 px-3.5">วันที่สอนเดิม</th>
                <th className="py-3 px-3.5">รายวิชา / ระดับ</th>
                <th className="py-3 px-3.5">ผู้สอนเดิม (ลา/ราชการ)</th>
                <th className="py-3 px-3.5">ผู้สอนแทน (+ชั่วโมง)</th>
                <th className="py-3 px-3.5 text-center">ชั่วโมง</th>
                <th className="py-3 px-3.5">สาเหตุ</th>
                <th className="py-3 px-3.5">เลขที่คำสั่ง / เอกสารอ้างอิง</th>
                <th className="py-3 px-3.5 text-center">สถานะ</th>
                <th className="py-3 px-3.5 text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => {
                const orig = teachers.find(t => t.id === item.originalTeacherId);
                const sub = teachers.find(t => t.id === item.substituteTeacherId);
                return (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3.5 text-slate-800 font-medium">
                      {item.originalDate}
                      <span className="block text-[10px] text-slate-400 font-normal">{item.originalTime}</span>
                    </td>
                    <td className="py-3 px-3.5">
                      <div className="font-semibold text-slate-900">{item.subjectCode}</div>
                      <div className="text-[11px] text-slate-500">{item.subjectName} ({item.level})</div>
                    </td>
                    <td className="py-3 px-3.5 text-rose-700 font-medium">
                      {orig ? `${orig.prefix}${orig.firstName} ${orig.lastName}` : item.originalTeacherId}
                      <span className="block text-[10px] text-slate-400">หักชั่วโมงออก</span>
                    </td>
                    <td className="py-3 px-3.5 text-emerald-700 font-medium">
                      {sub ? `${sub.prefix}${sub.firstName} ${sub.lastName}` : item.substituteTeacherId}
                      <span className="block text-[10px] text-emerald-600 font-bold">+ {item.hours} ชม.</span>
                    </td>
                    <td className="py-3 px-3.5 text-center font-bold text-slate-800">
                      {item.hours} ชม.
                    </td>
                    <td className="py-3 px-3.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-700">
                        {item.reason}
                      </span>
                    </td>
                    <td className="py-3 px-3.5 text-slate-700">
                      {item.orderNumber ? (
                        <div className="font-medium text-slate-900">{item.orderNumber}</div>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                          <AlertTriangle className="w-3 h-3" />
                          <span>ยังไม่มีคำสั่งอนุมัติ</span>
                        </span>
                      )}
                      <div className="text-[10px] text-slate-400 line-clamp-1">{item.documentRef}</div>
                    </td>
                    <td className="py-3 px-3.5 text-center">
                      {item.verified ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>รับรองแล้ว</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700">
                          <XCircle className="w-3 h-3" />
                          <span>รอตรวจสอบ</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onVerifySubstitute(item.id, !item.verified)}
                          className={`px-2 py-1 rounded-md text-[10px] font-semibold transition-colors ${
                            item.verified 
                              ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' 
                              : 'bg-emerald-600 text-white hover:bg-emerald-700'
                          }`}
                        >
                          {item.verified ? 'ยกเลิกรับรอง' : 'กดรับรอง'}
                        </button>
                        <button
                          onClick={() => onDeleteSubstitute(item.id)}
                          className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-slate-100"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h3 className="font-bold text-sm text-slate-900">บันทึกการสอนแทน / สอนชดเชย</h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">ผู้สอนเดิม (ผู้ติดภารกิจ/ลา)</label>
                  <select
                    value={formData.originalTeacherId}
                    onChange={e => setFormData({ ...formData, originalTeacherId: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
                  >
                    {teachers.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.prefix}{t.firstName} {t.lastName} ({t.departmentName})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">ผู้สอนแทน (ผู้ปฏิบัติการสอนจริง)</label>
                  <select
                    value={formData.substituteTeacherId}
                    onChange={e => setFormData({ ...formData, substituteTeacherId: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-medium text-emerald-700"
                  >
                    {teachers.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.prefix}{t.firstName} {t.lastName} ({t.departmentName})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">วันที่สอนเดิม</label>
                  <input
                    type="date"
                    required
                    value={formData.originalDate}
                    onChange={e => setFormData({ ...formData, originalDate: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">วันที่สอนแทนจริง</label>
                  <input
                    type="date"
                    required
                    value={formData.actualTaughtDate}
                    onChange={e => setFormData({ ...formData, actualTaughtDate: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">จำนวนชั่วโมง</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    required
                    value={formData.hours}
                    onChange={e => setFormData({ ...formData, hours: Number(e.target.value) })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">รหัสวิชา</label>
                  <input
                    type="text"
                    required
                    placeholder="เช่น 20101-2001"
                    value={formData.subjectCode}
                    onChange={e => setFormData({ ...formData, subjectCode: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">ระดับ</label>
                  <select
                    value={formData.level}
                    onChange={e => setFormData({ ...formData, level: e.target.value as EducationLevel })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
                  >
                    <option value="ปวช.">ปวช.</option>
                    <option value="ปวส.">ปวส.</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">สาเหตุ</label>
                  <select
                    value={formData.reason}
                    onChange={e => setFormData({ ...formData, reason: e.target.value as any })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
                  >
                    <option value="ไปราชการ">ไปราชการ</option>
                    <option value="ลาป่วย">ลาป่วย</option>
                    <option value="ลากิจ">ลากิจ</option>
                    <option value="ฝึกอบรม">ฝึกอบรม</option>
                    <option value="กิจกรรมสถานศึกษา">กิจกรรมสถานศึกษา</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">เลขที่คำสั่ง / บันทึกข้อความอนุมัติ</label>
                <input
                  type="text"
                  placeholder="เช่น วศ.สอนแทน 45/2568 (หากเว้นว่าง ระบบจะแจ้งเตือน Anomaly)"
                  value={formData.orderNumber}
                  onChange={e => setFormData({ ...formData, orderNumber: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">หมายเหตุ / เอกสารแนบ</label>
                <input
                  type="text"
                  placeholder="เช่น แนบสำเนาใบขออนุญาตไปราชการ"
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-xs"
                >
                  บันทึกรายการ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
