import React from 'react';

export type ViewFilter = 'all' | 'subjects' | 'skills' | 'qualities';

export interface Student {
  stt: number;
  id: string;
  name: string;
  className: string;
  dob?: string; // Date of birth
  parent: string; // 'T' represents 'Thường xuyên' or similar status
  status: string;
}

export interface MenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  active?: boolean;
}

// New Types for Comment Bank Module
export interface UserConfig {
  id: string;
  name: string;
  role: 'admin' | 'subject_teacher' | 'homeroom_teacher';
  avatarColor: string;
  assignments: {
    [grade: string]: string[]; // Grade -> Array of Subjects
  };
}

export interface CommentItem {
  id: number;
  grade: string;
  subject: string;
  term: string;
  level: 'T' | 'H' | 'C';
  content: string;
}

export interface ImportRow {
  index: number;
  grade: string;
  subject: string;
  term: string;
  level: string;
  content: string;
  isValid: boolean;
  error?: string;
}