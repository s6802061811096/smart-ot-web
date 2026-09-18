import React, { useState } from 'react';
import { CalculationRule, TeachingRate } from '../types';
import { 
  ShieldCheck, 
  Settings, 
  DollarSign, 
  RotateCcw, 
  Save, 
  AlertTriangle, 
  Layers, 
  CheckCircle2 
} from 'lucide-react';

interface RuleEngineSettingsProps {
  rules: CalculationRule[];
  rates: TeachingRate[];
  onUpdateRules: (newRules: CalculationRule[]) => void;
  onUpdateRates: (newRates: TeachingRate[]) => void;
  onResetDefaults: () => void;
}

export const RuleEngineSettings: React.FC<RuleEngineSettingsProps> = ({
  rules,
  rates,
  onUpdateRules,
  onUpdateRates,
  onResetDefaults
}) => {
  const [editableRules, setEditableRules] = useState<CalculationRule[]>(rules);
  const [editableRates, setEditableRates] = useState<TeachingRate[]>(rates);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleRuleChange = (index: number, field: keyof CalculationRule, value: any) => {
    const updated = [...editableRules];
    updated[index] = { ...updated[index], [field]: value };
    setEditableRules(updated);
  };

  const handleRateChange = (index: number, field: keyof TeachingRate, value: any) => {
    const updated = [...editableRates];
    updated[index] = { ...updated[index], [field]: value };
    setEditableRates(updated);
  };

  const handleSaveAll = () => {
    onUpdateRules(editableRules);
    onUpdateRates(editableRates);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              การกำหนดกฎเกณฑ์และอัตราค่าสอน (Rules & Rates Engine)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            สอดคล้องกับตาราง `Rules` และ `Rates` ใน Google Sheets เพื่อให้สถานศึกษาปรับเกณฑ์ได้โดยไม่ต้องแก้ไขโค้ดโปรแกรม
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onResetDefaults}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>คืนค่ามาตรฐาน สอศ. 2568</span>
          </button>
          <button
            onClick={handleSaveAll}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>บันทึกการเปลี่ยนแปลงทั้งหมด</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>บันทึกการตั้งค่ากฎเกณฑ์และอัตราค่าสอนใหม่เรียบร้อยแล้ว ระบบจะประมวลผลคำนวณใหม่โดยอัตโนมัติ</span>
        </div>
      )}

      {/* SECTION 1: TEACHING RATES (ตาราง Rates) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span>ตารางอัตราค่าสอนพิเศษ / ค่าสอนเกินภาระงานสอน (Rates Sheet)</span>
            </h3>
            <p className="text-xs text-slate-500">อัตราค่าตอบแทนต่อชั่วโมงตามระเบียบ สอศ. พ.ศ. 2568</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {editableRates.map((rate, idx) => (
            <div key={rate.rateId} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">{rate.title} ({rate.level})</span>
                <span className="font-mono text-[10px] text-slate-400">{rate.rateId}</span>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <span className="text-slate-500">อัตรา:</span>
                <input
                  type="number"
                  value={rate.ratePerHour}
                  onChange={(e) => handleRateChange(idx, 'ratePerHour', Number(e.target.value))}
                  className="w-24 px-2 py-1 bg-white border border-slate-200 rounded font-bold text-indigo-700"
                />
                <span className="font-medium text-slate-700">บาท / ชั่วโมง</span>
              </div>
              <p className="text-[11px] text-slate-500 pt-1">{rate.remarks}</p>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: CALCULATION RULES (ตาราง Rules) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="border-b pb-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Settings className="w-4 h-4 text-indigo-600" />
            <span>ตารางกฎเกณฑ์และการจำแนกภาระงาน (Rules Sheet)</span>
          </h3>
          <p className="text-xs text-slate-500">
            เกณฑ์ภาระงานสอนขั้นต่ำ ภาระงานหน้าที่ และเพดานการเบิกจ่ายตามประเภทผู้สอน
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-700">
              <tr>
                <th className="py-2.5 px-3">ประเภทผู้สอน / ตำแหน่ง</th>
                <th className="py-2.5 px-3 text-center">เกณฑ์สอนขั้นต่ำ (ชม./สัปดาห์)</th>
                <th className="py-2.5 px-3 text-center">เกณฑ์หน้าที่ขั้นต่ำ (ชม./สัปดาห์)</th>
                <th className="py-2.5 px-3 text-center">เพดานเบิกสูงสุด (ชม./สัปดาห์)</th>
                <th className="py-2.5 px-3">ข้อบังคับตามระเบียบ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {editableRules.map((rule, idx) => (
                <tr key={rule.ruleId} className="hover:bg-slate-50">
                  <td className="py-3 px-3 font-semibold text-slate-900">
                    {rule.category} ({rule.level})
                    <span className="block text-[10px] text-slate-400 font-normal">{rule.ruleId}</span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <input
                      type="number"
                      value={rule.minTeachingHours}
                      onChange={(e) => handleRuleChange(idx, 'minTeachingHours', Number(e.target.value))}
                      className="w-16 px-2 py-1 text-center bg-white border border-slate-200 rounded font-bold"
                    />
                  </td>
                  <td className="py-3 px-3 text-center">
                    <input
                      type="number"
                      value={rule.minDutyHours}
                      onChange={(e) => handleRuleChange(idx, 'minDutyHours', Number(e.target.value))}
                      className="w-16 px-2 py-1 text-center bg-white border border-slate-200 rounded font-bold"
                    />
                  </td>
                  <td className="py-3 px-3 text-center">
                    <input
                      type="number"
                      value={rule.maxClaimableOverloadHours}
                      onChange={(e) => handleRuleChange(idx, 'maxClaimableOverloadHours', Number(e.target.value))}
                      className="w-16 px-2 py-1 text-center bg-white border border-slate-200 rounded font-bold text-indigo-700"
                    />
                  </td>
                  <td className="py-3 px-3 text-slate-600 text-[11px]">
                    {rule.conditionDescription}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 3: SPECIAL REGULATION TOGGLES (ข้อ 17 และ ข้อ 23) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ข้อ 17 */}
        <div className="bg-sky-50/60 border border-sky-200 rounded-xl p-5 text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-sky-900">
            <Layers className="w-4 h-4 text-sky-600" />
            <span>หลักเกณฑ์การคำนวณ 2 ระดับการศึกษา (ข้อ 17)</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            ระบบเปิดใช้งานสูตรการปันส่วนภาระงานสอนขั้นต่ำตามสัดส่วนชั่วโมงสอนจริง ปวช. และ ปวส. โดยอัตโนมัติ เพื่อให้ได้ผลลัพธ์ที่เป็นธรรมและถูกต้องตามข้อ 17
          </p>
          <div className="pt-2 text-[11px] text-sky-800 font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
            <span>สถานะ: เปิดใช้งานตามระเบียบ 2568 (Active)</span>
          </div>
        </div>

        {/* ข้อ 23 */}
        <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-5 text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>หลักเกณฑ์บันทึกชั่วโมงเกินภาระงานที่ไม่ได้เบิก (ข้อ 23)</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            ระบบบันทึกชั่วโมงที่เกินกว่าเพดาน 12 ชม./สัปดาห์ ไว้ในระบบเสมอ เพื่อออกเป็นหนังสือรับรองสะสมผลงานทางวิชาการและวิทยฐานะตามข้อ 23
          </p>
          <div className="pt-2 text-[11px] text-amber-800 font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
            <span>สถานะ: เปิดใช้งานและบันทึกฐานข้อมูลแล้ว (Active)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
