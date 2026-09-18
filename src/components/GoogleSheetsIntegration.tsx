import React, { useState } from 'react';
import { 
  GAS_FILES, 
  SHEET_SCHEMAS, 
  generateSetupScript,
  SheetSchemaItem,
  GasFileItem
} from '../services/gasExport';
import { 
  FileSpreadsheet, 
  Code, 
  Copy, 
  Check, 
  Database, 
  Terminal, 
  Play
} from 'lucide-react';

export const GoogleSheetsIntegration: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<string>('Code.gs');
  const [selectedSheet, setSelectedSheet] = useState<string>('OT_Calculation');
  const [copied, setCopied] = useState<string | null>(null);
  const [rpcResult, setRpcResult] = useState<string | null>(null);
  const [rpcLoading, setRpcLoading] = useState(false);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleSimulateGasRpc = (action: string) => {
    setRpcLoading(true);
    setRpcResult(null);

    setTimeout(() => {
      setRpcLoading(false);
      if (action === 'getCalculationData') {
        setRpcResult(JSON.stringify({
          status: 'SUCCESS',
          academicTerm: '2/2568',
          regulation: 'สอศ. 2568',
          totalTeachers: 6,
          claimableHoursTotal: 612,
          totalAmountBaht: 133200,
          sheetsConnected: 14
        }, null, 2));
      } else if (action === 'setupDatabase') {
        setRpcResult(JSON.stringify({
          status: 'SUCCESS',
          message: 'สร้างและจัดรูปแบบตาราง Google Sheets ทั้ง 14 แผ่นงานเรียบร้อยแล้ว',
          createdSheets: SHEET_SCHEMAS.map((s: SheetSchemaItem) => s.sheetName)
        }, null, 2));
      }
    }, 600);
  };

  const activeGasFile = GAS_FILES.find((f: GasFileItem) => f.filename === selectedFile) || GAS_FILES[0];
  const activeSheetSchema = SHEET_SCHEMAS.find((s: SheetSchemaItem) => s.sheetName === selectedSheet) || SHEET_SCHEMAS[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              สถาปัตยกรรม Google Sheets (14 Sheets) & Google Apps Script (GAS)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            ตามข้อกำหนด: ใช้ Google Sheets เป็นฐานข้อมูล 14 แผ่นงาน และ Google Apps Script จัดการ API & Workflow
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleCopy(generateSetupScript(), 'setupScript')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            {copied === 'setupScript' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>คัดลอกสคริปต์สร้าง 14 Sheets อัตโนมัติ</span>
          </button>
        </div>
      </div>

      {/* 14-Sheets Database Architecture Explorer (Prompt Section 18) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Database className="w-4 h-4 text-indigo-600" />
              <span>โครงสร้างฐานข้อมูล 14 แผ่นงาน (Google Sheets Database Schema)</span>
            </h3>
            <p className="text-xs text-slate-500">เลือกแผ่นงานเพื่อตรวจสอบหัวคอลัมน์ (Headers) และวัตถุประสงค์</p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            14 แผ่นงานครบถ้วน
          </span>
        </div>

        {/* Sheets Selector Chips */}
        <div className="flex flex-wrap gap-1.5">
          {SHEET_SCHEMAS.map((s: SheetSchemaItem) => (
            <button
              key={s.sheetName}
              onClick={() => setSelectedSheet(s.sheetName)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                selectedSheet === s.sheetName
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {s.sheetName}
            </button>
          ))}
        </div>

        {/* Selected Sheet Details */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <span>แผ่นงาน: <code>{activeSheetSchema.sheetName}</code></span>
            </div>
            <span className="text-slate-500">{activeSheetSchema.purpose}</span>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
              หัวคอลัมน์ทั้งหมด ({activeSheetSchema.columns.length} คอลัมน์):
            </label>
            <div className="flex flex-wrap gap-1.5">
              {activeSheetSchema.columns.map((col: string, idx: number) => (
                <span key={col} className="px-2 py-0.5 rounded bg-white border border-slate-200 text-[11px] font-mono text-indigo-700">
                  {col}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* GAS Code Repository & Deployment Guide (Prompt Section 19) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Code className="w-4 h-4 text-indigo-600" />
              <span>ซอร์สโค้ด Google Apps Script (.gs) พร้อมนำไป Deploy</span>
            </h3>
            <p className="text-xs text-slate-500">
              นำไฟล์เหล่านี้ไปวางใน Extensions ➔ Apps Script ของ Google Sheets เพื่อเชื่อมต่อเป็น Web App
            </p>
          </div>

          <button
            onClick={() => handleCopy(activeGasFile.content, activeGasFile.filename)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            {copied === activeGasFile.filename ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>คัดลอก {activeGasFile.filename}</span>
          </button>
        </div>

        {/* File Tabs */}
        <div className="flex space-x-1 border-b border-slate-200">
          {GAS_FILES.map((file: GasFileItem) => (
            <button
              key={file.filename}
              onClick={() => setSelectedFile(file.filename)}
              className={`px-3.5 py-2 text-xs font-mono font-semibold border-b-2 transition-all cursor-pointer ${
                selectedFile === file.filename
                  ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {file.filename}
            </button>
          ))}
        </div>

        {/* File Description */}
        <div className="text-xs text-slate-600">
          <strong>คำอธิบาย:</strong> {activeGasFile.description}
        </div>

        {/* Code Block */}
        <div className="relative rounded-xl overflow-hidden bg-slate-900 text-slate-100 p-4 font-mono text-xs max-h-96 overflow-y-auto">
          <pre>{activeGasFile.content}</pre>
        </div>
      </div>

      {/* Simulated google.script.run RPC Console */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-600" />
              <span>ทดสอบการเรียกใช้งาน Google Apps Script Bridge (google.script.run)</span>
            </h3>
            <p className="text-xs text-slate-500">ทดสอบการสื่อสารแบบ Client-to-GAS Remote Procedure Call (RPC)</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleSimulateGasRpc('getCalculationData')}
            disabled={rpcLoading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 text-indigo-600" />
            <span>ทดสอบ google.script.run.getCalculationData()</span>
          </button>
          <button
            onClick={() => handleSimulateGasRpc('setupDatabase')}
            disabled={rpcLoading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 text-emerald-600" />
            <span>ทดสอบ google.script.run.setupSmartOTDatabase()</span>
          </button>
        </div>

        {rpcLoading && (
          <div className="text-xs text-indigo-600 font-medium animate-pulse">
            กำลังติดต่อ Google Apps Script Controller...
          </div>
        )}

        {rpcResult && (
          <div className="bg-slate-900 text-emerald-400 p-4 rounded-xl font-mono text-xs overflow-x-auto">
            <span className="text-slate-400 block mb-1">// GAS RPC Return Value:</span>
            <pre>{rpcResult}</pre>
          </div>
        )}
      </div>
    </div>
  );
};
