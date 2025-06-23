import React from 'react';
import { Camera, QrCode, Eye, Sparkles } from 'lucide-react';

interface MainPanelProps {
  onStart: () => void;
  experienceId?: string;
}

export const MainPanel: React.FC<MainPanelProps> = ({ onStart, experienceId }) => {
  const getExperienceInfo = (id: string) => {
    const experiences: Record<string, { name: string; description: string; emoji: string }> = {
      'granny': {
        name: 'Granny\'s Garden',
        description: 'A magical garden experience with Granny',
        emoji: '👵🌻'
      },
      'robot': {
        name: 'Robot Factory',
        description: 'Interactive robot assembly line',
        emoji: '🤖⚙️'
      },
      'dragon': {
        name: 'Dragon\'s Lair',
        description: 'Meet a friendly dragon in AR',
        emoji: '🐉🔥'
      },
      'ocean': {
        name: 'Ocean Adventure',
        description: 'Dive into an underwater world',
        emoji: '🌊🐠'
      }
    };

    return experiences[id] || {
      name: `${id.charAt(0).toUpperCase() + id.slice(1)} Experience`,
      description: `Interactive AR experience: ${id}`,
      emoji: '✨🎯'
    };
  };

  const experience = experienceId ? getExperienceInfo(experienceId) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Logo */}
        <div className="w-20 h-20 bg-gradient-to-br from-white/20 to-white/5 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-white/30 shadow-xl">
          <Camera className="w-10 h-10 text-white" />
        </div>

        {/* Title */}
        {experience ? (
          <div className="mb-8">
            <div className="text-4xl mb-4">{experience.emoji}</div>
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">{experience.name}</h1>
            <p className="text-white/70 text-lg mb-4">{experience.description}</p>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
              <p className="text-white/80 text-sm">
                <span className="font-medium">Experience ID:</span> <span className="font-mono text-blue-300">{experienceId}</span>
              </p>
            </div>
          </div>
        ) : (
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">WebAR Experience</h1>
            <p className="text-white/70 text-lg mb-4">Scan QR codes to see 3D magic</p>
          </div>
        )}

        {/* Tutorial Icons */}
        <div className="flex justify-center space-x-8 mb-12">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500/30 to-blue-600/20 rounded-xl flex items-center justify-center mb-3 border border-blue-400/30 shadow-lg">
              <QrCode className="w-8 h-8 text-blue-300" />
            </div>
            <span className="text-white/80 text-sm font-medium">Scan QR</span>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500/30 to-green-600/20 rounded-xl flex items-center justify-center mb-3 border border-green-400/30 shadow-lg">
              <Eye className="w-8 h-8 text-green-300" />
            </div>
            <span className="text-white/80 text-sm font-medium">Find Marker</span>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500/30 to-purple-600/20 rounded-xl flex items-center justify-center mb-3 border border-purple-400/30 shadow-lg">
              <Sparkles className="w-8 h-8 text-purple-300" />
            </div>
            <span className="text-white/80 text-sm font-medium">See Magic</span>
          </div>
        </div>

        {/* Instructions */}
        {experience && (
          <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-4 mb-8">
            <h3 className="text-blue-300 font-medium mb-2">📱 How to use:</h3>
            <ol className="text-blue-200 text-sm space-y-1 text-left">
              <li>1. Tap "Start AR Experience" below</li>
              <li>2. Allow camera access when prompted</li>
              <li>3. Point camera at the <span className="font-mono bg-blue-600/30 px-1 rounded">{experienceId}.mind</span> marker image</li>
              <li>4. Watch the AR magic appear! ✨</li>
            </ol>
          </div>
        )}

        {/* Start Button */}
        <button
          onClick={onStart}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-6 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-2xl text-lg"
        >
          <div className="flex items-center justify-center space-x-3">
            <Camera className="w-6 h-6" />
            <span>Start AR Experience</span>
          </div>
        </button>

        <p className="text-white/50 text-sm mt-6">
          Camera access required for AR functionality
        </p>
      </div>
    </div>
  );
};