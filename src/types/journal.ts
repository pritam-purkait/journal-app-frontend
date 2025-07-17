export interface JournalEntry {
  id: string; // ObjectId as string
  title: string;
  content: string;
  date: string; // LocalDateTime as ISO string
  sentiment?: 'HAPPY' | 'SAD' | 'ANGRY' | 'ANXIOUS';
}

export interface JournalFormData {
  title: string;
  content: string;
  sentiment?: JournalEntry['sentiment'];
}

export interface User {
  id?: string;
  userName: string;
  email?: string;
  password: string;
  sentimentAnalysis?: boolean;
}

export interface LoginRequest {
  userName: string;
  password: string;
}

export interface SignupRequest {
  userName: string;
  password: string;
  email?: string;
  sentimentAnalysis?: boolean;
}

export interface AuthResponse {
  token: string;
}