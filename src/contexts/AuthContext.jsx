import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('access_token'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profileSetupRequired, setProfileSetupRequired] = useState(false);

  // Check if profile is complete (needs job_role and department filled out)
  const checkProfileCompleteness = (profileData) => {
    if (!profileData) return true;
    const { job_role, department } = profileData;
    return !job_role || !department;
  };

  const fetchProfile = async (authToken) => {
    try {
      const response = await api.get('/api/users/profile', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (response.data && response.data.success) {
        const profile = response.data.data;
        setUser(profile);
        setIsAuthenticated(true);
        // If job_role or department is empty/null, set complete work profile flag
        const isSetupRequired = checkProfileCompleteness(profile);
        setProfileSetupRequired(isSetupRequired);
      } else {
        throw new Error('Profile fetch failed');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  // Sync state on load
  useEffect(() => {
    if (token) {
      fetchProfile(token);
    } else {
      setIsLoading(false);
    }

    // Listen to API unauthorized events
    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener('auth-unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth-unauthorized', handleUnauthorized);
    };
  }, [token]);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await api.post('/api/auth/signin', { email, password });
      const { access_token, user: userData } = response.data.data;
      
      localStorage.setItem('access_token', access_token);
      setToken(access_token);
      
      const profile = userData.profile || userData;
      setUser(profile);
      setIsAuthenticated(true);
      
      const isSetupRequired = checkProfileCompleteness(profile);
      setProfileSetupRequired(isSetupRequired);
      
      return { success: true, profile };
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const register = async (email, password, name, birthday_date, gender) => {
    setIsLoading(true);
    try {
      const response = await api.post('/api/auth/signup', {
        email,
        password,
        name,
        birthday_date,
        gender
      });

      if (response.data && response.data.success) {
        // Automatic login on success
        return await login(email, password);
      }
      throw new Error('Registration failed');
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await api.post('/api/auth/logout', {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (error) {
      console.error('Logout API failed, cleaning up locally anyway:', error);
    } finally {
      localStorage.removeItem('access_token');
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      setProfileSetupRequired(false);
      setIsLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (token) {
      await fetchProfile(token);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated,
      isLoading,
      profileSetupRequired,
      login,
      register,
      logout,
      refreshProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
