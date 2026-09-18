import React from 'react';
import { 
  OTCalculationResult, 
  AnomalyItem, 
  Department, 
  User 
} from '../types';
import { 
  Users, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  TrendingUp, 
  DollarSign, 
  AlertTriangle, 
  FileCheck,
  ChevronRight,
  Sparkles,
  Layers,
  ArrowUpRight
} from 'lucide-react';

interface DashboardProps {
  calculationResults: OTCalculationResult[];
  anomalies: AnomalyItem[];
  departments: Department[];
  currentUser: User;
  onNavigate: (tabId: string) => void;
  academicTerm: string;
}

export const Dashboard: React.FC<DashboardProps> = ({
  calculationResults,
  anomalies,
  departments,
  currentUser,
  onNavigate,
  academicTerm
}) => {
  // Aggregate KPIs
  const totalTeachers = calculationResults.length;
  const eligibleTeachers = calculationResults.filter(r => r.passedCheck && r.claimableOverloadHours > 0).length;
  const ineligibleTeachers = calculationResults.filter(r => !r.passedCheck).length;
  
  const totalBaseHours = calculationResults.reduce((acc, r) => acc + r.requiredBaseTeachingHours, 0);
  const totalGrossOverloadHours = calculationResults.reduce((acc, r) => acc + r.grossOverloadHours, 0);
  const totalClaimableHours = calculationResults.reduce((acc, r) => acc + r.claimableOverloadHours, 0);
  const totalUnclaimedHours = calculationResults.reduce((acc, r) => acc + r.unclaimedOverloadHours, 0);
  const totalAmount = calculationResults.reduce((acc, r) => acc + r.totalAmount, 0);

  const pendingApprovals = calculationResults.filter(r => 
    ['SUBMITTED', 'HEAD_ENDORSED', 'ACADEMIC_VERIFIED'].includes(r.approvalStatus)
  ).length;

  const dualLevelCount = calculationResults.filter(r => r.dualLevel.isDualLevel).length;

  return (
    <div className="space-y-6">
      {/* Welcome & Regulation Context Card */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>ระเบียบ สอศ. พ.ศ. 2568 (มีผลบังคับใช้ภาคเรียนที่ {academicTerm} เป็นต้นไป)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
            ระบบคำนวณและตรวจสอบค่าสอนเกินภาระงานสอน
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            ยินดีต้อนรับคุณ <span className="font-semibold text-white">{currentUser.name}</span> ({currentUser.position}) 
            ระบบกำลังประมวลผลข้อมูลผู้สอน ตารางสอน และการเทียบหน่วยชั่วโมง 2 ระดับตามหลักเกณฑ์ของระเบียบ สอศ. ฉบับล่าสุด
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button 
              onClick={() => onNavigate('calculation')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
            >
              <span>ตรวจสอบผลการคำนวณสิทธิ์</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button 
              onClick={() => onNavigate('reports')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl border border-white/20 backdrop-blur-xs transition-colors"
            >
              <span>จัดทำรายงานเบิกจ่าย</span>
            </button>
            <button 
              onClick={() => onNavigate('gas')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 text-xs font-semibold rounded-xl border border-emerald-400/30 transition-colors"
            >
              <span>ดูโครงสร้าง 14 Google Sheets</span>
            </button>
          </div>
        </div>

        {/* Decorative Background Glow */}
        <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-indigo-600/30 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 8 Primary KPI Cards (Matching prompt Section 6) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* 1. จำนวนผู้สอนทั้งหมด */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">ผู้สอนทั้งหมด</span>
            <div className="p-2 rounded-lg bg-slate-100 text-slate-700">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{totalTeachers}</div>
          <p className="text-[11px] text-slate-500 mt-1">ใน {departments.length} แผนกวิชา</p>
        </div>

        {/* 2. จำนวนผู้สอนที่มีสิทธิเบิก */}
        <div className="bg-white p-4 rounded-xl border border-emerald-200/80 shadow-xs hover:border-emerald-300 transition-all bg-emerald-50/20">
          <div className="flex items-center justify-between text-emerald-700 mb-2">
            <span className="text-xs font-medium">มีสิทธิเบิกจ่าย</span>
            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-900">{eligibleTeachers}</div>
          <p className="text-[11px] text-emerald-700 mt-1">
            คิดเป็น {totalTeachers > 0 ? Math.round((eligibleTeachers / totalTeachers) * 100) : 0}% ของผู้สอน
          </p>
        </div>

        {/* 3. ผู้สอนที่ไม่ผ่านเงื่อนไข */}
        <div className="bg-white p-4 rounded-xl border border-rose-200/80 shadow-xs hover:border-rose-300 transition-all bg-rose-50/20">
          <div className="flex items-center justify-between text-rose-700 mb-2">
            <span className="text-xs font-medium">ไม่ผ่านเงื่อนไข</span>
            <div className="p-2 rounded-lg bg-rose-100 text-rose-700">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-rose-900">{ineligibleTeachers}</div>
          <p className="text-[11px] text-rose-600 mt-1">ชั่วโมงสอนไม่ถึงเกณฑ์ขั้นต่ำ</p>
        </div>

        {/* 4. ชั่วโมงสอนปกติ */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">ชั่วโมงสอนปกติ</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-700">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{totalBaseHours.toLocaleString()}</div>
          <p className="text-[11px] text-slate-500 mt-1">ชั่วโมง (รวม 18 สัปดาห์)</p>
        </div>

        {/* 5. ชั่วโมงสอนเกินภาระงาน */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">ชั่วโมงเกินภาระงาน</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-700">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{totalGrossOverloadHours.toLocaleString()}</div>
          <p className="text-[11px] text-slate-500 mt-1">ชม. รวมก่อนจำกัดเพดาน</p>
        </div>

        {/* 6. ชั่วโมงที่มีสิทธิเบิก */}
        <div className="bg-white p-4 rounded-xl border border-indigo-200/80 shadow-xs hover:border-indigo-300 transition-all bg-indigo-50/20">
          <div className="flex items-center justify-between text-indigo-700 mb-2">
            <span className="text-xs font-medium">ชั่วโมงที่มีสิทธิเบิก</span>
            <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-indigo-900">{totalClaimableHours.toLocaleString()}</div>
          <p className="text-[11px] text-indigo-600 mt-1">
            ชม. (หักเพดานแล้ว)
            {totalUnclaimedHours > 0 && <span className="text-slate-500">, ไม่ได้เบิก {totalUnclaimedHours} ชม.</span>}
          </p>
        </div>

        {/* 7. ยอดเงินรวม */}
        <div className="bg-white p-4 rounded-xl border border-purple-200/80 shadow-xs hover:border-purple-300 transition-all bg-purple-50/20">
          <div className="flex items-center justify-between text-purple-700 mb-2">
            <span className="text-xs font-medium">ยอดเงินรวมประมาณการ</span>
            <div className="p-2 rounded-lg bg-purple-100 text-purple-700">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-purple-900">
            ฿{totalAmount.toLocaleString()}
          </div>
          <p className="text-[11px] text-purple-700 mt-1">ตามอัตรา ปวช./ปวส. สอศ.</p>
        </div>

        {/* 8. รายการรอตรวจสอบ/อนุมัติ */}
        <div className="bg-white p-4 rounded-xl border border-amber-200/80 shadow-xs hover:border-amber-300 transition-all bg-amber-50/20">
          <div className="flex items-center justify-between text-amber-700 mb-2">
            <span className="text-xs font-medium">รอตรวจสอบ / อนุมัติ</span>
            <div className="p-2 rounded-lg bg-amber-100 text-amber-700">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-900">{pendingApprovals}</div>
          <p className="text-[11px] text-amber-700 mt-1">รายการในกระบวนการ</p>
        </div>
      </div>

      {/* Highlights & Quick Status Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Departmental Breakdown & Dual Level Highlight */}
        <div className="lg:col-span-2 space-y-6">
          {/* Department Breakdown Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-slate-900 text-sm">สรุปยอดค่าสอนเกินภาระงานแยกตามแผนกวิชา</h3>
                <p className="text-xs text-slate-500">จำแนกตามภาระงานสอนจริงและสัดส่วนการเบิกจ่าย</p>
              </div>
              <button 
                onClick={() => onNavigate('reports')}
                className="text-xs font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                <span>ดูรายงานแผนก</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-500 font-medium pb-2">
                    <th className="py-2.5 px-3">แผนกวิชา</th>
                    <th className="py-2.5 px-3 text-center">ผู้สอน (คน)</th>
                    <th className="py-2.5 px-3 text-center">มีสิทธิเบิก</th>
                    <th className="py-2.5 px-3 text-right">ชม. เกินภาระงาน</th>
                    <th className="py-2.5 px-3 text-right">ชม. เบิกได้</th>
                    <th className="py-2.5 px-3 text-right">ยอดเงิน (บาท)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {departments.map((dept) => {
                    const deptResults = calculationResults.filter(r => r.departmentName.includes(dept.name) || dept.name.includes(r.departmentName));
                    const deptTeachers = deptResults.length;
                    const deptEligible = deptResults.filter(r => r.passedCheck && r.claimableOverloadHours > 0).length;
                    const deptGross = deptResults.reduce((acc, r) => acc + r.grossOverloadHours, 0);
                    const deptClaim = deptResults.reduce((acc, r) => acc + r.claimableOverloadHours, 0);
                    const deptBaht = deptResults.reduce((acc, r) => acc + r.totalAmount, 0);

                    return (
                      <tr key={dept.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3 font-medium text-slate-900">
                          {dept.name}
                          <span className="text-[10px] text-slate-400 block font-normal">{dept.faculty}</span>
                        </td>
                        <td className="py-3 px-3 text-center text-slate-600">{deptTeachers}</td>
                        <td className="py-3 px-3 text-center">
                          <span className="inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700">
                            {deptEligible}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right text-slate-600">{deptGross.toLocaleString()}</td>
                        <td className="py-3 px-3 text-right font-medium text-indigo-700">{deptClaim.toLocaleString()}</td>
                        <td className="py-3 px-3 text-right font-semibold text-slate-900">฿{deptBaht.toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Special Feature Highlight: Dual-Level Teaching (ข้อ 17) & Unclaimed Hours (ข้อ 23) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Box 1: Dual Level (ข้อ 17) */}
            <div className="bg-gradient-to-br from-sky-50 to-indigo-50 border border-sky-200/80 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2 text-sky-900 font-semibold text-xs">
                <Layers className="w-4 h-4 text-sky-600" />
                <span>การสอน 2 ระดับ (ข้อ 17): {dualLevelCount} ราย</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                แยกพิจารณาชั่วโมงสอนตามระดับ ปวช. และ ปวส. โดยปันส่วนภาระงานขั้นต่ำ และคูณด้วยอัตราค่าสอนของแต่ละระดับอย่างเป็นธรรม
              </p>
              <button 
                onClick={() => onNavigate('calculation')}
                className="text-xs font-semibold text-sky-700 hover:text-sky-800 flex items-center gap-1"
              >
                <span>ดูรายละเอียดการเทียบหน่วยชั่วโมง</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Box 2: Unclaimed Hours (ข้อ 23) */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/80 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2 text-amber-900 font-semibold text-xs">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>ชั่วโมงเกินภาระงานที่ไม่ได้เบิก (ข้อ 23)</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                ชั่วโมงที่เกินเพดาน {totalUnclaimedHours.toLocaleString()} ชม. ถูกบันทึกไว้ในระบบเพื่อใช้เป็นหลักฐานและเอกสารประกอบการประเมินวิทยฐานะ
              </p>
              <button 
                onClick={() => onNavigate('reports')}
                className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1"
              >
                <span>ออกหนังสือรับรองสะสมผลงาน</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Col: Urgent Anomalies & Approval Queue */}
        <div className="space-y-6">
          {/* Anomalies Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-rose-700 font-semibold text-sm">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <span>รายการที่ต้องตรวจสอบ ({anomalies.length})</span>
              </div>
              <button 
                onClick={() => onNavigate('anomalies')}
                className="text-xs text-rose-600 hover:text-rose-700 font-medium"
              >
                ดูทั้งหมด
              </button>
            </div>

            {anomalies.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-1" />
                ไม่พบรายการผิดปกติ ข้อมูลครบถ้วนสมบูรณ์
              </div>
            ) : (
              <div className="space-y-3">
                {anomalies.slice(0, 3).map((item) => (
                  <div 
                    key={item.id}
                    className={`p-3 rounded-lg border text-xs ${
                      item.severity === 'DANGER' 
                        ? 'bg-rose-50/60 border-rose-200 text-rose-900' 
                        : item.severity === 'WARNING'
                        ? 'bg-amber-50/60 border-amber-200 text-amber-900'
                        : 'bg-sky-50/60 border-sky-200 text-sky-900'
                    }`}
                  >
                    <div className="font-semibold flex items-center justify-between">
                      <span>{item.teacherName}</span>
                      <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-white/70">
                        {item.code}
                      </span>
                    </div>
                    <p className="text-[11px] mt-1 text-slate-700">{item.title}</p>
                    <p className="text-[10px] mt-0.5 text-slate-500 line-clamp-1">{item.detail}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Approval Queue */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
                <FileCheck className="w-4 h-4 text-indigo-600" />
                <span>คิวอนุมัติล่าสุด ({pendingApprovals})</span>
              </div>
              <button 
                onClick={() => onNavigate('approval')}
                className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
              >
                ไปหน้าอนุมัติ
              </button>
            </div>

            <div className="space-y-2.5">
              {calculationResults
                .filter(r => ['SUBMITTED', 'HEAD_ENDORSED', 'ACADEMIC_VERIFIED'].includes(r.approvalStatus))
                .slice(0, 4)
                .map((item) => (
                  <div key={item.teacherId} className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50 text-xs">
                    <div>
                      <p className="font-medium text-slate-800">{item.teacherName}</p>
                      <p className="text-[10px] text-slate-500">{item.departmentName}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-amber-100 text-amber-800">
                        {item.approvalStatus === 'SUBMITTED' ? 'รอ หน.แผนก' : item.approvalStatus === 'HEAD_ENDORSED' ? 'รอวิชาการ' : 'รอ ผอ.อนุมัติ'}
                      </span>
                      <span className="block text-[11px] font-semibold text-slate-700 mt-0.5">
                        ฿{item.totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
