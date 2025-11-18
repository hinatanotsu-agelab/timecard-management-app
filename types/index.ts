import { Timestamp } from 'firebase/firestore';

// ユーザー情報
export interface User {
  uid: string;
  email: string;
  organizationIds: string[]; // 所属組織IDの配列
  currentOrganizationId?: string; // 現在選択中の組織ID
  isManage: boolean; // 管理者権限(企業ログイン可否)
  displayName?: string;
  phoneNumber?: string; // 電話番号
  birthDate?: string; // 生年月日
  address?: string; // 住所
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// 組織情報
export interface Organization {
  id: string; // ドキュメントID
  name: string; // 企業名
  createdBy: string; // 作成者のUID
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// シフト情報
export interface Shift {
  id: string;
  organizationId: string;
  userId: string; // アルバイトのUID
  userName: string; // アルバイトの名前
  date: Timestamp; // シフト日
  startTime: string; // 開始時刻 (HH:mm形式)
  endTime: string; // 終了時刻 (HH:mm形式)
  breakTime: number; // 休憩時間（分）
  hourlyWage: number; // 時給
  status: 'pending' | 'approved' | 'rejected'; // ステータス
  estimatedPay: number; // 見込み給与
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// タイムカード情報
export interface Timecard {
  id: string;
  organizationId: string;
  userId: string; // アルバイトのUID
  userName: string; // アルバイトの名前
  date: Timestamp; // 勤務日
  clockIn: Timestamp; // 出勤時刻
  clockOut?: Timestamp; // 退勤時刻
  breakTime: number; // 休憩時間（分）
  hourlyWage: number; // 時給
  totalHours?: number; // 総労働時間
  totalPay?: number; // 給与
  status: 'in_progress' | 'completed'; // ステータス
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// シフト提出用のフォームデータ
export interface ShiftFormData {
  date: string;
  startTime: string;
  endTime: string;
  breakTime: number;
  hourlyWage: number;
}
