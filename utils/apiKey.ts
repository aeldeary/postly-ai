const API_KEY_STORAGE_KEY = 'postly_gemini_api_key';

export function getStoredApiKey(): string {
  return localStorage.getItem(API_KEY_STORAGE_KEY) || '';
}

export function setStoredApiKey(key: string): void {
  localStorage.setItem(API_KEY_STORAGE_KEY, key.trim());
}

export function removeStoredApiKey(): void {
  localStorage.removeItem(API_KEY_STORAGE_KEY);
}

export function hasStoredApiKey(): boolean {
  const key = getStoredApiKey();
  return key.length > 10;
}
