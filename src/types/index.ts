export type UserRole = 'ADMIN' | 'ACADEMIC' | 'HEAD' | 'TEACHER' | 'FINANCE';

export type EducationLevel = 'ปวช.' | 'ปวส.' | 'ปริญญาตรี (ทล.บ.)';

export type TeacherCategory = 
  | 'สอนอย่างเดียว' 
  | 'สอน + หัวหน้าแผนกวิชา' 
  | 'สอน + หัวหน้างาน' 
  | 'สอน + หัวหน้าธุรการ/หน้าที่อื่น' 
  | 'รองผู้อำนวยการ' 
  | 'ผู้อำนวยการ';

export type ApprovalStatus = 
  | 'DRAFT'           // ผู้สอนร่าง
  | 'SUBMITTED'       // ผู้สอนยืนยัน ส่งต่อหัวหน้าแผนก
  | 'HEAD_ENDORSED'   // หัวหน้าแผนกรับรอง
  | 'ACADEMIC_VERIFIED' // งานวิชาการตรวจสอบผ่าน
  | 'DIRECTOR_APPROVED' // ผู้อำนวยการอนุมัติ
  | 'FINANCE_PAID'    // งานการเงินเบิกจ่ายแล้ว
  | 'REJECTED';       // ส่งกลับแก้ไข

export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  departmentId?: string;
  teacherId?: string;
  position: string;
  email: string;
}

export interface Department {
  id: string;
  code: string;
  name: string;
  faculty: string;
  headTeacherId: string;
  totalTeachers: number;
}

export interface Teacher {
  id: string;             // เช่น T0001
  userId?: string;        // รหัสบัญชีผู้ใช้งานระบบ เช่น U004 (ตรวจสอบกับ currentUser.id)
  prefix: string;         // นาย/นาง/นางสาว
  firstName: string;
  lastName: string;
  position: string;       // ครู, ครูผู้ช่วย, ครูชำนาญการ, ครูชำนาญการพิเศษ, รองผู้อำนวยการ, ผู้อำนวยการ
  academicStanding?: string; // วิทยฐานะ
  departmentId: string;
  departmentName: string;
  category: TeacherCategory;
  teachingLevels: EducationLevel[]; // ระดับที่สอน เช่น ['ปวช.'], ['ปวส.'], ['ปวช.', 'ปวส.']
  baseTeachingQuotaHours: number;   // ภาระงานสอนขั้นต่ำตามเกณฑ์ (เช่น 18 หรือ 12 หรือ 6)
  baseDutyQuotaHours: number;       // ภาระงานหน้าที่ขั้นต่ำ (เช่น 0 หรือ 6 หรือ 12)
  assignedDutyTitle?: string;       // ชื่องานที่ได้รับมอบหมาย
  assignedDutyOrderNo?: string;     // เลขที่คำสั่งแต่งตั้ง
  status: 'ปฏิบัติงาน' | 'ลาศึกษาต่อ' | 'ช่วยราชการ';
  salary: number;
  phone: string;
}

export interface ScheduleItem {
  id: string;
  teacherId: string;
  dayOfWeek: 'จันทร์' | 'อังคาร' | 'พุธ' | 'พฤหัสบดี' | 'ศุกร์' | 'เสาร์' | 'อาทิตย์';
  startTime: string;     // e.g. "08:30"
  endTime: string;       // e.g. "11:30"
  subjectCode: string;   // เช่น 20101-2001
  subjectName: string;   // เช่น งานเครื่องยนต์แก๊สโซลีน
  level: EducationLevel; // ปวช. หรือ ปวส.
  classGroup: string;    // เช่น ชย.1/1
  room: string;          // เช่น ปฏิบัติการยานยนต์ 1
  periodHours: number;   // จำนวนชั่วโมง (เช่น 3 คาบ/ชั่วโมง)
  isOnlineApproved: boolean; // การสอนออนไลน์ที่ได้รับอนุมัติ
  academicTerm: string;  // เช่น 2/2568
}

export interface DutyItem {
  id: string;
  teacherId: string;
  dutyType: 'หัวหน้าแผนกวิชา' | 'หัวหน้างาน' | 'หัวหน้าธุรการ' | 'กรรมการตรวจรับ' | 'งานที่ปรึกษา' | 'หน้าที่พิเศษตามคำสั่ง';
  title: string;
  orderNumber: string;
  approvedHoursPerWeek: number;
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface SubstituteRecord {
  id: string;
  academicTerm: string;
  originalDate: string;
  originalTime: string;
  subjectCode: string;
  subjectName: string;
  level: EducationLevel;
  hours: number;
  reason: 'ลาป่วย' | 'ลากิจ' | 'ไปราชการ' | 'ฝึกอบรม' | 'กิจกรรมสถานศึกษา';
  originalTeacherId: string;
  substituteTeacherId: string;
  actualTaughtDate: string;
  orderNumber: string; // เลขที่คำสั่ง/บันทึกข้อความอนุมัติ
  documentRef?: string;
  verified: boolean;
  notes: string;
}

export interface TeachingRecord {
  id: string;
  teacherId: string;
  academicTerm: string;
  weekNumber: number;
  subjectCode: string;
  level: EducationLevel;
  scheduledHours: number;
  actualTaughtHours: number;
  substituteGivenHours: number;  // สอนแทนคนอื่น (นับเพิ่ม)
  substituteTakenHours: number;  // ให้คนอื่นสอนแทน (หักออก)
  compensatoryHours: number;     // สอนชดเชย
  recordedDate: string;
  status: 'COMPLETED' | 'CANCELLED' | 'MAKEUP';
}

export interface CalculationRule {
  ruleId: string;
  category: TeacherCategory;
  level: EducationLevel | 'รวมทุกระดับ';
  minTeachingHours: number;   // ชั่วโมงสอนขั้นต่ำ
  minDutyHours: number;       // ชั่วโมงหน้าที่ขั้นต่ำ
  maxClaimableOverloadHours: number; // เพดานเบิกจ่ายสูงสุดต่อสัปดาห์ (เช่น 12 ชม.)
  allowOnlineRatio: number;   // สัดส่วนออนไลน์สูงสุดที่เบิกได้ (เช่น 0.5 หรือ 1.0)
  dualLevelRatioPvcToPvs: number; // อัตราส่วนเทียบชั่วโมงกรณีสอน 2 ระดับ
  conditionDescription: string;
}

export interface TeachingRate {
  rateId: string;
  title: string;
  level: EducationLevel;
  ratePerHour: number;        // อัตราต่อชั่วโมง (บาท)
  effectiveDate: string;
  remarks: string;
}

export interface DualLevelBreakdown {
  isDualLevel: boolean;
  pvcActualHours: number;
  pvsActualHours: number;
  bachelorActualHours: number;
  pvcBaseQuota: number;
  pvsBaseQuota: number;
  conversionMethod: string;
  pvcClaimableHours: number;
  pvsClaimableHours: number;
  pvcRate: number;
  pvsRate: number;
  pvcAmount: number;
  pvsAmount: number;
}

export interface AnomalyItem {
  id: string;
  teacherId: string;
  teacherName: string;
  departmentName: string;
  severity: 'DANGER' | 'WARNING' | 'INFO';
  code: 'HOURS_BELOW_QUOTA' | 'SCHEDULE_MISMATCH' | 'MISSING_ORDER_NO' | 'EXCEED_CAP' | 'DUPLICATE_TIME' | 'MISSING_DATA' | 'RATE_NOT_FOUND';
  title: string;
  detail: string;
  suggestion: string;
  resolved: boolean;
}

export interface MonthlyClaimItem {
  monthId: string;           // เช่น "2568-11"
  monthName: string;         // เช่น "พฤศจิกายน 2568"
  monthShortName: string;    // เช่น "พ.ย. 68"
  weeksCount: number;        // เช่น 4 สัปดาห์
  weekRange: string;         // เช่น "สัปดาห์ที่ 1 - 4"
  scheduledHours: number;    // ชั่วโมงตามตารางในเดือน
  actualHours: number;       // ชั่วโมงสอนจริงในเดือน
  baseQuotaHours: number;    // เกณฑ์ภาระงานสอนปกติในเดือน
  overloadHours: number;     // ชั่วโมงเกินภาระงานในเดือน
  claimableHours: number;    // ชั่วโมงที่เบิกจ่ายได้ในเดือน
  unclaimedHours: number;    // ชั่วโมงเกินเพดานที่ไม่ได้เบิก
  pvcClaimableHours: number; // ปวช.
  pvsClaimableHours: number; // ปวส.
  totalAmount: number;       // จำนวนเงินขอเบิกประจำเดือน (บาท)
  approvalStatus: ApprovalStatus;
  submissionDate?: string;
  headApprovedDate?: string;
  headApproverName?: string;
  academicApprovedDate?: string;
  academicApproverName?: string;
  directorApprovedDate?: string;
  directorApproverName?: string;
  financeDisbursedDate?: string;
  rejectionReason?: string;
}

export interface OTCalculationResult {
  teacherId: string;
  userId?: string;        // รหัสบัญชีผู้ใช้งานระบบ เช่น U004 (ตรวจสอบกับ currentUser.id)
  teacherName: string;
  position: string;
  departmentName: string;
  category: TeacherCategory;
  academicTerm: string;
  totalWeeks: number;

  // ชั่วโมงต่อสัปดาห์
  weeklyScheduledHours: number;
  weeklyActualTaughtHours: number;
  weeklyDutyHours: number;
  weeklySubstitutePlusHours: number;
  weeklySubstituteMinusHours: number;

  // เกณฑ์ & การคำนวณ
  minTeachingHoursRequired: number;
  minDutyHoursRequired: number;
  
  // ผลลัพธ์ชั่วโมง
  actualTeachingHours: number;     // ชั่วโมงสอนจริงรวมตลอดภาค
  requiredBaseTeachingHours: number; // ภาระงานสอนปกติรวมตลอดภาค
  grossOverloadHours: number;      // ชั่วโมงเกินภาระงานสอนรวม (ก่อนจำกัดเพดาน)
  claimableOverloadHours: number;  // ชั่วโมงที่มีสิทธิเบิกจ่าย (หักเพดานแล้ว)
  unclaimedOverloadHours: number;  // ชั่วโมงเกินภาระงานที่ไม่ได้เบิก (ตามข้อ 23)

  // 2 ระดับ breakdown
  dualLevel: DualLevelBreakdown;

  // ยอดเงิน
  applicableRateSummary: string;
  totalAmount: number; // จำนวนเงินที่เบิกจ่าย (บาท)

  // รายการแยกรายเดือนสำหรับยื่นขอเบิก
  monthlyBreakdown: MonthlyClaimItem[];

  // สถานะการตรวจสอบ
  passedCheck: boolean;
  status: 'ELIGIBLE' | 'INELIGIBLE' | 'NEEDS_REVIEW';
  statusReason: string;
  auditNotes: string[];

  // การรับรอง & อนุมัติ
  approvalStatus: ApprovalStatus;
  submissionDate?: string;
  headApprovedDate?: string;
  headApproverName?: string;
  academicApprovedDate?: string;
  academicApproverName?: string;
  directorApprovedDate?: string;
  directorApproverName?: string;
  financeDisbursedDate?: string;
  rejectionReason?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  targetId: string;
  targetType: 'TEACHER' | 'SCHEDULE' | 'RULE' | 'RATE' | 'APPROVAL' | 'SUBSTITUTE';
  details: string;
  ipAddress?: string;
}

export interface SemesterMonthInfo {
  monthId: string;
  monthName: string;
  monthShortName: string;
  weeksCount: number;
  weekRange: string;
}

export interface SemesterGroup {
  term: string;
  label: string;
  months: SemesterMonthInfo[];
}
