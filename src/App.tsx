import React, { useState, useEffect } from 'react';
import { ARScene } from './components/ARScene';
import { ErrorScreen } from './components/ErrorScreen';

function App() {
  const [experienceId, setExperienceId] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Extract experience ID from URL path
    const path = window.location.pathname;
    
    if (path && path !== '/') {
      const id = path.substring(1); // Remove leading slash
      console.log('🎯 Starting AR experience:', id);
      setExperienceId(id);
    } else {
      // Default experience if no path
      setExperienceId('granny');
    }
  }, []);

  if (error) {
    return (
      <ErrorScreen
        error={error}
        onRetry={() => {
          setError('');
          window.location.reload();
        }}
        onGoHome={() => {
          setError('');
          window.location.href = '/';
        }}
      />
    );
  }

  if (!experienceId) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <ARScene 
      experienceId={experienceId}
      onError={setError}
    />
  );
}

export default App;