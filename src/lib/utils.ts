import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Ensure zero-crash payload hygiene by stripping undefined values before Firestore writes
export function stripUndefined<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}
