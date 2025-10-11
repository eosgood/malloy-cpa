// app/CsrfBoot.tsx
'use client';
import { useCsrf } from '@/hooks/useCsrf';

export default function CsrfBoot() {
  useCsrf(); // fetches /api/csrf once and sets cookies
  return null;
}
