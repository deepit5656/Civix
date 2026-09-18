import { useState, useEffect, useCallback } from 'react';
import { useAuthContext } from '../context/AuthContext';

const useProfileStatus = () => {
  const { user, isAuthenticated } = useAuthContext();

  const computeStatus = (userData, apiData) => {
    return Boolean(
      apiData?.isProfileComplete ||
      apiData?.user?.isProfileComplete ||
      (apiData?.name && apiData?.email && apiData?.location) ||
      (apiData?.user?.name && apiData?.user?.email && apiData?.user?.location) ||
      userData?.isProfileComplete ||
      (userData?.name && userData?.email && userData?.location) ||
      localStorage.getItem('profileComplete') === 'true'
    );
  };

  const [isProfileComplete, setIsProfileComplete] = useState(() => computeStatus(user, null));
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);

  const checkProfileStatus = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setIsLoading(false);
      setIsProfileComplete(false);
      return;
    }

    try {
      const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('civix_token');
      const response = await fetch(`${baseUrl}/profile/me`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
      });
      
      if (response.ok) {
        const contentType = response.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) {
          throw new Error('Invalid response format for profile status');
        }
        const data = await response.json();
        const rawUser = data.user || data;
        setProfileData(rawUser);
        const complete = computeStatus(user, data);
        setIsProfileComplete(complete);
        if (complete) {
          localStorage.setItem('profileComplete', 'true');
        }
        return;
      }
      
      // Fallback
      const complete = computeStatus(user, null);
      setIsProfileComplete(complete);
    } catch (error) {
      console.error('Error checking profile status:', error);
      const complete = computeStatus(user, null);
      setIsProfileComplete(complete);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    checkProfileStatus();
  }, [checkProfileStatus]);

  return {
    isProfileComplete,
    isLoading,
    profileData,
    refetch: () => {
      setIsLoading(true);
      checkProfileStatus();
    }
  };
};

export default useProfileStatus;
