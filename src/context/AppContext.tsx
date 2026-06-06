import React, { createContext, useContext, useState } from 'react';
import type { TransactionStatus, Scenario, Notification, AppStats } from '../types';
import { SCENARIOS } from '../scenarios';

interface AppContextType {
  activeScenario: Scenario;
  status: TransactionStatus;
  otp: string;
  notifications: Notification[];
  stats: AppStats;
  otpError: string;
  setScenario: (id: 'A' | 'B' | 'C') => void;
  startTransaction: () => void;
  completeFaceScan: () => void;
  triggerBiometrics: () => void;
  completeBiometrics: () => void;
  approveTransaction: () => void;
  rejectTransaction: () => void;
  verifyOtp: (enteredOtp: string) => boolean;
  resetTransaction: () => void;
  addNotification: (type: Notification['type'], title: string, message: string, time: string) => void;
  clearNotifications: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Helper for generating secure OTP
const generateSecureOtp = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeScenario, setActiveScenarioState] = useState<Scenario>(SCENARIOS[0]);
  const [status, setStatus] = useState<TransactionStatus>('idle');
  const [otp, setOtp] = useState<string>('');
  const [otpError, setOtpError] = useState<string>('');
  
  // Starting Mock stats
  const [stats, setStats] = useState<AppStats>({
    purchasesReviewed: 14,
    moneyProtected: 12500,
    purchasesApproved: 8,
    highRiskBlocked: 6,
  });

  // Starting Mock notifications
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'notif_1',
      type: 'success',
      title: 'Purchase Approved',
      message: '₹150 for Minecraft Skins was approved by OTP.',
      time: '2 hours ago',
      read: true,
    },
    {
      id: 'notif_2',
      type: 'blocked',
      title: 'High Risk Attempt Blocked',
      message: '₹2,500 purchase for Free Fire Diamonds was blocked.',
      time: 'Yesterday',
      read: true,
    },
  ]);

  // Handle changing scenarios
  const setScenario = (id: 'A' | 'B' | 'C') => {
    const nextScenario = SCENARIOS.find(s => s.id === id) || SCENARIOS[0];
    setActiveScenarioState(nextScenario);
    setStatus('idle');
    setOtp('');
    setOtpError('');
  };

  // State transitions
  const startTransaction = () => {
    setStatus('scanning');
    setOtp('');
    setOtpError('');
  };

  const completeFaceScan = () => {
    setStatus('estimating');
    
    // Simulate age estimation delay
    setTimeout(() => {
      setStatus('analyzing');
      
      // Simulate AI analysis delay
      setTimeout(() => {
        setStatus('waiting_parent');
        
        // Push alert notification to the Parent app
        addNotification(
          'alert',
          '🚨 AI Alert: Verification Required',
          `${activeScenario.request.childName} initiated a ₹${activeScenario.request.purchaseAmount} request on ${activeScenario.request.gameName}. Risk Score: ${activeScenario.request.riskScore} (${activeScenario.request.riskLevel}).`,
          'Just Now'
        );
      }, 2000);
    }, 2000);
  };

  const triggerBiometrics = () => {
    setStatus('biometrics');
  };

  const completeBiometrics = () => {
    setStatus('parent_decision');
  };

  const approveTransaction = () => {
    const nextOtp = generateSecureOtp();
    setOtp(nextOtp);
    setStatus('otp_entry');
    
    addNotification(
      'info',
      'OTP Code Generated',
      `Secure OTP ${nextOtp} generated for ${activeScenario.request.childName}'s purchase.`,
      'Just Now'
    );
  };

  const rejectTransaction = () => {
    setStatus('blocked');
    setStats(prev => ({
      ...prev,
      purchasesReviewed: prev.purchasesReviewed + 1,
      highRiskBlocked: prev.highRiskBlocked + 1,
      moneyProtected: prev.moneyProtected + activeScenario.request.purchaseAmount,
    }));

    addNotification(
      'blocked',
      'Transaction Blocked',
      `Rejected ₹${activeScenario.request.purchaseAmount} purchase request on ${activeScenario.request.gameName} from ${activeScenario.request.childName}.`,
      'Just Now'
    );
  };

  const verifyOtp = (enteredOtp: string): boolean => {
    if (enteredOtp === otp) {
      setStatus('approved');
      setOtpError('');
      setStats(prev => ({
        ...prev,
        purchasesReviewed: prev.purchasesReviewed + 1,
        purchasesApproved: prev.purchasesApproved + 1,
      }));

      addNotification(
        'success',
        'Transaction Approved',
        `₹${activeScenario.request.purchaseAmount} purchase on ${activeScenario.request.gameName} successfully verified via OTP.`,
        'Just Now'
      );
      return true;
    } else {
      setOtpError('Invalid OTP code. Please try again.');
      return false;
    }
  };

  const resetTransaction = () => {
    setStatus('idle');
    setOtp('');
    setOtpError('');
  };

  const addNotification = (type: Notification['type'], title: string, message: string, time: string) => {
    const newNotif: Notification = {
      id: Math.random().toString(36).substring(7),
      type,
      title,
      message,
      time,
      read: false,
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <AppContext.Provider
      value={{
        activeScenario,
        status,
        otp,
        notifications,
        stats,
        otpError,
        setScenario,
        startTransaction,
        completeFaceScan,
        triggerBiometrics,
        completeBiometrics,
        approveTransaction,
        rejectTransaction,
        verifyOtp,
        resetTransaction,
        addNotification,
        clearNotifications,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
