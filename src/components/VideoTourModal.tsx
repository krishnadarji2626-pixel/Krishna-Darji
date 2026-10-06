import React, { useState, useEffect, useRef } from 'react';
import { Property } from '../types/property';
import { X, Play, Pause, RotateCcw, Volume2, VolumeX, Maximize2, ShieldCheck, Phone, Compass, MapPin } from 'lucide-react';

interface VideoTourModalProps {
  property: Property | null;
  onClose: () => void;
  onOpenEnquiry: (property: Property) => void;
}

const TOUR_CHAPTERS = [
  { id: 1, title: 'Grand Foyer & Living Lounge', timestamp: 0, duration: 30, imageKey: 0 },
  { id: 2, title: 'Italian Modular Kitchen & Dining', timestamp: 30, duration: 35, imageKey: 1 },
  { id: 3, title: 'Master Bedroom Suite & Dressing', timestamp: 65, duration: 35, imageKey: 2 },
  { id: 4, title: 'Panoramic Balcony & Skyline View', timestamp: 100, duration: 40, imageKey: 3 }
];

export const VideoTourModal: React.FC<VideoTourModalProps> = ({
  property,
  onClose,
  onOpenEnquiry,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [panOffset, setPanOffset] = useState(0);

  const totalDuration = property?.videoDurationSec || 140;

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= totalDuration) {
            setIsPlaying(false);
            return totalDuration;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, totalDuration]);

  // Sync chapter with time
  useEffect(() => {
    const chapter = TOUR_CHAPTERS.find(
      (c, idx) =>
        currentTime >= c.timestamp &&
        currentTime < (TOUR_CHAPTERS[idx + 1]?.timestamp || totalDuration + 1)
    );
    if (chapter) {
      setActiveChapterIndex(chapter.id - 1);
    }
  }, [currentTime, totalDuration]);

  if (!property) return null;

  const currentChapter = TOUR_CHAPTERS[activeChapterIndex] || TOUR_CHAPTERS[0];
  const activeImage = property.galleryImages[currentChapter.imageKey % property.galleryImages.length] || property.coverImage;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const jumpToChapter = (chapter: typeof TOUR_CHAPTERS[0], idx: number) => {
    setCurrentTime(chapter.timestamp);
    setActiveChapterIndex(idx);
    setIsPlaying(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-stone-950 text-white rounded-3xl shadow-2xl border border-stone-800 overflow-hidden my-auto max-h-[95vh] flex flex-col">
        {/* Top Header */}
        <div className="px-5 py-3.5 bg-stone-900 border-b border-stone-800 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-bold text-amber-400 bg-amber-950/70 border border-amber-800/80 px-2 py-0.5 rounded">
              HD Video Tour Simulation
            </span>
            <div className="text-xs text-stone-300">
              <strong className="text-white">{property.title}</strong>
              <span className="text-stone-500 ml-2">({property.locality}, Surat)</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Simulation Canvas */}
        <div className="relative aspect-16/9 bg-stone-900 overflow-hidden flex items-center justify-center select-none">
          {/* Panoramic Moving Image simulation */}
          <div
            className="absolute inset-0 transition-transform duration-1000 ease-out"
            style={{
              transform: `scale(1.08) translateX(${panOffset}px) scaleX(${isPlaying ? 1.02 : 1})`,
            }}
          >
            <img
              src={activeImage}
              alt="Room view"
              className="w-full h-full object-cover filter brightness-95"
            />
          </div>

          {/* Ambient Dark Gradient Scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-transparent to-stone-950/60 pointer-events-none" />

          {/* Top Video Overlay: Current Room Kicker */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
            <div className="bg-stone-900/80 backdrop-blur-md border border-stone-700/60 rounded-xl px-3.5 py-2">
              <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider block">
                Current Walkthrough Room
              </span>
              <span className="text-sm font-bold text-white flex items-center gap-2">
                <Compass className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '10s' }} />
                {currentChapter.title}
              </span>
            </div>

            <div className="bg-stone-900/80 backdrop-blur-md border border-stone-700/60 rounded-xl px-3.5 py-2 text-right">
              <span className="text-[10px] font-semibold text-emerald-400 block">
                ● Live 4K Walkthrough
              </span>
              <span className="text-xs font-mono text-stone-300">
                {property.locality} · {property.priceDisplay}
              </span>
            </div>
          </div>

          {/* 360 Pan Controls Overlay */}
          <div className="absolute inset-y-0 inset-x-4 flex items-center justify-between pointer-events-none">
            <button
              onClick={() => setPanOffset((p) => p + 40)}
              className="pointer-events-auto p-3 rounded-full bg-stone-900/60 hover:bg-stone-900/90 text-white backdrop-blur-md border border-stone-700/50 cursor-pointer transition-all"
              title="Pan Left"
            >
              ←
            </button>
            <button
              onClick={() => setPanOffset((p) => p - 40)}
              className="pointer-events-auto p-3 rounded-full bg-stone-900/60 hover:bg-stone-900/90 text-white backdrop-blur-md border border-stone-700/50 cursor-pointer transition-all"
              title="Pan Right"
            >
              →
            </button>
          </div>

          {/* Play/Pause Giant Center Overlay if paused */}
          {!isPlaying && (
            <button
              onClick={() => setIsPlaying(true)}
              className="absolute z-10 w-16 h-16 rounded-full bg-amber-600/90 hover:bg-amber-600 text-white flex items-center justify-center shadow-2xl transition-transform hover:scale-110 cursor-pointer"
            >
              <Play className="w-8 h-8 fill-current ml-1" />
            </button>
          )}

          {/* Video Player Controls Bar */}
          <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent">
            {/* Scrubber */}
            <div className="relative mb-2 group">
              <input
                type="range"
                min={0}
                max={totalDuration}
                value={currentTime}
                onChange={(e) => setCurrentTime(Number(e.target.value))}
                className="w-full h-1.5 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-1 text-white hover:text-amber-400 transition-colors cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
                </button>

                <button
                  onClick={() => setCurrentTime(0)}
                  className="p-1 text-stone-400 hover:text-white transition-colors cursor-pointer"
                  title="Replay from start"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1 text-stone-400 hover:text-white transition-colors cursor-pointer"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>

                <span className="font-mono text-stone-300 tabular-nums">
                  {formatTime(currentTime)} / {formatTime(totalDuration)}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[11px] text-stone-400 hidden sm:inline">
                  Guided Property Tour: HomeVanta Surat
                </span>
                <button
                  onClick={() => alert('Full screen mode toggle')}
                  className="p-1 text-stone-400 hover:text-white transition-colors cursor-pointer"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Room Chapter Navigation Bar */}
        <div className="p-4 bg-stone-900 border-t border-stone-800">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-2">
            Jump to Specific Room in Tour:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {TOUR_CHAPTERS.map((chapter, idx) => (
              <button
                key={chapter.id}
                onClick={() => jumpToChapter(chapter, idx)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer text-xs ${
                  activeChapterIndex === idx
                    ? 'bg-amber-600/20 border-amber-500 text-white'
                    : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-white hover:border-stone-700'
                }`}
              >
                <div className="font-semibold truncate">{chapter.title}</div>
                <div className="text-[10px] text-stone-500 font-mono mt-0.5">
                  Starts at {formatTime(chapter.timestamp)}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer: Direct Call / Enquire via Google Form with Hardik Hingu */}
        <div className="p-4 sm:p-5 bg-stone-950 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h4 className="text-sm font-bold text-white">
              Liked this video walkthrough? Book a physical inspection
            </h4>
            <p className="text-xs text-stone-400">
              Direct developer key handover and site access handled by Hardik Hingu (8879719844).
            </p>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => {
                onClose();
                onOpenEnquiry(property);
              }}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer whitespace-nowrap shadow-xs"
            >
              Submit Google Form Enquiry
            </button>

            <a
              href="tel:+918879719844"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer whitespace-nowrap shadow-xs"
            >
              <Phone className="w-3.5 h-3.5 fill-current" />
              <span>Call Hardik: 8879719844</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
