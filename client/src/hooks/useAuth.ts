import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'citizen' | 'authority' | 'admin';
  ward_id: string | null;
}

interface AuthContextValue {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  setUser: (user: AuthUser | null) => void;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  session: null,
  loading: true,
  setUser: () => {},
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const useAuthProvider = (): AuthContextValue => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const savedUser = localStorage.getItem('nagpur_pulse_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async (supabaseUser: User) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('name, role, ward_id')
        .eq('id', supabaseUser.id)
        .single();

      const resolvedUser: AuthUser = {
        id: supabaseUser.id,
        email: supabaseUser.email ?? '',
        name: profile?.name || supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'Citizen',
        role: profile?.role ?? 'citizen',
        ward_id: profile?.ward_id ?? null,
      };

      setUser(resolvedUser);
      localStorage.setItem('nagpur_pulse_user', JSON.stringify(resolvedUser));
    } catch {
      const fallbackUser: AuthUser = {
        id: supabaseUser.id,
        email: supabaseUser.email ?? '',
        name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'Citizen',
        role: 'citizen',
        ward_id: null,
      };
      setUser(fallbackUser);
      localStorage.setItem('nagpur_pulse_user', JSON.stringify(fallbackUser));
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      if (session?.user) await loadProfile(session.user);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        if (session?.user) {
          await loadProfile(session.user);
        }
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    localStorage.removeItem('nagpur_pulse_user');
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  return { user, session, loading, setUser, signOut };
};
