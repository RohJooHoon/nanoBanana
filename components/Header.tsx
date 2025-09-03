import React, { useState, useEffect, useRef } from 'react';
import { Icon } from './Icon';
import { useAuth } from '../contexts/AuthContext';

export const Header: React.FC = () => {
  const { user, signOut, isInitialized } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-gray-800/80 backdrop-blur-sm shadow-lg sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
            <Icon.Logo className="w-10 h-10 text-cyan-400" />
            <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
                AI Image Reference Editor
            </h1>
        </div>

        <div className="flex items-center gap-4">
            {isInitialized && user ? (
                 <div className="relative" ref={dropdownRef}>
                    <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="rounded-full overflow-hidden w-10 h-10 border-2 border-cyan-400 hover:border-purple-500 transition-colors">
                        <img src={user.picture} alt="User avatar" referrerPolicy="no-referrer" />
                    </button>
                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-64 bg-gray-700 rounded-lg shadow-xl py-2 z-20 border border-gray-600">
                           <div className="px-4 py-2 border-b border-gray-600">
                                <p className="font-bold text-white truncate">{user.name}</p>
                                <p className="text-sm text-gray-400 truncate">{user.email}</p>
                           </div>
                           <button onClick={() => { signOut(); setIsDropdownOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/20 flex items-center gap-2">
                                <Icon.LogOut className="w-4 h-4" />
                                Sign Out
                           </button>
                        </div>
                    )}
                 </div>
            ) : (
                <div id="google-signin-button-container"></div>
            )}
        </div>
      </div>
    </header>
  );
};