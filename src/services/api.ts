/**
 * API Bridge for SMART OT TEACHING
 * Bridges communication between React frontend and Google Apps Script backend (google.script.run).
 * When running outside of Google Apps Script (e.g. local preview), falls back cleanly to local state simulation.
 */

import { 
  Teacher, 
  ScheduleItem, 
  DutyItem, 
  TeachingRecord, 
  SubstituteRecord, 
  CalculationRule, 
  TeachingRate, 
  ApprovalStatus,
  AuditLogEntry
} from '../types';

declare global {
  interface Window {
    google?: {
      script: {
        run: {
          withSuccessHandler: (callback: (result: any) => void) => {
            withFailureHandler: (callback: (error: any) => void) => Record<string, (...args: any[]) => void>;
          };
          withFailureHandler: (callback: (error: any) => void) => {
            withSuccessHandler: (callback: (result: any) => void) => Record<string, (...args: any[]) => void>;
          };
          [key: string]: any;
        };
      };
    };
  }
}

export interface BackendSystemData {
  settings: Record<string, any>;
  users: any[];
  teachers: Teacher[];
  departments: any[];
  schedules: ScheduleItem[];
  duties: DutyItem[];
  teachingRecords: TeachingRecord[];
  substitutes: SubstituteRecord[];
  rules: CalculationRule[];
  rates: TeachingRate[];
  approvals: any[];
  auditLogs: AuditLogEntry[];
}

export const isGasEnvironment = (): boolean => {
  return typeof window !== 'undefined' && !!(window.google && window.google.script && window.google.script.run);
};

/**
 * Generic promise wrapper for google.script.run calls with fallback
 */
function callGasFunction<T>(functionName: string, ...args: any[]): Promise<T> {
  return new Promise((resolve, reject) => {
    if (isGasEnvironment()) {
      try {
        window.google!.script.run
          .withSuccessHandler((response: T) => resolve(response))
          .withFailureHandler((error: any) => {
            console.error(`[GAS Error in ${functionName}]:`, error);
            reject(error);
          })[functionName](...args);
      } catch (err) {
        console.error(`[GAS Invocation Error in ${functionName}]:`, err);
        reject(err);
      }
    } else {
      // In preview/simulation mode, simulate immediate successful resolution
      console.info(`[GAS Bridge Simulation] Invoking ${functionName} with args:`, args);
      setTimeout(() => {
        resolve({ success: true, simulated: true } as unknown as T);
      }, 300);
    }
  });
}

export const apiService = {
  /**
   * Check if connected to real Google Apps Script host
   */
  isGasEnvironment,

  /**
   * Fetch initial data package from Google Sheets
   */
  async getInitialData(): Promise<BackendSystemData | null> {
    if (isGasEnvironment()) {
      return callGasFunction<BackendSystemData>('getInitialSystemData');
    }
    return null; // Signals caller to use INITIAL_DATA
  },

  /**
   * Update workflow approval state in Google Sheets OT_Approval and log in AuditLog
   */
  async updateApprovalStatus(
    teacherId: string, 
    stage: ApprovalStatus, 
    actorName: string, 
    remarks?: string
  ): Promise<{ success: boolean }> {
    return callGasFunction<{ success: boolean }>(
      'updateApprovalStatus', 
      teacherId, 
      stage, 
      actorName, 
      remarks || ''
    );
  },

  /**
   * Push full calculation results into OT_Calculation sheet
   */
  async exportCalculationsToSheets(
    results: any[],
    term: string
  ): Promise<{ success: boolean; count: number }> {
    return callGasFunction<{ success: boolean; count: number }>(
      'calculateAndStoreAllOT',
      term
    );
  },

  /**
   * Append new duty item to Duties sheet
   */
  async saveDuty(duty: DutyItem): Promise<{ success: boolean }> {
    return callGasFunction<{ success: boolean }>('saveDutyItem', duty);
  },

  /**
   * Append teaching log to TeachingRecords sheet
   */
  async saveTeachingRecord(record: TeachingRecord): Promise<{ success: boolean }> {
    return callGasFunction<{ success: boolean }>('saveTeachingRecordItem', record);
  },

  /**
   * Save substitute teaching record
   */
  async saveSubstituteRecord(record: SubstituteRecord): Promise<{ success: boolean }> {
    return callGasFunction<{ success: boolean }>('saveSubstituteRecordItem', record);
  },

  /**
   * Log action to AuditLog sheet
   */
  async logAction(entry: AuditLogEntry): Promise<{ success: boolean }> {
    return callGasFunction<{ success: boolean }>('appendAuditLog', entry);
  }
};
