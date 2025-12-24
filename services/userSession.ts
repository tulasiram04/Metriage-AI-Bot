const USER_ID_KEY = 'medtriage_user_id';

export interface UserData {
  odessa: string;
  name: string;
  age: number | null;
  gender: string;
  emergencyContactName: string;
  emergencyContactRelation: string;
  emergencyContactPhone: string;
  bloodGroup: string;
  allergies: string[];
  conditions: { name: string; status: string }[];
  height: string;
  weight: string;
  currentMedications: string;
  pastMedicalHistory: string;
  specialNotes: string;
  medicalInfoUpdatedAt: string | null;
  profileComplete?: boolean;
}

// Required fields for profile to be considered complete
const REQUIRED_FIELDS = ['name', 'age', 'gender', 'bloodGroup'] as const;

// Check if profile has all required fields filled
export const isProfileComplete = (user: UserData | null): boolean => {
  if (!user) return false;
  return (
    !!user.name?.trim() &&
    !!user.age &&
    !!user.gender?.trim() &&
    !!user.bloodGroup?.trim()
  );
};

// Get stored user ID from localStorage
export const getStoredUserId = (): string | null => {
  return localStorage.getItem(USER_ID_KEY);
};

// Store user ID in localStorage
export const storeUserId = (odessa: string): void => {
  localStorage.setItem(USER_ID_KEY, odessa);
};

// Clear user ID from localStorage
export const clearUserId = (): void => {
  localStorage.removeItem(USER_ID_KEY);
};

// Initialize user session - creates new user if none exists
export const initializeUserSession = async (): Promise<{ odessa: string; user: UserData; isNew: boolean }> => {
  const existingId = getStoredUserId();

  try {
    const response = await fetch('/api/session/init', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: existingId })
    });

    if (!response.ok) {
      throw new Error('Failed to initialize session');
    }

    const data = await response.json();
    
    // Store the user ID
    storeUserId(data.userId);
    
    return {
      odessa: data.userId,
      user: data.user,
      isNew: data.isNew
    };
  } catch (error) {
    console.error('Session initialization error:', error);
    throw error;
  }
};

// Get user profile data
export const getUserProfile = async (odessa: string): Promise<UserData | null> => {
  try {
    const response = await fetch(`/api/user/profile/${odessa}`, {
      headers: { 'X-User-Id': odessa }
    });

    if (!response.ok) {
      if (response.status === 404) {
        // User not found, clear stored ID and reinitialize
        clearUserId();
        return null;
      }
      throw new Error('Failed to fetch user profile');
    }

    return await response.json();
  } catch (error) {
    console.error('Get profile error:', error);
    return null;
  }
};

// Update user profile data
export const updateUserProfile = async (odessa: string, data: Partial<UserData>): Promise<UserData | null> => {
  try {
    const response = await fetch(`/api/user/profile/${odessa}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': odessa
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error || 'Failed to update profile');
    }

    return await response.json();
  } catch (error) {
    console.error('Update profile error:', error);
    throw error;
  }
};

// Check if user session is valid
export const validateSession = async (): Promise<boolean> => {
  const odessa = getStoredUserId();
  
  if (!odessa) {
    return false;
  }

  try {
    const response = await fetch(`/api/session/validate/${odessa}`);
    const data = await response.json();
    return data.valid === true;
  } catch {
    return false;
  }
};

// Check if name is available (unique)
export const checkNameAvailability = async (name: string, currentOdessa: string): Promise<{ available: boolean; error: string | null }> => {
  try {
    const response = await fetch('/api/session/check-name', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, currentOdessa })
    });

    return await response.json();
  } catch {
    return { available: false, error: 'Failed to check name availability' };
  }
};
