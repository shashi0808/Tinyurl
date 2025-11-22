import { z } from 'zod';

// Generate a random alphanumeric code of specified length (6-8 characters)
export function generateCode(length: number = 6): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Validate URL format
export function isValidUrl(url: string): boolean {
  try {
    const urlSchema = z.string().url();
    urlSchema.parse(url);
    return true;
  } catch {
    return false;
  }
}

// Validate code format (6-8 alphanumeric characters)
export function isValidCode(code: string): boolean {
  const codeRegex = /^[A-Za-z0-9]{6,8}$/;
  return codeRegex.test(code);
}

// Format date for display
export function formatDate(dateString: string | null): string {
  if (!dateString) return 'Never';
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Truncate long URLs for display
export function truncateUrl(url: string, maxLength: number = 50): string {
  if (url.length <= maxLength) return url;
  return url.substring(0, maxLength) + '...';
}

// Copy text to clipboard
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
