import React, { createContext, useState, useEffect, useContext } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: any | null;
  signIn: (email: string, password: string) => Promise<{ error: any } | undefined>;
  signUp: (email: string, password: string, options?: any) => Promise<{ error: any } | undefined>;
  signOut: () => void;
  loading: boolean;
  refreshProfile: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  profile: null,
  signIn: async () => undefined,
  signUp: async () => undefined,
  signOut: () => {},
  loading: true,
  refreshProfile: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const handleAuthError = async (error: any) => {
    if (error?.message?.includes('Invalid Refresh Token') || 
        error?.message?.includes('refresh_token_not_found')) {
      console.error('Refresh token error detected:', error);
      await signOut();
      window.location.href = '/auth';
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            // Use setTimeout to avoid potential deadlocks
            setTimeout(() => {
              fetchProfile(session.user.id);
            }, 0);
          } else {
            setProfile(null);
          }
        } catch (error) {
          await handleAuthError(error);
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(async ({ data: { session }, error }) => {
      if (error) {
        await handleAuthError(error);
        setLoading(false);
        return;
      }

      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchProfile(session.user.id);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) throw error;
      setProfile(data);
      return data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      await handleAuthError(error);
      return null;
    }
  };

  const refreshProfile = async () => {
    if (!user) return null;
    return fetchProfile(user.id);
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await supabase.auth.signInWithPassword({ email, password });
      if (response.error) {
        throw response.error;
      }
      return response;
    } catch (error) {
      await handleAuthError(error);
      return { error };
    }
  };

  const signUp = async (email: string, password: string, options?: any) => {
    try {
      const response = await supabase.auth.signUp({ 
        email, 
        password, 
        options: { data: options } 
      });
      if (response.error) {
        throw response.error;
      }
      return response;
    } catch (error) {
      await handleAuthError(error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setSession(null);
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };

  const value = {
    session,
    user,
    profile,
    signIn,
    signUp,
    signOut,
    loading,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};