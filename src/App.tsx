import React, { useState, useMemo, useEffect } from 'react';
import { 
  User, 
  UserRole, 
  Teacher, 
  ScheduleItem, 
  DutyItem, 
  SubstituteRecord, 
  TeachingRecord, 
  CalculationRule, 
  TeachingRate, 
  OTCalculationResult, 
  ApprovalStatus,
  AuditLogEntry
} from './types';
import { 
  INITIAL_USERS, 
  INITIAL_TEACHERS, 
  INITIAL_DEPARTMENTS, 
  INITIAL_SCHEDULES, 
  INITIAL_DUTIES, 
  INITIAL_SUBSTITUTES, 
  INITIAL_TEACHING_RECORDS, 
  INITIAL_RULES, 
  INITIAL_RATES,
  INITIAL_AUDIT_LOGS
} from './data/initialData';
import { calculateTeacherOT, detectAnomalies } from './services/ruleEngine';
import { apiService } from './services/api';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { CalculationModule } from './components/CalculationModule';
import { TeacherManagement } from './components/TeacherManagement';
import { ScheduleManagement } from './components/ScheduleManagement';
import { DutiesAndRecords } from './components/DutiesAndRecords';
import { SubstituteTeaching } from './components/SubstituteTeaching';
import { AnomalyChecker } from './components/AnomalyChecker';
import { ApprovalWorkflow } from './components/ApprovalWorkflow';
import { OfficialReports } from './components/OfficialReports';
import { RuleEngineSettings } from './components/RuleEngineSettings';
import { GoogleSheetsIntegration } from './components/GoogleSheetsIntegration';

export default function App() {
  // Master State
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]); // Default: Admin
  const [academicTerm, setAcademicTerm] = useState<string>('2/2568');
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Core Data Collections
  const [teachers, setTeachers] = useState<Teacher[]>(INITIAL_TEACHERS);
  const [schedules, setSchedules] = useState<ScheduleItem[]>(INITIAL_SCHEDULES);
  const [duties, setDuties] = useState<DutyItem[]>(INITIAL_DUTIES);
  const [substitutes, setSubstitutes] = useState<SubstituteRecord[]>(INITIAL_SUBSTITUTES);
  const [teachingRecords, setTeachingRecords] = useState<TeachingRecord[]>(INITIAL_TEACHING_RECORDS);
  const [rules, setRules] = useState<CalculationRule[]>(INITIAL_RULES);
  const [rates, setRates] = useState<TeachingRate[]>(INITIAL_RATES);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);

  // Hydrate from Google Apps Script if running in live GAS environment
  useEffect(() => {
    async function loadBackendData() {
      const data = await apiService.getInitialData();
      if (data) {
        if (data.teachers?.length) setTeachers(data.teachers);
        if (data.schedules?.length) setSchedules(data.schedules);
        if (data.duties?.length) setDuties(data.duties);
        if (data.teachingRecords?.length) setTeachingRecords(data.teachingRecords);
        if (data.substitutes?.length) setSubstitutes(data.substitutes);
        if (data.rules?.length) setRules(data.rules);
        if (data.rates?.length) setRates(data.rates);
        if (data.auditLogs?.length) setAuditLogs(data.auditLogs);
      }
    }
    loadBackendData();
  }, []);

  // Approval overrides per teacher
  const [approvalStatusMap, setApprovalStatusMap] = useState<Record<string, {
    status: ApprovalStatus;
    submissionDate?: string;
    headApprovedDate?: string;
    headApproverName?: string;
    academicApprovedDate?: string;
    academicApproverName?: string;
    directorApprovedDate?: string;
    directorApproverName?: string;
    financeDisbursedDate?: string;
    rejectionReason?: string;
  }>>({
    'T0001': {
      status: 'HEAD_ENDORSED',
      submissionDate: '2026-11-05',
      headApprovedDate: '2026-11-06',
      headApproverName: 'นายประสิทธิ์ กิจประเสริฐ'
    },
    'T0002': {
      status: 'ACADEMIC_VERIFIED',
      submissionDate: '2026-11-04',
      headApprovedDate: '2026-11-05',
      headApproverName: 'นายประสิทธิ์ กิจประเสริฐ',
      academicApprovedDate: '2026-11-08',
      academicApproverName: 'นางอรวรรณ วิชาการเลิศ'
    },
    'T0003': {
      status: 'SUBMITTED',
      submissionDate: '2026-11-07'
    },
    'T0004': {
      status: 'DIRECTOR_APPROVED',
      submissionDate: '2026-11-03',
      headApprovedDate: '2026-11-04',
      headApproverName: 'นายประสิทธิ์ กิจประเสริฐ',
      academicApprovedDate: '2026-11-06',
      academicApproverName: 'นางอรวรรณ วิชาการเลิศ',
      directorApprovedDate: '2026-11-10',
      directorApproverName: 'นายสมบูรณ์ บริหารงาน (ผู้อำนวยการ)'
    },
    'T0005': {
      status: 'REJECTED',
      submissionDate: '2026-11-05',
      rejectionReason: 'ชั่วโมงสอนจริง 16 ชม. ไม่ถึงเกณฑ์ขั้นต่ำ 18 ชม./สัปดาห์ ไม่สามารถเบิกจ่ายได้ตามระเบียบ'
    },
    'T0006': {
      status: 'FINANCE_PAID',
      submissionDate: '2026-11-01',
      headApprovedDate: '2026-11-02',
      headApproverName: 'นายประสิทธิ์ กิจประเสริฐ',
      academicApprovedDate: '2026-11-04',
      academicApproverName: 'นางอรวรรณ วิชาการเลิศ',
      directorApprovedDate: '2026-11-08',
      directorApproverName: 'นายสมบูรณ์ บริหารงาน (ผู้อำนวยการ)',
      financeDisbursedDate: '2026-11-15'
    }
  });

  // Resolved anomaly IDs
  const [resolvedAnomalyIds, setResolvedAnomalyIds] = useState<string[]>([]);

  // Selected report teacher and month
  const [selectedReportTeacherId, setSelectedReportTeacherId] = useState<string | null>(null);
  const [selectedReportMonthId, setSelectedReportMonthId] = useState<string | null>(null);

  // Monthly Approval Status map: teacherId -> { monthId: ApprovalStatus }
  const [monthlyApprovalMap, setMonthlyApprovalMap] = useState<Record<string, Record<string, ApprovalStatus>>>({
    'T0001': {
      '2568-11': 'HEAD_ENDORSED',
      '2568-12': 'SUBMITTED',
      '2569-01': 'DRAFT',
      '2569-02': 'DRAFT',
      '2569-03': 'DRAFT'
    },
    'T0006': {
      '2568-11': 'FINANCE_PAID',
      '2568-12': 'FINANCE_PAID',
      '2569-01': 'FINANCE_PAID',
      '2569-02': 'FINANCE_PAID',
      '2569-03': 'FINANCE_PAID'
    }
  });

  const handleUpdateMonthlyStatus = (teacherId: string, monthId: string, newStatus: ApprovalStatus, reason?: string) => {
    setMonthlyApprovalMap(prev => ({
      ...prev,
      [teacherId]: {
        ...(prev[teacherId] || {}),
        [monthId]: newStatus
      }
    }));
    const [yStr, mStr] = monthId.split('-');
    const mNum = parseInt(mStr, 10) || 0;
    const thaiMonths = [
      '', 'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
      'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];
    const monthName = `${thaiMonths[mNum] || monthId} ${yStr || ''}`.trim();
    addAuditLog('UPDATE_MONTHLY_STATUS', `${teacherId}_${monthId}`, 'APPROVAL', `เปลี่ยนสถานะคำขอเบิกเดือน ${monthName} เป็น ${newStatus} โดย ${currentUser.name} (${currentUser.role})`);
  };

  // Dynamically calculate OT for all teachers
  const calculationResults = useMemo<OTCalculationResult[]>(() => {
    return teachers.map(teacher => {
      const result = calculateTeacherOT(
        teacher,
        schedules,
        duties,
        substitutes,
        rules,
        rates,
        academicTerm
      );

      // Merge monthly status
      const teacherMonthlyStatuses = monthlyApprovalMap[teacher.id];
      const mergedMonthly = result.monthlyBreakdown?.map(m => {
        const customStatus = teacherMonthlyStatuses?.[m.monthId];
        return customStatus ? { ...m, approvalStatus: customStatus } : m;
      });

      // Merge current approval status
      const currentApproval = approvalStatusMap[teacher.id];
      if (currentApproval) {
        return {
          ...result,
          monthlyBreakdown: mergedMonthly || result.monthlyBreakdown,
          approvalStatus: currentApproval.status,
          submissionDate: currentApproval.submissionDate,
          headApprovedDate: currentApproval.headApprovedDate,
          headApproverName: currentApproval.headApproverName,
          academicApprovedDate: currentApproval.academicApprovedDate,
          academicApproverName: currentApproval.academicApproverName,
          directorApprovedDate: currentApproval.directorApprovedDate,
          directorApproverName: currentApproval.directorApproverName,
          financeDisbursedDate: currentApproval.financeDisbursedDate,
          rejectionReason: currentApproval.rejectionReason
        };
      }
      return {
        ...result,
        monthlyBreakdown: mergedMonthly || result.monthlyBreakdown
      };
    });
  }, [teachers, schedules, duties, substitutes, rules, rates, academicTerm, approvalStatusMap, monthlyApprovalMap]);

  // Dynamically detect anomalies
  const rawAnomalies = useMemo(() => {
    return detectAnomalies(teachers, schedules, duties, substitutes, calculationResults);
  }, [teachers, schedules, duties, substitutes, calculationResults]);

  const anomalies = useMemo(() => {
    return rawAnomalies.map(a => ({
      ...a,
      resolved: resolvedAnomalyIds.includes(a.id)
    }));
  }, [rawAnomalies, resolvedAnomalyIds]);

  // Helper for adding Audit Log
  const addAuditLog = (action: string, targetId: string, targetType: AuditLogEntry['targetType'], details: string) => {
    const newEntry: AuditLogEntry = {
      id: `LOG${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      action,
      targetId,
      targetType,
      details
    };
    setAuditLogs(prev => [newEntry, ...prev]);
  };

  // Switch Current User / Role
  const handleSwitchUser = (role: UserRole) => {
    const matched = users.find(u => u.role === role);
    if (matched) {
      setCurrentUser(matched);
      addAuditLog('SWITCH_ROLE', matched.id, 'APPROVAL', `สลับบทบาทเป็น ${role} (${matched.name})`);
    }
  };

  // CRUD Handlers for Teachers
  const handleAddTeacher = (newTeacher: Teacher) => {
    setTeachers(prev => [...prev, newTeacher]);
    addAuditLog('ADD_TEACHER', newTeacher.id, 'TEACHER', `เพิ่มข้อมูลผู้สอน ${newTeacher.prefix}${newTeacher.firstName} ${newTeacher.lastName}`);
  };

  const handleUpdateTeacher = (updated: Teacher) => {
    setTeachers(prev => prev.map(t => t.id === updated.id ? updated : t));
    addAuditLog('UPDATE_TEACHER', updated.id, 'TEACHER', `แก้ไขข้อมูลผู้สอน ${updated.prefix}${updated.firstName} ${updated.lastName}`);
  };

  const handleDeleteTeacher = (id: string) => {
    setTeachers(prev => prev.filter(t => t.id !== id));
    addAuditLog('DELETE_TEACHER', id, 'TEACHER', `ลบข้อมูลผู้สอนรหัส ${id}`);
  };

  // Schedule Handlers
  const handleAddSchedule = (item: ScheduleItem) => {
    setSchedules(prev => [...prev, item]);
    addAuditLog('ADD_SCHEDULE', item.id, 'SCHEDULE', `เพิ่มตารางสอนวิชา ${item.subjectCode} (${item.periodHours} คาบ)`);
  };

  const handleDeleteSchedule = (id: string) => {
    setSchedules(prev => prev.filter(s => s.id !== id));
    addAuditLog('DELETE_SCHEDULE', id, 'SCHEDULE', `ลบตารางสอนรหัส ${id}`);
  };

  const handleImportSchedules = (items: ScheduleItem[]) => {
    setSchedules(prev => [...prev, ...items]);
    addAuditLog('IMPORT_SCHEDULE', `${items.length}_ITEMS`, 'SCHEDULE', `นำเข้าตารางสอนรวม ${items.length} รายการ`);
  };

  // Duty Handlers
  const handleAddDuty = (duty: DutyItem) => {
    setDuties(prev => [...prev, duty]);
    addAuditLog('ADD_DUTY', duty.id, 'SCHEDULE', `เพิ่มหน้าที่พิเศษ: ${duty.title} (${duty.approvedHoursPerWeek} ชม./สัปดาห์)`);
  };

  const handleDeleteDuty = (id: string) => {
    setDuties(prev => prev.filter(d => d.id !== id));
    addAuditLog('DELETE_DUTY', id, 'SCHEDULE', `ลบหน้าที่พิเศษรหัส ${id}`);
  };

  // Teaching Record Handlers
  const handleAddTeachingRecord = (record: TeachingRecord) => {
    setTeachingRecords(prev => [...prev, record]);
    addAuditLog('ADD_TEACHING_RECORD', record.id, 'SCHEDULE', `บันทึกการสอนสัปดาห์ที่ ${record.weekNumber} วิชา ${record.subjectCode}`);
  };

  // Substitute Teaching Handlers
  const handleAddSubstitute = (sub: SubstituteRecord) => {
    setSubstitutes(prev => [...prev, sub]);
    addAuditLog('ADD_SUBSTITUTE', sub.id, 'SUBSTITUTE', `บันทึกการสอนแทนวิชา ${sub.subjectCode} คำสั่ง ${sub.orderNumber}`);
  };

  const handleDeleteSubstitute = (id: string) => {
    setSubstitutes(prev => prev.filter(s => s.id !== id));
    addAuditLog('DELETE_SUBSTITUTE', id, 'SUBSTITUTE', `ลบข้อมูลการสอนแทนรหัส ${id}`);
  };

  const handleVerifySubstitute = (id: string) => {
    setSubstitutes(prev => prev.map(s => s.id === id ? { ...s, verified: !s.verified } : s));
    addAuditLog('VERIFY_SUBSTITUTE', id, 'SUBSTITUTE', `ตรวจสอบ/รับรองความถูกต้องเอกสารสอนแทนรหัส ${id}`);
  };

  // Anomaly Resolution
  const handleResolveAnomaly = (id: string) => {
    setResolvedAnomalyIds(prev => [...prev, id]);
    addAuditLog('RESOLVE_ANOMALY', id, 'APPROVAL', `รับทราบ/ระบุแก้ไขข้อผิดปกติรหัส ${id}`);
  };

  // Approval Workflow Handler
  const handleUpdateApprovalStatus = (teacherId: string, newStatus: ApprovalStatus, reason?: string) => {
    const now = new Date().toISOString().split('T')[0];
    const prev = approvalStatusMap[teacherId] || { status: 'DRAFT' };
    const updated = { ...prev, status: newStatus };

    if (newStatus === 'SUBMITTED') {
      updated.submissionDate = now;
    } else if (newStatus === 'HEAD_ENDORSED') {
      updated.headApprovedDate = now;
      updated.headApproverName = currentUser.name;
    } else if (newStatus === 'ACADEMIC_VERIFIED') {
      updated.academicApprovedDate = now;
      updated.academicApproverName = currentUser.name;
    } else if (newStatus === 'DIRECTOR_APPROVED') {
      updated.directorApprovedDate = now;
      updated.directorApproverName = currentUser.name;
    } else if (newStatus === 'FINANCE_PAID') {
      updated.financeDisbursedDate = now;
    } else if (newStatus === 'REJECTED') {
      updated.rejectionReason = reason || 'ข้อมูลไม่เป็นไปตามเกณฑ์ สอศ. 2568';
    }

    setApprovalStatusMap(m => ({ ...m, [teacherId]: updated }));
    addAuditLog('UPDATE_APPROVAL_STATUS', teacherId, 'APPROVAL', `เปลี่ยนสถานะเป็น ${newStatus} โดย ${currentUser.name} (${currentUser.role})`);
  };

  // Rules & Rates Update
  const handleUpdateRules = (newRules: CalculationRule[]) => {
    setRules(newRules);
    addAuditLog('UPDATE_RULES', 'CUSTOM_RULES', 'RULE', 'ปรับแต่งเกณฑ์ภาระงานในระบบคำนวณ');
  };

  const handleUpdateRates = (newRates: TeachingRate[]) => {
    setRates(newRates);
    addAuditLog('UPDATE_RATES', 'CUSTOM_RATES', 'RATE', 'ปรับเปลี่ยนอัตราค่าสอนต่อชั่วโมง');
  };

  const handleResetDefaults = () => {
    setRules(INITIAL_RULES);
    setRates(INITIAL_RATES);
    addAuditLog('RESET_RULES_DEFAULT', 'STD_2568', 'RULE', 'รีเซ็ตเกณฑ์และอัตราค่าสอนเป็นมาตรฐานระเบียบ สอศ. 2568');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col">
      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        users={users}
        onSelectUser={(u: User) => {
          setCurrentUser(u);
          addAuditLog('SWITCH_ROLE', u.id, 'APPROVAL', `สลับบทบาทเป็น ${u.role} (${u.name})`);
        }}
        academicTerm={academicTerm}
        onSelectTerm={setAcademicTerm}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        anomalyCount={anomalies.filter(a => !a.resolved).length}
        pendingApprovalCount={calculationResults.filter(r => r.approvalStatus !== 'DIRECTOR_APPROVED' && r.approvalStatus !== 'FINANCE_PAID').length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8">
        {activeTab === 'dashboard' && (
          <Dashboard
            calculationResults={calculationResults}
            anomalies={anomalies}
            departments={INITIAL_DEPARTMENTS}
            currentUser={currentUser}
            onNavigate={setActiveTab}
            academicTerm={academicTerm}
          />
        )}

        {activeTab === 'calculation' && (
          <CalculationModule
            calculationResults={calculationResults}
            teachers={teachers}
            rules={rules}
            rates={rates}
            currentUser={currentUser}
            academicTerm={academicTerm}
            onSelectTerm={setAcademicTerm}
            onRecalculateAll={() => {}}
            onSelectTeacherForReport={(teacherId, monthId) => {
              setSelectedReportTeacherId(teacherId);
              setSelectedReportMonthId(monthId || null);
              setActiveTab('reports');
            }}
            onSubmitMonthlyClaim={(teacherId, monthId) => {
              handleUpdateMonthlyStatus(teacherId, monthId, 'SUBMITTED');
            }}
          />
        )}

        {activeTab === 'teachers' && (
          <TeacherManagement
            teachers={teachers}
            departments={INITIAL_DEPARTMENTS}
            currentUser={currentUser}
            onAddTeacher={handleAddTeacher}
            onUpdateTeacher={handleUpdateTeacher}
            onDeleteTeacher={handleDeleteTeacher}
          />
        )}

        {activeTab === 'schedule' && (
          <ScheduleManagement
            schedules={schedules}
            teachers={teachers}
            onAddSchedule={handleAddSchedule}
            onDeleteSchedule={handleDeleteSchedule}
            onImportSchedules={handleImportSchedules}
          />
        )}

        {activeTab === 'duties' && (
          <DutiesAndRecords
            duties={duties}
            teachingRecords={teachingRecords}
            teachers={teachers}
            onAddDuty={handleAddDuty}
            onDeleteDuty={handleDeleteDuty}
            onAddTeachingRecord={handleAddTeachingRecord}
          />
        )}

        {activeTab === 'substitute' && (
          <SubstituteTeaching
            substitutes={substitutes}
            teachers={teachers}
            onAddSubstitute={handleAddSubstitute}
            onDeleteSubstitute={handleDeleteSubstitute}
            onVerifySubstitute={handleVerifySubstitute}
          />
        )}

        {activeTab === 'anomalies' && (
          <AnomalyChecker
            anomalies={anomalies}
            onResolveAnomaly={handleResolveAnomaly}
            onRunScan={() => {}}
            onNavigateToTeacher={() => {
              setActiveTab('calculation');
            }}
          />
        )}

        {activeTab === 'approval' && (
          <ApprovalWorkflow
            calculationResults={calculationResults}
            currentUser={currentUser}
            auditLogs={auditLogs}
            academicTerm={academicTerm}
            onSelectTerm={setAcademicTerm}
            onUpdateStatus={handleUpdateApprovalStatus}
            onUpdateMonthlyStatus={handleUpdateMonthlyStatus}
            onBatchApprove={(teacherIds, newStatus) => {
              teacherIds.forEach(id => handleUpdateApprovalStatus(id, newStatus));
            }}
          />
        )}

        {activeTab === 'reports' && (
          <OfficialReports
            calculationResults={calculationResults}
            teachers={teachers}
            departments={INITIAL_DEPARTMENTS}
            schedules={schedules}
            substitutes={substitutes}
            academicTerm={academicTerm}
            currentUser={currentUser}
            onSelectTerm={setAcademicTerm}
            initialTeacherId={selectedReportTeacherId}
            initialMonthId={selectedReportMonthId}
          />
        )}

        {activeTab === 'rules' && (
          <RuleEngineSettings
            rules={rules}
            rates={rates}
            onUpdateRules={handleUpdateRules}
            onUpdateRates={handleUpdateRates}
            onResetDefaults={handleResetDefaults}
          />
        )}

        {activeTab === 'gas' && (
          <GoogleSheetsIntegration />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            <strong>SMART OT TEACHING</strong> &copy; 2568 — ระบบสารสนเทศคำนวณและตรวจสอบค่าสอนเกินภาระงานสอน อาชีวศึกษา
          </p>
          <div className="flex items-center gap-3 font-medium">
            <span className="text-emerald-700">● ระเบียบ สอศ. พ.ศ. 2568</span>
            <span className="text-slate-400">|</span>
            <span>Google Apps Script & Sheets 14 แผ่นงาน</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
