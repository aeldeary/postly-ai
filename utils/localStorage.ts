
import { ARCHIVE_STORAGE_KEY } from '../constants';

const MAX_STORAGE_BYTES = 4.5 * 1024 * 1024; // 4.5MB to be safe

export function setItem<T>(key: string, value: T): void {
  try {
    let serializedValue;

    // Use the unified key for checking logic
    if (key === ARCHIVE_STORAGE_KEY && Array.isArray(value)) {
      const archiveCopy = [...value]; // Work on a copy to avoid side effects
      serializedValue = JSON.stringify(archiveCopy);
      
      // Trim the archive if it exceeds the quota by removing the oldest items
      while (serializedValue.length > MAX_STORAGE_BYTES && archiveCopy.length > 0) {
        archiveCopy.pop(); 
        serializedValue = JSON.stringify(archiveCopy);
      }
    } else {
      serializedValue = JSON.stringify(value);
    }

    localStorage.setItem(key, serializedValue);
  } catch (error) {
    if (error instanceof DOMException && (error.name === 'QuotaExceededError' || error.code === 22)) {
        console.error(`Quota exceeded for key ${key}. Could not save item.`, error);
        alert('مساحة التخزين ممتلئة ولا يمكن حفظ العنصر الجديد. تم حذف أقدم العناصر تلقائيًا، يرجى المحاولة مرة أخرى.');
    } else {
        console.error(`Error setting item ${key} in localStorage`, error);
    }
  }
}

export function getItem<T>(key: string, defaultValue: T | null = null): T | null {
  try {
    const serializedValue = localStorage.getItem(key);
    if (serializedValue === null) {
      return defaultValue;
    }
    return JSON.parse(serializedValue) as T;
  } catch (error) {
    console.error(`Error getting item ${key} from localStorage`, error);
    return defaultValue;
  }
}

export function removeItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing item ${key} from localStorage`, error);
  }
}
