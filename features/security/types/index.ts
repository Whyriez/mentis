export interface AdminSessionItem {
  id: string;
  userEmail: string;
  role: string;
  ipAddress: string;
  deviceInfo: string;
  loginTime: string;
  lastActivity: string;
  isCurrentSession: boolean;
}

export interface FailedLoginAttempt {
  id: string;
  email: string;
  ipAddress: string;
  attemptTime: string;
  reason: string;
}
