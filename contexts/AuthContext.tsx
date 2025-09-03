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

export const AuthProvider: React.FC<{ children: React.ReactNode; clientId: string; }> = ({ children, clientId }) => {
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
    const initializeGsi = () => {
      if (window.google && window.google.accounts) {
        try {
            window.google.accounts.id.initialize({
              client_id: clientId,
              callback: handleCredentialResponse,
            });
            setIsInitialized(true);
        } catch (error) {
            console.error("Google Sign-In initialization failed:", error);
            // You could potentially clear the saved config here to force re-entry
        }
      } else {
        setTimeout(initializeGsi, 100);
      }
    };

    if (clientId) {
        initializeGsi();
    }
  }, [clientId, handleCredentialResponse]);

  // Effect for rendering the Google Sign-In button
  useEffect(() => {
    if (isInitialized && !user) {
      const signInButtonContainer = document.getElementById('google-signin-button-container');
      if (signInButtonContainer) {
        signInButtonContainer.innerHTML = ''; // Clear previous button
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