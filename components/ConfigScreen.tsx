import React, { useState } from 'react';
import { Icon } from './Icon';

interface ConfigScreenProps {
  onSave: (config: { apiKey: string; googleClientId: string }) => void;
}

export const ConfigScreen: React.FC<ConfigScreenProps> = ({ onSave }) => {
  const [apiKey, setApiKey] = useState('');
  const [googleClientId, setGoogleClientId] = useState('');
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!apiKey.trim() || !googleClientId.trim()) {
      setError('Both fields are required.');
      return;
    }
    setError('');
    onSave({ apiKey, googleClientId });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700">
        <div className="flex flex-col items-center text-center mb-6">
          <Icon.Logo className="w-16 h-16 text-cyan-400 mb-3" />
          <h1 className="text-3xl font-bold text-white">Application Setup</h1>
          <p className="text-gray-400 mt-2">
            Please enter your credentials to use the AI features and Google Sign-In.
          </p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6">
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-300 mb-2">
              Gemini API Key
            </label>
            <input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Gemini API Key"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
            />
            <p className="text-xs text-gray-500 mt-2">
              Get your key from{' '}
              <a
                href="https://aistudio.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:underline"
              >
                Google AI Studio
              </a>.
            </p>
          </div>

          <div>
            <label htmlFor="googleClientId" className="block text-sm font-medium text-gray-300 mb-2">
              Google Client ID
            </label>
            <input
              id="googleClientId"
              type="text"
              value={googleClientId}
              onChange={(e) => setGoogleClientId(e.target.value)}
              placeholder="Enter your Google Client ID"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
            />
             <p className="text-xs text-gray-500 mt-2">
              Get your Client ID from{' '}
              <a
                href="https://console.cloud.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 hover:underline"
              >
                Google Cloud Console
              </a>.
            </p>
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full py-3 px-6 text-lg font-bold rounded-lg transition-all duration-300 ease-in-out bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg transform hover:scale-105"
          >
            Save and Continue
          </button>
        </form>
         <p className="text-xs text-gray-600 mt-6 text-center">
            Your keys are stored only in your browser's local storage and are not sent anywhere else.
        </p>
      </div>
    </div>
  );
};
