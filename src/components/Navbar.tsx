import React from 'react';
import { User, UserRole } from '../types';
import { 
  GraduationCap, 
  ShieldCheck, 
  UserCheck, 
  BookOpen, 
  FileCheck2, 
  DollarSign, 
  Clock, 
  Calendar,
  AlertTriangle
} from 'lucide-react';

interface NavbarProps {
  currentUser: User;
  users: User[];
  onSelectUser: (user: User) => void;
  academicTerm: string;
  onSelectTerm: (term: string) => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  anomalyCount: number;
  pendingApprovalCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  users,
  onSelectUser,
  academicTerm,
  onSelectTerm,
  activeTab,
  onSelectTab,
  anomalyCount,
  pendingApprovalCount,
}) => {
  const roleBadgeColor: Record<UserRole, string> = {
    ADMIN: 'bg-red-100 text-red-800 border-red-200',
    ACADEMIC: 'bg-purple-100 text-purple-800 border-purple-200',
    HEAD: 'bg-blue-100 text-blue-800 border-blue-200',
    TEACHER: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    FINANCE: 'bg-amber-100 text-amber-800 border-amber-200',
  };

  const roleLabels: Record<UserRole, string> = {
    ADMIN: 'ผู้ดูแลระบบ (ADMIN)',
    ACADEMIC: 'งานวิชาการ (ACADEMIC)',
    HEAD: 'หัวหน้าแผนก (HEAD)',
    TEACHER: 'ครูผู้สอน (TEACHER)',
    FINANCE: 'งานการเงิน (FINANCE)',
  };

  const navItems = [
    { id: 'dashboard', label: 'ภาพรวมระบบ', icon: GraduationCap },
    { id: 'calculation', label: 'คำนวณสิทธิ์ & 2 ระดับ', icon: Clock, badge: null },
    { id: 'teachers', label: 'ข้อมูลผู้สอน', icon: UserCheck },
    { id: 'schedule', label: 'ตารางสอน', icon: Calendar },
    { id: 'duties', label: 'หน้าที่ & บันทึกสอน', icon: BookOpen },
    { id: 'substitute', label: 'สอนแทน / ชดเชย', icon: Clock },
    { id: 'anomalies', label: 'ตรวจสอบความผิดปกติ', icon: AlertTriangle, badge: anomalyCount > 0 ? anomalyCount : null, badgeColor: 'bg-rose-500' },
    { id: 'approval', label: 'Workflow อนุมัติ', icon: FileCheck2, badge: pendingApprovalCount > 0 ? pendingApprovalCount : null, badgeColor: 'bg-amber-500' },
    { id: 'reports', label: 'รายงาน & เอกสารเบิกจ่าย', icon: DollarSign },
    { id: 'rules', label: 'กฎ & อัตรา (Rules/Rates)', icon: ShieldCheck },
    { id: 'gas', label: 'Google Sheets & GAS', icon: BookOpen },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs no-print">
      {/* Top Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-700 via-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-indigo-100 font-bold text-xl tracking-wider">
              OT
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">SMART OT TEACHING</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
                  ระเบียบ สอศ. พ.ศ. 2568
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                ระบบคำนวณ ตรวจสอบ และจัดทำข้อมูลประกอบการเบิกจ่ายค่าสอนเกินภาระงานสอน
              </p>
            </div>
          </div>

          {/* Right Controls: Academic Term + Role Switcher */}
          <div className="flex items-center gap-3">
            {/* Term Selector */}
            <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200">
              <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="text-xs font-medium text-slate-600 hidden sm:inline">ภาคเรียน:</span>
              <select 
                aria-label="เลือกภาคเรียน"
                value={academicTerm}
                onChange={(e) => onSelectTerm(e.target.value)}
                className="text-xs font-bold text-slate-800 bg-transparent outline-none cursor-pointer"
              >
                <option value="2/2568">ภาคเรียน 2/2568 (พ.ย. 68 - มี.ค. 69)</option>
                <option value="1/2569">ภาคเรียน 1/2569 (พ.ค. 69 - ก.ย. 69)</option>
                <option value="2/2569">ภาคเรียน 2/2569 (พ.ย. 69 - มี.ค. 70)</option>
                <option value="1/2570">ภาคเรียน 1/2570 (พ.ค. 70 - ก.ย. 70)</option>
                <option value="2/2570">ภาคเรียน 2/2570 (พ.ย. 70 - มี.ค. 71)</option>
              </select>
            </div>

            {/* Quick User/Role Switcher Dropdown */}
            <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
              <div className="text-right hidden sm:block pl-2">
                <p className="text-xs font-semibold text-slate-800 leading-tight">{currentUser.name}</p>
                <p className="text-[10px] text-slate-500">{currentUser.position}</p>
              </div>

              <select
                aria-label="สลับบทบาทผู้ใช้งาน"
                value={currentUser.id}
                onChange={(e) => {
                  const targetUser = users.find(u => u.id === e.target.value);
                  if (targetUser) onSelectUser(targetUser);
                }}
                className={`text-xs font-medium px-2.5 py-1.5 rounded-lg border cursor-pointer outline-none transition-colors ${roleBadgeColor[currentUser.role]}`}
              >
                {users.map(u => (
                  <option key={u.id} value={u.id}>
                    [{u.role}] {u.name} - {u.position}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="border-t border-slate-100 bg-slate-50/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 overflow-x-auto py-2 scrollbar-none">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/80'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                  {item.badge !== null && item.badge !== undefined && (
                    <span className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold text-white ${item.badgeColor || 'bg-slate-500'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
