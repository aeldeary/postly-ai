import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { onAuthChange, saveUserProfile, loadArchiveFromFirestore, saveArchiveToFirestore } from '../services/firebase';
import { ArchivedItem } from '../types';
import { ARCHIVE_STORAGE_KEY } from '../constants';
import { getItem, setItem } from '../utils/localStorage';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  cloudArchive: ArchivedItem[];
  syncArchiveToCloud: (items: ArchivedItem[]) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  cloudArchive: [],
  syncArchiveToCloud: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [cloudArchive, setCloudArchive] = useState<ArchivedItem[]>([]);

  useEffect(() => {
    const unsub = onAuthChange(async (u) => {
      setUser(u);
      if (u) {
        // Save profile info
        await saveUserProfile(u.uid, {
          email: u.email,
          displayName: u.displayName,
          photoURL: u.photoURL,
          lastLogin: new Date().toISOString(),
        });
        // Load cloud archive and merge with local
        const cloudItems = await loadArchiveFromFirestore(u.uid);
        const localItems = getItem<ArchivedItem[]>(ARCHIVE_STORAGE_KEY) || [];
        // Merge: cloud takes priority, add any local-only items
        const cloudIds = new Set(cloudItems.map(i => i.id));
        const localOnly = localItems.filter(i => !cloudIds.has(i.id));
        const merged = [...cloudItems, ...localOnly];
        setCloudArchive(merged);
        setItem(ARCHIVE_STORAGE_KEY, merged);
        if (localOnly.length > 0) {
          await saveArchiveToFirestore(u.uid, merged);
        }
      } else {
        setCloudArchive([]);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const syncArchiveToCloud = async (items: ArchivedItem[]) => {
    if (user) {
      await saveArchiveToFirestore(user.uid, items);
      setCloudArchive(items);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, cloudArchive, syncArchiveToCloud }}>
      {children}
    </AuthContext.Provider>
  );
};
