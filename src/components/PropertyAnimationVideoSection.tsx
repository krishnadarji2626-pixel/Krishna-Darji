import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Video,
  Sparkles,
  Phone,
  Compass,
  MapPin,
  Layers,
  Activity,
  Info,
  Sliders,
  Check
} from 'lucide-react';
import { Property } from '../types/property';

interface PropertyAnimationVideoSectionProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
  onOpenEnquiry: (property: Property) => void;
  onOpenVideoModal: (property: Property) => void;
}

type CameraMode = 'flythrough' | 'panoramic' | 'crane';

interface Hotspot {
  id: string;
  x: number; // percentage from left
  y: number; // percentage from top
  title: string;
  detail: string;
}

interface Scene {
  name: string;
  time: string;
  image: string;
  hotspots: Hotspot[];
}

interface VideoTourData {
  id: string;
  title: string;
  locality: string;
  price: string;
  tourDuration: string;
  videoType: string;
  scenes: Scene[];
}

const FEATURED_VIDEO_LISTINGS: VideoTourData[] = [
  {
    id: 'HV-SURAT-101',
    title: '3.5 BHK Sky Residence at Green City Gold',
    locality: 'Vesu, VIP Road Extn',
    price: '₹1.45 Cr',
    tourDuration: '2m 20s',
    videoType: '4K Architectural Fly-Through',
    scenes: [
      {
        name: 'Grand Entrance & Italian Marble Foyer',
        time: '0:00',
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80',
        hotspots: [
          { id: 'h1', x: 28, y: 55, title: 'Italian Botticino Marble', detail: 'Imported 8x4 ft zero-joint slab finish' },
          { id: 'h2', x: 72, y: 40, title: 'Biometric Access', detail: 'Yale Smart digital lock with video intercom' },
        ],
      },
      {
        name: 'Double-Height Living Lounge (22ft Ceiling)',
        time: '0:35',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
        hotspots: [
          { id: 'h3', x: 35, y: 30, title: '22ft Ceiling Elevation', detail: 'Acoustic wood paneling & warm mood cove lights' },
          { id: 'h4', x: 80, y: 65, title: 'VRV Central Air Conditioning', detail: 'Daikin hidden ductless inverter system' },
        ],
      },
      {
        name: 'Imported Designer Modular Kitchen',
        time: '1:10',
        image: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1600&q=80',
        hotspots: [
          { id: 'h5', x: 42, y: 48, title: 'Quartz Island Counter', detail: 'Scratch-proof antimicrobial surface with Bosch hob' },
          { id: 'h6', x: 75, y: 38, title: 'Hafele Soft-Close Hardware', detail: 'Hydraulic lift cabinets and tandem drawers' },
        ],
      },
      {
        name: 'Master Bedroom Suite & Skyline Balcony',
        time: '1:45',
        image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80',
        hotspots: [
          { id: 'h7', x: 30, y: 60, title: 'Walk-in Dressing Closet', detail: 'Integrated LED profile lighting with glass shutters' },
          { id: 'h8', x: 82, y: 42, title: 'Tapi River Corridor View', detail: 'Double-glazed soundproof acoustic balcony glass' },
        ],
      },
    ],
  },
  {
    id: 'HV-SURAT-102',
    title: '4 BHK Luxury Independent Bungalow with Private Lawn',
    locality: 'Pal, Pal-Hazira Road',
    price: '₹3.25 Cr',
    tourDuration: '3m 30s',
    videoType: 'Drone Aerial & Interior Walkthrough',
    scenes: [
      {
        name: 'Drone Aerial View & Private Lawn Entry',
        time: '0:00',
        image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80',
        hotspots: [
          { id: 'p1', x: 32, y: 70, title: 'Manicured Private Lawn', detail: '1,200 sq.ft private garden with automated sprinkler' },
          { id: 'p2', x: 68, y: 35, title: 'Modern Stone Facade', detail: 'Natural travertine stone cladding with warm wash lighting' },
        ],
      },
      {
        name: 'Ground Floor Grand Living & Dining',
        time: '0:45',
        image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=80',
        hotspots: [
          { id: 'p3', x: 45, y: 50, title: '10-Seater Dining Space', detail: 'Seamless open-plan layout connecting to lawn deck' },
        ],
      },
      {
        name: 'Private Hydraulic Elevator & Lounge',
        time: '1:30',
        image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1600&q=80',
        hotspots: [
          { id: 'p4', x: 70, y: 45, title: 'Personal Hydraulic Lift', detail: 'Kone glass elevator servicing all 3 floors' },
        ],
      },
      {
        name: 'Rooftop Sundeck Overlooking Greenery',
        time: '2:15',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
        hotspots: [
          { id: 'p5', x: 50, y: 35, title: 'Private Sundeck Gazebo', detail: 'Pergola rooftop with outdoor barbecue setup' },
        ],
      },
    ],
  },
  {
    id: 'HV-SURAT-104',
    title: '3 BHK High-End Panoramic Living on VIP Road',
    locality: 'VIP Road, Opposite Shyam Mandir',
    price: '₹1.15 Cr',
    tourDuration: '2m 40s',
    videoType: 'High-Rise Panoramic Sunset Tour',
    scenes: [
      {
        name: 'Sky Residence Balcony Sunset View',
        time: '0:00',
        image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=80',
        hotspots: [
          { id: 'v1', x: 65, y: 38, title: 'VIP Road Skyline', detail: '180° uninterrupted sunset vista towards Airport corridor' },
        ],
      },
      {
        name: 'Bespoke Teak Wood Hall & Dining',
        time: '0:40',
        image: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1600&q=80',
        hotspots: [
          { id: 'v2', x: 38, y: 55, title: 'Custom Teak Millwork', detail: 'Handcrafted veneer feature wall and console' },
        ],
      },
      {
        name: 'Acoustic Cinema Lounge & Club Access',
        time: '1:20',
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80',
        hotspots: [
          { id: 'v3', x: 52, y: 48, title: 'Dolby Atmos Home Theater', detail: 'Acoustic treated walls and motorized recliner zone' },
        ],
      },
      {
        name: 'Master Bed with Panoramic Glass Wall',
        time: '2:00',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
        hotspots: [
          { id: 'v4', x: 75, y: 40, title: 'Floor-to-Ceiling Glazing', detail: '10ft height toughened laminated safety glass' },
        ],
      },
    ],
  },
];

export const PropertyAnimationVideoSection: React.FC<PropertyAnimationVideoSectionProps> = ({
  properties,
  onSelectProperty,
  onOpenEnquiry,
  onOpenVideoModal,
}) => {
  const [selectedTourIndex, setSelectedTourIndex] = useState(0);
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [cameraMode, setCameraMode] = useState<CameraMode>('flythrough');
  const [playSpeed, setPlaySpeed] = useState<number>(1);
  const [showHotspots, setShowHotspots] = useState<boolean>(true);
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);
  const [showMiniMap, setShowMiniMap] = useState<boolean>(false);

  const activeTour = FEATURED_VIDEO_LISTINGS[selectedTourIndex];
  const activeScene = activeTour.scenes[activeSceneIndex];
  const matchedProperty = properties.find((p) => p.id === activeTour.id) || properties[0];

  // Auto scene advance & progress simulation
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setActiveSceneIndex((scenePrev) => (scenePrev + 1) % activeTour.scenes.length);
            setActiveHotspot(null);
            return 0;
          }
          return prev + 1.2 * playSpeed;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, activeTour.scenes.length, playSpeed]);

  // Dynamic Camera Motion Transform Style
  const getCameraStyle = () => {
    const p = progress / 100;
    if (cameraMode === 'flythrough') {
      // Smooth push-in zoom with slight elevation
      const scale = isPlaying ? 1 + p * 0.12 : 1.05;
      const translateY = isPlaying ? -p * 20 : -10;
      return {
        transform: `scale(${scale}) translateY(${translateY}px)`,
        transition: 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
      };
    } else if (cameraMode === 'panoramic') {
      // Horizontal glide across room
      const scale = 1.08;
      const translateX = isPlaying ? (p - 0.5) * 45 : 0;
      return {
        transform: `scale(${scale}) translateX(${translateX}px)`,
        transition: 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
      };
    } else {
      // Crane vertical upward tilt
      const scale = 1.08;
      const translateY = isPlaying ? (0.5 - p) * 35 : 0;
      return {
        transform: `scale(${scale}) translateY(${translateY}px)`,
        transition: 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
      };
    }
  };

  return (
    <section className="py-16 bg-stone-950 text-white border-b border-stone-800 relative overflow-hidden select-none">
      {/* Dynamic Ambient Background Lights */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-950/90 border border-amber-800/80 rounded-md text-xs font-bold text-amber-400 mb-3 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span>Surat Property Animation & 4K Camera Fly-Through</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-display tracking-tight text-white">
              Experience Surat Properties Before Visiting in Person
            </h2>

            <p className="text-xs sm:text-sm text-stone-400 mt-1.5 max-w-2xl font-normal leading-relaxed">
              Ultra-smooth architectural animations with real 3D camera fly-throughs, panoramic glides, and clickable room inspection hotspots across Vesu, Pal, and VIP Road.
            </p>
          </div>

          {/* Real-time Quality & Video Specs */}
          <div className="flex items-center gap-3">
            <div className="px-3.5 py-2 bg-stone-900/90 border border-stone-800 rounded-xl text-center">
              <span className="text-[11px] font-bold text-emerald-400 block font-mono">4K UHD 60FPS</span>
              <span className="text-[10px] text-stone-400">HDR Quality</span>
            </div>

            <div className="px-3.5 py-2 bg-stone-900/90 border border-stone-800 rounded-xl text-center">
              <span className="text-[11px] font-bold text-amber-400 block font-mono">3D HOTSPOTS</span>
              <span className="text-[10px] text-stone-400">Spec Inspection</span>
            </div>
          </div>
        </div>

        {/* Property Selector Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
          {FEATURED_VIDEO_LISTINGS.map((tour, idx) => (
            <button
              key={tour.id}
              onClick={() => {
                setSelectedTourIndex(idx);
                setActiveSceneIndex(0);
                setProgress(0);
                setIsPlaying(true);
                setActiveHotspot(null);
              }}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap border shrink-0 flex items-center gap-2 ${
                selectedTourIndex === idx
                  ? 'bg-amber-600 text-white border-amber-500 shadow-md ring-2 ring-amber-500/30'
                  : 'bg-stone-900/80 text-stone-300 border-stone-800 hover:bg-stone-800 hover:text-white'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>{tour.title}</span>
              <span className="text-[10px] opacity-80 font-mono">({tour.price})</span>
            </button>
          ))}
        </div>

        {/* Video Cinema Container */}
        <div className="relative aspect-16/9 sm:aspect-21/9 bg-stone-900 rounded-3xl overflow-hidden border border-stone-800 shadow-2xl group">
          {/* Animated Camera Layer */}
          <div className="absolute inset-0 overflow-hidden" style={getCameraStyle()}>
            <img
              src={activeScene.image}
              alt={activeScene.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover filter brightness-95"
            />
          </div>

          {/* Sweeping Architectural Lighting Flare Animation */}
          {isPlaying && (
            <div
              className="absolute inset-0 pointer-events-none opacity-20 bg-gradient-to-r from-transparent via-amber-300/30 to-transparent transition-transform duration-1000 ease-out"
              style={{
                transform: `translateX(${(progress - 50) * 2}%)`,
              }}
            />
          )}

          {/* Dark Vignette Scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-stone-950/70 pointer-events-none" />

          {/* Interactive Floating Hotspots Overlaid on the Animation */}
          {showHotspots &&
            activeScene.hotspots.map((spot) => (
              <div
                key={spot.id}
                className="absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-110"
                style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveHotspot(activeHotspot?.id === spot.id ? null : spot);
                }}
              >
                {/* Pulsing Ripple Dot */}
                <div className="relative flex items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-amber-400 opacity-75" />
                  <div className="w-6 h-6 rounded-full bg-amber-500 border-2 border-white text-stone-950 font-black text-[10px] flex items-center justify-center shadow-lg hover:bg-amber-400">
                    +
                  </div>
                </div>

                {/* Hotspot Card Popover */}
                {activeHotspot?.id === spot.id && (
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-8 w-60 bg-stone-900/95 backdrop-blur-md border border-amber-500/80 rounded-xl p-3 shadow-2xl text-left pointer-events-auto z-30">
                    <div className="flex items-center justify-between pb-1 mb-1 border-b border-stone-800 text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                      <span>Architectural Spec</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveHotspot(null);
                        }}
                        className="text-stone-400 hover:text-white"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="text-xs font-bold text-white">{spot.title}</div>
                    <div className="text-[11px] text-stone-300 mt-0.5">{spot.detail}</div>
                  </div>
                )}
              </div>
            ))}

          {/* Top Video Overlay: Title & Active Camera Mode */}
          <div className="absolute top-4 sm:top-6 inset-x-4 sm:inset-x-6 flex items-start justify-between gap-4 pointer-events-none">
            {/* Title & Live Status */}
            <div className="bg-stone-900/85 backdrop-blur-md border border-stone-700/80 rounded-2xl px-4 py-2.5 pointer-events-auto shadow-lg max-w-sm">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                  Live 4K Animation Active
                </span>
                <span className="text-stone-500">·</span>
                <span className="text-[10px] font-mono text-stone-400">
                  {cameraMode === 'flythrough' ? 'Push-In Zoom' : cameraMode === 'panoramic' ? 'Panoramic Glide' : 'Crane Elevation'}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-extrabold text-white truncate">
                {activeTour.title}
              </h3>
              <p className="text-xs text-stone-300">
                {activeTour.locality} · <span className="text-amber-400 font-bold">{activeTour.price}</span>
              </p>
            </div>

            {/* Top Right: Animation Camera Controls */}
            <div className="flex items-center gap-2 pointer-events-auto">
              {/* Camera Mode Toggle Button */}
              <div className="hidden sm:flex bg-stone-900/85 backdrop-blur-md border border-stone-700/80 rounded-xl p-1 text-[11px] font-bold">
                <button
                  onClick={() => setCameraMode('flythrough')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    cameraMode === 'flythrough' ? 'bg-amber-600 text-white shadow-xs' : 'text-stone-400 hover:text-white'
                  }`}
                  title="3D Push-In Fly-Through Camera"
                >
                  Fly-Through
                </button>

                <button
                  onClick={() => setCameraMode('panoramic')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    cameraMode === 'panoramic' ? 'bg-amber-600 text-white shadow-xs' : 'text-stone-400 hover:text-white'
                  }`}
                  title="Horizontal Panoramic Glide"
                >
                  Panoramic
                </button>

                <button
                  onClick={() => setCameraMode('crane')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    cameraMode === 'crane' ? 'bg-amber-600 text-white shadow-xs' : 'text-stone-400 hover:text-white'
                  }`}
                  title="Vertical Crane Upward Tilt"
                >
                  Crane Up
                </button>
              </div>

              {/* Toggle Hotspots Button */}
              <button
                onClick={() => setShowHotspots(!showHotspots)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold backdrop-blur-md border transition-all cursor-pointer shadow-md ${
                  showHotspots
                    ? 'bg-amber-600 text-white border-amber-500'
                    : 'bg-stone-900/85 text-stone-400 border-stone-700 hover:text-white'
                }`}
                title="Toggle interactive room feature hotspots"
              >
                Hotspots: {showHotspots ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>

          {/* Center Play Button if paused */}
          {!isPlaying && (
            <button
              onClick={() => setIsPlaying(true)}
              className="absolute z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 sm:w-20 h-16 sm:h-20 rounded-full bg-amber-600/90 hover:bg-amber-600 text-white flex items-center justify-center shadow-2xl transition-transform hover:scale-110 cursor-pointer"
            >
              <Play className="w-8 sm:w-10 h-8 sm:h-10 fill-current ml-1" />
            </button>
          )}

          {/* Bottom Floating Bar: Scrubber, Controls & Action Buttons */}
          <div className="absolute bottom-0 inset-x-0 p-4 sm:p-6 bg-gradient-to-t from-black via-black/85 to-transparent z-20">
            {/* Progress Scrubber Bar */}
            <div className="w-full h-1.5 bg-stone-700/80 rounded-full mb-3.5 overflow-hidden">
              <div
                className="h-full bg-amber-500 transition-all duration-100 ease-linear rounded-full shadow-xs"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Playback Controls & Waveform */}
              <div className="flex items-center gap-3 text-xs">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-1.5 text-white hover:text-amber-400 transition-colors cursor-pointer"
                  title={isPlaying ? 'Pause Animation' : 'Play Animation'}
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
                </button>

                <button
                  onClick={() => {
                    setProgress(0);
                    setActiveSceneIndex(0);
                    setIsPlaying(true);
                  }}
                  className="p-1.5 text-stone-400 hover:text-white transition-colors cursor-pointer"
                  title="Replay animation from start"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1.5 text-stone-400 hover:text-white transition-colors cursor-pointer"
                  title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>

                {/* Animated Waveform Bars */}
                {isPlaying && !isMuted && (
                  <div className="hidden sm:flex items-center gap-0.5 h-3">
                    <span className="w-1 bg-amber-400 rounded-full animate-pulse h-2" />
                    <span className="w-1 bg-amber-400 rounded-full animate-pulse h-3.5 delay-75" />
                    <span className="w-1 bg-amber-400 rounded-full animate-pulse h-2 delay-150" />
                    <span className="w-1 bg-amber-400 rounded-full animate-pulse h-3 delay-100" />
                  </div>
                )}

                <span className="text-xs font-mono text-stone-300 tabular-nums">
                  Room {activeSceneIndex + 1}/{activeTour.scenes.length} · {activeTour.tourDuration}
                </span>

                {/* Speed selector */}
                <button
                  onClick={() => setPlaySpeed((s) => (s === 1 ? 1.5 : s === 1.5 ? 2 : 1))}
                  className="px-2 py-0.5 bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white font-mono rounded text-[10px] cursor-pointer"
                  title="Animation Speed"
                >
                  {playSpeed}x
                </button>
              </div>

              {/* Action Buttons Right Inside the Video Player */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenEnquiry(matchedProperty)}
                  className="px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer whitespace-nowrap shadow-md"
                >
                  Book Site Visit via Form
                </button>

                <a
                  href="tel:+918879719844"
                  className="px-3.5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap border border-stone-700 shadow-md"
                  title="Call Hardik Hingu: 8879719844"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400 fill-current" />
                  <span>Call Hardik</span>
                </a>

                <button
                  onClick={() => onOpenVideoModal(matchedProperty)}
                  className="p-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl cursor-pointer transition-colors shadow-md"
                  title="Open Full 360 Interactive 4K Video Tour Modal"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Room Chapters Grid below video */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {activeTour.scenes.map((scene, idx) => (
            <button
              key={idx}
              onClick={() => {
                setActiveSceneIndex(idx);
                setProgress(0);
                setIsPlaying(true);
                setActiveHotspot(null);
              }}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                activeSceneIndex === idx
                  ? 'bg-amber-600/20 border-amber-500 text-white ring-1 ring-amber-500'
                  : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-white hover:border-stone-700'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                <span className="text-amber-400 font-bold">Room {idx + 1}</span>
                <span className="text-stone-500">{scene.time}</span>
              </div>
              <div className="text-xs font-semibold line-clamp-1">{scene.name}</div>
              <div className="text-[10px] text-stone-500 mt-1">
                {scene.hotspots.length} Clickable Specs
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
