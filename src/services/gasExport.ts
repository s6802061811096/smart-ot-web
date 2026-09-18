export interface SheetStructure {
  name: string;
  description: string;
  columns: string[];
  sampleRow: string[];
}

export const GOOGLE_SHEETS_STRUCTURE: SheetStructure[] = [
  {
    name: 'Settings',
    description: 'การตั้งค่าระบบ ภาคเรียน ปีการศึกษา และสถานศึกษา',
    columns: ['SettingKey', 'SettingValue', 'Description', 'LastUpdated'],
    sampleRow: ['ACADEMIC_TERM', '2/2568', 'ภาคเรียนและปีการศึกษาปัจจุบัน', '2026-10-25']
  },
  {
    name: 'Users',
    description: 'บัญชีผู้ใช้งาน สิทธิ์ และรหัสผ่านแฮช',
    columns: ['UserID', 'Username', 'FullName', 'Role', 'DepartmentID', 'TeacherID', 'Email', 'Status'],
    sampleRow: ['U001', 'wiphada', 'นางสาววิภาดา พัฒนกิจ', 'TEACHER', 'DEP01', 'T0001', 'wiphada@vocational.ac.th', 'ACTIVE']
  },
  {
    name: 'Teachers',
    description: 'ข้อมูลครูผู้สอน ตำแหน่ง ภาระงานขั้นต่ำ และประเภทผู้สอน',
    columns: ['TeacherID', 'Prefix', 'FirstName', 'LastName', 'Position', 'AcademicStanding', 'DepartmentID', 'Category', 'Levels', 'BaseTeachingQuota', 'BaseDutyQuota', 'Status', 'Phone'],
    sampleRow: ['T0001', 'นางสาว', 'วิภาดา', 'พัฒนกิจ', 'ครู', 'ครู', 'DEP01', 'สอนอย่างเดียว', 'ปวช.,ปวส.', '18', '0', 'ปฏิบัติงาน', '081-234-5678']
  },
  {
    name: 'Departments',
    description: 'แผนกวิชา คณะวิชา และหัวหน้าแผนก',
    columns: ['DepartmentID', 'Code', 'DepartmentName', 'Faculty', 'HeadTeacherID', 'TotalTeachers'],
    sampleRow: ['DEP01', 'AUTO', 'แผนกวิชาช่างยนต์', 'ช่างอุตสาหกรรม', 'T0002', '8']
  },
  {
    name: 'Subjects',
    description: 'หลักสูตรรายวิชา รหัสวิชา ชื่อวิชา ทฤษฎี ปฏิบัติ หน่วยกิต',
    columns: ['SubjectCode', 'SubjectName', 'Level', 'TheoryHours', 'PracticeHours', 'Credits', 'DepartmentID'],
    sampleRow: ['20101-2001', 'งานเครื่องยนต์แก๊สโซลีน', 'ปวช.', '1', '6', '3', 'DEP01']
  },
  {
    name: 'Classes',
    description: 'กลุ่มเรียน ห้องเรียน และจำนวนผู้เรียน',
    columns: ['ClassGroupID', 'Level', 'Year', 'GroupNo', 'DepartmentID', 'StudentCount'],
    sampleRow: ['ชย.1/1', 'ปวช.', '1', '1', 'DEP01', '35']
  },
  {
    name: 'TeachingSchedule',
    description: 'ตารางสอนประจำภาคเรียน วัน เวลา ห้องเรียน และผู้สอน',
    columns: ['ScheduleID', 'TeacherID', 'DayOfWeek', 'StartTime', 'EndTime', 'SubjectCode', 'SubjectName', 'Level', 'ClassGroup', 'Room', 'PeriodHours', 'IsOnlineApproved', 'Term'],
    sampleRow: ['S001', 'T0001', 'จันทร์', '08:30', '12:30', '20101-2001', 'งานเครื่องยนต์แก๊สโซลีน', 'ปวช.', 'ชย.1/1', 'อาคารช่างยนต์ 101', '4', 'FALSE', '2/2568']
  },
  {
    name: 'Duties',
    description: 'ภาระหน้าที่พิเศษที่ได้รับมอบหมายตามคำสั่ง',
    columns: ['DutyID', 'TeacherID', 'DutyType', 'Title', 'OrderNumber', 'ApprovedHoursPerWeek', 'StartDate', 'EndDate', 'Status'],
    sampleRow: ['D001', 'T0002', 'หัวหน้าแผนกวิชา', 'ปฏิบัติหน้าที่หัวหน้าแผนกวิชาช่างยนต์', 'วศ. 142/2568', '6', '2026-10-25', '2027-03-15', 'ACTIVE']
  },
  {
    name: 'TeachingRecords',
    description: 'บันทึกการสอนรายสัปดาห์ การสอนแทน และสอนชดเชย',
    columns: ['RecordID', 'Term', 'WeekNo', 'TeacherID', 'SubjectCode', 'Level', 'ScheduledHours', 'ActualHours', 'SubGivenHours', 'SubTakenHours', 'Notes', 'RecordedDate'],
    sampleRow: ['REC001', '2/2568', '1', 'T0001', '20101-2001', 'ปวช.', '4', '4', '0', '0', 'สอนตามแผนการสอนปกติ', '2026-11-03']
  },
  {
    name: 'Rules',
    description: 'กฎและเกณฑ์การคำนวณตามระเบียบ สอศ. พ.ศ. 2568',
    columns: ['RuleID', 'Category', 'Level', 'MinTeachingHours', 'MinDutyHours', 'MaxClaimableOverload', 'AllowOnlineRatio', 'DualLevelRatio', 'ConditionDescription'],
    sampleRow: ['R01', 'สอนอย่างเดียว', 'ปวช.', '18', '0', '12', '0.5', '1.0', 'เกณฑ์ปกติ 18 ชม. เกินเบิกได้ไม่เกิน 12 ชม./สัปดาห์']
  },
  {
    name: 'Rates',
    description: 'อัตราค่าสอนเกินภาระงานต่อชั่วโมงแยกตามระดับ',
    columns: ['RateID', 'Title', 'Level', 'RatePerHour', 'EffectiveDate', 'Remarks'],
    sampleRow: ['RATE_PVC', 'ค่าสอนเกินภาระงาน ปวช.', 'ปวช.', '200', '2568-10-25', 'ระเบียบ สอศ. 2568 หมวด 2 ข้อ 20']
  },
  {
    name: 'OT_Calculation',
    description: 'ผลการคำนวณสิทธิ์ค่าสอนเกินภาระงานสอนรายบุคคล',
    columns: ['TeacherID', 'TeacherName', 'Category', 'WeeklyActualHours', 'MinQuota', 'GrossOverload', 'ClaimableHours', 'UnclaimedHours', 'DualLevelDetail', 'TotalAmount', 'Status', 'Term'],
    sampleRow: ['T0001', 'นางสาววิภาดา พัฒนกิจ', 'สอนอย่างเดียว', '24', '18', '108', '108', '0', 'ปวช. 63 ชม. (12,600 บ.) + ปวส. 45 ชม. (11,250 บ.)', '23850', 'ELIGIBLE', '2/2568']
  },
  {
    name: 'OT_Approval',
    description: 'สถานะ Workflow การตรวจสอบและอนุมัติการเบิกจ่าย',
    columns: ['TeacherID', 'Term', 'ApprovalStage', 'TeacherConfirmedDate', 'HeadApprovedDate', 'AcademicVerifiedDate', 'DirectorApprovedDate', 'FinanceDisbursedDate', 'Remarks'],
    sampleRow: ['T0001', '2/2568', 'HEAD_ENDORSED', '2026-11-05', '2026-11-06', '', '', '', 'หัวหน้าแผนกตรวจสอบตารางสอนและรับรองแล้ว']
  },
  {
    name: 'AuditLog',
    description: 'บันทึกประวัติการแก้ไขและดำเนินการทั้งหมดในระบบ',
    columns: ['LogID', 'Timestamp', 'UserID', 'UserName', 'Role', 'Action', 'TargetID', 'TargetType', 'Details'],
    sampleRow: ['LOG001', '2026-11-01 09:15:30', 'U001', 'นายสมบูรณ์ บริหารงาน', 'ADMIN', 'INIT_SYSTEM', 'SYSTEM', 'RULE', 'เริ่มต้นระบบ ภาคเรียนที่ 2/2568']
  }
];

export const GAS_SCRIPTS = [
  {
    filename: 'Code.gs',
    description: 'จุดเริ่มต้น Web App (doGet/doPost) และ Router หลัก',
    code: `/**
 * SMART OT TEACHING - Google Apps Script
 * ระเบียบ สอศ. ว่าด้วยค่าสอนเกินภาระงานสอน พ.ศ. 2568
 */

function doGet(e) {
  var template = HtmlService.createTemplateFromFile('index');
  template.initialData = getInitialSystemData();
  return template.evaluate()
    .setTitle('SMART OT TEACHING - ระบบคำนวณค่าสอนเกินภาระงานสอน')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getInitialSystemData() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  return {
    settings: getSheetDataAsJson(ss.getSheetByName('Settings')),
    teachers: getSheetDataAsJson(ss.getSheetByName('Teachers')),
    schedules: getSheetDataAsJson(ss.getSheetByName('TeachingSchedule')),
    rules: getSheetDataAsJson(ss.getSheetByName('Rules')),
    rates: getSheetDataAsJson(ss.getSheetByName('Rates')),
    approvals: getSheetDataAsJson(ss.getSheetByName('OT_Approval'))
  };
}

function getSheetDataAsJson(sheet) {
  if (!sheet) return [];
  var values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];
  var headers = values[0];
  var result = [];
  for (var i = 1; i < values.length; i++) {
    var row = values[i];
    var obj = {};
    for (var j = 0; j < headers.length; j++) {
      obj[headers[j]] = row[j];
    }
    result.push(obj);
  }
  return result;
}`
  },
  {
    filename: 'RuleEngine.gs',
    description: 'ประมวลผลเกณฑ์ตามระเบียบ สอศ. พ.ศ. 2568 (ข้อ 16-23)',
    code: `/**
 * RuleEngine.gs
 * ตรวจสอบประเภทผู้สอน เกณฑ์ภาระงานขั้นต่ำ และการสอน 2 ระดับตามข้อ 17
 */

function evaluateTeacherEligibility(teacher, schedules, duties, rules) {
  var term = "2/2568";
  var teacherSchedules = schedules.filter(function(s) {
    return s.TeacherID === teacher.TeacherID && s.Term === term;
  });
  
  var pvcHours = 0;
  var pvsHours = 0;
  for (var i = 0; i < teacherSchedules.length; i++) {
    var item = teacherSchedules[i];
    var hours = Number(item.PeriodHours) || 0;
    if (item.Level === 'ปวช.') pvcHours += hours;
    if (item.Level === 'ปวส.') pvsHours += hours;
  }
  
  var totalWeeklyHours = pvcHours + pvsHours;
  var isDual = (pvcHours > 0 && pvsHours > 0);
  
  // ค้นหากฎที่ตรงกัน
  var matchedRule = rules.find(function(r) {
    return r.Category === teacher.Category && (r.Level === 'รวมทุกระดับ' || r.Level === 'ปวช.');
  }) || { MinTeachingHours: 18, MaxClaimableOverload: 12 };
  
  var minHours = Number(matchedRule.MinTeachingHours);
  var maxCap = Number(matchedRule.MaxClaimableOverload);
  
  var isEligible = totalWeeklyHours >= minHours;
  var weeklyGrossOverload = Math.max(0, totalWeeklyHours - minHours);
  var weeklyClaimable = Math.min(weeklyGrossOverload, maxCap);
  var weeklyUnclaimed = Math.max(0, weeklyGrossOverload - maxCap);
  
  return {
    teacherId: teacher.TeacherID,
    isEligible: isEligible,
    isDual: isDual,
    pvcHours: pvcHours,
    pvsHours: pvsHours,
    totalWeeklyHours: totalWeeklyHours,
    minTeachingQuota: minHours,
    weeklyGrossOverload: weeklyGrossOverload,
    weeklyClaimable: weeklyClaimable,
    weeklyUnclaimed: weeklyUnclaimed,
    totalClaimableSemester: weeklyClaimable * 18,
    totalUnclaimedSemester: weeklyUnclaimed * 18
  };
}`
  },
  {
    filename: 'Calculation.gs',
    description: 'คำนวณชั่วโมงเกินภาระงาน ยอดเงิน และบันทึกลงชีต OT_Calculation',
    code: `/**
 * Calculation.gs
 * คำนวณยอดเงินและบันทึกลง Google Sheet
 */

function runFullRecalculation() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var teachers = getSheetDataAsJson(ss.getSheetByName('Teachers'));
  var schedules = getSheetDataAsJson(ss.getSheetByName('TeachingSchedule'));
  var duties = getSheetDataAsJson(ss.getSheetByName('Duties'));
  var rules = getSheetDataAsJson(ss.getSheetByName('Rules'));
  var rates = getSheetDataAsJson(ss.getSheetByName('Rates'));
  
  var pvcRate = 200;
  var pvsRate = 250;
  
  var calcSheet = ss.getSheetByName('OT_Calculation');
  if (!calcSheet) {
    calcSheet = ss.insertSheet('OT_Calculation');
    calcSheet.appendRow(['TeacherID', 'TeacherName', 'Category', 'WeeklyActualHours', 'MinQuota', 'GrossOverload', 'ClaimableHours', 'UnclaimedHours', 'DualLevelDetail', 'TotalAmount', 'Status', 'Term']);
  } else {
    calcSheet.clearContents();
    calcSheet.appendRow(['TeacherID', 'TeacherName', 'Category', 'WeeklyActualHours', 'MinQuota', 'GrossOverload', 'ClaimableHours', 'UnclaimedHours', 'DualLevelDetail', 'TotalAmount', 'Status', 'Term']);
  }
  
  for (var i = 0; i < teachers.length; i++) {
    var t = teachers[i];
    var res = evaluateTeacherEligibility(t, schedules, duties, rules);
    
    var totalAmount = 0;
    var detail = '';
    
    if (res.isDual && res.isEligible) {
      // ปันส่วนตามข้อ 17
      var pvcRatio = res.pvcHours / res.totalWeeklyHours;
      var pvsRatio = res.pvsHours / res.totalWeeklyHours;
      var pvcClaim = (res.totalClaimableSemester * pvcRatio).toFixed(1);
      var pvsClaim = (res.totalClaimableSemester * pvsRatio).toFixed(1);
      var pvcBaht = Math.round(pvcClaim * pvcRate);
      var pvsBaht = Math.round(pvsClaim * pvsRate);
      totalAmount = pvcBaht + pvsBaht;
      detail = 'ปวช. ' + pvcClaim + ' ชม. (' + pvcBaht + ' บ.) + ปวส. ' + pvsClaim + ' ชม. (' + pvsBaht + ' บ.)';
    } else if (res.isEligible) {
      var rate = t.Levels === 'ปวส.' ? pvsRate : pvcRate;
      totalAmount = Math.round(res.totalClaimableSemester * rate);
      detail = t.Levels + ' @ ' + rate + ' บ./ชม.';
    }
    
    calcSheet.appendRow([
      t.TeacherID,
      t.Prefix + t.FirstName + ' ' + t.LastName,
      t.Category,
      res.totalWeeklyHours,
      res.minTeachingQuota,
      res.weeklyGrossOverload * 18,
      res.totalClaimableSemester,
      res.totalUnclaimedSemester,
      detail,
      totalAmount,
      res.isEligible ? 'ELIGIBLE' : 'INELIGIBLE',
      '2/2568'
    ]);
  }
  
  return { success: true, count: teachers.length };
}`
  },
  {
    filename: 'Approval.gs',
    description: 'Workflow การตรวจสอบ–รับรอง–อนุมัติ และบันทึก Audit Log',
    code: `/**
 * Approval.gs
 * จัดการสถานะการอนุมัติ 5 ระดับ (Teacher -> Head -> Academic -> Director -> Finance)
 */

function updateApprovalStatus(teacherId, stage, actorName, remarks) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('OT_Approval');
  var data = sheet.getDataRange().getValues();
  var nowStr = Utilities.formatDate(new Date(), "Asia/Bangkok", "yyyy-MM-dd HH:mm:ss");
  
  var rowIndex = -1;
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === teacherId) {
      rowIndex = i + 1;
      break;
    }
  }
  
  if (rowIndex > 0) {
    sheet.getRange(rowIndex, 3).setValue(stage);
    if (stage === 'HEAD_ENDORSED') sheet.getRange(rowIndex, 5).setValue(nowStr);
    if (stage === 'ACADEMIC_VERIFIED') sheet.getRange(rowIndex, 6).setValue(nowStr);
    if (stage === 'DIRECTOR_APPROVED') sheet.getRange(rowIndex, 7).setValue(nowStr);
    if (stage === 'FINANCE_PAID') sheet.getRange(rowIndex, 8).setValue(nowStr);
    sheet.getRange(rowIndex, 9).setValue(remarks || '');
  }
  
  // บันทึก Audit Log
  var auditSheet = ss.getSheetByName('AuditLog');
  if (auditSheet) {
    auditSheet.appendRow([
      'LOG-' + new Date().getTime(),
      nowStr,
      Session.getActiveUser().getEmail(),
      actorName,
      'APPROVER',
      'SET_STAGE_' + stage,
      teacherId,
      'APPROVAL',
      remarks || 'บันทึกสถานะการอนุมัติ'
    ]);
  }
  
  return { success: true };
}`
  }
];

export interface SheetSchemaItem {
  sheetName: string;
  purpose: string;
  columns: string[];
  sample: string[];
}

export interface GasFileItem {
  filename: string;
  description: string;
  content: string;
}

export const SHEET_SCHEMAS: SheetSchemaItem[] = GOOGLE_SHEETS_STRUCTURE.map(s => ({
  sheetName: s.name,
  purpose: s.description,
  columns: s.columns,
  sample: s.sampleRow
}));

export const GAS_FILES: GasFileItem[] = GAS_SCRIPTS.map(g => ({
  filename: g.filename,
  description: g.description,
  content: g.code
}));

export function generateSetupScript(): string {
  return `/**
 * SetupDatabase.gs
 * รันฟังก์ชันนี้ครั้งแรกใน Apps Script เพื่อสร้าง 14 แผ่นงานใน Google Sheets พร้อมใส่หัวคอลัมน์อัตโนมัติ
 */
function setupSmartOTDatabase() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ${JSON.stringify(SHEET_SCHEMAS, null, 2)};
  
  sheets.forEach(function(s) {
    var sheet = ss.getSheetByName(s.sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(s.sheetName);
    }
    sheet.clear();
    
    // ตั้งค่าหัวตาราง
    sheet.getRange(1, 1, 1, s.columns.length).setValues([s.columns]);
    sheet.getRange(1, 1, 1, s.columns.length)
      .setBackground('#1e293b')
      .setFontColor('#ffffff')
      .setFontWeight('bold');
      
    // ตัวอย่างแถวแรก
    if (s.sample && s.sample.length > 0) {
      sheet.getRange(2, 1, 1, s.sample.length).setValues([s.sample]);
    }
    sheet.autoResizeColumns(1, s.columns.length);
  });
  
  Browser.msgBox('สร้างฐานข้อมูล 14 แผ่นงานสำหรับ SMART OT TEACHING สำเร็จเรียบร้อยแล้ว!');
}`;
}

