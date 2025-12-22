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