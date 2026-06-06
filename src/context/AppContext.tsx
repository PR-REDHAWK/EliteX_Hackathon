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
  isRegistered: boolean;
  isLoggedIn: boolean;
  parentUsername: string;
  parentEmail: string;
  isFaceVerified: boolean;
  setFaceVerified: (verified: boolean) => void;
  registerParent: (username: string, email: string, psw: string) => void;
  loginParent: (usernameOrEmail: string, psw: string) => boolean;
  logoutParent: () => void;
  setScenario: (id: 'A' | 'B' | 'C') => void;
  startTransaction: () => void;
  triggerBiometrics: () => void;
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

interface AIRiskData {
  riskScore: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  recommendation: 'Approve' | 'Review Carefully' | 'Reject';
  explanation: string;
  riskBreakdown: {
    age: number;
    amount: number;
    frequency: number;
    pattern: number;
    time: number;
  };
}

// Fetch risk analysis from Gemini API
const fetchGeminiRiskAnalysis = async (scenarioId: string, childName: string, childAge: number, gameName: string, itemName: string, purchaseAmount: number, requestTime: string): Promise<AIRiskData> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('VITE_GEMINI_API_KEY is not defined in the environment.');
  }

  const contextPrompt = scenarioId === 'A' 
    ? `- Average historical monthly spending limit: ₹400
- Velocity: 8 transaction attempts in the last week.
- Multiplier: Current transaction is 12.5x larger than typical purchases.
- Timing: Late-night activity (11:42 PM).` 
    : scenarioId === 'B' 
      ? `- Average historical monthly spending limit: ₹1,200
      - Velocity: 5 transaction attempts in the last 48 hours (potential compulsive spending spree).
      - Multiplier: Price is low (₹199), fits average limit ranges, but indicates microtransaction spam.
      - Timing: Afternoon activity (04:15 PM).` 
      : `- User is verified as a legal adult (24 years old).
      - Velocity: First purchase attempt this month.
      - Multiplier: Standard purchase index (₹299).
      - Timing: Midday activity (02:30 PM).`;

  const prompt = `
You are the SecurePlay AI Transaction Risk Intelligence Engine.
Analyze the following purchase attempt by a minor and evaluate transaction risk indicators.

CHILD PROFILE:
- Name: ${childName}
- Estimated Age (from Biometrics Face Scan): ${childAge} years old

TRANSACTION DETAILS:
- Game: ${gameName}
- Product: ${itemName}
- Amount: ₹${purchaseAmount}
- Request Time: ${requestTime}

HISTORICAL SPENDING BEHAVIOR & CONTEXT:
${contextPrompt}

Evaluate the transaction and return a JSON object with the following fields:
{
  "riskScore": number (0 to 100),
  "riskLevel": "Low" | "Medium" | "High",
  "recommendation": "Approve" | "Review Carefully" | "Reject",
  "explanation": "A detailed explanation of why the risk score was generated, explaining specific risk factors (e.g. amount size, timing, or velocity) in 2-3 sentences.",
  "riskBreakdown": {
    "age": number (0-100 risk score),
    "amount": number (0-100 risk score),
    "frequency": number (0-100 risk score),
    "pattern": number (0-100 risk score),
    "time": number (0-100 risk score)
  }
}
`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          responseMimeType: 'application/json',
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini API returned status ${response.status}`);
  }

  const result = await response.json();
  const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('Empty response from Gemini API.');
  }

  const data = JSON.parse(text.trim()) as AIRiskData;
  return data;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Store a deep copy of scenario baseline data
  const [activeScenario, setActiveScenarioState] = useState<Scenario>(() => {
    return JSON.parse(JSON.stringify(SCENARIOS[0]));
  });
  const [status, setStatus] = useState<TransactionStatus>('idle');
  const [otp, setOtp] = useState<string>('');
  const [otpError, setOtpError] = useState<string>('');
  
  // Parental Auth State
  const [isRegistered, setIsRegistered] = useState<boolean>(() => {
    return localStorage.getItem('parentIsRegistered') === 'true';
  });
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [parentUsername, setParentUsername] = useState<string>(() => {
    return localStorage.getItem('parentUsername') || '';
  });
  const [parentEmail, setParentEmail] = useState<string>(() => {
    return localStorage.getItem('parentEmail') || '';
  });
  const [parentCredentials, setParentCredentials] = useState<{ username: string; email: string; psw: string } | null>(() => {
    const saved = localStorage.getItem('parentCredentials');
    return saved ? JSON.parse(saved) : null;
  });
  const [isFaceVerified, setIsFaceVerified] = useState<boolean>(false);

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
  ]);

  // Handle changing scenarios (deep copy baseline values)
  const setScenario = (id: 'A' | 'B' | 'C') => {
    const nextScenario = SCENARIOS.find(s => s.id === id) || SCENARIOS[0];
    setActiveScenarioState(JSON.parse(JSON.stringify(nextScenario)));
    setStatus('idle');
    setOtp('');
    setOtpError('');
  };

  // Auth Operations
  const registerParent = (username: string, email: string, psw: string) => {
    const creds = { username, email, psw };
    setParentUsername(username);
    setParentEmail(email);
    setParentCredentials(creds);
    setIsRegistered(true);
    setIsLoggedIn(true);

    localStorage.setItem('parentIsRegistered', 'true');
    localStorage.setItem('parentUsername', username);
    localStorage.setItem('parentEmail', email);
    localStorage.setItem('parentCredentials', JSON.stringify(creds));

    addNotification(
      'info',
      'Account Registered',
      `Welcome to SecurePlay! Parent account for ${username} has been successfully created.`,
      'Just Now'
    );
  };

  const loginParent = (usernameOrEmail: string, psw: string): boolean => {
    if (parentCredentials) {
      const matchEmail = parentCredentials.email.toLowerCase() === usernameOrEmail.toLowerCase();
      const matchUsername = parentCredentials.username.toLowerCase() === usernameOrEmail.toLowerCase();
      if ((matchEmail || matchUsername) && parentCredentials.psw === psw) {
        setIsLoggedIn(true);
        return true;
      }
    }
    return false;
  };

  const logoutParent = () => {
    setIsLoggedIn(false);
    setIsFaceVerified(false);
  };

  const setFaceVerified = (verified: boolean) => {
    setIsFaceVerified(verified);
  };

  // State transitions
  const startTransaction = () => {
    setStatus('estimating');
    setOtp('');
    setOtpError('');
    
    // Simulate age estimation delay
    setTimeout(() => {
      setStatus('analyzing');
      
      const reqData = activeScenario.request;

      // Run live Gemini API analysis
      fetchGeminiRiskAnalysis(
        activeScenario.id,
        reqData.childName,
        reqData.childAge,
        reqData.gameName,
        reqData.itemName,
        reqData.purchaseAmount,
        reqData.requestTime
      )
        .then((aiResponse) => {
          setActiveScenarioState((prev) => ({
            ...prev,
            request: {
              ...prev.request,
              riskScore: aiResponse.riskScore,
              riskLevel: aiResponse.riskLevel,
              recommendation: aiResponse.recommendation,
              explanation: aiResponse.explanation,
              riskBreakdown: aiResponse.riskBreakdown,
            },
          }));

          setStatus('waiting_parent');
          
          addNotification(
            'alert',
            '🚨 AI Alert: Verification Required',
            `${reqData.childName} initiated a ₹${reqData.purchaseAmount} request on ${reqData.gameName}. Risk Score: ${aiResponse.riskScore} (${aiResponse.riskLevel}).`,
            'Just Now'
          );
        })
        .catch((err) => {
          console.warn('Gemini API failed or timed out. Falling back to local static model.', err);
          
          // Graceful fallback to static scenario baseline values
          setStatus('waiting_parent');
          
          addNotification(
            'alert',
            '🚨 AI Alert: Verification Required (Local Model)',
            `${reqData.childName} initiated a ₹${reqData.purchaseAmount} request on ${reqData.gameName}. Risk Score: ${reqData.riskScore} (${reqData.riskLevel}).`,
            'Just Now'
          );
        });
    }, 2000);
  };

  // Skip biometrics verification layout and transition directly to decision report
  const triggerBiometrics = () => {
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
    const original = SCENARIOS.find(s => s.id === activeScenario.id) || SCENARIOS[0];
    setActiveScenarioState(JSON.parse(JSON.stringify(original)));
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
        isRegistered,
        isLoggedIn,
        parentUsername,
        parentEmail,
        isFaceVerified,
        setFaceVerified,
        registerParent,
        loginParent,
        logoutParent,
        setScenario,
        startTransaction,
        triggerBiometrics,
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
