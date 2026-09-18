import {
  Teacher,
  ScheduleItem,
  DutyItem,
  SubstituteRecord,
  CalculationRule,
  TeachingRate,
  OTCalculationResult,
  DualLevelBreakdown,
  MonthlyClaimItem,
  AnomalyItem,
  SemesterMonthInfo,
  SemesterGroup
} from '../types';

export const WEEKS_PER_SEMESTER = 18; // 1 ภาคเรียน มี 18 สัปดาห์ตามมาตรฐาน สอศ.

/**
 * คำนวณรายชื่อเดือนและสัปดาห์ในภาคเรียน (18 สัปดาห์ 5 งวดเดือน)
 * ภาคเรียนที่ 1: พฤษภาคม - กันยายน ของปีการศึกษานั้น
 * ภาคเรียนที่ 2: พฤศจิกายน, ธันวาคม ของปีการศึกษา และ มกราคม, กุมภาพันธ์, มีนาคม ของปีถัดไป
 */
export function getSemesterMonthsConfig(academicTerm: string): SemesterMonthInfo[] {
  const parts = academicTerm.trim().split('/');
  const semesterNum = parseInt(parts[0], 10) || 2;
  const yearBE = parseInt(parts[1], 10) || 2568;

  if (semesterNum === 1) {
    // ภาคเรียนที่ 1: พฤษภาคม, มิถุนายน, กรกฎาคม, สิงหาคม, กันยายน
    return [
      {
        monthId: `${yearBE}-05`,
        monthName: `พฤษภาคม ${yearBE}`,
        monthShortName: `พ.ค. ${String(yearBE).slice(-2)}`,
        weeksCount: 4,
        weekRange: 'สัปดาห์ที่ 1 - 4'
      },
      {
        monthId: `${yearBE}-06`,
        monthName: `มิถุนายน ${yearBE}`,
        monthShortName: `มิ.ย. ${String(yearBE).slice(-2)}`,
        weeksCount: 4,
        weekRange: 'สัปดาห์ที่ 5 - 8'
      },
      {
        monthId: `${yearBE}-07`,
        monthName: `กรกฎาคม ${yearBE}`,
        monthShortName: `ก.ค. ${String(yearBE).slice(-2)}`,
        weeksCount: 4,
        weekRange: 'สัปดาห์ที่ 9 - 12'
      },
      {
        monthId: `${yearBE}-08`,
        monthName: `สิงหาคม ${yearBE}`,
        monthShortName: `ส.ค. ${String(yearBE).slice(-2)}`,
        weeksCount: 4,
        weekRange: 'สัปดาห์ที่ 13 - 16'
      },
      {
        monthId: `${yearBE}-09`,
        monthName: `กันยายน ${yearBE}`,
        monthShortName: `ก.ย. ${String(yearBE).slice(-2)}`,
        weeksCount: 2,
        weekRange: 'สัปดาห์ที่ 17 - 18'
      }
    ];
  } else {
    // ภาคเรียนที่ 2: พฤศจิกายน, ธันวาคม และ มกราคม, กุมภาพันธ์, มีนาคม (ปีถัดไป)
    const nextYearBE = yearBE + 1;
    return [
      {
        monthId: `${yearBE}-11`,
        monthName: `พฤศจิกายน ${yearBE}`,
        monthShortName: `พ.ย. ${String(yearBE).slice(-2)}`,
        weeksCount: 4,
        weekRange: 'สัปดาห์ที่ 1 - 4'
      },
      {
        monthId: `${yearBE}-12`,
        monthName: `ธันวาคม ${yearBE}`,
        monthShortName: `ธ.ค. ${String(yearBE).slice(-2)}`,
        weeksCount: 4,
        weekRange: 'สัปดาห์ที่ 5 - 8'
      },
      {
        monthId: `${nextYearBE}-01`,
        monthName: `มกราคม ${nextYearBE}`,
        monthShortName: `ม.ค. ${String(nextYearBE).slice(-2)}`,
        weeksCount: 4,
        weekRange: 'สัปดาห์ที่ 9 - 12'
      },
      {
        monthId: `${nextYearBE}-02`,
        monthName: `กุมภาพันธ์ ${nextYearBE}`,
        monthShortName: `ก.พ. ${String(nextYearBE).slice(-2)}`,
        weeksCount: 4,
        weekRange: 'สัปดาห์ที่ 13 - 16'
      },
      {
        monthId: `${nextYearBE}-03`,
        monthName: `มีนาคม ${nextYearBE}`,
        monthShortName: `มี.ค. ${String(nextYearBE).slice(-2)}`,
        weeksCount: 2,
        weekRange: 'สัปดาห์ที่ 17 - 18'
      }
    ];
  }
}

/**
 * รายการภาคเรียนมาตรฐานและเดือนประกอบที่รองรับในระบบ
 */
export const SUPPORTED_SEMESTERS: SemesterGroup[] = [
  {
    term: '2/2568',
    label: 'ภาคเรียนที่ 2/2568 (พ.ย. 2568 - มี.ค. 2569)',
    months: getSemesterMonthsConfig('2/2568')
  },
  {
    term: '1/2569',
    label: 'ภาคเรียนที่ 1/2569 (พ.ค. 2569 - ก.ย. 2569)',
    months: getSemesterMonthsConfig('1/2569')
  },
  {
    term: '2/2569',
    label: 'ภาคเรียนที่ 2/2569 (พ.ย. 2569 - มี.ค. 2570)',
    months: getSemesterMonthsConfig('2/2569')
  },
  {
    term: '1/2570',
    label: 'ภาคเรียนที่ 1/2570 (พ.ค. 2570 - ก.ย. 2570)',
    months: getSemesterMonthsConfig('1/2570')
  },
  {
    term: '2/2570',
    label: 'ภาคเรียนที่ 2/2570 (พ.ย. 2570 - มี.ค. 2571)',
    months: getSemesterMonthsConfig('2/2570')
  }
];

export function findMatchingRule(
  teacher: Teacher,
  rules: CalculationRule[],
  isDualLevel: boolean
): CalculationRule {
  // หากสอน 2 ระดับ ให้หากฎ 'รวมทุกระดับ' ของประเภทผู้สอนนั้นก่อน
  if (isDualLevel) {
    const dualRule = rules.find(
      r => r.category === teacher.category && (r.level === 'รวมทุกระดับ' || r.level === 'ปวช.')
    );
    if (dualRule) return dualRule;
  }

  // หากสอนระดับเดียว
  const singleLevel = teacher.teachingLevels[0] || 'ปวช.';
  const rule = rules.find(
    r => r.category === teacher.category && (r.level === singleLevel || r.level === 'รวมทุกระดับ')
  );

  if (rule) return rule;

  // Fallback default rule
  return {
    ruleId: 'DEFAULT',
    category: teacher.category,
    level: 'ปวช.',
    minTeachingHours: teacher.baseTeachingQuotaHours || 18,
    minDutyHours: teacher.baseDutyQuotaHours || 0,
    maxClaimableOverloadHours: 12,
    allowOnlineRatio: 0.5,
    dualLevelRatioPvcToPvs: 1.125,
    conditionDescription: 'เกณฑ์พื้นฐานตามระเบียบ สอศ. พ.ศ. 2568'
  };
}

export function calculateTeacherOT(
  teacher: Teacher,
  schedules: ScheduleItem[],
  duties: DutyItem[],
  substitutes: SubstituteRecord[],
  rules: CalculationRule[],
  rates: TeachingRate[],
  academicTerm = '2/2568'
): OTCalculationResult {
  // 1. Filter schedules for this teacher
  const hasExactTermSchedules = schedules.some(s => s.teacherId === teacher.id && s.academicTerm === academicTerm);
  const teacherSchedules = schedules.filter(
    s => s.teacherId === teacher.id && (hasExactTermSchedules ? s.academicTerm === academicTerm : true)
  );

  // คำนวณชั่วโมงตามระดับ
  let pvcHours = 0;
  let pvsHours = 0;
  let bachelorHours = 0;

  teacherSchedules.forEach(s => {
    if (s.level === 'ปวช.') pvcHours += s.periodHours;
    else if (s.level === 'ปวส.') pvsHours += s.periodHours;
    else if (s.level === 'ปริญญาตรี (ทล.บ.)') bachelorHours += s.periodHours;
  });

  const totalWeeklyScheduled = pvcHours + pvsHours + bachelorHours;

  // 2. ตรวจสอบการสอนแทน / ชดเชย (เฉลี่ยต่อสัปดาห์หรือรวมภาคเรียน)
  // สอนแทนคนอื่น (ได้ชั่วโมงเพิ่ม)
  const substitutePlus = substitutes.filter(
    sub => sub.substituteTeacherId === teacher.id && sub.academicTerm === academicTerm && sub.verified
  );
  const totalSubPlusHours = substitutePlus.reduce((sum, sub) => sum + sub.hours, 0);

  // ให้คนอื่นสอนแทน (หักชั่วโมงออก)
  const substituteMinus = substitutes.filter(
    sub => sub.originalTeacherId === teacher.id && sub.academicTerm === academicTerm && sub.verified
  );
  const totalSubMinusHours = substituteMinus.reduce((sum, sub) => sum + sub.hours, 0);

  // เฉลี่ยผลกระทบสอนแทนต่อสัปดาห์ตลอด 18 สัปดาห์
  const weeklySubPlus = Number((totalSubPlusHours / WEEKS_PER_SEMESTER).toFixed(2));
  const weeklySubMinus = Number((totalSubMinusHours / WEEKS_PER_SEMESTER).toFixed(2));

  // 3. ภาระงานหน้าที่ที่ได้รับมอบหมาย
  const teacherDuties = duties.filter(
    d => d.teacherId === teacher.id && d.status === 'ACTIVE'
  );
  const totalWeeklyDutyHours = teacherDuties.reduce((sum, d) => sum + d.approvedHoursPerWeek, 0);

  // 4. ตรวจสอบว่าเป็นการสอน 2 ระดับหรือไม่
  const isDualLevel = (pvcHours > 0 && pvsHours > 0) || teacher.teachingLevels.length > 1;

  // 5. Match Rule
  const rule = findMatchingRule(teacher, rules, isDualLevel);

  const minTeaching = rule.minTeachingHours;
  const minDuty = rule.minDutyHours;
  const maxCapWeekly = rule.maxClaimableOverloadHours;

  // Fetch rates
  const pvcRateObj = rates.find(r => r.level === 'ปวช.');
  const pvsRateObj = rates.find(r => r.level === 'ปวส.');
  const bachRateObj = rates.find(r => r.level === 'ปริญญาตรี (ทล.บ.)');

  const pvcRate = pvcRateObj ? pvcRateObj.ratePerHour : 200;
  const pvsRate = pvsRateObj ? pvsRateObj.ratePerHour : 250;
  const bachRate = bachRateObj ? bachRateObj.ratePerHour : 300;

  // ตรวจสอบสิทธิ์เบื้องต้น (ผ่านเกณฑ์ชั่วโมงสอนขั้นต่ำหรือไม่)
  const totalWeeklyActual = totalWeeklyScheduled + (weeklySubPlus - weeklySubMinus);
  const auditNotes: string[] = [];

  let passedCheck = true;
  let status: 'ELIGIBLE' | 'INELIGIBLE' | 'NEEDS_REVIEW' = 'ELIGIBLE';
  let statusReason = 'ผ่านเกณฑ์ตามระเบียบ สอศ. พ.ศ. 2568';

  if (totalWeeklyActual < minTeaching) {
    passedCheck = false;
    status = 'INELIGIBLE';
    statusReason = `ชั่วโมงสอนไม่ถึงเกณฑ์ขั้นต่ำ (สอน ${totalWeeklyActual} ชม./สัปดาห์ < เกณฑ์ขั้นต่ำ ${minTeaching} ชม.) ไม่เกิดสิทธิเบิก`;
    auditNotes.push(`ไม่ผ่านเกณฑ์: ภาระงานสอนจริง ${totalWeeklyActual} ชม./สัปดาห์ ต่ำกว่าภาระงานสอนขั้นต่ำที่กำหนด ${minTeaching} ชม./สัปดาห์`);
  } else {
    auditNotes.push(`ผ่านเกณฑ์ภาระงานสอนขั้นต่ำ: สอนจริง ${totalWeeklyActual} ชม./สัปดาห์ (เกณฑ์ขั้นต่ำ ${minTeaching} ชม./สัปดาห์)`);
  }

  if (minDuty > 0) {
    if (totalWeeklyDutyHours < minDuty) {
      status = 'NEEDS_REVIEW';
      auditNotes.push(`แจ้งเตือนภาระหน้าที่: ปฏิบัติหน้าที่ ${totalWeeklyDutyHours} ชม./สัปดาห์ ต่ำกว่าเกณฑ์ที่ต้องรับผิดชอบ ${minDuty} ชม./สัปดาห์`);
    } else {
      auditNotes.push(`ผ่านเกณฑ์ภาระหน้าที่พิเศษ: ได้รับมอบหมาย ${totalWeeklyDutyHours} ชม./สัปดาห์ (เกณฑ์ ${minDuty} ชม./สัปดาห์)`);
    }
  }

  // 6. คำนวณชั่วโมงเกินภาระงานสอน (Overload)
  let weeklyGrossOverload = 0;
  let weeklyClaimable = 0;
  let weeklyUnclaimed = 0;

  // Dual-level breakdown details
  let dualLevelBreakdown: DualLevelBreakdown;

  if (isDualLevel && passedCheck) {
    // การสอน 2 ระดับตามข้อ 17 ของระเบียบ สอศ. 2568
    // ปันส่วนภาระงานสอนปกติ (Base Quota) ตามสัดส่วนของแต่ละระดับ
    const totalTeachingSum = pvcHours + pvsHours;
    const pvcRatio = totalTeachingSum > 0 ? pvcHours / totalTeachingSum : 0;
    const pvsRatio = totalTeachingSum > 0 ? pvsHours / totalTeachingSum : 0;

    const pvcBaseQuota = Number((minTeaching * pvcRatio).toFixed(2));
    const pvsBaseQuota = Number((minTeaching * pvsRatio).toFixed(2));

    const pvcGrossOver = Math.max(0, pvcHours - pvcBaseQuota);
    const pvsGrossOver = Math.max(0, pvsHours - pvsBaseQuota);

    weeklyGrossOverload = pvcGrossOver + pvsGrossOver;

    // ตรวจสอบเพดานเบิกจ่ายสูงสุด (Cap e.g. 12 ชม./สัปดาห์)
    if (weeklyGrossOverload > maxCapWeekly) {
      weeklyClaimable = maxCapWeekly;
      weeklyUnclaimed = weeklyGrossOverload - maxCapWeekly;
      auditNotes.push(`ชั่วโมงเกินเพดาน: เกินภาระงาน ${weeklyGrossOverload.toFixed(2)} ชม./สัปดาห์ เบิกได้ตามเพดาน ${maxCapWeekly} ชม./สัปดาห์ ส่วนที่เกิน ${weeklyUnclaimed.toFixed(2)} ชม./สัปดาห์ บันทึกเป็นชั่วโมงสอนเกินภาระงานที่ไม่ได้เบิก (ข้อ 23)`);
    } else {
      weeklyClaimable = weeklyGrossOverload;
      weeklyUnclaimed = 0;
      auditNotes.push(`ชั่วโมงเกินภาระงาน ${weeklyGrossOverload.toFixed(2)} ชม./สัปดาห์ อยู่ในเพดานที่กำหนด (${maxCapWeekly} ชม./สัปดาห์)`);
    }

    // คำนวณสัดส่วนชั่วโมงที่มีสิทธิเบิกในแต่ละระดับ
    const claimRatio = weeklyGrossOverload > 0 ? weeklyClaimable / weeklyGrossOverload : 0;
    const pvcClaimableWeekly = Number((pvcGrossOver * claimRatio).toFixed(2));
    const pvsClaimableWeekly = Number((pvsGrossOver * claimRatio).toFixed(2));

    const pvcClaimableTotal = Number((pvcClaimableWeekly * WEEKS_PER_SEMESTER).toFixed(1));
    const pvsClaimableTotal = Number((pvsClaimableWeekly * WEEKS_PER_SEMESTER).toFixed(1));

    const pvcAmount = Math.round(pvcClaimableTotal * pvcRate);
    const pvsAmount = Math.round(pvsClaimableTotal * pvsRate);

    dualLevelBreakdown = {
      isDualLevel: true,
      pvcActualHours: pvcHours,
      pvsActualHours: pvsHours,
      bachelorActualHours: bachelorHours,
      pvcBaseQuota,
      pvsBaseQuota,
      conversionMethod: `ปันส่วนภาระงานขั้นต่ำตามสัดส่วน ปวช. ${(pvcRatio * 100).toFixed(1)}% (${pvcBaseQuota} ชม.) และ ปวส. ${(pvsRatio * 100).toFixed(1)}% (${pvsBaseQuota} ชม.) ตามข้อ 17`,
      pvcClaimableHours: pvcClaimableTotal,
      pvsClaimableHours: pvsClaimableTotal,
      pvcRate,
      pvsRate,
      pvcAmount,
      pvsAmount
    };

    auditNotes.push(`สูตรเทียบชั่วโมง 2 ระดับ: ปวช. ${pvcHours} ชม. (เบิกได้ ${pvcClaimableTotal} ชม. x ${pvcRate} บาท) + ปวส. ${pvsHours} ชม. (เบิกได้ ${pvsClaimableTotal} ชม. x ${pvsRate} บาท) รวม 18 สัปดาห์`);
  } else if (passedCheck) {
    // กรณีสอนระดับเดียว
    weeklyGrossOverload = Math.max(0, totalWeeklyActual - minTeaching);

    if (weeklyGrossOverload > maxCapWeekly) {
      weeklyClaimable = maxCapWeekly;
      weeklyUnclaimed = weeklyGrossOverload - maxCapWeekly;
      auditNotes.push(`ชั่วโมงเกินเพดาน: เกินภาระงาน ${weeklyGrossOverload.toFixed(2)} ชม./สัปดาห์ เบิกได้ตามเพดาน ${maxCapWeekly} ชม./สัปดาห์ ส่วนที่เกิน ${weeklyUnclaimed.toFixed(2)} ชม./สัปดาห์ บันทึกเป็นชั่วโมงไม่ได้เบิก (ข้อ 23)`);
    } else {
      weeklyClaimable = weeklyGrossOverload;
      weeklyUnclaimed = 0;
      if (weeklyClaimable > 0) {
        auditNotes.push(`ชั่วโมงเกินภาระงาน ${weeklyGrossOverload.toFixed(2)} ชม./สัปดาห์ สามารถเบิกจ่ายได้เต็มจำนวน`);
      } else {
        auditNotes.push(`ไม่มีชั่วโมงสอนเกินภาระงาน (สอนพอดีภาระงานขั้นต่ำ)`);
      }
    }

    const singleLevel = teacher.teachingLevels[0] || 'ปวช.';
    const appliedRate = singleLevel === 'ปวส.' ? pvsRate : singleLevel === 'ปริญญาตรี (ทล.บ.)' ? bachRate : pvcRate;
    const totalClaimableSemester = Number((weeklyClaimable * WEEKS_PER_SEMESTER).toFixed(1));

    dualLevelBreakdown = {
      isDualLevel: false,
      pvcActualHours: singleLevel === 'ปวช.' ? totalWeeklyScheduled : 0,
      pvsActualHours: singleLevel === 'ปวส.' ? totalWeeklyScheduled : 0,
      bachelorActualHours: singleLevel === 'ปริญญาตรี (ทล.บ.)' ? totalWeeklyScheduled : 0,
      pvcBaseQuota: singleLevel === 'ปวช.' ? minTeaching : 0,
      pvsBaseQuota: singleLevel === 'ปวส.' ? minTeaching : 0,
      conversionMethod: `คำนวณระดับเดียว (${singleLevel}) เกณฑ์ขั้นต่ำ ${minTeaching} ชม./สัปดาห์`,
      pvcClaimableHours: singleLevel === 'ปวช.' ? totalClaimableSemester : 0,
      pvsClaimableHours: singleLevel === 'ปวส.' ? totalClaimableSemester : 0,
      pvcRate: singleLevel === 'ปวช.' ? appliedRate : 0,
      pvsRate: singleLevel === 'ปวส.' ? appliedRate : 0,
      pvcAmount: singleLevel === 'ปวช.' ? Math.round(totalClaimableSemester * appliedRate) : 0,
      pvsAmount: singleLevel === 'ปวส.' ? Math.round(totalClaimableSemester * appliedRate) : 0
    };
  } else {
    // Ineligible case
    dualLevelBreakdown = {
      isDualLevel,
      pvcActualHours: pvcHours,
      pvsActualHours: pvsHours,
      bachelorActualHours: bachelorHours,
      pvcBaseQuota: minTeaching,
      pvsBaseQuota: 0,
      conversionMethod: 'ไม่ผ่านเกณฑ์ชั่วโมงสอนขั้นต่ำ',
      pvcClaimableHours: 0,
      pvsClaimableHours: 0,
      pvcRate,
      pvsRate,
      pvcAmount: 0,
      pvsAmount: 0
    };
  }

  // 7. คำนวณผลลัพธ์รวมทั้งภาคเรียน (18 สัปดาห์)
  const actualTeachingHoursSemester = Number((totalWeeklyActual * WEEKS_PER_SEMESTER).toFixed(1));
  const requiredBaseTeachingHoursSemester = Number((minTeaching * WEEKS_PER_SEMESTER).toFixed(1));
  const grossOverloadHoursSemester = Number((weeklyGrossOverload * WEEKS_PER_SEMESTER).toFixed(1));
  const claimableOverloadHoursSemester = Number((weeklyClaimable * WEEKS_PER_SEMESTER).toFixed(1));
  const unclaimedOverloadHoursSemester = Number((weeklyUnclaimed * WEEKS_PER_SEMESTER).toFixed(1));

  // ยอดเงินรวม
  let totalAmount = 0;
  let applicableRateSummary = '';

  if (isDualLevel) {
    totalAmount = dualLevelBreakdown.pvcAmount + dualLevelBreakdown.pvsAmount;
    applicableRateSummary = `ปวช. @ ${pvcRate} บ./ชม. (${dualLevelBreakdown.pvcClaimableHours} ชม.) + ปวส. @ ${pvsRate} บ./ชม. (${dualLevelBreakdown.pvsClaimableHours} ชม.)`;
  } else {
    const singleLevel = teacher.teachingLevels[0] || 'ปวช.';
    const appliedRate = singleLevel === 'ปวส.' ? pvsRate : singleLevel === 'ปริญญาตรี (ทล.บ.)' ? bachRate : pvcRate;
    totalAmount = Math.round(claimableOverloadHoursSemester * appliedRate);
    applicableRateSummary = `${singleLevel} @ ${appliedRate} บาท/ชั่วโมง`;
  }

  // Monthly claim breakdown (จัดทำและคำนวณแยกรายเดือนตามภาคเรียน)
  const semesterMonthsConfig = getSemesterMonthsConfig(academicTerm);

  // Default approval status
  let initialApprovalStatus: any = 'DRAFT';
  if (teacher.id === 'T0001') {
    initialApprovalStatus = 'HEAD_ENDORSED'; // นางสาววิภาดา ได้รับการรับรองจากหัวหน้าแผนกแล้ว
  } else if (teacher.id === 'T0002') {
    initialApprovalStatus = 'ACADEMIC_VERIFIED'; // นายประสิทธิ์ ได้รับการตรวจสอบจากงานวิชาการแล้ว
  } else if (teacher.id === 'T0003') {
    initialApprovalStatus = 'SUBMITTED';
  } else if (teacher.id === 'T0004') {
    initialApprovalStatus = 'DIRECTOR_APPROVED';
  } else if (teacher.id === 'T0005') {
    initialApprovalStatus = 'REJECTED'; // ไม่ผ่านเกณฑ์
  }

  const monthlyBreakdown: MonthlyClaimItem[] = semesterMonthsConfig.map((m, idx) => {
    const mActual = Number((totalWeeklyActual * m.weeksCount).toFixed(1));
    const mScheduled = Number((totalWeeklyScheduled * m.weeksCount).toFixed(1));
    const mBase = Number((minTeaching * m.weeksCount).toFixed(1));
    const mOverload = Number((weeklyGrossOverload * m.weeksCount).toFixed(1));
    const mClaimable = Number((weeklyClaimable * m.weeksCount).toFixed(1));
    const mUnclaimed = Number((weeklyUnclaimed * m.weeksCount).toFixed(1));
    
    let mPvcClaimable = 0;
    let mPvsClaimable = 0;
    let mAmount = 0;

    if (isDualLevel) {
      mPvcClaimable = Number(((dualLevelBreakdown.pvcClaimableHours / WEEKS_PER_SEMESTER) * m.weeksCount).toFixed(1));
      mPvsClaimable = Number(((dualLevelBreakdown.pvsClaimableHours / WEEKS_PER_SEMESTER) * m.weeksCount).toFixed(1));
      mAmount = Math.round(mPvcClaimable * pvcRate + mPvsClaimable * pvsRate);
    } else {
      const singleLevel = teacher.teachingLevels[0] || 'ปวช.';
      const appliedRate = singleLevel === 'ปวส.' ? pvsRate : singleLevel === 'ปริญญาตรี (ทล.บ.)' ? bachRate : pvcRate;
      mPvcClaimable = singleLevel === 'ปวช.' ? mClaimable : 0;
      mPvsClaimable = singleLevel === 'ปวส.' ? mClaimable : 0;
      mAmount = Math.round(mClaimable * appliedRate);
    }

    let mStatus = initialApprovalStatus;
    if (initialApprovalStatus === 'FINANCE_PAID') {
      mStatus = 'FINANCE_PAID';
    } else if (initialApprovalStatus === 'DIRECTOR_APPROVED') {
      mStatus = idx <= 1 ? 'FINANCE_PAID' : 'DIRECTOR_APPROVED';
    } else if (initialApprovalStatus === 'HEAD_ENDORSED') {
      mStatus = idx === 0 ? 'HEAD_ENDORSED' : (idx === 1 ? 'SUBMITTED' : 'DRAFT');
    }

    // Dynamic submission date based on monthId (e.g. 2569-05 -> 2026-05-05)
    const [yStr, mStr] = m.monthId.split('-');
    const yearCE = (parseInt(yStr, 10) || 2568) - 543;
    const dateStr = `${yearCE}-${mStr}-05`;

    return {
      monthId: m.monthId,
      monthName: m.monthName,
      monthShortName: m.monthShortName,
      weeksCount: m.weeksCount,
      weekRange: m.weekRange,
      scheduledHours: mScheduled,
      actualHours: mActual,
      baseQuotaHours: mBase,
      overloadHours: mOverload,
      claimableHours: mClaimable,
      unclaimedHours: mUnclaimed,
      pvcClaimableHours: mPvcClaimable,
      pvsClaimableHours: mPvsClaimable,
      totalAmount: mAmount,
      approvalStatus: mStatus,
      submissionDate: mStatus !== 'DRAFT' ? dateStr : undefined
    };
  });

  return {
    teacherId: teacher.id,
    userId: teacher.userId,
    teacherName: `${teacher.prefix}${teacher.firstName} ${teacher.lastName}`,
    position: teacher.position,
    departmentName: teacher.departmentName,
    category: teacher.category,
    academicTerm,
    totalWeeks: WEEKS_PER_SEMESTER,

    weeklyScheduledHours: totalWeeklyScheduled,
    weeklyActualTaughtHours: totalWeeklyActual,
    weeklyDutyHours: totalWeeklyDutyHours,
    weeklySubstitutePlusHours: weeklySubPlus,
    weeklySubstituteMinusHours: weeklySubMinus,

    minTeachingHoursRequired: minTeaching,
    minDutyHoursRequired: minDuty,

    actualTeachingHours: actualTeachingHoursSemester,
    requiredBaseTeachingHours: requiredBaseTeachingHoursSemester,
    grossOverloadHours: grossOverloadHoursSemester,
    claimableOverloadHours: claimableOverloadHoursSemester,
    unclaimedOverloadHours: unclaimedOverloadHoursSemester,

    dualLevel: dualLevelBreakdown,

    applicableRateSummary,
    totalAmount,
    monthlyBreakdown,

    passedCheck,
    status,
    statusReason,
    auditNotes,

    approvalStatus: initialApprovalStatus,
    submissionDate: initialApprovalStatus !== 'DRAFT' ? '2026-11-05' : undefined,
    headApprovedDate: ['HEAD_ENDORSED', 'ACADEMIC_VERIFIED', 'DIRECTOR_APPROVED', 'FINANCE_PAID'].includes(initialApprovalStatus) ? '2026-11-06' : undefined,
    headApproverName: ['HEAD_ENDORSED', 'ACADEMIC_VERIFIED', 'DIRECTOR_APPROVED', 'FINANCE_PAID'].includes(initialApprovalStatus) ? 'นายประสิทธิ์ กิจประเสริฐ' : undefined,
    academicApprovedDate: ['ACADEMIC_VERIFIED', 'DIRECTOR_APPROVED', 'FINANCE_PAID'].includes(initialApprovalStatus) ? '2026-11-08' : undefined,
    academicApproverName: ['ACADEMIC_VERIFIED', 'DIRECTOR_APPROVED', 'FINANCE_PAID'].includes(initialApprovalStatus) ? 'นางอรวรรณ วิชาการเลิศ' : undefined,
    directorApprovedDate: ['DIRECTOR_APPROVED', 'FINANCE_PAID'].includes(initialApprovalStatus) ? '2026-11-10' : undefined,
    directorApproverName: ['DIRECTOR_APPROVED', 'FINANCE_PAID'].includes(initialApprovalStatus) ? 'นายสมบูรณ์ บริหารงาน (ผอ.)' : undefined,
    rejectionReason: initialApprovalStatus === 'REJECTED' ? 'ชั่วโมงสอนจริง 16 ชม. ไม่ถึงเกณฑ์ขั้นต่ำ 18 ชม./สัปดาห์ ไม่สามารถเบิกจ่ายได้ตามระเบียบ' : undefined
  };
}

export function detectAnomalies(
  teachers: Teacher[],
  schedules: ScheduleItem[],
  duties: DutyItem[],
  substitutes: SubstituteRecord[],
  results: OTCalculationResult[]
): AnomalyItem[] {
  const anomalies: AnomalyItem[] = [];

  // 1. ตรวจสอบชั่วโมงไม่ถึงเกณฑ์ (HOURS_BELOW_QUOTA)
  results.forEach(res => {
    if (!res.passedCheck) {
      anomalies.push({
        id: `ANO-${res.teacherId}-01`,
        teacherId: res.teacherId,
        teacherName: res.teacherName,
        departmentName: res.departmentName,
        severity: 'DANGER',
        code: 'HOURS_BELOW_QUOTA',
        title: 'ชั่วโมงสอนจริงไม่ถึงเกณฑ์ขั้นต่ำตามระเบียบ',
        detail: `สอนจริงเพียง ${res.weeklyActualTaughtHours} ชม./สัปดาห์ ต่ำกว่าภาระงานขั้นต่ำ ${res.minTeachingHoursRequired} ชม./สัปดาห์`,
        suggestion: 'มอบหมายชั่วโมงสอนเพิ่มเติม หรือตรวจสอบภาระงานสอนชดเชย หากไม่ครบจะไม่สามารถเบิกค่าสอนเกินภาระงานได้',
        resolved: false
      });
    }
  });

  // 2. ตรวจสอบการสอนแทนที่ไม่มีเลขที่คำสั่ง (MISSING_ORDER_NO)
  substitutes.forEach(sub => {
    if (!sub.orderNumber || sub.orderNumber.trim() === '') {
      const origTeacher = teachers.find(t => t.id === sub.originalTeacherId);
      const subTeacher = teachers.find(t => t.id === sub.substituteTeacherId);
      anomalies.push({
        id: `ANO-SUB-${sub.id}`,
        teacherId: sub.substituteTeacherId,
        teacherName: subTeacher ? `${subTeacher.prefix}${subTeacher.firstName} ${subTeacher.lastName}` : 'ไม่ระบุ',
        departmentName: subTeacher?.departmentName || 'แผนกวิชา',
        severity: 'WARNING',
        code: 'MISSING_ORDER_NO',
        title: 'การสอนแทนยังไม่มีเลขที่คำสั่ง/บันทึกข้อความอนุมัติ',
        detail: `รายการสอนแทนวิชา ${sub.subjectCode} (${sub.hours} ชม.) วันที่ ${sub.actualTaughtDate} แทน ${origTeacher?.firstName || ''} ยังไม่มีเลขที่คำสั่งทางการ`,
        suggestion: 'แนบสำเนาคำสั่งหรือบันทึกข้อความขออนุมัติสอนแทนจากงานวิชาการเพื่อประกอบการนับชั่วโมง',
        resolved: false
      });
    }
  });

  // 3. ตรวจสอบชั่วโมงเกินเพดานที่กำหนด (EXCEED_CAP)
  results.forEach(res => {
    if (res.unclaimedOverloadHours > 0) {
      anomalies.push({
        id: `ANO-${res.teacherId}-02`,
        teacherId: res.teacherId,
        teacherName: res.teacherName,
        departmentName: res.departmentName,
        severity: 'INFO',
        code: 'EXCEED_CAP',
        title: 'มีชั่วโมงสอนเกินเพดานสูงสุดที่สามารถเบิกได้',
        detail: `มีชั่วโมงเกินภาระงานรวม ${res.grossOverloadHours} ชม. โดยมีส่วนที่เกินเพดาน ${res.unclaimedOverloadHours} ชม.`,
        suggestion: 'ระบบได้ตัดยอดเกินเพดานไปบันทึกเป็น "ชั่วโมงสอนเกินภาระงานที่ไม่ได้เบิก" ตามระเบียบ สอศ. ข้อ 23 เรียบร้อยแล้ว',
        resolved: true
      });
    }
  });

  // 4. ตรวจสอบเวลาชนกันในตารางสอน (DUPLICATE_TIME)
  const teacherDayMap: { [key: string]: ScheduleItem[] } = {};
  schedules.forEach(item => {
    const key = `${item.teacherId}-${item.dayOfWeek}`;
    if (!teacherDayMap[key]) teacherDayMap[key] = [];
    teacherDayMap[key].push(item);
  });

  Object.entries(teacherDayMap).forEach(([key, items]) => {
    if (items.length > 1) {
      for (let i = 0; i < items.length; i++) {
        for (let j = i + 1; j < items.length; j++) {
          const a = items[i];
          const b = items[j];
          if (a.startTime === b.startTime && a.id !== b.id) {
            const t = teachers.find(teach => teach.id === a.teacherId);
            anomalies.push({
              id: `ANO-CONFLICT-${a.id}-${b.id}`,
              teacherId: a.teacherId,
              teacherName: t ? `${t.prefix}${t.firstName} ${t.lastName}` : a.teacherId,
              departmentName: t?.departmentName || '',
              severity: 'DANGER',
              code: 'DUPLICATE_TIME',
              title: 'ตารางสอนมีช่วงเวลาซ้ำซ้อนกันในวันเดียวกัน',
              detail: `วัน${a.dayOfWeek} เวลา ${a.startTime} ซ้ำกันระหว่างวิชา ${a.subjectCode} (${a.room}) และ ${b.subjectCode} (${b.room})`,
              suggestion: 'ปรับแก้ไขเวลาหรือห้องเรียนในตารางสอนให้ถูกต้อง',
              resolved: false
            });
          }
        }
      }
    }
  });

  return anomalies;
}
