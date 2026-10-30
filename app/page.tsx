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
// PRÁZDNY POČOATOČNÝ KATALÓG (VLASTNÉ FILMY PRIDÁŠ CEZ ADMIN PANEL)
// ==========================================
const SEED_MOVIES: any[] = [];

const DEFAULT_USER_PROFILES = [
  { id: 'p1', name: 'Môj Profil', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80', isKids: false, pin: null },
  { id: 'p2', name: 'Deti & Rodina', avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80', isKids: true, pin: null }
];

// ==========================================
// MAIN APP COMPONENT
// ==========================================
export default function App() {
  const [profiles, setProfiles] = useState(DEFAULT_USER_PROFILES);
  const [activeProfile, setActiveProfile] = useState(DEFAULT_USER_PROFILES[0]);
  const [isProfileSelectorOpen, setIsProfileSelectorOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home'); 
  const [selectedGenre, setSelectedGenre] = useState('All');

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [inputEmail, setInputEmail] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const [myList, setMyList] = useState<string[]>([]);
  const [watchProgress, setWatchProgress] = useState<any>({});
  const [ratings, setRatings] = useState<any>({});

  const [selectedMedia, setSelectedMedia] = useState<any>(null);
  const [activeVideoSource, setActiveVideoSource] = useState<any>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const [pinModalProfile, setPinModalProfile] = useState<any>(null);
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState(false);

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Vitajte v STREAMX', desc: 'Pridajte si svoje prvé filmy cez Admin Panel.', read: false, date: 'Dnes' }
  ]);
  const [showNotificationsMenu, setShowNotificationsMenu] = useState(false);

  const [catalog, setCatalog] = useState(SEED_MOVIES);
  const [allUsers, setAllUsers] = useState([
    { id: 'u1', email: 'kevinkasak@icloud.com', role: 'admin' },
    { id: 'u2', email: 'uzivatel@example.com', role: 'user' }
  ]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const isMyAdminEmail = session.user.email?.toLowerCase() === 'kevinkasak@icloud.com';
        const userRole = isMyAdminEmail ? 'admin' : (session.user.user_metadata?.role || 'user');
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
        const isMyAdminEmail = session.user.email?.toLowerCase() === 'kevinkasak@icloud.com';
        const userRole = isMyAdminEmail ? 'admin' : (session.user.user_metadata?.role || 'user');
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

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!inputEmail || !inputPassword) return;

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
                <button onClick={() => setActiveTab('home')} className={`hover:text-red-500 transition-colors ${activeTab === 'home' ? 'text-white font-bold border-b-2 border-[#E50914] pb-1' : 'text-gray-400'}`}>Domov</button>
                <button onClick={() => setActiveTab('movies')} className={`hover:text-red-500 transition-colors ${activeTab === 'movies' ? 'text-white font-bold border-b-2 border-[#E50914] pb-1' : 'text-gray-400'}`}>Filmy</button>
                <button onClick={() => setActiveTab('series')} className={`hover:text-red-500 transition-colors ${activeTab === 'series' ? 'text-white font-bold border-b-2 border-[#E50914] pb-1' : 'text-gray-400'}`}>Seriály</button>
                <button onClick={() => setActiveTab('mylist')} className={`hover:text-red-500 transition-colors ${activeTab === 'mylist' ? 'text-white font-bold border-b-2 border-[#E50914] pb-1' : 'text-gray-400'}`}>Môj Zoznam ({myList.length})</button>
                
                {currentUser?.role === 'admin' && (
                  <button onClick={() => setActiveTab('admin')} className={`hover:text-red-500 transition-colors ${activeTab === 'admin' ? 'text-white font-bold border-b-2 border-[#E50914] pb-1' : 'text-gray-400'}`}>Admin Panel</button>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {currentUser?.isLoggedIn && (
              <div className="relative">
                <div className="flex items-center bg-white/5 border border-white/10 rounded-full px-3 py-1.5 focus-within:border-red-500">
                  <Search className="w-4 h-4 text-gray-400 mr-2" />
                  <input 
                    type="text"
                    placeholder="Hľadať filmy..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none w-32 md:w-56"
                  />
                </div>
              </div>
            )}

            {currentUser?.isLoggedIn ? (
              <div className="relative">
                <button 
                  onClick={() => setIsProfileSelectorOpen(!isProfileSelectorOpen)}
                  className="flex items-center gap-2 group p-1 rounded-full hover:bg-white/5"
                >
                  <img src={activeProfile.avatar} alt={activeProfile.name} className="w-8 h-8 rounded-md object-cover border border-white/20" />
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {isProfileSelectorOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#181820] border border-white/10 rounded-xl shadow-2xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-white/10">
                      <p className="text-xs text-gray-400">Prihlásený účet:</p>
                      <p className="text-xs font-bold text-white truncate mt-0.5">{currentUser.email}</p>
                      <p className="text-[10px] text-emerald-400 uppercase font-mono mt-0.5">{currentUser.role}</p>
                    </div>

                    <div className="border-t border-white/10 pt-2 px-2 space-y-1">
                      <button onClick={() => { setActiveTab('settings'); setIsProfileSelectorOpen(false); }} className="w-full text-left px-3 py-1.5 text-xs text-gray-300 hover:bg-white/10 rounded flex items-center gap-2">
                        <Settings className="w-3.5 h-3.5" /> Nastavenia profilov
                      </button>
                      <button onClick={handleLogout} className="w-full text-left px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10 rounded flex items-center gap-2 font-semibold">
                        <LogOut className="w-3.5 h-3.5" /> Odhlásiť sa
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button onClick={() => { setAuthMode('login'); setIsAuthModalOpen(true); }} className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-white/10">
                  <LogIn className="w-4 h-4" /> Prihlásiť
                </button>
                <button onClick={() => { setAuthMode('register'); setIsAuthModalOpen(true); }} className="flex items-center gap-1.5 bg-[#E50914] hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg">
                  <UserPlus className="w-4 h-4" /> Registrácia
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {!currentUser?.isLoggedIn ? (
        <div className="flex flex-col items-center justify-center min-h-[82vh] px-4 text-center">
          <div className="max-w-3xl space-y-6">
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-tight">
              Neobmedzené filmy, seriály a vlastný obsah.
            </h1>
            <p className="text-base md:text-xl text-gray-300">
              Prihláste sa pre prístup k vašej súkromnej knižnici STREAMX.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <button onClick={() => { setAuthMode('login'); setIsAuthModalOpen(true); }} className="bg-[#E50914] text-white font-bold px-8 py-4 rounded-xl shadow-lg">
                Prihlásiť sa do účtu
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
            />
          )}

          {activeTab === 'movies' && (
            <CatalogFilteredView type="movie" catalog={catalog} selectedGenre={selectedGenre} setSelectedGenre={setSelectedGenre} onSelectMedia={(media: any) => setSelectedMedia(media)} onPlayMedia={handlePlayMedia} />
          )}

          {activeTab === 'series' && (
            <CatalogFilteredView type="series" catalog={catalog} selectedGenre={selectedGenre} setSelectedGenre={setSelectedGenre} onSelectMedia={(media: any) => setSelectedMedia(media)} onPlayMedia={handlePlayMedia} />
          )}

          {activeTab === 'mylist' && (
            <MyListView catalog={catalog} myList={myList} toggleMyList={toggleMyList} onSelectMedia={(media: any) => setSelectedMedia(media)} />
          )}

          {activeTab === 'admin' && currentUser?.role === 'admin' && (
            <AdminDashboard catalog={catalog} setCatalog={setCatalog} allUsers={allUsers} setAllUsers={setAllUsers} />
          )}

          {activeTab === 'settings' && (
            <AccountSettingsView profiles={profiles} setProfiles={setProfiles} />
          )}
        </main>
      )}

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

      {isPlayerOpen && activeVideoSource && (
        <VideoPlayerModal 
          videoSource={activeVideoSource}
          onClose={() => setIsPlayerOpen(false)}
          onUpdateProgress={(id: string, time: number) => setWatchProgress({...watchProgress, [id]: time})}
          initialTime={watchProgress[activeVideoSource.id] || 0}
        />
      )}

      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#181820] border border-white/10 p-6 md:p-8 rounded-2xl w-full max-w-md relative shadow-2xl">
            <button onClick={() => setIsAuthModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
            <h2 className="text-2xl font-bold mb-6 text-white text-center">{authMode === 'register' ? 'Registrácia' : 'Prihlásenie'}</h2>
            {authError && <div className="mb-4 p-3 bg-red-500/20 text-red-200 text-xs rounded-lg">{authError}</div>}
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">E-mailová adresa</label>
                <input type="email" value={inputEmail} onChange={(e) => setInputEmail(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white text-sm" required />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Heslo</label>
                <input type="password" value={inputPassword} onChange={(e) => setInputPassword(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white text-sm" required />
              </div>
              <button type="submit" className="w-full bg-[#E50914] text-white font-bold py-3 rounded-xl text-sm shadow-lg">
                {authMode === 'register' ? 'Vytvoriť účet' : 'Prihlásiť sa'}
              </button>
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
function HomeView({ catalog, myList, toggleMyList, onSelectMedia, onPlayMedia, activeProfile }: any) {
  if (catalog.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <Film className="w-16 h-16 text-gray-600 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Zatiaľ žiadne filmy v katalógu</h2>
        <p className="text-sm text-gray-400">Prejdite do **Admin Panelu** v hornom menu a pridajte svoje prvé vlastné video!</p>
      </div>
    );
  }

  const heroMedia = catalog[0];
  const movies = catalog.filter((c: any) => c.type === 'movie');
  const series = catalog.filter((c: any) => c.type === 'series');

  return (
    <div className="space-y-8">
      {heroMedia && (
        <div className="relative w-full h-[70vh] flex items-end justify-start overflow-hidden">
          <img src={heroMedia.bannerUrl} alt={heroMedia.title} className="absolute inset-0 w-full h-full object-cover filter brightness-90" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f13] via-[#0f0f13]/40 to-transparent" />
          <div className="relative z-10 max-w-2xl px-6 md:px-12 pb-12 space-y-4">
            <h1 className="text-4xl md:text-6xl font-black text-white">{heroMedia.title}</h1>
            <p className="text-sm md:text-base text-gray-300 line-clamp-3">{heroMedia.description}</p>
            <div className="flex gap-4">
              <button onClick={() => onPlayMedia(heroMedia)} className="flex items-center gap-2 bg-white text-black font-bold px-6 py-3 rounded-xl">
                <Play className="w-5 h-5 fill-black" /> Prehrať
              </button>
              <button onClick={() => onSelectMedia(heroMedia)} className="flex items-center gap-2 bg-white/20 text-white font-semibold px-6 py-3 rounded-xl border border-white/10">
                <Info className="w-5 h-5" /> Viac informácií
              </button>
            </div>
          </div>
        </div>
      )}

      {movies.length > 0 && <MediaRow title="🎬 Filmy" items={movies} onSelectMedia={onSelectMedia} onPlayMedia={onPlayMedia} myList={myList} toggleMyList={toggleMyList} />}
      {series.length > 0 && <MediaRow title="📺 Seriály" items={series} onSelectMedia={onSelectMedia} onPlayMedia={onPlayMedia} myList={myList} toggleMyList={toggleMyList} />}
    </div>
  );
}

function MediaRow({ title, items, onSelectMedia, onPlayMedia, myList, toggleMyList }: any) {
  return (
    <div className="px-6 md:px-12 space-y-3">
      <h2 className="text-lg md:text-xl font-bold text-white">{title}</h2>
      <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide py-2">
        {items.map((item: any) => {
          const isBookmarked = myList.includes(item.id);
          return (
            <div key={item.id} className="flex-none w-48 bg-[#181820] rounded-xl overflow-hidden border border-white/5 cursor-pointer group relative">
              <div className="aspect-[2/3] relative">
                <img src={item.coverUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" onClick={() => onSelectMedia(item)} />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end">
                  <div className="flex gap-2 mb-2">
                    <button onClick={() => onPlayMedia(item)} className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center"><Play className="w-4 h-4 fill-current ml-0.5" /></button>
                    <button onClick={() => toggleMyList(item.id)} className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center">
                      {isBookmarked ? <Check className="w-4 h-4 text-emerald-400" /> : <Plus className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="text-xs font-bold text-white truncate">{item.title}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CatalogFilteredView({ type, catalog, selectedGenre, setSelectedGenre, onSelectMedia, onPlayMedia }: any) {
  const filtered = catalog.filter((item: any) => item.type === type);
  return (
    <div className="px-6 md:px-12 py-8 space-y-6">
      <h1 className="text-3xl font-black text-white uppercase">{type === 'movie' ? 'Filmy' : 'Seriály'}</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {filtered.map((item: any) => (
          <div key={item.id} onClick={() => onSelectMedia(item)} className="bg-[#181820] rounded-xl overflow-hidden cursor-pointer">
            <img src={item.coverUrl} alt={item.title} className="w-full aspect-[2/3] object-cover" />
            <div className="p-3"><h3 className="text-xs font-bold text-white truncate">{item.title}</h3></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MyListView({ catalog, myList, toggleMyList, onSelectMedia }: any) {
  const savedItems = catalog.filter((item: any) => myList.includes(item.id));
  return (
    <div className="px-6 md:px-12 py-8 space-y-6">
      <h1 className="text-3xl font-black text-white">Môj Zoznam</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {savedItems.map((item: any) => (
          <div key={item.id} className="relative bg-[#181820] rounded-xl overflow-hidden">
            <img src={item.coverUrl} alt={item.title} className="w-full aspect-[2/3] object-cover cursor-pointer" onClick={() => onSelectMedia(item)} />
            <button onClick={() => toggleMyList(item.id)} className="absolute top-2 right-2 bg-black/70 p-1.5 rounded-full text-red-500"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

function MediaDetailModal({ media, onClose, onPlay, isInList, onToggleList, userRating, onRate }: any) {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#181820] border border-white/10 rounded-2xl w-full max-w-3xl overflow-hidden relative">
        <button onClick={onClose} className="absolute top-4 right-4 z-20 bg-black/60 p-2 rounded-full text-white"><X className="w-5 h-5" /></button>
        <div className="relative h-72 w-full">
          <img src={media.bannerUrl} alt={media.title} className="w-full h-full object-cover" />
          <div className="absolute bottom-6 left-6 flex gap-4">
            <button onClick={() => onPlay(media)} className="flex items-center gap-2 bg-[#E50914] text-white font-bold px-6 py-2.5 rounded-xl shadow-lg">
              <Play className="w-5 h-5 fill-white" /> Prehrať
            </button>
            <button onClick={onToggleList} className="flex items-center gap-2 bg-white/10 text-white font-semibold px-4 py-2.5 rounded-xl border border-white/10">
              {isInList ? <Check className="w-4 h-4 text-emerald-400" /> : <Plus className="w-4 h-4" />} {isInList ? 'V zozname' : 'Môj Zoznam'}
            </button>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <h2 className="text-2xl font-bold text-white">{media.title}</h2>
          <p className="text-sm text-gray-300">{media.description}</p>
        </div>
      </div>
    </div>
  );
}

function VideoPlayerModal({ videoSource, onClose, onUpdateProgress, initialTime }: any) {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = initialTime;
      videoRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <video ref={videoRef} src={videoSource.url} controls className="w-full h-full object-contain" onTimeUpdate={() => onUpdateProgress(videoSource.id, videoRef.current?.currentTime || 0)} />
      <button onClick={onClose} className="absolute top-6 left-6 bg-black/60 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2">
        <ArrowLeft className="w-5 h-5" /> Späť
      </button>
    </div>
  );
}

// ==========================================
// ROZŠÍRENÝ ADMIN DASHBOARD (SPRÁVA & MAZANIE FILMOV)
// ==========================================
function AdminDashboard({ catalog, setCatalog, allUsers, setAllUsers }: any) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('movie');
  const [genres, setGenres] = useState('Akčné, Sci-Fi');
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
      description: description || 'Bez opisu.',
      year: new Date().getFullYear(),
      genres: genres.split(',').map((g: string) => g.trim()),
      matchRate: 98,
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
    alert('Váš film bol úspešne pridaný do katalógu!');
  };

  const handleDeleteMedia = (id: string) => {
    if (confirm('Naozaj chcete vymazať tento film z katalógu?')) {
      setCatalog(catalog.filter((item: any) => item.id !== id));
    }
  };

  return (
    <div className="px-6 md:px-12 py-8 max-w-6xl mx-auto space-y-8">
      <div className="border-b border-white/10 pb-4">
        <h1 className="text-3xl font-black text-white flex items-center gap-3">
          <Shield className="w-8 h-8 text-red-500" /> Rozšírený Administrátorský Panel
        </h1>
        <p className="text-xs text-gray-400 mt-1">Pridávajte vlastné videá, filmy alebo seriály a spravujte existujúci obsah.</p>
      </div>

      {/* ZOZNAM EXISTUJÚCich FILMOV S MOŽNOSŤOU MAZANIA */}
      <div className="bg-[#181820] border border-white/10 p-6 rounded-2xl space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Film className="w-5 h-5 text-red-500" /> Existujúce filmy a seriály v katalógu ({catalog.length})
        </h3>
        
        {catalog.length === 0 ? (
          <p className="text-xs text-gray-400">Katalóg je zatiaľ prázdny. Pridajte prvý film nižšie.</p>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {catalog.map((item: any) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 text-xs">
                <div className="flex items-center gap-3">
                  <img src={item.coverUrl} alt={item.title} className="w-10 h-14 object-cover rounded" />
                  <div>
                    <h4 className="font-bold text-white text-sm">{item.title}</h4>
                    <span className="text-gray-400">{item.type === 'movie' ? 'Film' : 'Seriál'} • {item.year}</span>
                  </div>
                </div>
                <button onClick={() => handleDeleteMedia(item.id)} className="bg-red-500/20 hover:bg-red-500/30 text-red-300 px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1">
                  <Trash2 className="w-3.5 h-3.5" /> Odstrániť
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FORMULÁR NA PRIDANIE VLASTNÉHO FILMU */}
      <div className="bg-[#181820] border border-white/10 p-6 rounded-2xl space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Plus className="w-5 h-5 text-red-500" /> Pridať Vlastný Film alebo Seriál
        </h3>

        <form onSubmit={handleCreateMedia} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="text-gray-400 block mb-1">Názov</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Napr. Môj Vlastný Film" className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white" required />
          </div>

          <div>
            <label className="text-gray-400 block mb-1">Typ</label>
            <select value={type} onChange={(e) => setType(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white">
              <option value="movie" className="bg-[#181820]">Film</option>
              <option value="series" className="bg-[#181820]">Seriál</option>
            </select>
          </div>

          <div>
            <label className="text-gray-400 block mb-1">URL Video Streamu (MP4 odkaz)</label>
            <input type="url" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://.../video.mp4" className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white" required />
          </div>

          <div>
            <label className="text-gray-400 block mb-1">Žánre</label>
            <input type="text" value={genres} onChange={(e) => setGenres(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white" />
          </div>

          <div>
            <label className="text-gray-400 block mb-1">Cover Obrázok URL (plagát)</label>
            <input type="url" value={coverUrl} onChange={(e) => setCoverUrl(e.target.value)} placeholder="https://..." className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white" />
          </div>

          <div>
            <label className="text-gray-400 block mb-1">Banner Obrázok URL (pozadie)</label>
            <input type="url" value={bannerUrl} onChange={(e) => setBannerUrl(e.target.value)} placeholder="https://..." className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white" />
          </div>

          <div className="md:col-span-2">
            <label className="text-gray-400 block mb-1">Popis</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white" />
          </div>

          <button type="submit" className="md:col-span-2 bg-[#E50914] text-white font-bold py-3 rounded-xl shadow-lg">
            Pridať Film do Katalógu
          </button>
        </form>
      </div>
    </div>
  );
}

function AccountSettingsView({ profiles, setProfiles }: any) {
  return (
    <div className="px-6 md:px-12 py-8 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-black text-white">Nastavenia Profilov</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {profiles.map((p: any) => (
          <div key={p.id} className="bg-[#181820] border border-white/10 p-4 rounded-xl flex items-center gap-3">
            <img src={p.avatar} alt={p.name} className="w-12 h-12 rounded-lg object-cover" />
            <div>
              <h4 className="font-bold text-sm text-white">{p.name}</h4>
              <p className="text-xs text-gray-400">{p.isKids ? 'Detský profil' : 'Štandardný profil'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
