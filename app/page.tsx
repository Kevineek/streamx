'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Play, Pause, Plus, Check, Info, Search, Bell, User, Volume2, VolumeX,
  Maximize, Minimize, RotateCcw, RotateCw, SkipForward, Settings, Lock,
  ChevronDown, ChevronRight, Star, ThumbsUp, ThumbsDown, X, Edit3, Trash2,
  Shield, Film, Tv, List, Clock, CreditCard, HelpCircle, Code, Server,
  Database, RefreshCw, Eye, EyeOff, Sliders, Monitor, Globe, Download,
  CheckCircle, AlertCircle, ArrowLeft, Layers, LogIn, LogOut, UserPlus, Edit
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Inicializácia Supabase klienta
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ==========================================
// MOCK DATABASE & SEED DATA
// ==========================================
const SEED_MOVIES = [
  {
    id: 'm1',
    type: 'movie',
    title: 'Tears of Steel',
    tagline: 'Budúcnosť je v ruinách starých spomienok.',
    description: 'Skupina výskumníkov sa stretáva v Oude Kerk v Amsterdame, aby rekonštruovala kľúčovú udalosť z minulosti a zachránila svet pred inváziou robotov.',
    year: 2012,
    duration: '12 min',
    ageRating: '12+',
    genres: ['Sci-Fi', 'Akčné', 'Dráma'],
    rating: 4.7,
    matchRate: 98,
    isOriginal: true,
    isTrending: true,
    top10Rank: 1,
    coverUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    cast: ['Derek de Lint', 'Sergio Hasselbaink', 'Rogan van der Berg'],
    director: 'Ian Hubert',
    audioTracks: ['Slovenský dabing (5.1)', 'Český dabing', 'Anglický originál'],
    subtitles: ['Slovenské', 'České', 'Anglické', 'Vypnuté'],
    introStart: 5,
    introEnd: 15
  },
  {
    id: 'm2',
    type: 'movie',
    title: 'Big Buck Bunny',
    tagline: 'Keď sa obrovský králik nahnevá...',
    description: 'Dobrosrdečný obrovský králik Big Buck spoznáva krásy lesa, kým mu jeho pokoj nenarušia tri zlomyseľné hlodavce. Odveta bude sladká a komická!',
    year: 2008,
    duration: '10 min',
    ageRating: 'Všetky vekové kategórie',
    genres: ['Animované', 'Komédie', 'Rodinné'],
    rating: 4.8,
    matchRate: 95,
    isOriginal: false,
    isTrending: true,
    top10Rank: 2,
    coverUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&auto=format&fit=crop&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    cast: ['Bunny', 'Gamer Squirrel', 'Frankie'],
    director: 'Sacha Goedegebure',
    audioTracks: ['Slovenský dabing', 'Anglický originál'],
    subtitles: ['Slovenské', 'Vypnuté'],
    introStart: 0,
    introEnd: 8
  },
  {
    id: 'm3',
    type: 'movie',
    title: 'Sintel: Cesta drakov',
    tagline: 'Osamelá bojovníčka na nezastaviteľnej púti.',
    description: 'Mladá dievčina Sintel nájde zranené mláďa draka a vypestuje si k nemu hlboké puto. Keď ho dospelý drak unesie, vydáva sa na nebezpečnú výpravu naprieč svetom.',
    year: 2010,
    duration: '15 min',
    ageRating: '12+',
    genres: ['Fantasy', 'Akčné', 'Dráma'],
    rating: 4.9,
    matchRate: 99,
    isOriginal: true,
    isTrending: true,
    top10Rank: 3,
    coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1600&auto=format&fit=crop&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    cast: ['Halina Reijn', 'Thom Hoffman'],
    director: 'Colin Levy',
    audioTracks: ['Slovenský dabing', 'Český dabing', 'Anglický originál'],
    subtitles: ['Slovenské', 'České', 'Anglické'],
    introStart: 10,
    introEnd: 25
  },
  {
    id: 's1',
    type: 'series',
    title: 'Nexus Chronicles: Elephant Dream',
    tagline: 'Stroje nesnívajú, no zachytávajú naše nočné mory.',
    description: 'Dve obsluhy gigantického nekončiaceho stroja objavujú tajomstvá fungovania vlastnej reality a hrozbu, ktorá prichádza z útrob mechanického sveta.',
    year: 2024,
    seasonsCount: 2,
    episodesCount: 12,
    ageRating: '16+',
    genres: ['Sci-Fi', 'Thriller', 'Dráma'],
    rating: 4.6,
    matchRate: 94,
    isOriginal: true,
    isTrending: true,
    top10Rank: 4,
    coverUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=1600&auto=format&fit=crop&q=80',
    cast: ['Tygo Gernandt', 'Cas Jansen'],
    director: 'Bassam Kurdali',
    seasons: [
      {
        seasonNumber: 1,
        title: 'Séria 1: Mechanické prebudenie',
        episodes: [
          {
            id: 's1e1',
            episodeNumber: 1,
            title: '1. Kapitola: V útrobách oceľového obra',
            duration: '11 min',
            description: 'Proog a Emo sa vydávajú do hlbších poschodí komplexu Stroj. Zisťujú, že architektúra sa sama mení.',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            thumbnail: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&auto=format&fit=crop&q=80',
            introStart: 4,
            introEnd: 12
          },
          {
            id: 's1e2',
            episodeNumber: 2,
            title: '2. Kapitola: Signál zo spomienok',
            duration: '10 min',
            description: 'Neznámy zvukový signál privedie posádku k opustenému riadiacemu panelu z minulého storočia.',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80',
            introStart: 2,
            introEnd: 10
          }
        ]
      }
    ]
  },
  {
    id: 'm4',
    type: 'movie',
    title: 'Rýchlosť & Následky',
    tagline: 'Jedna sekunda nepozornosti, celoživotný záväzok.',
    description: 'Adrenalínový pohľad na automobilové preteky v uzavretom meste, kde stávky prekračujú len samotné peniaze.',
    year: 2023,
    duration: '15 min',
    ageRating: '16+',
    genres: ['Akčné', 'Kriminálne'],
    rating: 4.4,
    matchRate: 89,
    isOriginal: false,
    isTrending: false,
    coverUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600&auto=format&fit=crop&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    cast: ['Alex Vance', 'Elena Rostova'],
    director: 'Marcus Vance'
  },
  {
    id: 'm5',
    type: 'movie',
    title: 'Kybernetický Horizont',
    tagline: 'Kde končí človek a začína kód?',
    description: 'Temný vizuálny príbeh hovorí o hackerke, ktorá do svojho vedomia stiahne zakázanú AI.',
    year: 2024,
    duration: '14 min',
    ageRating: '18+',
    genres: ['Sci-Fi', 'Horory', 'Thriller'],
    rating: 4.8,
    matchRate: 97,
    isOriginal: true,
    isTrending: true,
    top10Rank: 5,
    coverUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1600&auto=format&fit=crop&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    cast: ['Maya Lin', 'David Thorne'],
    director: 'Koji Sato'
  }
];

const DEFAULT_USER_PROFILES = [
  { id: 'p1', name: 'Môj Profil', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80', isKids: false, pin: null },
  { id: 'p2', name: 'Deti & Rodina', avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80', isKids: true, pin: null }
];

// ==========================================
// MAIN APP COMPONENT
// ==========================================
export default function App() {
  // Navigation & Profile State
  const [profiles, setProfiles] = useState(DEFAULT_USER_PROFILES);
  const [activeProfile, setActiveProfile] = useState(DEFAULT_USER_PROFILES[0]);
  const [isProfileSelectorOpen, setIsProfileSelectorOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home'); 
  const [selectedGenre, setSelectedGenre] = useState('All');

  // Auth System State (Supabase Integration)
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [inputEmail, setInputEmail] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Interactive Content State
  const [myList, setMyList] = useState(['m1', 's1']);
  const [watchProgress, setWatchProgress] = useState({ 'm1': 240, 's1e1': 120 });
  const [ratings, setRatings] = useState({ 'm1': 5, 'm3': 4 });

  // Player & Detail Modal State
  const [selectedMedia, setSelectedMedia] = useState<any>(null);
  const [activeVideoSource, setActiveVideoSource] = useState<any>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

  // Search Engine State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Pin Dialog State
  const [pinModalProfile, setPinModalProfile] = useState<any>(null);
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState(false);

  // Notifications State
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Nová Séria!', desc: 'Nexus Chronicles prichádza s 2. sériou.', read: false, date: 'Dnes' },
    { id: 2, title: 'Pridaný nový film', desc: 'Sintel: Cesta drakov je teraz dostupná v 4K.', read: false, date: 'Včera' }
  ]);
  const [showNotificationsMenu, setShowNotificationsMenu] = useState(false);

  // Admin Catalog Management & User List Management
  const [catalog, setCatalog] = useState(SEED_MOVIES);
  const [allUsers, setAllUsers] = useState([
    { id: 'u1', email: 'kevinkasak@icloud.com', role: 'admin' },
    { id: 'u2', email: 'uzivatel@example.com', role: 'user' }
  ]);

  // Supabase Auth Session Listener & Initializer
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const userRole = session.user.user_metadata?.role || (session.user.email?.toLowerCase().includes('admin') ? 'admin' : 'user');
        setCurrentUser({
          id: session.user.id,
          email: session.user.email,
          role: userRole,
          isLoggedIn: true
        });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const userRole = session.user.user_metadata?.role || (session.user.email?.toLowerCase().includes('admin') ? 'admin' : 'user');
        setCurrentUser({
          id: session.user.id,
          email: session.user.email,
          role: userRole,
          isLoggedIn: true
        });
      } else {
        setCurrentUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Search Filtering Effect
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const q = searchQuery.toLowerCase();
    const filtered = catalog.filter(item =>
      item.title.toLowerCase().includes(q) ||
      item.genres.some((g: string) => g.toLowerCase().includes(q)) ||
      (item.cast && item.cast.some((c: string) => c.toLowerCase().includes(q))) ||
      (item.director && item.director.toLowerCase().includes(q))
    );
    setSearchResults(filtered);
  }, [searchQuery, catalog]);

  // Handle Supabase Auth Logic (Login / Register)
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!inputEmail || !inputPassword) return;

    if (authMode === 'register') {
      const { data, error } = await supabase.auth.signUp({
        email: inputEmail,
        password: inputPassword,
        options: {
          data: {
            role: inputEmail.toLowerCase().includes('admin') ? 'admin' : 'user'
          }
        }
      });
      if (error) {
        setAuthError(error.message);
        return;
      }
      if (data.user) {
        setAllUsers(prev => [...prev, { id: data.user.id, email: inputEmail, role: inputEmail.toLowerCase().includes('admin') ? 'admin' : 'user' }]);
        alert('Registrácia úspešná! Teraz sa môžete prihlásiť.');
        setAuthMode('login');
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: inputEmail,
        password: inputPassword,
      });
      if (error) {
        setAuthError(error.message);
        return;
      }
      if (data.session) {
        setIsAuthModalOpen(false);
        setInputEmail('');
        setInputPassword('');
      }
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setIsProfileSelectorOpen(false);
    setActiveTab('home');
  };

  // Profile PIN Verification Handler
  const handleSelectProfile = (profile: any) => {
    if (profile.pin) {
      setPinModalProfile(profile);
      setEnteredPin('');
      setPinError(false);
    } else {
      setActiveProfile(profile);
      setIsProfileSelectorOpen(false);
    }
  };

  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinModalProfile && enteredPin === pinModalProfile.pin) {
      setActiveProfile(pinModalProfile);
      setPinModalProfile(null);
      setIsProfileSelectorOpen(false);
    } else {
      setPinError(true);
    }
  };

  // Watchlist Toggle
  const toggleMyList = (id: string) => {
    if (myList.includes(id)) {
      setMyList(myList.filter(item => item !== id));
    } else {
      setMyList([...myList, id]);
    }
  };

  // Launch Video Player
  const handlePlayMedia = (media: any, episode: any = null) => {
    const video = episode ? episode.videoUrl : media.videoUrl;
    setSelectedMedia(media);
    setActiveVideoSource({
      url: video,
      title: media.title + (episode ? ` - ${episode.title}` : ''),
      id: episode ? episode.id : media.id,
      introStart: episode?.introStart || media.introStart || 0,
      introEnd: episode?.introEnd || media.introEnd || 0
    });
    setIsPlayerOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0f0f13] text-gray-100 font-sans selection:bg-[#E50914] selection:text-white">
      {/* GLOBAL NAVBAR */}
      <nav className="sticky top-0 z-40 bg-[#0f0f13]/90 backdrop-blur-md border-b border-white/10 px-4 md:px-8 py-3 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo & Main Nav */}
          <div className="flex items-center gap-8">
            <div 
              onClick={() => { setActiveTab('home'); setSelectedMedia(null); }}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div className="w-9 h-9 bg-gradient-to-tr from-[#E50914] to-red-500 rounded-lg flex items-center justify-center font-black text-white text-xl shadow-lg shadow-red-600/30 group-hover:scale-105 transition-transform">
                N
              </div>
              <span className="text-xl md:text-2xl font-black tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-red-500">
                STREAM<span className="text-[#E50914]">X</span>
              </span>
            </div>

            {/* Desktop Navigation Links - Zobrazujú sa LEN ak je používateľ prihlásený */}
            {currentUser?.isLoggedIn && (
              <div className="hidden md:flex items-center gap-6 text-sm font-medium">
                <button 
                  onClick={() => setActiveTab('home')} 
                  className={`hover:text-red-500 transition-colors ${activeTab === 'home' ? 'text-white font-bold border-b-2 border-[#E50914] pb-1' : 'text-gray-400'}`}
                >
                  Domov
                </button>
                <button 
                  onClick={() => setActiveTab('movies')} 
                  className={`hover:text-red-500 transition-colors ${activeTab === 'movies' ? 'text-white font-bold border-b-2 border-[#E50914] pb-1' : 'text-gray-400'}`}
                >
                  Filmy
                </button>
                <button 
                  onClick={() => setActiveTab('series')} 
                  className={`hover:text-red-500 transition-colors ${activeTab === 'series' ? 'text-white font-bold border-b-2 border-[#E50914] pb-1' : 'text-gray-400'}`}
                >
                  Seriály
                </button>
                <button 
                  onClick={() => setActiveTab('mylist')} 
                  className={`hover:text-red-500 transition-colors ${activeTab === 'mylist' ? 'text-white font-bold border-b-2 border-[#E50914] pb-1' : 'text-gray-400'}`}
                >
                  Môj Zoznam ({myList.length})
                </button>
                
                {currentUser?.role === 'admin' && (
                  <button 
                    onClick={() => setActiveTab('admin')} 
                    className={`hover:text-red-500 transition-colors ${activeTab === 'admin' ? 'text-white font-bold border-b-2 border-[#E50914] pb-1' : 'text-gray-400'}`}
                  >
                    Admin Panel
                  </button>
                )}

                {currentUser?.role === 'admin' && (
                  <button 
                    onClick={() => setActiveTab('docs')} 
                    className={`hover:text-emerald-400 transition-colors flex items-center gap-1 ${activeTab === 'docs' ? 'text-emerald-400 font-bold border-b-2 border-emerald-400 pb-1' : 'text-gray-400'}`}
                  >
                    <Code className="w-4 h-4" /> Backend Guide
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Right Toolbar: Search, Notifications, Profile / Auth */}
          <div className="flex items-center gap-4">
            
            {/* Search Input - Len pre prihlásených */}
            {currentUser?.isLoggedIn && (
              <div className="relative">
                <div className="flex items-center bg-white/5 border border-white/10 rounded-full px-3 py-1.5 focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500 transition-all">
                  <Search className="w-4 h-4 text-gray-400 mr-2" />
                  <input 
                    type="text"
                    placeholder="Hľadať filmy, hercov, žánre..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none w-32 md:w-56"
                  />
                  {searchQuery && (
                    <X 
                      className="w-4 h-4 text-gray-400 cursor-pointer hover:text-white" 
                      onClick={() => setSearchQuery('')}
                    />
                  )}
                </div>

                {searchQuery.trim() !== '' && (
                  <div className="absolute right-0 mt-2 w-80 md:w-96 bg-[#181820] border border-white/10 rounded-xl shadow-2xl p-3 z-50 max-h-[70vh] overflow-y-auto backdrop-blur-xl">
                    <div className="text-xs font-semibold text-gray-400 mb-2 px-2">VÝSLEDKY VYHĽADÁVANIA ({searchResults.length})</div>
                    {searchResults.length === 0 ? (
                      <div className="p-4 text-center text-sm text-gray-400">Žiadne výsledky pre "{searchQuery}"</div>
                    ) : (
                      <div className="space-y-2">
                        {searchResults.map((item: any) => (
                          <div 
                            key={item.id}
                            onClick={() => {
                              setSelectedMedia(item);
                              setSearchQuery('');
                            }}
                            className="flex items-center gap-3 p-2 hover:bg-white/10 rounded-lg cursor-pointer transition-colors group"
                          >
                            <img src={item.coverUrl} alt={item.title} className="w-12 h-16 object-cover rounded-md group-hover:scale-105 transition-transform" />
                            <div>
                              <h4 className="text-sm font-bold text-white group-hover:text-red-400">{item.title}</h4>
                              <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                                <span>{item.year}</span>
                                <span>•</span>
                                <span className="text-emerald-400 font-semibold">{item.matchRate}% Zhoda</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Notifications Center */}
            {currentUser?.isLoggedIn && (
              <div className="relative">
                <button 
                  onClick={() => setShowNotificationsMenu(!showNotificationsMenu)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors relative"
                >
                  <Bell className="w-5 h-5 text-gray-300" />
                  {notifications.some(n => !n.read) && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
                  )}
                </button>

                {showNotificationsMenu && (
                  <div className="absolute right-0 mt-2 w-80 bg-[#181820] border border-white/10 rounded-xl shadow-2xl p-4 z-50">
                    <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
                      <span className="font-bold text-sm text-white">Upozornenia</span>
                      <button 
                        onClick={() => setNotifications(notifications.map(n => ({...n, read: true})))}
                        className="text-xs text-red-400 hover:underline"
                      >
                        Označiť všetko ako prečítané
                      </button>
                    </div>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {notifications.map(n => (
                        <div key={n.id} className={`p-2.5 rounded-lg text-xs ${n.read ? 'bg-transparent text-gray-400' : 'bg-red-500/10 text-white border-l-2 border-red-500'}`}>
                          <div className="font-semibold text-sm mb-0.5">{n.title}</div>
                          <p>{n.desc}</p>
                          <span className="text-[10px] text-gray-500 block mt-1">{n.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Profile Avatar & Switcher Dropdown OR Login Button */}
            {currentUser?.isLoggedIn ? (
              <div className="relative">
                <button 
                  onClick={() => setIsProfileSelectorOpen(!isProfileSelectorOpen)}
                  className="flex items-center gap-2 group p-1 rounded-full hover:bg-white/5 transition-colors"
                >
                  <img 
                    src={activeProfile.avatar} 
                    alt={activeProfile.name} 
                    className="w-8 h-8 rounded-md object-cover border border-white/20 group-hover:border-red-500"
                  />
                  <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-white" />
                </button>

                {isProfileSelectorOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#181820] border border-white/10 rounded-xl shadow-2xl py-2 z-50 backdrop-blur-xl">
                    <div className="px-4 py-2 border-b border-white/10">
                      <p className="text-xs text-gray-400">Prihlásený účet:</p>
                      <p className="text-xs font-bold text-white truncate mt-0.5">{currentUser.email}</p>
                      <p className="text-[10px] text-emerald-400 uppercase font-mono mt-0.5">{currentUser.role}</p>
                    </div>

                    <div className="py-2">
                      <p className="px-4 text-[10px] uppercase font-bold text-gray-500 mb-1">Prepnúť profil</p>
                      {profiles.map(p => (
                        <button
                          key={p.id}
                          onClick={() => handleSelectProfile(p)}
                          className={`w-full px-4 py-2 text-left text-sm flex items-center justify-between hover:bg-white/10 transition-colors ${p.id === activeProfile.id ? 'text-red-500 font-semibold' : 'text-gray-300'}`}
                        >
                          <div className="flex items-center gap-2">
                            <img src={p.avatar} alt={p.name} className="w-6 h-6 rounded object-cover" />
                            <span>{p.name}</span>
                          </div>
                          {p.pin && <Lock className="w-3 h-3 text-amber-400" />}
                        </button>
                      ))}
                    </div>

                    <div className="border-t border-white/10 pt-2 px-2 space-y-1">
                      <button 
                        onClick={() => { setActiveTab('settings'); setIsProfileSelectorOpen(false); }}
                        className="w-full text-left px-3 py-1.5 text-xs text-gray-300 hover:bg-white/10 rounded flex items-center gap-2"
                      >
                        <Settings className="w-3.5 h-3.5" /> Nastavenia profilov
                      </button>
                      <button 
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10 rounded flex items-center gap-2 font-semibold"
                      >
                        <LogOut className="w-3.5 h-3.5" /> Odhlásiť sa
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => { setAuthMode('login'); setIsAuthModalOpen(true); }}
                  className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors border border-white/10"
                >
                  <LogIn className="w-4 h-4" /> Prihlásiť
                </button>
                <button 
                  onClick={() => { setAuthMode('register'); setIsAuthModalOpen(true); }}
                  className="flex items-center gap-1.5 bg-[#E50914] hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors shadow-lg shadow-red-600/30"
                >
                  <UserPlus className="w-4 h-4" /> Registrácia
                </button>
              </div>
            )}

          </div>
        </div>
      </nav>

      {/* MOBILE BOTTOM NAVIGATION - Iba pre prihlásených */}
      {currentUser?.isLoggedIn && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0f0f13]/95 backdrop-blur-lg border-t border-white/10 z-40 px-4 py-2 flex items-center justify-around text-xs">
          <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center gap-1 ${activeTab === 'home' ? 'text-red-500' : 'text-gray-400'}`}>
            <Film className="w-5 h-5" />
            <span>Domov</span>
          </button>
          <button onClick={() => setActiveTab('movies')} className={`flex flex-col items-center gap-1 ${activeTab === 'movies' ? 'text-red-500' : 'text-gray-400'}`}>
            <Tv className="w-5 h-5" />
            <span>Filmy</span>
          </button>
          <button onClick={() => setActiveTab('mylist')} className={`flex flex-col items-center gap-1 ${activeTab === 'mylist' ? 'text-red-500' : 'text-gray-400'}`}>
            <List className="w-5 h-5" />
            <span>Zoznam</span>
          </button>
          <button onClick={() => setActiveTab('settings')} className={`flex flex-col items-center gap-1 ${activeTab === 'settings' ? 'text-red-500' : 'text-gray-400'}`}>
            <User className="w-5 h-5" />
            <span>Profil</span>
          </button>
        </div>
      )}

      {/* MAIN VIEWPORT BODY - Ochrana prístupu: Ak nie je prihlásený, zobrazí sa čisté úvodné menu */}
      {!currentUser?.isLoggedIn ? (
        <div className="flex flex-col items-center justify-center min-h-[82vh] px-4 text-center">
          <div className="max-w-3xl space-y-6">
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-tight">
              Neobmedzené filmy, seriály a ďalší obsah.
            </h1>
            <p className="text-base md:text-xl text-gray-300">
              Sledujte kdekoľvek. Zrušte kedykoľvek. Prihláste sa pre prístup k celej knižnici STREAMX.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <button 
                onClick={() => { setAuthMode('login'); setIsAuthModalOpen(true); }}
                className="bg-[#E50914] hover:bg-red-700 text-white font-bold px-8 py-4 rounded-xl text-base transition-colors shadow-lg shadow-red-600/30 flex items-center gap-2"
              >
                <LogIn className="w-5 h-5" /> Prihlásiť sa do účtu
              </button>
              <button 
                onClick={() => { setAuthMode('register'); setIsAuthModalOpen(true); }}
                className="bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-4 rounded-xl text-base transition-colors border border-white/20 flex items-center gap-2"
              >
                <UserPlus className="w-5 h-5" /> Vytvoriť nový účet
              </button>
            </div>
          </div>
        </div>
      ) : (
        <main className="pb-24">
          {activeTab === 'home' && (
            <HomeView 
              catalog={catalog}
              myList={myList}
              toggleMyList={toggleMyList}
              onSelectMedia={(media: any) => setSelectedMedia(media)}
              onPlayMedia={handlePlayMedia}
              activeProfile={activeProfile}
              watchProgress={watchProgress}
            />
          )}

          {activeTab === 'movies' && (
            <CatalogFilteredView 
              type="movie"
              catalog={catalog}
              selectedGenre={selectedGenre}
              setSelectedGenre={setSelectedGenre}
              onSelectMedia={(media: any) => setSelectedMedia(media)}
              onPlayMedia={handlePlayMedia}
            />
          )}

          {activeTab === 'series' && (
            <CatalogFilteredView 
              type="series"
              catalog={catalog}
              selectedGenre={selectedGenre}
              setSelectedGenre={setSelectedGenre}
              onSelectMedia={(media: any) => setSelectedMedia(media)}
              onPlayMedia={handlePlayMedia}
            />
          )}

          {activeTab === 'mylist' && (
            <MyListView 
              catalog={catalog}
              myList={myList}
              toggleMyList={toggleMyList}
              onSelectMedia={(media: any) => setSelectedMedia(media)}
            />
          )}

          {activeTab === 'admin' && currentUser?.role === 'admin' && (
            <AdminDashboard 
              catalog={catalog}
              setCatalog={setCatalog}
              allUsers={allUsers}
              setAllUsers={setAllUsers}
            />
          )}

          {activeTab === 'settings' && (
            <AccountSettingsView 
              profiles={profiles}
              setProfiles={setProfiles}
              activeProfile={activeProfile}
            />
          )}

          {activeTab === 'docs' && currentUser?.role === 'admin' && (
            <BackendDocsView />
          )}
        </main>
      )}

      {/* MEDIA DETAIL MODAL VIEW */}
      {selectedMedia && (
        <MediaDetailModal 
          media={selectedMedia}
          onClose={() => setSelectedMedia(null)}
          onPlay={handlePlayMedia}
          isInList={myList.includes(selectedMedia.id)}
          onToggleList={() => toggleMyList(selectedMedia.id)}
          userRating={ratings[selectedMedia.id]}
          onRate={(r: number) => setRatings({...ratings, [selectedMedia.id]: r})}
          catalog={catalog}
          onSelectRelated={(m: any) => setSelectedMedia(m)}
        />
      )}

      {/* CUSTOM FULLSCREEN VIDEO PLAYER */}
      {isPlayerOpen && activeVideoSource && (
        <VideoPlayerModal 
          videoSource={activeVideoSource}
          onClose={() => setIsPlayerOpen(false)}
          onUpdateProgress={(id: string, time: number) => setWatchProgress({...watchProgress, [id]: time})}
          initialTime={watchProgress[activeVideoSource.id] || 0}
        />
      )}

      {/* LOGIN & REGISTER AUTH MODAL */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#181820] border border-white/10 p-6 md:p-8 rounded-2xl w-full max-w-md relative shadow-2xl">
            <button 
              onClick={() => setIsAuthModalOpen(false)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h2 className="text-2xl font-bold mb-6 text-white text-center">
              {authMode === 'register' ? 'Registrácia účtu' : 'Prihlásenie do STREAMX'}
            </h2>

            {authError && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500 text-red-200 text-xs rounded-lg">
                {authError}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">E-mailová adresa</label>
                <input 
                  type="email" 
                  value={inputEmail} 
                  onChange={(e) => setInputEmail(e.target.value)} 
                  placeholder="meno@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-red-600"
                  required 
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Heslo</label>
                <input 
                  type="password" 
                  value={inputPassword} 
                  onChange={(e) => setInputPassword(e.target.value)} 
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-red-600"
                  required 
                />
              </div>

              <button 
                type="submit" 
                className="w-full bg-[#E50914] hover:bg-red-700 text-white font-bold py-3 rounded-xl text-sm transition-colors shadow-lg shadow-red-600/30 mt-2"
              >
                {authMode === 'register' ? 'Vytvoriť účet' : 'Prihlásiť sa'}
              </button>
            </form>

            <p className="text-center text-xs text-gray-400 mt-6">
              {authMode === 'register' ? 'Už máte účet?' : 'Ešte nemáte účet?'} {' '}
              <button 
                onClick={() => { setAuthMode(authMode === 'register' ? 'login' : 'register'); setAuthError(''); }} 
                className="text-red-500 hover:underline font-semibold ml-1"
              >
                {authMode === 'register' ? 'Prihláste sa' : 'Zaregistrujte sa'}
              </button>
            </p>
          </div>
        </div>
      )}

      {/* PIN VERIFICATION MODAL */}
      {pinModalProfile && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#181820] border border-white/10 p-6 rounded-2xl w-full max-w-md text-center">
            <Lock className="w-12 h-12 text-amber-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-1">Zadajte PIN pre profil {pinModalProfile.name}</h3>
            <p className="text-xs text-gray-400 mb-6">Tento profil je chránený 4-miestnym bezpečnostným PIN kódom.</p>
            
            <form onSubmit={handleVerifyPin} className="space-y-4">
              <input 
                type="password"
                maxLength={4}
                value={enteredPin}
                onChange={(e) => setEnteredPin(e.target.value)}
                placeholder="****"
                className="w-32 mx-auto text-center tracking-widest text-2xl font-mono bg-white/5 border border-white/20 rounded-lg py-2 text-white focus:outline-none focus:border-red-500"
                autoFocus
              />
              
              {pinError && (
                <p className="text-xs text-red-500 font-semibold">Nesprávny PIN kód. Skúste znova.</p>
              )}

              <div className="flex gap-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setPinModalProfile(null)}
                  className="flex-1 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm font-semibold transition-colors"
                >
                  Zrušiť
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-2 rounded-lg bg-[#E50914] hover:bg-red-700 text-sm font-semibold transition-colors shadow-lg shadow-red-600/30"
                >
                  Odomknúť
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// HOME VIEW COMPONENT
// ==========================================
function HomeView({ catalog, myList, toggleMyList, onSelectMedia, onPlayMedia, activeProfile, watchProgress }: any) {
  const heroMedia = catalog[0];

  const trending = catalog.filter((c: any) => c.isTrending);
  const originals = catalog.filter((c: any) => c.isOriginal);
  const movies = catalog.filter((c: any) => c.type === 'movie');
  const series = catalog.filter((c: any) => c.type === 'series');

  const displayCatalog = activeProfile?.isKids 
    ? catalog.filter((c: any) => c.ageRating === 'Všetky vekové kategórie' || c.genres.includes('Animované'))
    : catalog;

  return (
    <div className="space-y-8">
      {/* HERO BANNER SECTION */}
      {heroMedia && (
        <div className="relative w-full h-[70vh] md:h-[80vh] flex items-end justify-start overflow-hidden">
          <img 
            src={heroMedia.bannerUrl} 
            alt={heroMedia.title} 
            className="absolute inset-0 w-full h-full object-cover object-center scale-105 filter brightness-90 animate-fade-in"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f13] via-[#0f0f13]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f13] via-[#0f0f13]/60 to-transparent" />

          <div className="relative z-10 max-w-2xl px-6 md:px-12 pb-12 space-y-4">
            <div className="flex items-center gap-2">
              <span className="bg-[#E50914] text-white text-[10px] font-extrabold px-2 py-0.5 rounded tracking-widest uppercase">
                STREAMX ORIGINAL
              </span>
              <span className="text-emerald-400 text-xs font-bold">{heroMedia.matchRate}% Zhoda</span>
              <span className="text-gray-300 text-xs">{heroMedia.year}</span>
              <span className="border border-white/30 text-gray-300 text-[10px] px-1 rounded">{heroMedia.ageRating}</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white drop-shadow-md">
              {heroMedia.title}
            </h1>

            <p className="text-sm md:text-base text-gray-300 line-clamp-3 leading-relaxed drop-shadow">
              {heroMedia.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button 
                onClick={() => onPlayMedia(heroMedia)}
                className="flex items-center gap-2 bg-white text-black font-bold px-6 py-3 rounded-xl hover:bg-gray-200 transition-all transform hover:scale-105 shadow-lg"
              >
                <Play className="w-5 h-5 fill-black" /> Prehrať Teraz
              </button>
              <button 
                onClick={() => onSelectMedia(heroMedia)}
                className="flex items-center gap-2 bg-white/20 backdrop-blur-md text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/30 transition-all border border-white/10"
              >
                <Info className="w-5 h-5" /> Viac Informácií
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONTINUATION / WATCH PROGRESS ROW */}
      <div className="px-6 md:px-12 space-y-3">
        <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#E50914]" /> Pokračovať v sledovaní pre {activeProfile?.name || 'Vás'}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {displayCatalog.slice(0, 3).map((item: any) => (
            <div 
              key={item.id}
              onClick={() => onPlayMedia(item)}
              className="group relative bg-[#181820] rounded-xl overflow-hidden cursor-pointer border border-white/10 hover:border-red-500/50 transition-all duration-300 hover:scale-105"
            >
              <img src={item.coverUrl} alt={item.title} className="w-full h-36 object-cover" />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-red-600/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                  <Play className="w-5 h-5 fill-white ml-0.5" />
                </div>
              </div>
              
              <div className="w-full bg-gray-700 h-1.5">
                <div className="bg-red-600 h-full w-2/5" />
              </div>

              <div className="p-2.5">
                <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                <p className="text-[10px] text-gray-400 mt-0.5">Zostáva 8 min</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* HORIZONTAL MEDIA SLIDERS */}
      <MediaRow 
        title="🔥 Trendy na platforme" 
        items={trending} 
        onSelectMedia={onSelectMedia} 
        onPlayMedia={onPlayMedia}
        myList={myList}
        toggleMyList={toggleMyList}
      />

      <MediaRow 
        title="⭐ STREAMX Originálna tvorba" 
        items={originals} 
        onSelectMedia={onSelectMedia} 
        onPlayMedia={onPlayMedia}
        myList={myList}
        toggleMyList={toggleMyList}
      />

      <MediaRow 
        title="🎬 Populárne Filmy" 
        items={movies} 
        onSelectMedia={onSelectMedia} 
        onPlayMedia={onPlayMedia}
        myList={myList}
        toggleMyList={toggleMyList}
      />

      <MediaRow 
        title="📺 Najlepšie Seriály" 
        items={series} 
        onSelectMedia={onSelectMedia} 
        onPlayMedia={onPlayMedia}
        myList={myList}
        toggleMyList={toggleMyList}
      />
    </div>
  );
}

// ==========================================
// MEDIA ROW CAROUSEL COMPONENT
// ==========================================
function MediaRow({ title, items, onSelectMedia, onPlayMedia, myList, toggleMyList }: any) {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: string) => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth * 0.75 : clientWidth * 0.75;
      rowRef.current.scrollTo({ left: scrollLeft + scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="px-6 md:px-12 space-y-3 relative group/row">
      <h2 className="text-lg md:text-xl font-bold text-white">{title}</h2>
      
      <button 
        onClick={() => scroll('left')}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/70 hover:bg-red-600 text-white p-2 rounded-full opacity-0 group-hover/row:opacity-100 transition-all shadow-xl"
      >
        <ChevronRight className="w-5 h-5 rotate-180" />
      </button>

      <button 
        onClick={() => scroll('right')}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/70 hover:bg-red-600 text-white p-2 rounded-full opacity-0 group-hover/row:opacity-100 transition-all shadow-xl"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      <div 
        ref={rowRef}
        className="flex items-center gap-4 overflow-x-auto scrollbar-hide py-2 scroll-smooth"
      >
        {items.map((item: any) => {
          const isBookmarked = myList.includes(item.id);
          return (
            <div 
              key={item.id}
              className="flex-none w-40 sm:w-48 md:w-56 bg-[#181820] rounded-xl overflow-hidden border border-white/5 hover:border-red-500/50 transition-all duration-300 hover:scale-105 cursor-pointer group relative shadow-lg"
            >
              <div className="relative aspect-[2/3] overflow-hidden">
                <img 
                  src={item.coverUrl} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                />
                
                {item.top10Rank && (
                  <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded shadow">
                    TOP {item.top10Rank}
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end">
                  <div className="flex items-center gap-2 mb-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); onPlayMedia(item); }}
                      className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors"
                    >
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleMyList(item.id); }}
                      className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/40 transition-colors"
                    >
                      {isBookmarked ? <Check className="w-4 h-4 text-emerald-400" /> : <Plus className="w-4 h-4" />}
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); onSelectMedia(item); }}
                      className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/40 transition-colors ml-auto"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-[10px] text-emerald-400 font-bold">{item.matchRate}% Zhoda</div>
                  <div className="text-xs font-bold text-white truncate">{item.title}</div>
                  <div className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                    <span>{item.year}</span>
                    <span>•</span>
                    <span>{item.genres[0]}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ==========================================
// FILTERED CATALOG VIEW (MOVIES / SERIES)
// ==========================================
function CatalogFilteredView({ type, catalog, selectedGenre, setSelectedGenre, onSelectMedia, onPlayMedia }: any) {
  const genresList = ['All', 'Akčné', 'Sci-Fi', 'Animované', 'Fantasy', 'Komédie', 'Dráma', 'Thriller'];
  
  const filtered = catalog.filter((item: any) => {
    const matchesType = item.type === type;
    const matchesGenre = selectedGenre === 'All' || item.genres.includes(selectedGenre);
    return matchesType && matchesGenre;
  });

  return (
    <div className="px-6 md:px-12 py-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-black text-white uppercase">
            {type === 'movie' ? '🎬 Filmový Katalóg' : '📺 Seriálový Katalóg'}
          </h1>
          <p className="text-xs text-gray-400 mt-1">Prehliadajte kompletnú knižnicu titulov v najvyššej kvalite.</p>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {genresList.map(g => (
            <button
              key={g}
              onClick={() => setSelectedGenre(g)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${selectedGenre === g ? 'bg-[#E50914] text-white shadow-lg shadow-red-600/30' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}`}
            >
              {g === 'All' ? 'Všetky Žánre' : g}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {filtered.map((item: any) => (
          <div 
            key={item.id}
            onClick={() => onSelectMedia(item)}
            className="group bg-[#181820] rounded-xl overflow-hidden border border-white/5 hover:border-red-500/50 transition-all duration-300 hover:scale-105 cursor-pointer shadow-lg"
          >
            <div className="aspect-[2/3] relative overflow-hidden">
              <img src={item.coverUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end">
                <span className="text-xs font-bold text-white">{item.title}</span>
                <span className="text-[10px] text-emerald-400 font-semibold">{item.matchRate}% Zhoda</span>
              </div>
            </div>
            <div className="p-3">
              <h3 className="text-xs font-bold text-white truncate">{item.title}</h3>
              <p className="text-[10px] text-gray-400 mt-1">{item.year} • {item.genres.slice(0, 2).join(', ')}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// MY LIST VIEW COMPONENT
// ==========================================
function MyListView({ catalog, myList, toggleMyList, onSelectMedia }: any) {
  const savedItems = catalog.filter((item: any) => myList.includes(item.id));

  return (
    <div className="px-6 md:px-12 py-8 space-y-6">
      <div className="border-b border-white/10 pb-4">
        <h1 className="text-3xl font-black text-white">Môj Zoznam Uložených Titulov</h1>
        <p className="text-xs text-gray-400 mt-1">Vaše uložené filmy a seriály pripravené na neskoršie sledowanie.</p>
      </div>

      {savedItems.length === 0 ? (
        <div className="text-center py-20 bg-[#181820]/50 rounded-2xl border border-white/5">
          <List className="w-12 h-12 text-gray-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">Váš zoznam je momentálne prázdny</h3>
          <p className="text-xs text-gray-400 mt-1">Pridajte si filmy a seriály kliknutím na ikonu "+" na kartách titulov.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {savedItems.map((item: any) => (
            <div 
              key={item.id}
              className="group bg-[#181820] rounded-xl overflow-hidden border border-white/5 hover:border-red-500/50 transition-all duration-300 relative"
            >
              <img 
                src={item.coverUrl} 
                alt={item.title} 
                className="w-full aspect-[2/3] object-cover cursor-pointer"
                onClick={() => onSelectMedia(item)}
              />
              <button 
                onClick={() => toggleMyList(item.id)}
                className="absolute top-2 right-2 bg-black/70 p-1.5 rounded-full text-red-500 hover:bg-red-600 hover:text-white transition-colors"
                title="Odstrániť zo zoznamu"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="p-3">
                <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                <p className="text-[10px] text-gray-400 mt-1">{item.year} • {item.genres[0]}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ==========================================
// MEDIA DETAIL MODAL VIEW
// ==========================================
function MediaDetailModal({ media, onClose, onPlay, isInList, onToggleList, userRating, onRate, catalog, onSelectRelated }: any) {
  const [selectedSeason, setSelectedSeason] = useState(1);
  const relatedMedia = catalog.filter((c: any) => c.id !== media.id && c.genres.some((g: string) => media.genres.includes(g))).slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 md:p-6 overflow-y-auto">
      <div className="bg-[#181820] border border-white/10 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-black/60 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative h-72 md:h-96 w-full">
          <img src={media.bannerUrl} alt={media.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#181820] via-[#181820]/30 to-transparent" />

          <div className="absolute bottom-6 left-6 md:left-8 right-6 space-y-3">
            <h2 className="text-3xl md:text-5xl font-black text-white">{media.title}</h2>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => onPlay(media)}
                className="flex items-center gap-2 bg-[#E50914] text-white font-bold px-6 py-2.5 rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-600/30"
              >
                <Play className="w-5 h-5 fill-white" /> Prehrať
              </button>
              <button 
                onClick={onToggleList}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-md text-white font-semibold px-4 py-2.5 rounded-xl hover:bg-white/20 transition-colors border border-white/10 text-xs md:text-sm"
              >
                {isInList ? <Check className="w-4 h-4 text-emerald-400" /> : <Plus className="w-4 h-4" />}
                {isInList ? 'V zozname' : 'Môj Zoznam'}
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-3 text-xs text-gray-300">
                <span className="text-emerald-400 font-bold">{media.matchRate}% Zhoda</span>
                <span>{media.year}</span>
                <span className="border border-white/30 px-1.5 py-0.5 rounded text-[10px]">{media.ageRating}</span>
                <span>{media.duration || `${media.seasonsCount} Sérií`}</span>
              </div>

              <p className="text-sm text-gray-300 leading-relaxed">{media.description}</p>

              <div className="pt-2 border-t border-white/10">
                <span className="text-xs font-semibold text-gray-400 block mb-2">Vaše hodnotenie titulu:</span>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      onClick={() => onRate(star)}
                      className={`w-6 h-6 cursor-pointer transition-colors ${star <= (userRating || 0) ? 'text-amber-400 fill-amber-400' : 'text-gray-600'}`}
                    />
                  ))}
                  {userRating && <span className="text-xs text-emerald-400 font-bold ml-2">Hodnotené ({userRating}/5)</span>}
                </div>
              </div>
            </div>

            <div className="space-y-3 text-xs text-gray-400 bg-white/5 p-4 rounded-xl border border-white/5">
              <div>
                <span className="text-gray-500 block">Obsadenie:</span>
                <span className="text-white font-medium">{media.cast ? media.cast.join(', ') : 'N/A'}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Režisér:</span>
                <span className="text-white font-medium">{media.director || 'N/A'}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Žánre:</span>
                <span className="text-white font-medium">{media.genres.join(', ')}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Zvukové stopy:</span>
                <span className="text-white font-medium">{media.audioTracks ? media.audioTracks.join(', ') : 'SK, EN'}</span>
              </div>
            </div>

          </div>

          {media.type === 'series' && media.seasons && (
            <div className="space-y-4 border-t border-white/10 pt-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Epizódy</h3>
                <select 
                  value={selectedSeason}
                  onChange={(e) => setSelectedSeason(Number(e.target.value))}
                  className="bg-white/10 border border-white/20 text-xs text-white rounded-lg px-3 py-1.5 focus:outline-none"
                >
                  {media.seasons.map((s: any) => (
                    <option key={s.seasonNumber} value={s.seasonNumber} className="bg-[#181820]">
                      {s.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-3">
                {media.seasons.find((s: any) => s.seasonNumber === selectedSeason)?.episodes.map((ep: any) => (
                  <div 
                    key={ep.id}
                    onClick={() => onPlay(media, ep)}
                    className="flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer border border-white/5 transition-colors group"
                  >
                    <span className="text-sm font-bold text-gray-500 group-hover:text-white w-4">{ep.episodeNumber}</span>
                    <img src={ep.thumbnail} alt={ep.title} className="w-24 h-16 object-cover rounded-lg" />
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-white group-hover:text-red-400">{ep.title}</h4>
                      <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{ep.description}</p>
                    </div>
                    <span className="text-xs text-gray-500">{ep.duration}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {relatedMedia.length > 0 && (
            <div className="space-y-3 border-t border-white/10 pt-6">
              <h3 className="text-lg font-bold text-white">Podobné Tituly</h3>
              <div className="grid grid-cols-3 gap-4">
                {relatedMedia.map((item: any) => (
                  <div 
                    key={item.id}
                    onClick={() => onSelectRelated(item)}
                    className="bg-white/5 rounded-xl overflow-hidden border border-white/5 hover:border-red-500/50 cursor-pointer transition-all hover:scale-105"
                  >
                    <img src={item.coverUrl} alt={item.title} className="w-full h-32 object-cover" />
                    <div className="p-2">
                      <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                      <span className="text-[10px] text-emerald-400 font-semibold">{item.matchRate}% Zhoda</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// ==========================================
// CUSTOM HTML5 VIDEO PLAYER COMPONENT
// ==========================================
function VideoPlayerModal({ videoSource, onClose, onUpdateProgress, initialTime }: any) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(initialTime);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState('1080p');
  const [selectedAudio, setSelectedAudio] = useState('SK');
  const [selectedSubtitles, setSelectedSubtitles] = useState('Off');
  const [showControls, setShowControls] = useState(true);
  
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = initialTime;
      videoRef.current.play().catch(() => setIsPlaying(false));
    }
  }, []);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      onUpdateProgress(videoSource.id, videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const skipTime = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(Math.max(videoRef.current.currentTime + seconds, 0), duration);
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden"
    >
      <video
        ref={videoRef}
        src={videoSource.url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        className="w-full h-full object-contain cursor-pointer"
        onClick={togglePlay}
      />

      <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/60 transition-opacity duration-300 flex flex-col justify-between p-6 ${showControls ? 'opacity-100' : 'opacity-0 cursor-none'}`}>
        
        <div className="flex items-center justify-between">
          <button 
            onClick={onClose}
            className="flex items-center gap-2 text-white hover:text-red-500 font-bold transition-colors"
          >
            <ArrowLeft className="w-6 h-6" /> Späť
          </button>
          <span className="text-sm font-bold text-white tracking-wide">{videoSource.title}</span>
          <div className="flex items-center gap-3">
            <span className="bg-red-600 text-white text-[10px] font-mono px-2 py-0.5 rounded">HLS • {selectedQuality}</span>
          </div>
        </div>

        {videoSource.introStart && currentTime >= videoSource.introStart && currentTime <= videoSource.introEnd && (
          <button 
            onClick={() => skipTime(videoSource.introEnd - currentTime)}
            className="absolute right-8 bottom-28 bg-white text-black font-bold text-xs px-5 py-2.5 rounded-lg shadow-2xl hover:bg-red-600 hover:text-white transition-all transform hover:scale-105"
          >
            Preskočiť Úvod
          </button>
        )}

        <div className="space-y-4">
          
          <div className="flex items-center gap-3 text-xs text-white font-mono">
            <span>{formatTime(currentTime)}</span>
            <input 
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="flex-1 accent-red-600 cursor-pointer h-1.5 bg-white/20 rounded-lg"
            />
            <span>{formatTime(duration)}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={togglePlay} className="text-white hover:text-red-500 transition-colors">
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 fill-white" />}
              </button>
              <button onClick={() => skipTime(-10)} className="text-white hover:text-red-500 transition-colors">
                <RotateCcw className="w-5 h-5" />
              </button>
              <button onClick={() => skipTime(10)} className="text-white hover:text-red-500 transition-colors">
                <RotateCw className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2">
                <button onClick={() => setIsMuted(!isMuted)} className="text-white hover:text-red-500">
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <input 
                  type="range" 
                  min={0} 
                  max={1} 
                  step={0.1}
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setVolume(v);
                    if (videoRef.current) videoRef.current.volume = v;
                  }}
                  className="w-20 accent-red-600 h-1"
                />
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs">
              
              <select 
                value={selectedAudio}
                onChange={(e) => setSelectedAudio(e.target.value)}
                className="bg-white/10 border border-white/20 text-white rounded px-2 py-1 focus:outline-none"
              >
                <option value="SK" className="bg-black">Zvuk: SK Dabing</option>
                <option value="CZ" className="bg-black">Zvuk: CZ Dabing</option>
                <option value="EN" className="bg-black">Zvuk: EN Originál</option>
              </select>

              <select 
                value={selectedSubtitles}
                onChange={(e) => setSelectedSubtitles(e.target.value)}
                className="bg-white/10 border border-white/20 text-white rounded px-2 py-1 focus:outline-none"
              >
                <option value="Off" className="bg-black">Titulky: Vypnuté</option>
                <option value="SK" className="bg-black">Titulky: Slovenské</option>
                <option value="EN" className="bg-black">Titulky: Anglické</option>
              </select>

              <select 
                value={selectedQuality}
                onChange={(e) => setSelectedQuality(e.target.value)}
                className="bg-white/10 border border-white/20 text-white rounded px-2 py-1 focus:outline-none font-mono"
              >
                <option value="1080p" className="bg-black">1080p FHD</option>
                <option value="720p" className="bg-black">720p HD</option>
                <option value="480p" className="bg-black">480p SD</option>
              </select>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

// ==========================================
// ADMIN DASHBOARD COMPONENT (S MOŽNOSŤOU PRIDÁVAŤ ADMIN PRÁVA)
// ==========================================
function AdminDashboard({ catalog, setCatalog, allUsers, setAllUsers }: any) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('movie');
  const [genres, setGenres] = useState('Sci-Fi, Akčné');
  const [videoUrl, setVideoUrl] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [description, setDescription] = useState('');

  const handleCreateMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !videoUrl) return;

    const newItem = {
      id: 'm_' + Date.now(),
      type,
      title,
      tagline: 'Nový titul pridaný administrátorom.',
      description: description || 'Bez opisu.',
      year: new Date().getFullYear(),
      duration: '15 min',
      ageRating: '12+',
      genres: genres.split(',').map((g: string) => g.trim()),
      rating: 5.0,
      matchRate: 99,
      isOriginal: true,
      isTrending: true,
      coverUrl: coverUrl || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
      bannerUrl: bannerUrl || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80',
      videoUrl
    };

    setCatalog([newItem, ...catalog]);
    setTitle('');
    setVideoUrl('');
    setCoverUrl('');
    setBannerUrl('');
    setDescription('');
    alert('Nová položka bola úspešne pridaná do katalógu!');
  };

  const toggleUserRole = (userId: string) => {
    setAllUsers(allUsers.map((u: any) => {
      if (u.id === userId) {
        const newRole = u.role === 'admin' ? 'user' : 'admin';
        return { ...u, role: newRole };
      }
      return u;
    }));
  };

  return (
    <div className="px-6 md:px-12 py-8 max-w-7xl mx-auto space-y-8">
      <div className="border-b border-white/10 pb-4">
        <h1 className="text-3xl font-black text-white flex items-center gap-3">
          <Shield className="w-8 h-8 text-red-500" /> Administrátorský Panel
        </h1>
        <p className="text-xs text-gray-400 mt-1">Spravujte mediálny obsah platformy a priraďujte administrátorské práva používateľom.</p>
      </div>

      {/* SPRÁVA POUŽÍVATEĽOV A ADMIN PRÁV */}
      <div className="bg-[#181820] border border-white/10 p-6 rounded-2xl space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <User className="w-5 h-5 text-red-500" /> Správa používateľov a administrátorských práv
        </h3>
        <div className="divide-y divide-white/10">
          {allUsers.map((u: any) => (
            <div key={u.id} className="py-3 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-white text-sm block">{u.email}</span>
                <span className={`uppercase font-mono text-[10px] ${u.role === 'admin' ? 'text-emerald-400' : 'text-gray-400'}`}>Rola: {u.role}</span>
              </div>
              <button 
                onClick={() => toggleUserRole(u.id)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${u.role === 'admin' ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30' : 'bg-red-500/20 text-red-300 hover:bg-red-500/30'}`}
              >
                {u.role === 'admin' ? 'Odstrániť Admin práva' : 'Nastaviť ako Admin'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* CREATE MEDIA FORM */}
      <div className="bg-[#181820] border border-white/10 p-6 rounded-2xl space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Plus className="w-5 h-5 text-red-500" /> Pridať Nový Film alebo Seriál
        </h3>

        <form onSubmit={handleCreateMedia} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="text-gray-400 block mb-1">Názov Titulu</label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Napr. Cyberpunk 2088"
              className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-red-500"
              required
            />
          </div>

          <div>
            <label className="text-gray-400 block mb-1">Typ Obsahu</label>
            <select 
              value={type} 
              onChange={(e) => setType(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none"
            >
              <option value="movie" className="bg-[#181820]">Film</option>
              <option value="series" className="bg-[#181820]">Seriál</option>
            </select>
          </div>

          <div>
            <label className="text-gray-400 block mb-1">URL Video Streamu (MP4 / HLS .m3u8)</label>
            <input 
              type="url" 
              value={videoUrl} 
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://.../video.mp4"
              className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-red-500"
              required
            />
          </div>

          <div>
            <label className="text-gray-400 block mb-1">Žánre (čiarkou oddelené)</label>
            <input 
              type="text" 
              value={genres} 
              onChange={(e) => setGenres(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="text-gray-400 block mb-1">Cover Obrázok URL (2:3)</label>
            <input 
              type="url" 
              value={coverUrl} 
              onChange={(e) => setCoverUrl(e.target.value)}
              placeholder="https://..."
              className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="text-gray-400 block mb-1">Banner Obrázok URL (16:9)</label>
            <input 
              type="url" 
              value={bannerUrl} 
              onChange={(e) => setBannerUrl(e.target.value)}
              placeholder="https://..."
              className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-gray-400 block mb-1">Popis Obsahu</label>
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none"
            />
          </div>

          <button 
            type="submit"
            className="md:col-span-2 bg-[#E50914] text-white font-bold py-3 rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-600/30"
          >
            Uložiť Titul do Databázy
          </button>
        </form>
      </div>

    </div>
  );
}

// ==========================================
// ACCOUNT SETTINGS & PROFILES VIEW (ÚPRAVA MENA, AVATARA A PIN-U)
// ==========================================
function AccountSettingsView({ profiles, setProfiles, activeProfile }: any) {
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [pin, setPin] = useState('');
  const [isKids, setIsKids] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    if (editingProfileId) {
      setProfiles(profiles.map((p: any) => p.id === editingProfileId ? { ...p, name, avatar, pin: pin || null, isKids } : p));
    } else {
      setProfiles([...profiles, { id: 'p_' + Date.now(), name, avatar: avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80', isKids, pin: pin || null }]);
    }

    setName('');
    setAvatar('');
    setPin('');
    setIsKids(false);
    setEditingProfileId(null);
    alert('Zmeny profilu boli uložené!');
  };

  const startEdit = (p: any) => {
    setEditingProfileId(p.id);
    setName(p.name);
    setAvatar(p.avatar);
    setPin(p.pin || '');
    setIsKids(p.isKids);
  };

  return (
    <div className="px-6 md:px-12 py-8 max-w-4xl mx-auto space-y-8">
      <div className="border-b border-white/10 pb-4">
        <h1 className="text-3xl font-black text-white">Nastavenia & Správa Profilov</h1>
        <p className="text-xs text-gray-400 mt-1">Upravte si meno, profilovú fotografiu alebo zabezpečte profil 4-miestnym PIN kódom.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {profiles.map((p: any) => (
          <div key={p.id} className="bg-[#181820] border border-white/10 p-4 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={p.avatar} alt={p.name} className="w-12 h-12 rounded-lg object-cover" />
              <div>
                <h4 className="font-bold text-sm text-white">{p.name}</h4>
                <p className="text-xs text-gray-400">{p.isKids ? 'Detský profil' : 'Štandardný profil'}</p>
                {p.pin && <span className="text-[10px] text-amber-400 flex items-center gap-1 mt-0.5"><Lock className="w-3 h-3" /> Chránené PINom</span>}
              </div>
            </div>
            <button onClick={() => startEdit(p)} className="p-2 text-gray-400 hover:text-white bg-white/5 rounded-lg"><Edit className="w-4 h-4" /></button>
          </div>
        ))}
      </div>

      <div className="bg-[#181820] border border-white/10 p-6 rounded-2xl space-y-4">
        <h3 className="font-bold text-white text-lg">{editingProfileId ? 'Upraviť profil' : 'Pridať nový profil'}</h3>
        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
          <div>
            <label className="block text-gray-400 mb-1">Meno profilu</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none" />
          </div>
          <div>
            <label className="block text-gray-400 mb-1">URL adresa profilovej fotky (Avatara)</label>
            <input type="url" value={avatar} onChange={e => setAvatar(e.target.value)} placeholder="https://..." className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none" />
          </div>
          <div>
            <label className="block text-gray-400 mb-1">Zamknúť profil (4-miestny PIN kód ako na Netflixe)</label>
            <input type="password" maxLength={4} value={pin} onChange={e => setPin(e.target.value)} placeholder="Voliteľné (napr. 1234)" className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white font-mono focus:outline-none" />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="kidsMode" checked={isKids} onChange={e => setIsKids(e.target.checked)} className="rounded" />
            <label htmlFor="kidsMode" className="text-gray-300">Tento profil je pre deti</label>
          </div>
          <button type="submit" className="bg-[#E50914] text-white font-bold py-2.5 px-5 rounded-xl shadow-lg shadow-red-600/30">
            {editingProfileId ? 'Uložiť zmeny profilu' : 'Vytvoriť profil'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// BACKEND ARCHITECTURE & DEVELOPER DOCS
// ==========================================
function BackendDocsView() {
  return (
    <div className="px-6 md:px-12 py-8 max-w-5xl mx-auto space-y-8 text-gray-300">
      <div className="border-b border-white/10 pb-4">
        <h1 className="text-3xl font-black text-white flex items-center gap-3">
          <Code className="w-8 h-8 text-emerald-400" /> Backend Guide & Technická Dokumentácia
        </h1>
        <p className="text-xs text-gray-400 mt-1">Kompletný návod na produkčné nasadenie, PostgreSQL schému a HLS streaming.</p>
      </div>
      <section className="bg-[#181820] border border-white/10 p-6 rounded-2xl space-y-3">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Server className="w-5 h-5 text-emerald-400" /> 1. Docker & Node.js Rýchle Spustenie
        </h3>
        <pre className="bg-black/60 p-4 rounded-xl text-xs font-mono text-emerald-400 overflow-x-auto border border-white/5">
{`git clone https://github.com/streamx/streamx-platform.git
cd streamx-platform
docker-compose up -d --build`}
        </pre>
      </section>
    </div>
  );
}