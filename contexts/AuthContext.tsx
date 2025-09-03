import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';

// This is a global declaration for the google object from the GSI script
declare global {
  interface Window {
    google: any;
  }
}

interface User {
  name: string;
  email: string;
  picture: string;
}

interface AuthContextType {
  user: User | null;
  signOut: () => void;
  isInitialized: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// A simple function to decode the JWT payload without needing a full library.
// We don't need to verify the signature since we get it directly from Google's script.
const simpleJwtDecode = (token: string): any => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Failed to decode JWT:", e);
        return null;
    }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  const handleCredentialResponse = useCallback((response: any) => {
    const decoded = simpleJwtDecode(response.credential);
    if (decoded) {
      setUser({
        name: decoded.name,
        email: decoded.email,
        picture: decoded.picture,
      });
    }
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    if (window.google && window.google.accounts) {
        window.google.accounts.id.disableAutoSelect();
    }
  }, []);

  // Effect for initializing the Google Sign-In client
  useEffect(() => {
    // In a real application, the GOOGLE_CLIENT_ID should be stored in an environment variable.
    // For this example, a placeholder is used. You must replace it with your own for Sign-In to work.
    const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';
    
    if (GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com') {
      console.warn("Using a placeholder GOOGLE_CLIENT_ID. Google Sign-In will not function until you replace it with your own client ID in contexts/AuthContext.tsx.");
    }
    
    const initializeGsi = () => {
      if (window.google && window.google.accounts) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
        });
        setIsInitialized(true);
        // You can uncomment the line below to enable automatic sign-in prompt on page load.
        // window.google.accounts.id.prompt();
      } else {
        setTimeout(initializeGsi, 100);
      }
    };

    initializeGsi();
  }, [handleCredentialResponse]);

  // Effect for rendering the Google Sign-In button
  useEffect(() => {
    if (isInitialized && !user) {
      const signInButtonContainer = document.getElementById('google-signin-button-container');
      if (signInButtonContainer) {
        // Clear the container to avoid rendering multiple buttons, e.g., on fast state changes.
        signInButtonContainer.innerHTML = '';
        window.google.accounts.id.renderButton(signInButtonContainer, {
          theme: 'outline',
          size: 'large',
          type: 'standard',
        });
      }
    }
  }, [isInitialized, user]);

  return (
    <AuthContext.Provider value={{ user, signOut, isInitialized }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
