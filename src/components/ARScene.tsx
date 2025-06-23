import React, { useEffect, useRef, useState } from 'react';
import { X, Camera } from 'lucide-react';
import { initializeMindAR } from '../utils/mindARUtils';
import { loadARComponent } from '../utils/arComponentLoader';

interface ARSceneProps {
  experienceId: string;
  onError: (error: string) => void;
}

export const ARScene: React.FC<ARSceneProps> = ({ experienceId, onError }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingStage, setLoadingStage] = useState<string>('Starting camera...');

  useEffect(() => {
    let mounted = true;
    let cleanup: (() => void) | null = null;
    
    const startAR = async () => {
      if (!containerRef.current) {
        console.error('❌ Container not available');
        if (mounted) onError('AR container not available');
        return;
      }

      try {
        console.log('🚀 Starting AR for:', experienceId);
        
        // Check if .mind file exists
        setLoadingStage('Loading marker file...');
        const mindFileUrl = `/assets/${experienceId}.mind`;
        
        const response = await fetch(mindFileUrl);
        if (!response.ok) {
          throw new Error(`Marker file not found: ${experienceId}.mind`);
        }
        
        console.log('✅ Found marker file:', mindFileUrl);

        // Load AR component
        setLoadingStage('Loading 3D content...');
        const ARComponent = await loadARComponent(experienceId);
        
        // Initialize MindAR
        setLoadingStage('Starting AR...');
        const { cleanupFn } = await initializeMindAR(
          containerRef.current,
          mindFileUrl,
          {
            onTrackingStart: () => {
              console.log('🎯 Tracking started!');
              if (mounted) setIsTracking(true);
            },
            onTrackingLost: () => {
              console.log('📱 Tracking lost');
              if (mounted) setIsTracking(false);
            },
            onError: (error: string) => {
              console.error('❌ AR error:', error);
              if (mounted) onError(error);
            },
            onReady: () => {
              console.log('✅ AR ready!');
              if (mounted) setIsLoading(false);
            }
          },
          ARComponent
        );
        
        if (mounted) {
          cleanup = cleanupFn;
        }

      } catch (error) {
        console.error('❌ Failed to start AR:', error);
        if (mounted) {
          onError(`Failed to start AR: ${error}`);
        }
      }
    };

    // Small delay to ensure container is ready
    const timer = setTimeout(startAR, 100);

    return () => {
      clearTimeout(timer);
      mounted = false;
      if (cleanup) {
        console.log('🧹 Cleaning up AR');
        cleanup();
      }
    };
  }, [experienceId, onError]);

  return (
    <div className="fixed inset-0 bg-black">
      {/* AR Container */}
      <div 
        ref={containerRef} 
        className="w-full h-full"
      />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="text-white text-center">
            <div className="animate-spin w-12 h-12 border-3 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
            <h2 className="text-xl font-bold mb-2">AR Experience: {experienceId}</h2>
            <p className="text-sm opacity-80">{loadingStage}</p>
          </div>
        </div>
      )}

      {/* Simple UI */}
      {!isLoading && (
        <>
          {/* Status Bar */}
          <div className="absolute top-4 left-4 right-4 z-40">
            <div className="bg-black/50 backdrop-blur rounded-lg p-3 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  isTracking ? 'bg-green-400' : 'bg-yellow-400'
                }`} />
                <span className="text-white text-sm">
                  {isTracking ? `${experienceId} Active` : `Find ${experienceId} marker`}
                </span>
              </div>
              <button
                onClick={() => window.location.href = '/'}
                className="text-white hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="absolute bottom-4 left-4 right-4 z-40">
            <div className="bg-black/50 backdrop-blur rounded-lg p-3 text-center">
              <p className="text-white text-sm">
                {isTracking 
                  ? `🎯 AR is active! Move around to explore the ${experienceId} experience`
                  : `📱 Point your camera at the ${experienceId}.mind marker image`
                }
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};