/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Plus, Image as ImageIcon, Smile, Gift, Languages, Mic, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const SPEEDS = [1, 0.75, 0.5, 1.25, 1.5];

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const duration = 6; // 6 seconds as shown in the image

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressInterval = useRef<number | null>(null);

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleCycleSpeed = () => {
    const currentIndex = SPEEDS.indexOf(playbackSpeed);
    const nextIndex = (currentIndex + 1) % SPEEDS.length;
    setPlaybackSpeed(SPEEDS[nextIndex]);
  };

  useEffect(() => {
    if (isPlaying) {
      progressInterval.current = window.setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + (0.1 * playbackSpeed);
          if (next >= duration) {
            setIsPlaying(false);
            return 0;
          }
          return next;
        });
      }, 100);
    } else {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [isPlaying, playbackSpeed]);

  useEffect(() => {
    setProgress((currentTime / duration) * 100);
  }, [currentTime]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Mock waveform bars
  const waveformBars = [
    12, 18, 24, 16, 20, 28, 22, 14, 18, 26, 20, 12, 16, 22, 18, 14
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans text-gray-900">
      {/* Header */}
      <header className="p-4 flex justify-center items-center bg-white border-b border-gray-100">
        <span className="text-sm font-medium text-gray-500">18:26</span>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col">
        <div className="flex-1" />
        
        {/* Voice Message Bubble */}
        <div className="flex justify-end">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#F0EEFF] rounded-3xl p-4 pr-6 shadow-sm max-w-[85%] relative"
          >
            <div className="flex items-center gap-4">
              {/* Play/Pause Button */}
              <button 
                onClick={handleTogglePlay}
                className="w-10 h-10 rounded-full bg-[#7C66FF] flex items-center justify-center text-white hover:bg-[#6B55EE] transition-colors"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
              </button>

              {/* Waveform and Progress */}
              <div className="flex flex-col gap-1">
                <div className="flex items-end gap-1 h-8">
                  {waveformBars.map((height, i) => {
                    const barProgress = (i / waveformBars.length) * 100;
                    const isActive = progress > barProgress;
                    return (
                      <div 
                        key={i}
                        className={`w-1 rounded-full transition-colors duration-300 ${isActive ? 'bg-[#7C66FF]' : 'bg-[#D1C9FF]'}`}
                        style={{ height: `${height}px` }}
                      />
                    );
                  })}
                </div>
                <div className="flex justify-between text-[10px] text-gray-400 font-mono mt-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Speed Button */}
              <button 
                onClick={handleCycleSpeed}
                className="ml-2 px-3 py-1.5 rounded-full bg-[#E5E1FF] text-[#7C66FF] text-sm font-semibold hover:bg-[#DCD7FF] transition-colors min-w-[50px]"
              >
                {playbackSpeed}x
              </button>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Input Area */}
      <footer className="p-4 bg-white border-t border-gray-100 space-y-4">
        <div className="flex items-center gap-3 bg-gray-100 rounded-2xl px-4 py-3">
          <input 
            type="text" 
            placeholder="请输入..." 
            className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
          />
          <Mic size={24} className="text-gray-400 cursor-pointer hover:text-gray-600" />
        </div>

        <div className="flex justify-between items-center px-2">
          <div className="flex gap-6">
            <Plus size={24} className="text-gray-500 cursor-pointer hover:text-gray-700" />
            <ImageIcon size={24} className="text-gray-500 cursor-pointer hover:text-gray-700" />
            <Smile size={24} className="text-gray-500 cursor-pointer hover:text-gray-700" />
            <Gift size={24} className="text-gray-500 cursor-pointer hover:text-gray-700" />
            <Languages size={24} className="text-gray-500 cursor-pointer hover:text-gray-700" />
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
            <Send size={20} />
          </div>
        </div>
      </footer>
    </div>
  );
}
