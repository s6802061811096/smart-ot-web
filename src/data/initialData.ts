import {
  Department,
  Teacher,
  ScheduleItem,
  DutyItem,
  SubstituteRecord,
  TeachingRecord,
  CalculationRule,
  TeachingRate,
  User,
  AuditLogEntry
} from '../types';

export const INITIAL_DEPARTMENTS: Department[] = [
  { id: 'DEP01', code: 'AUTO', name: 'แผนกวิชาช่างยนต์', faculty: 'ช่างอุตสาหกรรม', headTeacherId: 'T0002', totalTeachers: 8 },
  { id: 'DEP02', code: 'ELEC', name: 'แผนกวิชาช่างไฟฟ้ากำลัง', faculty: 'ช่างอุตสาหกรรม', headTeacherId: 'T0004', totalTeachers: 7 },
  { id: 'DEP03', code: 'ACCT', name: 'แผนกวิชาการบัญชี', faculty: 'บริหารธุรกิจและพาณิชยกรรม', headTeacherId: 'T0006', totalTeachers: 6 },
  { id: 'DEP04', code: 'COMP', name: 'แผนกวิชาคอมพิวเตอร์ธุรกิจ', faculty: 'เทคโนโลยีสารสนเทศ', headTeacherId: 'T0008', totalTeachers: 6 },
  { id: 'DEP05', code: 'GENS', name: 'แผนกวิชาสามัญสัมพันธ์', faculty: 'ศึกษาทั่วไป', headTeacherId: 'T0010', totalTeachers: 9 },
];

export const INITIAL_USERS: User[] = [
  {
    id: 'U001',
    username: 'admin',
    name: 'นายสมบูรณ์ บริหารงาน',
    role: 'ADMIN',
    position: 'ผู้ดูแลระบบสารสนเทศ',
    email: 'admin@vocational.ac.th'
  },
  {
    id: 'U002',
    username: 'academic',
    name: 'นางอรวรรณ วิชาการเลิศ',
    role: 'ACADEMIC',
    position: 'หัวหน้างานพัฒนาหลักสูตรการเรียนการสอน',
    email: 'academic@vocational.ac.th'
  },
  {
    id: 'U003',
    username: 'head_auto',
    name: 'นายประสิทธิ์ กิจประเสริฐ',
    role: 'HEAD',
    departmentId: 'DEP01',
    teacherId: 'T0002',
    position: 'ครูชำนาญการพิเศษ (หัวหน้าแผนกช่างยนต์)',
    email: 'prasit@vocational.ac.th'
  },
  {
    id: 'U004',
    username: 'teacher_wiphada',
    name: 'นางสาววิภาดา พัฒนกิจ',
    role: 'TEACHER',
    departmentId: 'DEP01',
    teacherId: 'T0001',
    position: 'ครู (แผนกช่างยนต์ - สอน 2 ระดับ ปวช.+ปวส.)',
    email: 'wiphada@vocational.ac.th'
  },
  {
    id: 'U005',
    username: 'finance',
    name: 'นางรุ่งทิพย์ การเงินยิ่ง',
    role: 'FINANCE',
    position: 'หัวหน้างานการเงินและบัญชี',
    email: 'finance@vocational.ac.th'
  },
  {
    id: 'U006',
    username: 'teacher_thanakorn',
    name: 'นายธนากร ยอดวิชา',
    role: 'TEACHER',
    departmentId: 'DEP01',
    teacherId: 'T0003',
    position: 'ครูชำนาญการ (หัวหน้างานกิจกรรมฯ)',
    email: 'thanakorn@vocational.ac.th'
  },
  {
    id: 'U007',
    username: 'teacher_arnon',
    name: 'นายอานนท์ สายไฟฟ้า',
    role: 'TEACHER',
    departmentId: 'DEP02',
    teacherId: 'T0004',
    position: 'ครูชำนาญการพิเศษ (หัวหน้าแผนกช่างไฟฟ้ากำลัง)',
    email: 'arnon@vocational.ac.th'
  },
  {
    id: 'U008',
    username: 'teacher_suchitra',
    name: 'นางสุจิตรา พลังงานดี',
    role: 'TEACHER',
    departmentId: 'DEP02',
    teacherId: 'T0005',
    position: 'ครู (แผนกวิชาช่างไฟฟ้ากำลัง)',
    email: 'suchitra@vocational.ac.th'
  },
  {
    id: 'U009',
    username: 'teacher_kanda',
    name: 'นางสาวกานดา การเงินเพียบ',
    role: 'TEACHER',
    departmentId: 'DEP03',
    teacherId: 'T0006',
    position: 'ครูชำนาญการ (หัวหน้าแผนกวิชาการบัญชี)',
    email: 'kanda@vocational.ac.th'
  },
  {
    id: 'U010',
    username: 'teacher_mayuree',
    name: 'นางสาวมยุรี ตัวเลขแม่น',
    role: 'TEACHER',
    departmentId: 'DEP03',
    teacherId: 'T0007',
    position: 'ครูผู้ช่วย (แผนกวิชาการบัญชี)',
    email: 'mayuree@vocational.ac.th'
  },
  {
    id: 'U011',
    username: 'teacher_worapong',
    name: 'นายวรพงศ์ ไอทีเจริญ',
    role: 'TEACHER',
    departmentId: 'DEP04',
    teacherId: 'T0008',
    position: 'ครูชำนาญการ (แผนกวิชาคอมพิวเตอร์ธุรกิจ)',
    email: 'worapong@vocational.ac.th'
  },
  {
    id: 'U012',
    username: 'teacher_theerasak',
    name: 'นายธีรศักดิ์ ช่างศิลป์ประณีต',
    role: 'TEACHER',
    departmentId: 'DEP05',
    teacherId: 'T0009',
    position: 'รองผู้อำนวยการ (ฝ่ายวิชาการ)',
    email: 'theerasak@vocational.ac.th'
  },
  {
    id: 'U013',
    username: 'teacher_chonthicha',
    name: 'นางสาวชลธิชา ภาษาไทยงาม',
    role: 'TEACHER',
    departmentId: 'DEP05',
    teacherId: 'T0010',
    position: 'ครู (แผนกวิชาสามัญสัมพันธ์)',
    email: 'chonthicha@vocational.ac.th'
  }
];

export const INITIAL_TEACHERS: Teacher[] = [
  {
    id: 'T0001',
    userId: 'U004',
    prefix: 'นางสาว',
    firstName: 'วิภาดา',
    lastName: 'พัฒนกิจ',
    position: 'ครู',
    academicStanding: 'ครู',
    departmentId: 'DEP01',
    departmentName: 'แผนกวิชาช่างยนต์',
    category: 'สอนอย่างเดียว',
    teachingLevels: ['ปวช.', 'ปวส.'], // สอน 2 ระดับ
    baseTeachingQuotaHours: 18,
    baseDutyQuotaHours: 0,
    status: 'ปฏิบัติงาน',
    salary: 28450,
    phone: '081-234-5678'
  },
  {
    id: 'T0002',
    userId: 'U003',
    prefix: 'นาย',
    firstName: 'ประสิทธิ์',
    lastName: 'กิจประเสริฐ',
    position: 'ครูชำนาญการพิเศษ',
    academicStanding: 'ชำนาญการพิเศษ',
    departmentId: 'DEP01',
    departmentName: 'แผนกวิชาช่างยนต์',
    category: 'สอน + หัวหน้าแผนกวิชา',
    teachingLevels: ['ปวส.'],
    baseTeachingQuotaHours: 12,
    baseDutyQuotaHours: 6,
    assignedDutyTitle: 'หัวหน้าแผนกวิชาช่างยนต์',
    assignedDutyOrderNo: 'วศ. 142/2568',
    status: 'ปฏิบัติงาน',
    salary: 43200,
    phone: '089-987-6543'
  },
  {
    id: 'T0003',
    userId: 'U006',
    prefix: 'นาย',
    firstName: 'ธนากร',
    lastName: 'ยอดวิชา',
    position: 'ครูชำนาญการ',
    academicStanding: 'ชำนาญการ',
    departmentId: 'DEP01',
    departmentName: 'แผนกวิชาช่างยนต์',
    category: 'สอน + หัวหน้างาน',
    teachingLevels: ['ปวช.'],
    baseTeachingQuotaHours: 14,
    baseDutyQuotaHours: 4,
    assignedDutyTitle: 'หัวหน้างานกิจกรรมนักเรียนนักศึกษา',
    assignedDutyOrderNo: 'วศ. 150/2568',
    status: 'ปฏิบัติงาน',
    salary: 35100,
    phone: '084-555-1122'
  },
  {
    id: 'T0004',
    userId: 'U007',
    prefix: 'นาย',
    firstName: 'อานนท์',
    lastName: 'สายไฟฟ้า',
    position: 'ครูชำนาญการพิเศษ',
    academicStanding: 'ชำนาญการพิเศษ',
    departmentId: 'DEP02',
    departmentName: 'แผนกวิชาช่างไฟฟ้ากำลัง',
    category: 'สอน + หัวหน้าแผนกวิชา',
    teachingLevels: ['ปวช.', 'ปวส.'],
    baseTeachingQuotaHours: 12,
    baseDutyQuotaHours: 6,
    assignedDutyTitle: 'หัวหน้าแผนกวิชาช่างไฟฟ้ากำลัง',
    assignedDutyOrderNo: 'วศ. 143/2568',
    status: 'ปฏิบัติงาน',
    salary: 42100,
    phone: '086-444-3322'
  },
  {
    id: 'T0005',
    userId: 'U008',
    prefix: 'นาง',
    firstName: 'สุจิตรา',
    lastName: 'พลังงานดี',
    position: 'ครู',
    academicStanding: 'ครู',
    departmentId: 'DEP02',
    departmentName: 'แผนกวิชาช่างไฟฟ้ากำลัง',
    category: 'สอนอย่างเดียว',
    teachingLevels: ['ปวช.'],
    baseTeachingQuotaHours: 18,
    baseDutyQuotaHours: 0,
    status: 'ปฏิบัติงาน',
    salary: 26500,
    phone: '087-123-9988'
  },
  {
    id: 'T0006',
    userId: 'U009',
    prefix: 'นางสาว',
    firstName: 'กานดา',
    lastName: 'การเงินเพียบ',
    position: 'ครูชำนาญการ',
    academicStanding: 'ชำนาญการ',
    departmentId: 'DEP03',
    departmentName: 'แผนกวิชาการบัญชี',
    category: 'สอน + หัวหน้าแผนกวิชา',
    teachingLevels: ['ปวส.'],
    baseTeachingQuotaHours: 12,
    baseDutyQuotaHours: 6,
    assignedDutyTitle: 'หัวหน้าแผนกวิชาการบัญชี',
    assignedDutyOrderNo: 'วศ. 144/2568',
    status: 'ปฏิบัติงาน',
    salary: 36800,
    phone: '083-999-4411'
  },
  {
    id: 'T0007',
    userId: 'U010',
    prefix: 'นางสาว',
    firstName: 'มยุรี',
    lastName: 'ตัวเลขแม่น',
    position: 'ครูผู้ช่วย',
    academicStanding: 'ครูผู้ช่วย',
    departmentId: 'DEP03',
    departmentName: 'แผนกวิชาการบัญชี',
    category: 'สอนอย่างเดียว',
    teachingLevels: ['ปวช.'],
    baseTeachingQuotaHours: 18,
    baseDutyQuotaHours: 0,
    status: 'ปฏิบัติงาน',
    salary: 19500,
    phone: '082-333-8899'
  },
  {
    id: 'T0008',
    userId: 'U011',
    prefix: 'นาย',
    firstName: 'วรพงศ์',
    lastName: 'ไอทีเจริญ',
    position: 'ครูชำนาญการ',
    academicStanding: 'ชำนาญการ',
    departmentId: 'DEP04',
    departmentName: 'แผนกวิชาคอมพิวเตอร์ธุรกิจ',
    category: 'สอนอย่างเดียว',
    teachingLevels: ['ปวช.', 'ปวส.'],
    baseTeachingQuotaHours: 18,
    baseDutyQuotaHours: 0,
    status: 'ปฏิบัติงาน',
    salary: 33400,
    phone: '085-777-6655'
  },
  {
    id: 'T0009',
    userId: 'U012',
    prefix: 'นาย',
    firstName: 'ธีรศักดิ์',
    lastName: 'ช่างศิลป์ประณีต',
    position: 'รองผู้อำนวยการ',
    academicStanding: 'ชำนาญการพิเศษ',
    departmentId: 'DEP05',
    departmentName: 'แผนกวิชาสามัญสัมพันธ์',
    category: 'รองผู้อำนวยการ',
    teachingLevels: ['ปวส.'],
    baseTeachingQuotaHours: 6,
    baseDutyQuotaHours: 20,
    assignedDutyTitle: 'รองผู้อำนวยการฝ่ายวิชาการ',
    assignedDutyOrderNo: 'วศ. 002/2568',
    status: 'ปฏิบัติงาน',
    salary: 49800,
    phone: '081-998-7711'
  },
  {
    id: 'T0010',
    userId: 'U013',
    prefix: 'นางสาว',
    firstName: 'ชลธิชา',
    lastName: 'ภาษาไทยงาม',
    position: 'ครู',
    academicStanding: 'ครู',
    departmentId: 'DEP05',
    departmentName: 'แผนกวิชาสามัญสัมพันธ์',
    category: 'สอนอย่างเดียว',
    teachingLevels: ['ปวช.'],
    baseTeachingQuotaHours: 18,
    baseDutyQuotaHours: 0,
    status: 'ปฏิบัติงาน',
    salary: 24500,
    phone: '089-112-2334'
  }
];

export const INITIAL_SCHEDULES: ScheduleItem[] = [
  // T0001 (นางสาววิภาดา พัฒนกิจ) - สอน 2 ระดับ: ปวช. 14 ชม. + ปวส. 10 ชม. = 24 ชม. (เกิน 18 ชม. -> เกินภาระงาน 6 ชม.)
  { id: 'S001', teacherId: 'T0001', dayOfWeek: 'จันทร์', startTime: '08:30', endTime: '12:30', subjectCode: '20101-2001', subjectName: 'งานเครื่องยนต์แก๊สโซลีน', level: 'ปวช.', classGroup: 'ชย.1/1', room: 'อาคารช่างยนต์ 101', periodHours: 4, isOnlineApproved: false, academicTerm: '2/2568' },
  { id: 'S002', teacherId: 'T0001', dayOfWeek: 'จันทร์', startTime: '13:30', endTime: '16:30', subjectCode: '20101-2002', subjectName: 'งานเครื่องยนต์ดีเซล', level: 'ปวช.', classGroup: 'ชย.1/2', room: 'อาคารช่างยนต์ 102', periodHours: 3, isOnlineApproved: false, academicTerm: '2/2568' },
  { id: 'S003', teacherId: 'T0001', dayOfWeek: 'อังคาร', startTime: '08:30', endTime: '12:30', subjectCode: '20101-2005', subjectName: 'งานไฟฟ้ายานยนต์', level: 'ปวช.', classGroup: 'ชย.2/1', room: 'ห้องไฟฟ้าช่างยนต์', periodHours: 4, isOnlineApproved: false, academicTerm: '2/2568' },
  { id: 'S004', teacherId: 'T0001', dayOfWeek: 'อังคาร', startTime: '13:30', endTime: '16:30', subjectCode: '20101-2006', subjectName: 'งานระบบส่งกำลังยานยนต์', level: 'ปวช.', classGroup: 'ชย.2/2', room: 'โรงประลอง 2', periodHours: 3, isOnlineApproved: false, academicTerm: '2/2568' },
  { id: 'S005', teacherId: 'T0001', dayOfWeek: 'พุธ', startTime: '08:30', endTime: '13:30', subjectCode: '30101-2001', subjectName: 'เทคโนโลยียานยนต์สมัยใหม่', level: 'ปวส.', classGroup: 'ส.ชย.1/1', room: 'ห้องปฏิบัติการเทคโนโลยี', periodHours: 5, isOnlineApproved: false, academicTerm: '2/2568' },
  { id: 'S006', teacherId: 'T0001', dayOfWeek: 'พฤหัสบดี', startTime: '08:30', endTime: '13:30', subjectCode: '30101-2004', subjectName: 'การวิเคราะห์ปัญหายานยนต์ขั้นสูง', level: 'ปวส.', classGroup: 'ส.ชย.2/1', room: 'ศูนย์ตรวจสภาพ 1', periodHours: 5, isOnlineApproved: false, academicTerm: '2/2568' },

  // T0002 (นายประสิทธิ์ กิจประเสริฐ - หน.แผนก เกณฑ์ 12 ชม.) สอน ปวส. 18 ชม. -> เกิน 6 ชม.
  { id: 'S007', teacherId: 'T0002', dayOfWeek: 'จันทร์', startTime: '08:30', endTime: '12:30', subjectCode: '30101-1001', subjectName: 'การจัดการงานบริการยานยนต์', level: 'ปวส.', classGroup: 'ส.ชย.1/2', room: 'ห้องบรรยาย 301', periodHours: 4, isOnlineApproved: false, academicTerm: '2/2568' },
  { id: 'S008', teacherId: 'T0002', dayOfWeek: 'อังคาร', startTime: '08:30', endTime: '13:30', subjectCode: '30101-2008', subjectName: 'โครงงานวิจัยยานยนต์ 1', level: 'ปวส.', classGroup: 'ส.ชย.2/2', room: 'ห้องวิจัยช่างยนต์', periodHours: 5, isOnlineApproved: false, academicTerm: '2/2568' },
  { id: 'S009', teacherId: 'T0002', dayOfWeek: 'พุธ', startTime: '08:30', endTime: '13:30', subjectCode: '30101-2009', subjectName: 'โครงงานวิจัยยานยนต์ 2', level: 'ปวส.', classGroup: 'ส.ชย.2/1', room: 'ห้องวิจัยช่างยนต์', periodHours: 5, isOnlineApproved: false, academicTerm: '2/2568' },
  { id: 'S010', teacherId: 'T0002', dayOfWeek: 'พฤหัสบดี', startTime: '13:30', endTime: '17:30', subjectCode: '30101-2101', subjectName: 'สัมมนาวิชาชีพยานยนต์', level: 'ปวส.', classGroup: 'ส.ชย.2/2', room: 'ห้องบรรยาย 302', periodHours: 4, isOnlineApproved: false, academicTerm: '2/2568' },

  // T0003 (นายธนากร ยอดวิชา - หน.งาน เกณฑ์ 14 ชม.) สอน ปวช. 20 ชม. -> เกิน 6 ชม.
  { id: 'S011', teacherId: 'T0003', dayOfWeek: 'จันทร์', startTime: '08:30', endTime: '13:30', subjectCode: '20101-2003', subjectName: 'งานปรับอากาศยานยนต์', level: 'ปวช.', classGroup: 'ชย.3/1', room: 'โรงประลองแอร์', periodHours: 5, isOnlineApproved: false, academicTerm: '2/2568' },
  { id: 'S012', teacherId: 'T0003', dayOfWeek: 'อังคาร', startTime: '08:30', endTime: '13:30', subjectCode: '20101-2004', subjectName: 'งานสีรถยนต์เบื้องต้น', level: 'ปวช.', classGroup: 'ชย.3/2', room: 'โรงประลองสี', periodHours: 5, isOnlineApproved: false, academicTerm: '2/2568' },
  { id: 'S013', teacherId: 'T0003', dayOfWeek: 'พุธ', startTime: '08:30', endTime: '13:30', subjectCode: '20101-2007', subjectName: 'งานซ่อมเครื่องยนต์ไฮบริด', level: 'ปวช.', classGroup: 'ชย.3/1', room: 'ห้องไฮบริด', periodHours: 5, isOnlineApproved: false, academicTerm: '2/2568' },
  { id: 'S014', teacherId: 'T0003', dayOfWeek: 'ศุกร์', startTime: '08:30', endTime: '13:30', subjectCode: '20101-2008', subjectName: 'งานบำรุงรักษายานยนต์', level: 'ปวช.', classGroup: 'ชย.2/1', room: 'อาคารช่างยนต์ 101', periodHours: 5, isOnlineApproved: false, academicTerm: '2/2568' },

  // T0004 (นายอานนท์ สายไฟฟ้า - หน.แผนกไฟฟ้า เกณฑ์ 12 ชม.) สอน ปวช.+ปวส. 22 ชม. -> เกิน 10 ชม.
  { id: 'S015', teacherId: 'T0004', dayOfWeek: 'จันทร์', startTime: '08:30', endTime: '13:30', subjectCode: '20104-2001', subjectName: 'วงจรไฟฟ้ากระแสตรง', level: 'ปวช.', classGroup: 'ชฟ.1/1', room: 'ห้องแล็บไฟฟ้า 1', periodHours: 5, isOnlineApproved: false, academicTerm: '2/2568' },
  { id: 'S016', teacherId: 'T0004', dayOfWeek: 'อังคาร', startTime: '08:30', endTime: '13:30', subjectCode: '20104-2002', subjectName: 'วงจรไฟฟ้ากระแสสลับ', level: 'ปวช.', classGroup: 'ชฟ.1/2', room: 'ห้องแล็บไฟฟ้า 2', periodHours: 5, isOnlineApproved: false, academicTerm: '2/2568' },
  { id: 'S017', teacherId: 'T0004', dayOfWeek: 'พฤหัสบดี', startTime: '08:30', endTime: '14:30', subjectCode: '30104-2001', subjectName: 'การวิเคราะห์ระบบไฟฟ้ากำลัง', level: 'ปวส.', classGroup: 'ส.ชฟ.1/1', room: 'ห้องแล็บพลังงาน', periodHours: 6, isOnlineApproved: false, academicTerm: '2/2568' },
  { id: 'S018', teacherId: 'T0004', dayOfWeek: 'ศุกร์', startTime: '08:30', endTime: '14:30', subjectCode: '30104-2003', subjectName: 'การควบคุมมอเตอร์ไฟฟ้าอุตสาหกรรม', level: 'ปวส.', classGroup: 'ส.ชฟ.2/1', room: 'ห้องแล็บควบคุม', periodHours: 6, isOnlineApproved: false, academicTerm: '2/2568' },

  // T0005 (นางสุจิตรา พลังงานดี - สอนอย่างเดียว เกณฑ์ 18 ชม.) สอน ปวช. 16 ชม. -> ไม่ถึงเกณฑ์! (Anomaly case: HOURS_BELOW_QUOTA)
  { id: 'S019', teacherId: 'T0005', dayOfWeek: 'จันทร์', startTime: '08:30', endTime: '12:30', subjectCode: '20104-1001', subjectName: 'เขียนแบบไฟฟ้า', level: 'ปวช.', classGroup: 'ชฟ.1/1', room: 'ห้องเขียนแบบ', periodHours: 4, isOnlineApproved: false, academicTerm: '2/2568' },
  { id: 'S020', teacherId: 'T0005', dayOfWeek: 'อังคาร', startTime: '08:30', endTime: '12:30', subjectCode: '20104-1002', subjectName: 'เครื่องมือวัดไฟฟ้า', level: 'ปวช.', classGroup: 'ชฟ.1/2', room: 'ห้องเครื่องมือวัด', periodHours: 4, isOnlineApproved: false, academicTerm: '2/2568' },
  { id: 'S021', teacherId: 'T0005', dayOfWeek: 'พุธ', startTime: '08:30', endTime: '12:30', subjectCode: '20104-2005', subjectName: 'การติดตั้งไฟฟ้าในอาคาร', level: 'ปวช.', classGroup: 'ชฟ.2/1', room: 'แผงฝึกติดตั้ง', periodHours: 4, isOnlineApproved: false, academicTerm: '2/2568' },
  { id: 'S022', teacherId: 'T0005', dayOfWeek: 'พฤหัสบดี', startTime: '08:30', endTime: '12:30', subjectCode: '20104-2006', subjectName: 'การติดตั้งไฟฟ้าโรงงาน', level: 'ปวช.', classGroup: 'ชฟ.2/2', room: 'แผงฝึกโรงงาน', periodHours: 4, isOnlineApproved: false, academicTerm: '2/2568' },

  // T0006 (นางสาวกานดา การเงินเพียบ - หน.แผนกบัญชี เกณฑ์ 12 ชม.) สอน ปวส. 18 ชม. -> เกิน 6 ชม.
  { id: 'S023', teacherId: 'T0006', dayOfWeek: 'จันทร์', startTime: '08:30', endTime: '12:30', subjectCode: '30201-2001', subjectName: 'การบัญชีชั้นกลาง 1', level: 'ปวส.', classGroup: 'ส.บช.1/1', room: 'ห้องบัญชี 401', periodHours: 4, isOnlineApproved: false, academicTerm: '2/2568' },
  { id: 'S024', teacherId: 'T0006', dayOfWeek: 'อังคาร', startTime: '08:30', endTime: '13:30', subjectCode: '30201-2002', subjectName: 'การบัญชีต้นทุน 1', level: 'ปวส.', classGroup: 'ส.บช.1/2', room: 'ห้องบัญชี 402', periodHours: 5, isOnlineApproved: false, academicTerm: '2/2568' },
  { id: 'S025', teacherId: 'T0006', dayOfWeek: 'พุธ', startTime: '08:30', endTime: '13:30', subjectCode: '30201-2003', subjectName: 'ระบบสารสนเทศทางการบัญชี', level: 'ปวส.', classGroup: 'ส.บช.2/1', room: 'ห้องคอมพ์บัญชี', periodHours: 5, isOnlineApproved: true, academicTerm: '2/2568' },
  { id: 'S026', teacherId: 'T0006', dayOfWeek: 'พฤหัสบดี', startTime: '08:30', endTime: '12:30', subjectCode: '30201-2005', subjectName: 'การสอบบัญชี', level: 'ปวส.', classGroup: 'ส.บช.2/2', room: 'ห้องบัญชี 403', periodHours: 4, isOnlineApproved: false, academicTerm: '2/2568' },

  // T0007 (นางสาวมยุรี ตัวเลขแม่น - สอนอย่างเดียว เกณฑ์ 18 ชม.) สอน ปวช. 24 ชม. -> เกิน 6 ชม.
  { id: 'S027', teacherId: 'T0007', dayOfWeek: 'จันทร์', startTime: '08:30', endTime: '14:30', subjectCode: '20201-2001', subjectName: 'การบัญชีเบื้องต้น 1', level: 'ปวช.', classGroup: 'บช.1/1', room: 'ห้องปฏิบัติการ 201', periodHours: 6, isOnlineApproved: false, academicTerm: '2/2568' },
  { id: 'S028', teacherId: 'T0007', dayOfWeek: 'อังคาร', startTime: '08:30', endTime: '14:30', subjectCode: '20201-2002', subjectName: 'การบัญชีเบื้องต้น 2', level: 'ปวช.', classGroup: 'บช.1/2', room: 'ห้องปฏิบัติการ 202', periodHours: 6, isOnlineApproved: false, academicTerm: '2/2568' },
  { id: 'S029', teacherId: 'T0007', dayOfWeek: 'พุธ', startTime: '08:30', endTime: '14:30', subjectCode: '20201-2003', subjectName: 'การบัญชีร่วมค้าและฝากขาย', level: 'ปวช.', classGroup: 'บช.2/1', room: 'ห้องปฏิบัติการ 203', periodHours: 6, isOnlineApproved: false, academicTerm: '2/2568' },
  { id: 'S030', teacherId: 'T0007', dayOfWeek: 'ศุกร์', startTime: '08:30', endTime: '14:30', subjectCode: '20201-2004', subjectName: 'การบัญชีตั๋วเงิน', level: 'ปวช.', classGroup: 'บช.2/2', room: 'ห้องปฏิบัติการ 204', periodHours: 6, isOnlineApproved: false, academicTerm: '2/2568' },

  // T0008 (นายวรพงศ์ ไอทีเจริญ - สอนอย่างเดียว เกณฑ์ 18 ชม.) สอน ปวช. 12 ชม. + ปวส. 16 ชม. = 28 ชม. -> เกิน 10 ชม. แต่มีชั่วโมงเกินเพดาน 12 ชม./สัปดาห์ (ทดสอบกรณีเพดาน)
  { id: 'S031', teacherId: 'T0008', dayOfWeek: 'จันทร์', startTime: '08:30', endTime: '14:30', subjectCode: '20204-2001', subjectName: 'การเขียนโปรแกรมคอมพิวเตอร์', level: 'ปวช.', classGroup: 'คอม.1/1', room: 'แล็บคอม 1', periodHours: 6, isOnlineApproved: false, academicTerm: '2/2568' },
  { id: 'S032', teacherId: 'T0008', dayOfWeek: 'อังคาร', startTime: '08:30', endTime: '14:30', subjectCode: '20204-2002', subjectName: 'การสร้างเว็บไซต์', level: 'ปวช.', classGroup: 'คอม.1/2', room: 'แล็บคอม 2', periodHours: 6, isOnlineApproved: false, academicTerm: '2/2568' },
  { id: 'S033', teacherId: 'T0008', dayOfWeek: 'พุธ', startTime: '08:30', endTime: '16:30', subjectCode: '30204-2001', subjectName: 'การพัฒนาโปรแกรมบนอุปกรณ์เคลื่อนที่', level: 'ปวส.', classGroup: 'ส.คอม.1/1', room: 'แล็บคอม 3', periodHours: 8, isOnlineApproved: true, academicTerm: '2/2568' },
  { id: 'S034', teacherId: 'T0008', dayOfWeek: 'พฤหัสบดี', startTime: '08:30', endTime: '16:30', subjectCode: '30204-2003', subjectName: 'การวิเคราะห์และออกแบบระบบ', level: 'ปวส.', classGroup: 'ส.คอม.2/1', room: 'แล็บคอม 4', periodHours: 8, isOnlineApproved: false, academicTerm: '2/2568' },

  // T0009 (นายธีรศักดิ์ - รอง ผอ. เกณฑ์ 6 ชม.) สอน ปวส. 10 ชม. -> เกิน 4 ชม.
  { id: 'S035', teacherId: 'T0009', dayOfWeek: 'อังคาร', startTime: '13:00', endTime: '18:00', subjectCode: '30000-1101', subjectName: 'การบริหารจัดการและการเป็นผู้ประกอบการ', level: 'ปวส.', classGroup: 'ส.รวม 1', room: 'หอประชุมวิทยวิวัฒน์', periodHours: 5, isOnlineApproved: false, academicTerm: '2/2568' },
  { id: 'S036', teacherId: 'T0009', dayOfWeek: 'พฤหัสบดี', startTime: '13:00', endTime: '18:00', subjectCode: '30000-1102', subjectName: 'ภาวะผู้นำและการทำงานเป็นทีม', level: 'ปวส.', classGroup: 'ส.รวม 2', room: 'หอประชุมวิทยวิวัฒน์', periodHours: 5, isOnlineApproved: false, academicTerm: '2/2568' },

  // T0010 (นางสาวชลธิชา ภาษาไทยงาม - สอนอย่างเดียว เกณฑ์ 18 ชม.) สอน ปวช. 20 ชม. -> เกิน 2 ชม.
  { id: 'S037', teacherId: 'T0010', dayOfWeek: 'จันทร์', startTime: '08:30', endTime: '12:30', subjectCode: '20000-1101', subjectName: 'ภาษาไทยพื้นฐาน', level: 'ปวช.', classGroup: 'ชย.1/1', room: 'อาคารสามัญ 201', periodHours: 4, isOnlineApproved: false, academicTerm: '2/2568' },
  { id: 'S038', teacherId: 'T0010', dayOfWeek: 'อังคาร', startTime: '08:30', endTime: '12:30', subjectCode: '20000-1101', subjectName: 'ภาษาไทยพื้นฐาน', level: 'ปวช.', classGroup: 'ชย.1/2', room: 'อาคารสามัญ 202', periodHours: 4, isOnlineApproved: false, academicTerm: '2/2568' },
  { id: 'S039', teacherId: 'T0010', dayOfWeek: 'พุธ', startTime: '08:30', endTime: '12:30', subjectCode: '20000-1102', subjectName: 'ภาษาไทยเพื่ออาชีพ', level: 'ปวช.', classGroup: 'ชฟ.2/1', room: 'อาคารสามัญ 203', periodHours: 4, isOnlineApproved: false, academicTerm: '2/2568' },
  { id: 'S040', teacherId: 'T0010', dayOfWeek: 'พฤหัสบดี', startTime: '08:30', endTime: '12:30', subjectCode: '20000-1102', subjectName: 'ภาษาไทยเพื่ออาชีพ', level: 'ปวช.', classGroup: 'บช.2/1', room: 'อาคารสามัญ 204', periodHours: 4, isOnlineApproved: false, academicTerm: '2/2568' },
  { id: 'S041', teacherId: 'T0010', dayOfWeek: 'ศุกร์', startTime: '08:30', endTime: '12:30', subjectCode: '20000-1103', subjectName: 'การพัฒนาทักษะการสื่อสารภาษาไทย', level: 'ปวช.', classGroup: 'คอม.2/1', room: 'อาคารสามัญ 205', periodHours: 4, isOnlineApproved: false, academicTerm: '2/2568' }
];

export const INITIAL_DUTIES: DutyItem[] = [
  {
    id: 'D001',
    teacherId: 'T0002',
    dutyType: 'หัวหน้าแผนกวิชา',
    title: 'ปฏิบัติหน้าที่หัวหน้าแผนกวิชาช่างยนต์ ประจำภาคเรียนที่ 2/2568',
    orderNumber: 'วศ. 142/2568 ลงวันที่ 20 ต.ค. 2568',
    approvedHoursPerWeek: 6,
    startDate: '2026-10-25',
    endDate: '2027-03-15',
    status: 'ACTIVE'
  },
  {
    id: 'D002',
    teacherId: 'T0003',
    dutyType: 'หัวหน้างาน',
    title: 'ปฏิบัติหน้าที่หัวหน้างานกิจกรรมนักเรียนนักศึกษา',
    orderNumber: 'วศ. 150/2568 ลงวันที่ 25 ต.ค. 2568',
    approvedHoursPerWeek: 4,
    startDate: '2026-10-25',
    endDate: '2027-03-15',
    status: 'ACTIVE'
  },
  {
    id: 'D003',
    teacherId: 'T0004',
    dutyType: 'หัวหน้าแผนกวิชา',
    title: 'ปฏิบัติหน้าที่หัวหน้าแผนกวิชาช่างไฟฟ้ากำลัง ประจำภาคเรียนที่ 2/2568',
    orderNumber: 'วศ. 143/2568 ลงวันที่ 20 ต.ค. 2568',
    approvedHoursPerWeek: 6,
    startDate: '2026-10-25',
    endDate: '2027-03-15',
    status: 'ACTIVE'
  },
  {
    id: 'D004',
    teacherId: 'T0006',
    dutyType: 'หัวหน้าแผนกวิชา',
    title: 'ปฏิบัติหน้าที่หัวหน้าแผนกวิชาการบัญชี ประจำภาคเรียนที่ 2/2568',
    orderNumber: 'วศ. 144/2568 ลงวันที่ 20 ต.ค. 2568',
    approvedHoursPerWeek: 6,
    startDate: '2026-10-25',
    endDate: '2027-03-15',
    status: 'ACTIVE'
  },
  {
    id: 'D005',
    teacherId: 'T0009',
    dutyType: 'หน้าที่พิเศษตามคำสั่ง',
    title: 'ปฏิบัติหน้าที่รองผู้อำนวยการฝ่ายวิชาการ',
    orderNumber: 'วศ. 002/2568 ลงวันที่ 1 ต.ค. 2568',
    approvedHoursPerWeek: 20,
    startDate: '2026-10-01',
    endDate: '2027-09-30',
    status: 'ACTIVE'
  }
];

export const INITIAL_SUBSTITUTES: SubstituteRecord[] = [
  {
    id: 'SUB001',
    academicTerm: '2/2568',
    originalDate: '2026-11-10',
    originalTime: '08:30 - 12:30',
    subjectCode: '20101-2001',
    subjectName: 'งานเครื่องยนต์แก๊สโซลีน',
    level: 'ปวช.',
    hours: 4,
    reason: 'ไปราชการ',
    originalTeacherId: 'T0001',
    substituteTeacherId: 'T0003',
    actualTaughtDate: '2026-11-10',
    orderNumber: 'บันทึกข้อความ วศ.สอนแทน 45/2568',
    documentRef: 'แนบสำเนาคำสั่งไปราชการและบันทึกขออนุญาตสอนแทน',
    verified: true,
    notes: 'สอนแทนวิชาปฏิบัติการเครื่องยนต์แก๊สโซลีน ชย.1/1 ครบถ้วนตามแผน'
  },
  {
    id: 'SUB002',
    academicTerm: '2/2568',
    originalDate: '2026-12-05',
    originalTime: '08:30 - 11:30',
    subjectCode: '30201-2001',
    subjectName: 'การบัญชีชั้นกลาง 1',
    level: 'ปวส.',
    hours: 3,
    reason: 'ลาป่วย',
    originalTeacherId: 'T0006',
    substituteTeacherId: 'T0007',
    actualTaughtDate: '2026-12-05',
    orderNumber: 'วศ.สอนแทน 52/2568',
    documentRef: 'แนบใบรับรองแพทย์และบันทึกขออนุญาต',
    verified: true,
    notes: 'สอนแทนตามเนื้อหาบทที่ 4 การบันทึกบัญชีสินค้าคงเหลือ'
  },
  {
    id: 'SUB003',
    academicTerm: '2/2568',
    originalDate: '2026-12-18',
    originalTime: '13:30 - 16:30',
    subjectCode: '20104-2005',
    subjectName: 'การติดตั้งไฟฟ้าในอาคาร',
    level: 'ปวช.',
    hours: 3,
    reason: 'กิจกรรมสถานศึกษา',
    originalTeacherId: 'T0005',
    substituteTeacherId: 'T0004',
    actualTaughtDate: '2026-12-18',
    orderNumber: '', // Missing order number! (Anomaly simulation)
    documentRef: 'ยังไม่ส่งเอกสารคำสั่ง',
    verified: false,
    notes: 'ยังไม่มีเลขที่คำสั่งอนุมัติจากงานวิชาการ รอการตรวจสอบ'
  }
];

export const INITIAL_TEACHING_RECORDS: TeachingRecord[] = [
  {
    id: 'REC001',
    teacherId: 'T0001',
    academicTerm: '2/2568',
    weekNumber: 1,
    subjectCode: '20101-2001',
    level: 'ปวช.',
    scheduledHours: 4,
    actualTaughtHours: 4,
    substituteGivenHours: 0,
    substituteTakenHours: 0,
    compensatoryHours: 0,
    recordedDate: '2026-11-03',
    status: 'COMPLETED'
  },
  {
    id: 'REC002',
    teacherId: 'T0001',
    academicTerm: '2/2568',
    weekNumber: 1,
    subjectCode: '30101-1001',
    level: 'ปวส.',
    scheduledHours: 3,
    actualTaughtHours: 3,
    substituteGivenHours: 0,
    substituteTakenHours: 0,
    compensatoryHours: 0,
    recordedDate: '2026-11-04',
    status: 'COMPLETED'
  },
  {
    id: 'REC003',
    teacherId: 'T0002',
    academicTerm: '2/2568',
    weekNumber: 1,
    subjectCode: '30101-2003',
    level: 'ปวส.',
    scheduledHours: 4,
    actualTaughtHours: 4,
    substituteGivenHours: 0,
    substituteTakenHours: 0,
    compensatoryHours: 0,
    recordedDate: '2026-11-03',
    status: 'COMPLETED'
  }
];

export const INITIAL_RULES: CalculationRule[] = [
  {
    ruleId: 'R01',
    category: 'สอนอย่างเดียว',
    level: 'ปวช.',
    minTeachingHours: 18,
    minDutyHours: 0,
    maxClaimableOverloadHours: 12,
    allowOnlineRatio: 0.5,
    dualLevelRatioPvcToPvs: 1.0,
    conditionDescription: 'สอน ปวช. เพียงระดับเดียว เกณฑ์ปกติ 18 ชม./สัปดาห์ ส่วนที่เกิน 18 ชม. มีสิทธิเบิกไม่เกิน 12 ชม./สัปดาห์'
  },
  {
    ruleId: 'R02',
    category: 'สอนอย่างเดียว',
    level: 'ปวส.',
    minTeachingHours: 16,
    minDutyHours: 0,
    maxClaimableOverloadHours: 12,
    allowOnlineRatio: 0.5,
    dualLevelRatioPvcToPvs: 1.0,
    conditionDescription: 'สอน ปวส. เพียงระดับเดียว เกณฑ์ปกติ 16 ชม./สัปดาห์ ส่วนที่เกิน 16 ชม. มีสิทธิเบิกไม่เกิน 12 ชม./สัปดาห์'
  },
  {
    ruleId: 'R03',
    category: 'สอนอย่างเดียว',
    level: 'รวมทุกระดับ', // กรณีสอน 2 ระดับ
    minTeachingHours: 18,
    minDutyHours: 0,
    maxClaimableOverloadHours: 12,
    allowOnlineRatio: 0.5,
    dualLevelRatioPvcToPvs: 1.125, // ข้อ 17
    conditionDescription: 'กรณีสอน 2 ระดับ (ปวช.+ปวส.) ปันส่วนภาระงานสอนขั้นต่ำตามสัดส่วนชั่วโมงสอนแต่ละระดับ และแยกคิดอัตราค่าสอนตามระดับ'
  },
  {
    ruleId: 'R04',
    category: 'สอน + หัวหน้าแผนกวิชา',
    level: 'รวมทุกระดับ',
    minTeachingHours: 12,
    minDutyHours: 6,
    maxClaimableOverloadHours: 12,
    allowOnlineRatio: 0.5,
    dualLevelRatioPvcToPvs: 1.125,
    conditionDescription: 'หัวหน้าแผนกวิชา ได้รับการลดหย่อนภาระสอนเหลือขั้นต่ำ 12 ชม./สัปดาห์ + หน้าที่ 6 ชม. ส่วนที่เกิน 12 ชม. มีสิทธิ์เบิก'
  },
  {
    ruleId: 'R05',
    category: 'สอน + หัวหน้างาน',
    level: 'รวมทุกระดับ',
    minTeachingHours: 14,
    minDutyHours: 4,
    maxClaimableOverloadHours: 12,
    allowOnlineRatio: 0.5,
    dualLevelRatioPvcToPvs: 1.125,
    conditionDescription: 'หัวหน้างาน ได้รับการลดหย่อนภาระสอนเหลือขั้นต่ำ 14 ชม./สัปดาห์ + หน้าที่ 4 ชม. ส่วนที่เกิน 14 ชม. มีสิทธิ์เบิก'
  },
  {
    ruleId: 'R06',
    category: 'สอน + หัวหน้าธุรการ/หน้าที่อื่น',
    level: 'รวมทุกระดับ',
    minTeachingHours: 14,
    minDutyHours: 4,
    maxClaimableOverloadHours: 12,
    allowOnlineRatio: 0.5,
    dualLevelRatioPvcToPvs: 1.125,
    conditionDescription: 'หัวหน้าธุรการหรือหน้าที่พิเศษตามระเบียบ ขั้นต่ำ 14 ชม./สัปดาห์ + หน้าที่ 4 ชม. ส่วนที่เกิน 14 ชม. มีสิทธิ์เบิก'
  },
  {
    ruleId: 'R07',
    category: 'รองผู้อำนวยการ',
    level: 'รวมทุกระดับ',
    minTeachingHours: 6,
    minDutyHours: 20,
    maxClaimableOverloadHours: 6,
    allowOnlineRatio: 0.5,
    dualLevelRatioPvcToPvs: 1.125,
    conditionDescription: 'รองผู้อำนวยการ สอนขั้นต่ำ 6 ชม./สัปดาห์ และหน้าที่บริหาร 20 ชม. เพดานเบิกจ่ายไม่เกิน 6 ชม./สัปดาห์'
  },
  {
    ruleId: 'R08',
    category: 'ผู้อำนวยการ',
    level: 'รวมทุกระดับ',
    minTeachingHours: 4,
    minDutyHours: 25,
    maxClaimableOverloadHours: 4,
    allowOnlineRatio: 0.5,
    dualLevelRatioPvcToPvs: 1.125,
    conditionDescription: 'ผู้อำนวยการ สอนขั้นต่ำ 4 ชม./สัปดาห์ และหน้าที่บริหาร 25 ชม. เพดานเบิกจ่ายไม่เกิน 4 ชม./สัปดาห์'
  }
];

export const INITIAL_RATES: TeachingRate[] = [
  {
    rateId: 'RATE_PVC',
    title: 'ค่าสอนเกินภาระงานสอน ระดับประกาศนียบัตรวิชาชีพ (ปวช.)',
    level: 'ปวช.',
    ratePerHour: 200,
    effectiveDate: '2568-10-25',
    remarks: 'ตามระเบียบ สอศ. พ.ศ. 2568 หมวด 2 ข้อ 20'
  },
  {
    rateId: 'RATE_PVS',
    title: 'ค่าสอนเกินภาระงานสอน ระดับประกาศนียบัตรวิชาชีพชั้นสูง (ปวส.)',
    level: 'ปวส.',
    ratePerHour: 250,
    effectiveDate: '2568-10-25',
    remarks: 'ตามระเบียบ สอศ. พ.ศ. 2568 หมวด 2 ข้อ 20'
  },
  {
    rateId: 'RATE_BACHELOR',
    title: 'ค่าสอนเกินภาระงานสอน ระดับปริญญาตรีสายเทคโนโลยี (ทล.บ.)',
    level: 'ปริญญาตรี (ทล.บ.)',
    ratePerHour: 300,
    effectiveDate: '2568-10-25',
    remarks: 'ตามระเบียบ สอศ. พ.ศ. 2568 หมวด 2 ข้อ 20'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'LOG001',
    timestamp: '2026-11-01 09:15:30',
    userId: 'U001',
    userName: 'นายสมบูรณ์ บริหารงาน',
    userRole: 'ADMIN',
    action: 'INIT_SYSTEM',
    targetId: 'SYSTEM',
    targetType: 'RULE',
    details: 'เริ่มต้นระบบ SMART OT TEACHING ภาคเรียนที่ 2/2568 นำเข้าเกณฑ์ระเบียบ สอศ. พ.ศ. 2568'
  },
  {
    id: 'LOG002',
    timestamp: '2026-11-02 14:20:10',
    userId: 'U002',
    userName: 'นางอรวรรณ วิชาการเลิศ',
    userRole: 'ACADEMIC',
    action: 'IMPORT_SCHEDULE',
    targetId: 'SCHEDULE_BATCH_01',
    targetType: 'SCHEDULE',
    details: 'นำเข้าตารางสอนภาคเรียนที่ 2/2568 จำนวน 41 รายวิชา'
  },
  {
    id: 'LOG003',
    timestamp: '2026-11-05 10:05:44',
    userId: 'U004',
    userName: 'นางสาววิภาดา พัฒนกิจ',
    userRole: 'TEACHER',
    action: 'SUBMIT_CALCULATION',
    targetId: 'T0001',
    targetType: 'APPROVAL',
    details: 'ผู้สอนตรวจสอบและยืนยันข้อมูลชั่วโมงสอน 2 ระดับ ปวช.+ปวส. ส่งต่อหัวหน้าแผนก'
  },
  {
    id: 'LOG004',
    timestamp: '2026-11-06 11:30:00',
    userId: 'U003',
    userName: 'นายประสิทธิ์ กิจประเสริฐ',
    userRole: 'HEAD',
    action: 'ENDORSE_CALCULATION',
    targetId: 'T0001',
    targetType: 'APPROVAL',
    details: 'หัวหน้าแผนกวิชาช่างยนต์ ตรวจสอบและรับรองข้อมูลของ นางสาววิภาดา พัฒนกิจ'
  }
];
