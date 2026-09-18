import { User, Teacher, OTCalculationResult, ScheduleItem, SubstituteRecord, TeachingRecord, DutyItem } from '../types';

/**
 * ค้นหาข้อมูลครู (Teacher) ที่ตรงกับบัญชีผู้ใช้งานปัจจุบัน โดยตรวจสอบจาก currentUser.id
 * ตามลำดับความสำคัญ:
 * 1. teacher.userId === currentUser.id
 * 2. teacher.id === currentUser.id (กรณีใช้รหัสครูเป็น User ID)
 * 3. teacher.id === currentUser.teacherId (กรณีบัญชีระบุ teacherId อ้างอิงไว้)
 * 4. ชื่อ-สกุล ตรงกับชื่อผู้ใช้
 */
export function getTeacherForCurrentUser(currentUser?: User | null, teachers: Teacher[] = []): Teacher | null {
  if (!currentUser) return null;

  // 1. ตรวจสอบโดยตรงจาก currentUser.id กับ teacher.userId
  const byUserId = teachers.find(t => t.userId && t.userId === currentUser.id);
  if (byUserId) return byUserId;

  // 2. ตรวจสอบกรณี currentUser.id เป็นรหัสครูโดยตรง (เช่น 'T0001')
  const byTeacherIdDirect = teachers.find(t => t.id === currentUser.id);
  if (byTeacherIdDirect) return byTeacherIdDirect;

  // 3. ตรวจสอบจาก currentUser.teacherId ที่ผูกไว้กับบัญชีผู้ใช้
  if (currentUser.teacherId) {
    const byTeacherIdProp = teachers.find(t => t.id === currentUser.teacherId);
    if (byTeacherIdProp) return byTeacherIdProp;
  }

  // 4. ตรวจสอบจากชื่อครูผู้สอน
  if (currentUser.name) {
    const normalizedUserName = currentUser.name.trim().toLowerCase();
    const byName = teachers.find(t => {
      const fullTeacherName = `${t.prefix}${t.firstName} ${t.lastName}`.trim().toLowerCase();
      return fullTeacherName === normalizedUserName || normalizedUserName.includes(t.firstName.toLowerCase());
    });
    if (byName) return byName;
  }

  return null;
}

/**
 * ดึงรหัสครู (teacherId) ของ currentUser โดยตรวจสอบจาก currentUser.id
 */
export function getTeacherIdForCurrentUser(currentUser?: User | null, teachers: Teacher[] = []): string | null {
  if (!currentUser) return null;
  const teacher = getTeacherForCurrentUser(currentUser, teachers);
  if (teacher) return teacher.id;
  return currentUser.teacherId || currentUser.id || null;
}

/**
 * ตรวจสอบว่าผู้ใช้งานปัจจุบันเป็นครูผู้สอน (Role: TEACHER) หรือไม่
 */
export function isTeacherRole(currentUser?: User | null): boolean {
  return currentUser?.role === 'TEACHER';
}

/**
 * ตรวจสอบว่าข้อมูลการสอน / รายการคำนวณเบิกจ่าย / บันทึกตารางสอน เป็นของ currentUser หรือไม่
 * โดยตรวจสอบจาก currentUser.id
 * - หากเป็น Admin, Academic, Head, Finance จะเห็นข้อมูลทั้งหมดได้ตามบทบาท
 * - หากเป็น TEACHER จะเห็นได้เฉพาะข้อมูลที่มีรหัสครูตรงกับ currentUser.id เท่านั้น
 */
export function isRecordOfCurrentUser(
  record: { 
    teacherId?: string; 
    userId?: string; 
    id?: string;
    originalTeacherId?: string;
    substituteTeacherId?: string;
  },
  currentUser?: User | null,
  teachers: Teacher[] = []
): boolean {
  if (!currentUser) return true;
  // หากไม่ใช่ครูผู้สอน (Admin, Academic, Finance, Head) ให้ผ่านการตรวจสอบสิทธิ์ระดับบุคคล
  if (currentUser.role !== 'TEACHER') return true;

  // 1. ตรวจสอบตรงกับ userId ใน record เทียบกับ currentUser.id
  if (record.userId && record.userId === currentUser.id) {
    return true;
  }

  // 2. ดึงรหัสครูของผู้ใช้งานปัจจุบัน
  const myTeacherId = getTeacherIdForCurrentUser(currentUser, teachers);

  // 3. ตรวจสอบกับ teacherId
  if (record.teacherId) {
    if (record.teacherId === currentUser.id) return true;
    if (myTeacherId && record.teacherId === myTeacherId) return true;
    if (currentUser.teacherId && record.teacherId === currentUser.teacherId) return true;
  }

  // 4. ตรวจสอบกับ record.id (กรณีตัว record คือ Teacher เอง)
  if (record.id) {
    if (record.id === currentUser.id) return true;
    if (myTeacherId && record.id === myTeacherId) return true;
    if (currentUser.teacherId && record.id === currentUser.teacherId) return true;
  }

  // 5. ตรวจสอบกรณีบันทึกการสอนแทน (Substitute Record)
  if (record.originalTeacherId || record.substituteTeacherId) {
    if (record.originalTeacherId === currentUser.id || record.substituteTeacherId === currentUser.id) return true;
    if (myTeacherId && (record.originalTeacherId === myTeacherId || record.substituteTeacherId === myTeacherId)) return true;
    if (currentUser.teacherId && (record.originalTeacherId === currentUser.teacherId || record.substituteTeacherId === currentUser.teacherId)) return true;
  }

  return false;
}

/**
 * กรองรายการคำนวณเบิกจ่าย (OTCalculationResult) โดยตรวจสอบจาก currentUser.id
 */
export function filterCalculationResultsForUser(
  results: OTCalculationResult[],
  currentUser?: User | null,
  teachers: Teacher[] = []
): OTCalculationResult[] {
  if (!currentUser || currentUser.role !== 'TEACHER') {
    return results;
  }
  return results.filter(r => isRecordOfCurrentUser(r, currentUser, teachers));
}

/**
 * กรองรายชื่อครู (Teacher[]) โดยตรวจสอบจาก currentUser.id
 */
export function filterTeachersForUser(
  teachersList: Teacher[],
  currentUser?: User | null
): Teacher[] {
  if (!currentUser || currentUser.role !== 'TEACHER') {
    return teachersList;
  }
  return teachersList.filter(t => isRecordOfCurrentUser(t, currentUser, teachersList));
}
