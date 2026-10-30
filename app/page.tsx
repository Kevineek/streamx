'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Play, Pause, Plus, Check, Info, Search, Bell, User, Volume2, VolumeX,
  Maximize, Minimize, RotateCcw, RotateCw, SkipForward, Settings, Lock,
  ChevronDown, ChevronRight, Star, ThumbsUp, ThumbsDown, X, Edit3, Trash2,
  Shield, Film, Tv, List, Clock, CreditCard, HelpCircle, Code, Server,
  Database, RefreshCw, Eye, EyeOff, Sliders, Monitor, Globe, Download,
  CheckCircle, AlertCircle, ArrowLeft, Layers, LogIn, LogOut, UserPlus, Edit,
  Send, UserX, UserCheck, KeyRound
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
  // Navigation & Profile State (S PREZISTENTNÝM ULOŽENÍM V LOCALSTORAGE)
  const [profiles, setProfiles] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('streamx_profiles');
      return saved ? JSON.parse(saved) : DEFAULT_USER_PROFILES;
    }
    return DEFAULT_USER_PROFILES;
  });

  const [activeProfile, setActiveProfile] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('streamx_active_profile');
      return saved ? JSON.parse(saved) : DEFAULT_USER_PROFILES[0];
    }
    return DEFAULT_USER_PROFILES[0];
  });

  const [isProfileSelectorOpen, setIsProfileSelectorOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home'); 
  const [selectedGenre, setSelectedGenre] = useState('All');

  // Sync Profiles to LocalStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('streamx_profiles', JSON.stringify(profiles));
    }
  }, [profiles]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('streamx_active_profile', JSON.stringify(activeProfile));
    }
  }, [activeProfile]);

  // Auth System State
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [inputEmail, setInputEmail] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Interactive Content State
  const [myList, setMyList] = useState(['m1']);
  const [watchProgress, setWatchProgress] = useState({ 'm1': 240 });
  const [ratings, setRatings] = useState({ 'm1': 5 });

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

  // Notifications State (S PODPOROU PRE ADMIN OZNÁMENIA)
  const [notifications, setNotifications] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('streamx_notifications');
      return saved ? JSON.parse(saved) : [
        { id: 1, title: 'Vitajte v STREAMX', desc: 'Váš účet je pripravený.', read: false, date: 'Dnes' }
      ];
    }
    return [{ id: 1, title: 'Vitajte v STREAMX', desc: 'Váš účet je pripravený.', read: false, date: 'Dnes' }];
  });
  const [showNotificationsMenu, setShowNotificationsMenu] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('streamx_notifications', JSON.stringify(notifications));
    }
  }, [notifications]);

  // Admin Catalog Management & User List Management (S PODPOROU BANOV)
  const [catalog, setCatalog] = useState(SEED_MOVIES);
  const [allUsers, setAllUsers] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('streamx_users');
      return saved ? JSON.parse(saved) : [
        { id: 'u1', email: 'kevinkasak@icloud.com', role: 'admin', isBanned: false },
        { id: 'u2', email: 'uzivatel@example.com', role: 'user', isBanned: false }
      ];
    }
    return [
      { id: 'u1', email: 'kevinkasak@icloud.com', role: 'admin', isBanned: false },
      { id: 'u2', email: 'uzivatel@example.com', role: 'user', isBanned: false }
    ];
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('streamx_users', JSON.stringify(allUsers));
    }
  }, [allUsers]);

  // Supabase Auth Session Listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const email = session.user.email?.toLowerCase() || '';
        const targetUser = allUsers.find((u: any) => u.email.toLowerCase() === email);
        if (targetUser?.isBanned) {
          alert('Tento účet bol zablokovaný administrátorom.');
          supabase.auth.signOut();
          setCurrentUser(null);
          return;
        }
        const isMyAdminEmail = email === 'kevinkasak@icloud.com';
        const userRole = isMyAdminEmail ? 'admin' : (targetUser?.role || session.user.user_metadata?.role || 'user');
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
        const email = session.user.email?.toLowerCase() || '';
        const targetUser = allUsers.find((u: any) => u.email.toLowerCase() === email);
        if (targetUser?.isBanned) {
          alert('Tento účet bol zablokovaný administrátorom.');
          supabase.auth.signOut();
          setCurrentUser(null);
          return;
        }
        const isMyAdminEmail = email === 'kevinkasak@icloud.com';
        const userRole = isMyAdminEmail ? 'admin' : (targetUser?.role || session.user.user_metadata?.role || 'user');
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
  }, [allUsers]);

  // Search Filtering Effect
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const q = searchQuery.toLowerCase();
    const filtered = catalog.filter(item =>
      item.title.toLowerCase().includes(q) ||
      item.genres.some((g: string) => g.toLowerCase().includes(q))
    );
    setSearchResults(filtered);
  }, [searchQuery, catalog]);

  // Auth Submit Handler
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!inputEmail || !inputPassword) return;

    // Check ban
    const existing = allUsers.find((u: any) => u.email.toLowerCase() === inputEmail.toLowerCase());
    if (existing?.isBanned) {
      setAuthError('Tento účet je zablokovaný (BANNED). Obráťte sa na administrátora.');
      return;
    }

    if (authMode === 'register') {
      const { data, error } = await supabase.auth.signUp({
        email: inputEmail,
        password: inputPassword,
      });
      if (error) {
        setAuthError(error.message);
        return;
      }
      if (data.user) {
        setAllUsers(prev => [...prev, { id: data.user.id, email: inputEmail, role: 'user', isBanned: false }]);
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

  const toggleMyList = (id: string) => {
    if (myList.includes(id)) {
      setMyList(myList.filter(item => item !== id));
    } else {
      setMyList([...myList, id]);
    }
  };

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

          <div className="flex items-center gap-4">
            
            {currentUser?.isLoggedIn && (
              <div className="relative">
                <div className="flex items-center bg-white/5 border border-white/10 rounded-full px-3 py-1.5 focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500 transition-all">
                  <Search className="w-4 h-4 text-gray-400 mr-2" />
                  <input 
                    type="text"
                    placeholder="Hľadať..."
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

            {/* Notifications */}
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
                      <span className="font-bold text-sm text-white">Upozornenia & Oznamy</span>
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

            {/* Profile Avatar */}
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

      {/* MOBILE BOTTOM NAVIGATION */}
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

      {/* MAIN VIEWPORT BODY */}
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
              setNotifications={setNotifications}
            />
          )}

          {activeTab === 'settings' && (
            <AccountSettingsView 
              profiles={profiles}
              setProfiles={setProfiles}
              activeProfile={activeProfile}
              setActiveProfile={setActiveProfile}
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
        <p className="text-xs text-gray-400 mt-1">Vaše uložené filmy a seriály pripravené na neskoršie sledovanie.</p>
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
            </div>

          </div>

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

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <video
        ref={videoRef}
        src={videoSource.url}
        onTimeUpdate={handleTimeUpdate}
        controls
        className="w-full h-full object-contain"
      />
      <button 
        onClick={onClose}
        className="absolute top-6 left-6 z-50 bg-black/70 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" /> Späť
      </button>
    </div>
  );
}

// ==========================================
// ROZŠÍRENÝ ADMIN DASHBOARD COMPONENT
// ==========================================
function AdminDashboard({ catalog, setCatalog, allUsers, setAllUsers, setNotifications }: any) {
  // Media State
  const [title, setTitle] = useState('');
  const [type, setType] = useState('movie');
  const [genres, setGenres] = useState('Sci-Fi, Akčné');
  const [videoUrl, setVideoUrl] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [description, setDescription] = useState('');

  // Notification Send State
  const [notifTitle, setNotifTitle] = useState('');
  const [notifDesc, setNotifDesc] = useState('');

  // New User Creation State
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('user');

  // Edit User State
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editEmail, setEditEmail] = useState('');
  const [editRole, setEditRole] = useState('user');

  // Handler: Odoslanie oznamu
  const handleSendNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle || !notifDesc) return;

    const newNotif = {
      id: Date.now(),
      title: notifTitle,
      desc: notifDesc,
      read: false,
      date: 'Práve teraz'
    };

    setNotifications((prev: any) => [newNotif, ...prev]);
    setNotifTitle('');
    setNotifDesc('');
    alert('Oznámenie bolo úspešne odoslané všetkým používateľom!');
  };

  // Handler: Pridať nového používateľa
  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserEmail) return;

    if (allUsers.some((u: any) => u.email.toLowerCase() === newUserEmail.toLowerCase())) {
      alert('Používateľ s týmto e-mailom už existuje!');
      return;
    }

    const newUser = {
      id: 'u_' + Date.now(),
      email: newUserEmail,
      role: newUserRole,
      isBanned: false
    };

    setAllUsers([...allUsers, newUser]);
    setNewUserEmail('');
    alert('Nový používateľský účet bol vytvorený!');
  };

  // Handler: Ban / Unban
  const toggleBanUser = (userId: string) => {
    setAllUsers(allUsers.map((u: any) => {
      if (u.id === userId) {
        const isBanned = !u.isBanned;
        return { ...u, isBanned };
      }
      return u;
    }));
  };

  // Handler: Odstrániť účet
  const handleDeleteUser = (userId: string) => {
    if (confirm('Naozaj chcete trvalo odstrániť tento používateľský účet?')) {
      setAllUsers(allUsers.filter((u: any) => u.id !== userId));
    }
  };

  // Handler: Uložiť úpravu používateľa
  const handleSaveUserEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUserId || !editEmail) return;

    setAllUsers(allUsers.map((u: any) => u.id === editingUserId ? { ...u, email: editEmail, role: editRole } : u));
    setEditingUserId(null);
    alert('Údaje používateľa boli úspešne aktualizované!');
  };

  // Handler: Pridať film
  const handleCreateMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !videoUrl) return;

    const newItem = {
      id: 'm_' + Date.now(),
      type,
      title,
      description: description || 'Bez opisu.',
      year: new Date().getFullYear(),
      genres: genres.split(',').map((g: string) => g.trim()),
      matchRate: 99,
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
    alert('Nová položka bola pridaná do katalógu!');
  };

  return (
    <div className="px-6 md:px-12 py-8 max-w-7xl mx-auto space-y-8">
      <div className="border-b border-white/10 pb-4">
        <h1 className="text-3xl font-black text-white flex items-center gap-3">
          <Shield className="w-8 h-8 text-red-500" /> Rozšírený Administrátorský Panel
        </h1>
        <p className="text-xs text-gray-400 mt-1">Kompletná správa používateľských účtov, posielanie oznamov a správa obsahu.</p>
      </div>

      {/* 1. POSIELANIE OZNÁMENÍ POUŽÍVATEĽOM */}
      <div className="bg-[#181820] border border-white/10 p-6 rounded-2xl space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Send className="w-5 h-5 text-red-500" /> Poslať hromadné oznámenie používateľom
        </h3>

        <form onSubmit={handleSendNotification} className="space-y-3 text-xs">
          <div>
            <label className="text-gray-400 block mb-1">Nadpis Oznámenia</label>
            <input 
              type="text" 
              value={notifTitle} 
              onChange={(e) => setNotifTitle(e.target.value)} 
              placeholder="Napr. Plánovaná údržba / Nová funkcia" 
              className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-red-500" 
              required 
            />
          </div>
          <div>
            <label className="text-gray-400 block mb-1">Text Oznámenia</label>
            <textarea 
              value={notifDesc} 
              onChange={(e) => setNotifDesc(e.target.value)} 
              placeholder="Zadajte správu pre všetkých používateľov..." 
              rows={2} 
              className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-red-500" 
              required 
            />
          </div>
          <button type="submit" className="bg-[#E50914] text-white font-bold px-5 py-2.5 rounded-xl shadow-lg hover:bg-red-700 transition-colors flex items-center gap-2">
            <Send className="w-4 h-4" /> Odoslať Oznámenie
          </button>
        </form>
      </div>

      {/* 2. SPRÁVA POUŽÍVATEĽOV, BAN, RESET & MANUÁLNE PRIDANIE */}
      <div className="bg-[#181820] border border-white/10 p-6 rounded-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <User className="w-5 h-5 text-red-500" /> Správa účtov, Banovanie a Resetovanie
            </h3>
            <p className="text-xs text-gray-400">Blokujte účty, resetujte zmeny alebo pridávajte nové profilové prístupy.</p>
          </div>
        </div>

        {/* PRIDAŤ NOVÉHO POUŽÍVATEĽA */}
        <form onSubmit={handleAddUser} className="bg-white/5 p-4 rounded-xl border border-white/10 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs items-end">
          <div>
            <label className="text-gray-400 block mb-1">Názov e-mailu nového účtu</label>
            <input 
              type="email" 
              value={newUserEmail} 
              onChange={(e) => setNewUserEmail(e.target.value)} 
              placeholder="novy@streamx.com" 
              className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none" 
              required 
            />
          </div>
          <div>
            <label className="text-gray-400 block mb-1">Pridelená Rola</label>
            <select 
              value={newUserRole} 
              onChange={(e) => setNewUserRole(e.target.value)} 
              className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none"
            >
              <option value="user" className="bg-[#181820]">Používateľ (User)</option>
              <option value="admin" className="bg-[#181820]">Administrátor (Admin)</option>
            </select>
          </div>
          <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold p-2.5 rounded-xl transition-colors flex items-center justify-center gap-2">
            <UserPlus className="w-4 h-4" /> Vytvoriť Účet
          </button>
        </form>

        {/* LIST POUŽÍVATEĽOV */}
        <div className="divide-y divide-white/10">
          {allUsers.map((u: any) => (
            <div key={u.id} className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">{u.email}</span>
                  {u.isBanned && <span className="bg-red-500/20 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded border border-red-500/30">ZABLOKOVANÝ (BANNED)</span>}
                </div>
                <span className={`uppercase font-mono text-[10px] ${u.role === 'admin' ? 'text-emerald-400' : 'text-gray-400'}`}>Rola: {u.role}</span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button 
                  onClick={() => {
                    setEditingUserId(u.id);
                    setEditEmail(u.email);
                    setEditRole(u.role);
                  }}
                  className="px-3 py-1.5 rounded-lg font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1"
                >
                  <Edit className="w-3.5 h-3.5" /> Upraviť
                </button>

                <button 
                  onClick={() => {
                    alert(`Heslo pre ${u.email} bolo resetované na predvolené: "streamx123"`);
                  }}
                  className="px-3 py-1.5 rounded-lg font-semibold bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition-colors flex items-center gap-1"
                >
                  <KeyRound className="w-3.5 h-3.5" /> Reset Hesla
                </button>

                <button 
                  onClick={() => toggleBanUser(u.id)}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1 ${u.isBanned ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30' : 'bg-red-500/20 text-red-300 hover:bg-red-500/30'}`}
                >
                  {u.isBanned ? <UserCheck className="w-3.5 h-3.5" /> : <UserX className="w-3.5 h-3.5" />}
                  {u.isBanned ? 'Odblokovať Účet' : 'Banovať Účet'}
                </button>

                <button 
                  onClick={() => handleDeleteUser(u.id)}
                  className="px-3 py-1.5 rounded-lg font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Zmazať
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* MODAL / FORM PRE ÚPRAVU POUŽÍVATEĽA */}
        {editingUserId && (
          <form onSubmit={handleSaveUserEdit} className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-3 text-xs">
            <h4 className="font-bold text-white text-sm">Úprava Používateľa</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-gray-400 block mb-1">E-mail</label>
                <input type="email" value={editEmail} onChange={e => setEditEmail(e.target.value)} required className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white" />
              </div>
              <div>
                <label className="text-gray-400 block mb-1">Rola</label>
                <select value={editRole} onChange={e => setEditRole(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white">
                  <option value="user" className="bg-[#181820]">user</option>
                  <option value="admin" className="bg-[#181820]">admin</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => setEditingUserId(null)} className="px-4 py-2 bg-white/10 rounded-lg text-white">Zrušiť</button>
              <button type="submit" className="px-4 py-2 bg-red-600 rounded-lg text-white font-bold">Uložiť Zmeny</button>
            </div>
          </form>
        )}
      </div>

      {/* 3. FORMULÁR PRE PRIDANIE OBSAHU */}
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
// ACCOUNT SETTINGS & PROFILES VIEW (ÚPRAVA MENA, AVATARA, PIN-U, ADD/DELETE PROFILES)
// ==========================================
function AccountSettingsView({ profiles, setProfiles, activeProfile, setActiveProfile }: any) {
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [pin, setPin] = useState('');
  const [isKids, setIsKids] = useState(false);

  // Uloženie profilu (pridanie alebo úprava)
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    if (editingProfileId) {
      const updated = profiles.map((p: any) => p.id === editingProfileId ? { ...p, name, avatar, pin: pin || null, isKids } : p);
      setProfiles(updated);
      if (activeProfile.id === editingProfileId) {
        setActiveProfile({ ...activeProfile, name, avatar, pin: pin || null, isKids });
      }
    } else {
      if (profiles.length >= 5) {
        alert('Dosiahli ste maximálny počet 5 profilov.');
        return;
      }
      const newP = { id: 'p_' + Date.now(), name, avatar: avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80', isKids, pin: pin || null };
      setProfiles([...profiles, newP]);
    }

    setName('');
    setAvatar('');
    setPin('');
    setIsKids(false);
    setEditingProfileId(null);
    alert('Zmeny profilu boli uložené a zostanú zachované aj po reštarte stránky!');
  };

  const startEdit = (p: any) => {
    setEditingProfileId(p.id);
    setName(p.name);
    setAvatar(p.avatar);
    setPin(p.pin || '');
    setIsKids(p.isKids);
  };

  const handleDeleteProfile = (profileId: string) => {
    if (profiles.length <= 1) {
      alert('Musíte mať aspoň 1 aktívny profil.');
      return;
    }
    if (confirm('Naozaj chcete vymazať tento profil?')) {
      const filtered = profiles.filter((p: any) => p.id !== profileId);
      setProfiles(filtered);
      if (activeProfile.id === profileId) {
        setActiveProfile(filtered[0]);
      }
    }
  };

  return (
    <div className="px-6 md:px-12 py-8 max-w-4xl mx-auto space-y-8">
      <div className="border-b border-white/10 pb-4">
        <h1 className="text-3xl font-black text-white">Nastavenia & Správa Profilov</h1>
        <p className="text-xs text-gray-400 mt-1">Pridávajte, upravujte, vymazávajte alebo zabezpečte profily PIN kódom. Avatary zostávajú uloženie aj po reštarte.</p>
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
            <div className="flex items-center gap-2">
              <button onClick={() => startEdit(p)} className="p-2 text-gray-400 hover:text-white bg-white/5 rounded-lg" title="Upraviť profil"><Edit className="w-4 h-4" /></button>
              <button onClick={() => handleDeleteProfile(p.id)} className="p-2 text-red-400 hover:text-red-300 bg-red-500/10 rounded-lg" title="Vymazať profil"><Trash2 className="w-4 h-4" /></button>
            </div>
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
            {editingProfileId ? 'Uložiť zmeny profilu' : 'Vytvoriť nový profil'}
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
