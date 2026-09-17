import { useState, useEffect } from 'react';
import { useAuthContext } from '../context/AuthContext';

const useProfileStatus = () => {
  const { user, isAuthenticated } = useAuthContext();
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);

  const checkProfileStatus = async () => {
    if (!isAuthenticated || !user) {
      setIsLoading(false);
      return;
    }

    try {
      const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${baseUrl}/profile/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('civix_token')}`,
        },
        credentials: 'include',
      });
      
      if (response.ok) {
        const contentType = response.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) {
          throw new Error('Invalid response format for profile status');
        }
        const data = await response.json();
        setProfileData(data.user || data);
        setIsProfileComplete(Boolean(data.user?.isProfileComplete || user?.isProfileComplete));
      } else {
        setIsProfileComplete(Boolean(user?.isProfileComplete));
      }
    } catch (error) {
      console.error('Error checking profile status:', error);
      setIsProfileComplete(Boolean(user?.isProfileComplete));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkProfileStatus();
  }, [isAuthenticated, user]);

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
