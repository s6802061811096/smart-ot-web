import React, { useState } from 'react';
import { Teacher, TeacherCategory, EducationLevel, Department, User } from '../types';
import { 
  UserPlus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  GraduationCap, 
  Briefcase, 
  Phone,
  CheckCircle,
  X,
  Lock,
  User as UserIcon,
  Mail,
  Award,
  BookOpen
} from 'lucide-react';

interface TeacherManagementProps {
  teachers: Teacher[];
  departments: Department[];
  currentUser?: User;
  onAddTeacher: (teacher: Teacher) => void;
  onUpdateTeacher: (teacher: Teacher) => void;
  onDeleteTeacher: (id: string) => void;
}

export const TeacherManagement: React.FC<TeacherManagementProps> = ({
  teachers,
  departments,
  currentUser,
  onAddTeacher,
  onUpdateTeacher,
  onDeleteTeacher
}) => {
  const isTeacherSelfView = currentUser?.role === 'TEACHER';
  const myTeacher = isTeacherSelfView 
    ? (teachers.find(t => t.id === currentUser?.teacherId) || 
       teachers.find(t => currentUser?.name?.includes(t.firstName)) || 
       teachers[0])
    : null;
  const myTeacherId = myTeacher?.id || currentUser?.teacherId || 'T0001';
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

  // Form states
  const [formData, setFormData] = useState<Partial<Teacher>>({
    id: '',
    prefix: 'นาย',
    firstName: '',
    lastName: '',
    position: 'ครู',
    departmentId: departments[0]?.id || 'DEP01',
    category: 'สอนอย่างเดียว',
    teachingLevels: ['ปวช.'],
    baseTeachingQuotaHours: 18,
    baseDutyQuotaHours: 0,
    status: 'ปฏิบัติงาน',
    salary: 25000,
    phone: ''
  });

  const handleOpenAdd = () => {
    const nextId = `T${String(teachers.length + 1).padStart(4, '0')}`;
    setEditingTeacher(null);
    setFormData({
      id: nextId,
      prefix: 'นาย',
      firstName: '',
      lastName: '',
      position: 'ครู',
      departmentId: departments[0]?.id || 'DEP01',
      category: 'สอนอย่างเดียว',
      teachingLevels: ['ปวช.'],
      baseTeachingQuotaHours: 18,
      baseDutyQuotaHours: 0,
      status: 'ปฏิบัติงาน',
      salary: 25000,
      phone: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (t: Teacher) => {
    if (isTeacherSelfView && t.id !== myTeacherId) return;
    setEditingTeacher(t);
    setFormData({ ...t });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const dept = departments.find(d => d.id === formData.departmentId);
    const updatedTeacher: Teacher = {
      id: isTeacherSelfView ? myTeacherId : (formData.id || `T${Date.now()}`),
      prefix: formData.prefix || 'นาย',
      firstName: formData.firstName || '',
      lastName: formData.lastName || '',
      position: formData.position || 'ครู',
      academicStanding: formData.academicStanding || 'ครู',
      departmentId: formData.departmentId || 'DEP01',
      departmentName: dept?.name || formData.departmentName || 'แผนกวิชา',
      category: formData.category as TeacherCategory || 'สอนอย่างเดียว',
      teachingLevels: (formData.teachingLevels && formData.teachingLevels.length > 0) ? formData.teachingLevels : ['ปวช.'],
      baseTeachingQuotaHours: Number(formData.baseTeachingQuotaHours) || 18,
      baseDutyQuotaHours: Number(formData.baseDutyQuotaHours) || 0,
      assignedDutyTitle: formData.assignedDutyTitle || '',
      assignedDutyOrderNo: formData.assignedDutyOrderNo || '',
      status: formData.status as any || 'ปฏิบัติงาน',
      salary: Number(formData.salary) || 20000,
      phone: formData.phone || ''
    };

    if (editingTeacher || isTeacherSelfView) {
      onUpdateTeacher(updatedTeacher);
    } else {
      onAddTeacher(updatedTeacher);
    }
    setIsModalOpen(false);
  };

  const handleCategoryChange = (cat: TeacherCategory) => {
    let baseTeaching = 18;
    let baseDuty = 0;

    if (cat === 'สอน + หัวหน้าแผนกวิชา') {
      baseTeaching = 12;
      baseDuty = 6;
    } else if (cat === 'สอน + หัวหน้างาน' || cat === 'สอน + หัวหน้าธุรการ/หน้าที่อื่น') {
      baseTeaching = 14;
      baseDuty = 4;
    } else if (cat === 'รองผู้อำนวยการ') {
      baseTeaching = 6;
      baseDuty = 20;
    } else if (cat === 'ผู้อำนวยการ') {
      baseTeaching = 4;
      baseDuty = 25;
    }

    setFormData(prev => ({
      ...prev,
      category: cat,
      baseTeachingQuotaHours: baseTeaching,
      baseDutyQuotaHours: baseDuty
    }));
  };

  // หากเป็นครูผู้สอน (TEACHER): แสดงผลเฉพาะข้อมูลโปรไฟล์ของตนเอง และแก้ไขได้เฉพาะของตนเองเท่านั้น
  if (isTeacherSelfView && myTeacher) {
    return (
      <div className="space-y-6">
        {/* Security & Access Banner */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-emerald-900">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm block text-emerald-950">
                ระบบรักษาความปลอดภัยและการจำกัดสิทธิ์ข้อมูลส่วนบุคคล (PDPA & Role Access Control)
              </span>
              <span className="text-emerald-800">
                ท่านเข้าสู่ระบบในบทบาท <strong>ครูผู้สอน ({currentUser?.name})</strong> จึงสามารถดูและแก้ไขเฉพาะข้อมูลโปรไฟล์ของตนเองเท่านั้น
              </span>
            </div>
          </div>
          <button
            onClick={() => handleOpenEdit(myTeacher)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg shadow-xs transition-colors shrink-0 cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>แก้ไขข้อมูลส่วนตัว</span>
          </button>
        </div>

        {/* Teacher Profile Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-sky-600 p-6 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-xs border-2 border-white/40 flex items-center justify-center font-bold text-2xl text-white shadow-inner">
                {myTeacher.firstName[0]}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-bold tracking-tight">
                    {myTeacher.prefix}{myTeacher.firstName} {myTeacher.lastName}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 text-white border border-white/30">
                    รหัส {myTeacher.id}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500 text-white">
                    {myTeacher.status}
                  </span>
                </div>
                <p className="text-indigo-100 text-xs mt-1">
                  {myTeacher.position} • วิทยฐานะ: {myTeacher.academicStanding || 'ครู'} • {myTeacher.departmentName}
                </p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xs rounded-lg px-4 py-2 text-right border border-white/20">
              <span className="text-[11px] text-indigo-100 block">สังกัดแผนกวิชา</span>
              <span className="text-sm font-bold text-white">{myTeacher.departmentName}</span>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Box 1: กฎ & ภาระงานสอนตามระเบียบ 2568 */}
            <div className="border border-slate-200 rounded-xl p-4.5 bg-slate-50/50 space-y-3">
              <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs border-b border-slate-200 pb-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <span>เกณฑ์ภาระงานสอน (ระเบียบ สอศ. 2568)</span>
              </div>
              <div className="space-y-2 text-xs text-slate-700">
                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span className="text-slate-500">ประเภทผู้สอน:</span>
                  <span className="font-semibold text-slate-900 bg-indigo-50 px-2 py-0.5 rounded-md text-indigo-700">
                    {myTeacher.category}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span className="text-slate-500">ภาระงานสอนขั้นต่ำ:</span>
                  <span className="font-bold text-indigo-700 text-sm">
                    {myTeacher.baseTeachingQuotaHours} ชม./สัปดาห์
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span className="text-slate-500">ภาระหน้าที่พิเศษขั้นต่ำ:</span>
                  <span className="font-semibold text-slate-800">
                    {myTeacher.baseDutyQuotaHours} ชม./สัปดาห์
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-500">ระดับที่ได้รับมอบหมายสอน:</span>
                  <div className="flex gap-1">
                    {myTeacher.teachingLevels.map(lvl => (
                      <span key={lvl} className="px-2 py-0.5 rounded-sm bg-blue-100 text-blue-800 font-semibold text-[10px]">
                        {lvl}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Box 2: ข้อมูลหน้าที่พิเศษ & ตำแหน่ง */}
            <div className="border border-slate-200 rounded-xl p-4.5 bg-slate-50/50 space-y-3">
              <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs border-b border-slate-200 pb-2">
                <Award className="w-4 h-4 text-indigo-600" />
                <span>หน้าที่พิเศษ & วิทยฐานะ</span>
              </div>
              <div className="space-y-2 text-xs text-slate-700">
                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span className="text-slate-500">ตำแหน่งปัจจุบัน:</span>
                  <span className="font-semibold text-slate-900">{myTeacher.position}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span className="text-slate-500">วิทยฐานะ:</span>
                  <span className="font-semibold text-slate-900">{myTeacher.academicStanding || 'ครู'}</span>
                </div>
                <div className="py-1 border-b border-slate-100">
                  <span className="text-slate-500 block mb-0.5">หน้าที่พิเศษที่ได้รับแต่งตั้ง:</span>
                  <span className="font-medium text-slate-900">
                    {myTeacher.assignedDutyTitle || 'ไม่มีหน้าที่พิเศษ'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-500">คำสั่งแต่งตั้งเลขที่:</span>
                  <span className="font-mono text-slate-700">{myTeacher.assignedDutyOrderNo || '-'}</span>
                </div>
              </div>
            </div>

            {/* Box 3: ข้อมูลติดต่อ & การเงิน */}
            <div className="border border-slate-200 rounded-xl p-4.5 bg-slate-50/50 space-y-3">
              <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs border-b border-slate-200 pb-2">
                <UserIcon className="w-4 h-4 text-indigo-600" />
                <span>ข้อมูลติดต่อ & บัญชีเงินเดือน</span>
              </div>
              <div className="space-y-2 text-xs text-slate-700">
                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    เบอร์โทรศัพท์:
                  </span>
                  <span className="font-semibold text-slate-900">{myTeacher.phone || 'ยังไม่ได้ระบุ'}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    อีเมลติดต่อ:
                  </span>
                  <span className="font-medium text-slate-900">{currentUser?.email || 'user@vec.go.th'}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span className="text-slate-500">อัตราเงินเดือน:</span>
                  <span className="font-bold text-slate-800">฿{myTeacher.salary.toLocaleString()} บาท</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-500">สถานะสิทธิ์การเบิก:</span>
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    พร้อมคำนวณเบิกจ่าย
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Modal (Self edit) */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in duration-150">
              <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-emerald-600" />
                  <span>แก้ไขข้อมูลโปรไฟล์ของตนเอง</span>
                </h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200/50"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-5 space-y-4 text-xs">
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">คำนำหน้า</label>
                    <input 
                      type="text" 
                      value={formData.prefix || ''} 
                      onChange={e => setFormData({ ...formData, prefix: e.target.value })}
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">ชื่อ</label>
                    <input 
                      type="text" 
                      value={formData.firstName || ''} 
                      onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">นามสกุล</label>
                    <input 
                      type="text" 
                      value={formData.lastName || ''} 
                      onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">ตำแหน่ง</label>
                    <input 
                      type="text" 
                      value={formData.position || ''} 
                      onChange={e => setFormData({ ...formData, position: e.target.value })}
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">วิทยฐานะ</label>
                    <input 
                      type="text" 
                      value={formData.academicStanding || ''} 
                      onChange={e => setFormData({ ...formData, academicStanding: e.target.value })}
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">เบอร์โทรศัพท์ติดต่อ</label>
                    <input 
                      type="tel" 
                      placeholder="08X-XXX-XXXX"
                      value={formData.phone || ''} 
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">เงินเดือน (บาท)</label>
                    <input 
                      type="number" 
                      value={formData.salary || 0} 
                      onChange={e => setFormData({ ...formData, salary: Number(e.target.value) })}
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-semibold text-xs cursor-pointer"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-xs shadow-xs cursor-pointer"
                  >
                    บันทึกข้อมูลส่วนตัว
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  const filteredTeachers = teachers.filter(t => {
    const fullName = `${t.prefix}${t.firstName} ${t.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) || t.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = deptFilter === 'ALL' || t.departmentId === deptFilter;
    const matchesCat = categoryFilter === 'ALL' || t.category === categoryFilter;
    return matchesSearch && matchesDept && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">การจัดการข้อมูลผู้สอน (Teachers)</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            รวบรวมข้อมูลผู้สอน ตำแหน่ง ประเภทตามเกณฑ์ระเบียบ สอศ. พ.ศ. 2568 และภาระงานขั้นต่ำ
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>เพิ่มผู้สอนใหม่</span>
        </button>
      </div>

      {/* Filter Row */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="ค้นหารหัส หรือชื่อผู้สอน..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div>
          <select
            aria-label="กรองตามแผนกวิชา"
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="w-full py-1.5 px-3 rounded-lg border border-slate-200 text-xs bg-white text-slate-700"
          >
            <option value="ALL">ทุกแผนกวิชา</option>
            {departments.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>

        <div>
          <select
            aria-label="กรองตามประเภทผู้สอน"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full py-1.5 px-3 rounded-lg border border-slate-200 text-xs bg-white text-slate-700"
          >
            <option value="ALL">ทุกประเภทผู้สอน</option>
            <option value="สอนอย่างเดียว">สอนอย่างเดียว</option>
            <option value="สอน + หัวหน้าแผนกวิชา">สอน + หัวหน้าแผนกวิชา</option>
            <option value="สอน + หัวหน้างาน">สอน + หัวหน้างาน</option>
            <option value="รองผู้อำนวยการ">รองผู้อำนวยการ</option>
          </select>
        </div>
      </div>

      {/* Teachers Table (Matching Prompt Section 7) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
              <tr>
                <th className="py-3 px-3.5">TeacherID</th>
                <th className="py-3 px-3.5">ชื่อ-สกุล</th>
                <th className="py-3 px-3.5">ตำแหน่ง / วิทยฐานะ</th>
                <th className="py-3 px-3.5">ระดับที่สอน</th>
                <th className="py-3 px-3.5">แผนกวิชา</th>
                <th className="py-3 px-3.5">ประเภทผู้สอนตามระเบียบ</th>
                <th className="py-3 px-3.5 text-center">เกณฑ์สอน (ชม.)</th>
                <th className="py-3 px-3.5 text-center">สถานะ</th>
                <th className="py-3 px-3.5 text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTeachers.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3.5 font-bold text-slate-800">{t.id}</td>
                  <td className="py-3 px-3.5 font-medium text-slate-900">
                    {t.prefix}{t.firstName} {t.lastName}
                    {t.assignedDutyTitle && (
                      <span className="block text-[10px] text-indigo-600 font-normal">
                        ({t.assignedDutyTitle})
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3.5 text-slate-600">{t.position}</td>
                  <td className="py-3 px-3.5">
                    <div className="flex gap-1 flex-wrap">
                      {t.teachingLevels.map(lvl => (
                        <span 
                          key={lvl} 
                          className={`px-1.5 py-0.2 rounded-sm text-[10px] font-semibold ${
                            lvl === 'ปวช.' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'
                          }`}
                        >
                          {lvl}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-3.5 text-slate-600">{t.departmentName}</td>
                  <td className="py-3 px-3.5">
                    <span className="inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-800">
                      {t.category}
                    </span>
                  </td>
                  <td className="py-3 px-3.5 text-center font-semibold text-slate-800">
                    {t.baseTeachingQuotaHours}
                  </td>
                  <td className="py-3 px-3.5 text-center">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700">
                      <CheckCircle className="w-3 h-3" />
                      {t.status}
                    </span>
                  </td>
                  <td className="py-3 px-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(t)}
                        className="p-1 rounded-md text-slate-500 hover:text-indigo-600 hover:bg-slate-100"
                        title="แก้ไข"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`คุณต้องการลบผู้สอน ${t.prefix}${t.firstName} ${t.lastName} หรือไม่?`)) {
                            onDeleteTeacher(t.id);
                          }
                        }}
                        className="p-1 rounded-md text-slate-500 hover:text-rose-600 hover:bg-slate-100"
                        title="ลบ"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4">
              <h3 className="font-bold text-base text-slate-900">
                {editingTeacher ? 'แก้ไขข้อมูลผู้สอน' : 'เพิ่มข้อมูลผู้สอนใหม่'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">รหัสผู้สอน (ID)</label>
                  <input
                    type="text"
                    required
                    value={formData.id}
                    onChange={e => setFormData({ ...formData, id: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">คำนำหน้า</label>
                  <select
                    value={formData.prefix}
                    onChange={e => setFormData({ ...formData, prefix: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
                  >
                    <option value="นาย">นาย</option>
                    <option value="นาง">นาง</option>
                    <option value="นางสาว">นางสาว</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">ตำแหน่ง</label>
                  <select
                    value={formData.position}
                    onChange={e => setFormData({ ...formData, position: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
                  >
                    <option value="ครูผู้ช่วย">ครูผู้ช่วย</option>
                    <option value="ครู">ครู</option>
                    <option value="ครูชำนาญการ">ครูชำนาญการ</option>
                    <option value="ครูชำนาญการพิเศษ">ครูชำนาญการพิเศษ</option>
                    <option value="รองผู้อำนวยการ">รองผู้อำนวยการ</option>
                    <option value="ผู้อำนวยการ">ผู้อำนวยการ</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">ชื่อ</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">นามสกุล</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">แผนกวิชา</label>
                  <select
                    value={formData.departmentId}
                    onChange={e => setFormData({ ...formData, departmentId: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
                  >
                    {departments.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">ประเภทตามระเบียบ</label>
                  <select
                    value={formData.category}
                    onChange={e => handleCategoryChange(e.target.value as TeacherCategory)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-medium text-indigo-700"
                  >
                    <option value="สอนอย่างเดียว">สอนอย่างเดียว (เกณฑ์ 18 ชม.)</option>
                    <option value="สอน + หัวหน้าแผนกวิชา">สอน + หัวหน้าแผนกวิชา (เกณฑ์ 12 ชม.)</option>
                    <option value="สอน + หัวหน้างาน">สอน + หัวหน้างาน (เกณฑ์ 14 ชม.)</option>
                    <option value="สอน + หัวหน้าธุรการ/หน้าที่อื่น">สอน + หัวหน้าธุรการ (เกณฑ์ 14 ชม.)</option>
                    <option value="รองผู้อำนวยการ">รองผู้อำนวยการ (เกณฑ์ 6 ชม.)</option>
                    <option value="ผู้อำนวยการ">ผู้อำนวยการ (เกณฑ์ 4 ชม.)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">ภาระงานสอนขั้นต่ำ (ชม./สัปดาห์)</label>
                  <input
                    type="number"
                    value={formData.baseTeachingQuotaHours}
                    onChange={e => setFormData({ ...formData, baseTeachingQuotaHours: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">ภาระงานหน้าที่ขั้นต่ำ (ชม./สัปดาห์)</label>
                  <input
                    type="number"
                    value={formData.baseDutyQuotaHours}
                    onChange={e => setFormData({ ...formData, baseDutyQuotaHours: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-xs"
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
