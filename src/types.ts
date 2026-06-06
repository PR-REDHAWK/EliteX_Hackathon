export type TransactionStatus =
  | 'idle'
  | 'scanning'
  | 'estimating'
  | 'analyzing'
  | 'waiting_parent'
  | 'biometrics'
  | 'parent_decision'
  | 'otp_entry'
  | 'approved'
  | 'blocked';

export type RiskLevel = 'Low' | 'Medium' | 'High';

export type AIRecommendation = 'Approve' | 'Review Carefully' | 'Reject';

export interface RiskBreakdown {
  age: number;      // 0 - 100
  amount: number;   // 0 - 100
  frequency: number; // 0 - 100
  pattern: number;   // 0 - 100
  time: number;      // 0 - 100
}

export interface PurchaseRequest {
  id: string;
  childName: string;
  childAge: number;
  gameName: string;
  itemName: string;
  purchaseAmount: number;
  requestTime: string;
  riskLevel: RiskLevel;
  riskScore: number;
  explanation: string;
  recommendation: AIRecommendation;
  riskBreakdown: RiskBreakdown;
  itemImage?: string;
}

export interface Scenario {
  id: 'A' | 'B' | 'C';
  label: string;
  description: string;
  request: PurchaseRequest;
}

export interface Notification {
  id: string;
  type: 'alert' | 'success' | 'blocked' | 'info';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export interface AppStats {
  purchasesReviewed: number;
  moneyProtected: number;
  purchasesApproved: number;
  highRiskBlocked: number;
}
