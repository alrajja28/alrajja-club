import React, { useState, useEffect } from 'react';
import { useConvexAuth, useQuery } from 'convex/react';
import { useAuthActions } from '@convex-dev/auth/react';
import { clubApi } from './backend/api';
import { SplashScreen } from './components/SplashScreen';
import { LoginScreen } from './components/LoginScreen';
import { HomeTab } from './components/HomeTab';
import { MatchesTab } from './components/MatchesTab';
import { TeamTab, Player } from './components/TeamTab';
import { MoreTab } from './components/MoreTab';
import { StoreTab } from './components/StoreTab';
import { NewsTab } from './components/NewsTab';
import { ProfileTab } from './components/ProfileTab';
import { PlayerDetailsScreen, PlayerDetailsData } from './components/PlayerDetailsScreen';
import { MediaScreen } from './components/MediaScreen';
import { TicketsScreen } from './components/TicketsScreen';
import { AcademyScreen } from './components/AcademyScreen';
import { AnthemModal } from './components/AnthemModal';
import { CartModal } from './components/CartModal';
import { NewsDetailModal } from './components/NewsDetailModal';
import { SideDrawer } from './components/SideDrawer';
import { LiveStreamModal } from './components/LiveStreamModal';
import { BottomNav, NavTabId } from './components/BottomNav';
import { Match, NewsItem, Product, UPCOMING_MATCH } from './data/clubData';

export type AppScreenId =
  | 'splash-screen'
  | 'login-screen'
  | 'home-screen'
  | 'matches-screen'
  | 'players-screen'
  | 'player-details-screen'
  | 'media-screen'
  | 'tickets-screen'
  | 'store-screen'
  | 'academy-screen'
  | 'more-screen'
  | 'news-screen'
  | 'profile-screen';

export default function App() {
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();
  const viewer = useQuery(clubApi.content.me, isAuthenticated ? {} : 'skip');
  // 1. نظام التوجيه (Navigation System) وسجل الشاشات لزر الرجوع
  const [currentScreen, setCurrentScreen] = useState<AppScreenId>('splash-screen');
  const [screenHistory, setScreenHistory] = useState<AppScreenId[]>(['splash-screen']);

  // Selected player for player-details-screen
  const [selectedPlayerForDetails, setSelectedPlayerForDetails] = useState<PlayerDetailsData | null>(null);

  // Selected match for tickets-screen
  const [selectedTicketMatch, setSelectedTicketMatch] = useState<Match | null>(null);

  // Authenticated user state
  const [user, setUser] = useState({
    name: 'زائر',
    phone: '',
    role: 'مشجع',
  });

  // Modals state
  const [isAnthemOpen, setIsAnthemOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLiveStreamOpen, setIsLiveStreamOpen] = useState(false);

  // User persistent cart & tickets
  const [cartItems, setCartItems] = useState<
    Array<{ id: string; name: string; price: number; quantity: number; options?: string }>
  >([]);

  const submissions=useQuery(clubApi.submissions.mine,isAuthenticated?{}:'skip');
  const bookedTickets=(submissions??[]).filter((r:any)=>r.kind==='tickets').map((r:any)=>({...r.data,id:r._id,status:r.status,code:r._id.slice(-8).toUpperCase()}));

  // Function to switch screens with history tracking
  const switchScreen = (screenId: AppScreenId | string, isBack = false) => {
    const target = screenId as AppScreenId;
    if (!isBack && screenHistory[screenHistory.length - 1] !== target) {
      setScreenHistory((prev) => [...prev, target]);
    }
    setCurrentScreen(target);
  };

  // Function to go back through screen history
  const goBack = () => {
    if (screenHistory.length > 1) {
      setScreenHistory((prev) => {
        const next = [...prev];
        next.pop(); // remove current
        const previousScreen = next[next.length - 1];
        setCurrentScreen(previousScreen);
        return next;
      });
    }
  };

  // Handlers for authentication flow
  const handleStartFromSplash = () => {
    switchScreen('login-screen');
  };

  const handleGuestFromSplash = () => {
    switchScreen('home-screen');
  };

  const handleLoginSuccess = (userData: { name: string; phone: string; role: string }) => {
    setUser(userData);
    switchScreen('home-screen');
  };

  const handleLogout = () => {
    void signOut();
    setUser({ name: 'زائر', phone: 'غير مسجل', role: 'مشجع' });
    setScreenHistory(['splash-screen']);
    setCurrentScreen('splash-screen');
  };

  useEffect(() => {
    if (viewer && isAuthenticated) {
      setUser({name:viewer.name || 'مشجع رجاوي',phone:viewer.email || '',role:viewer.isAdmin?'إدارة النادي':'مشجع'});
      setCurrentScreen(screen => screen === 'login-screen' || screen === 'splash-screen' ? 'home-screen' : screen);
    }
  }, [viewer, isAuthenticated]);

  const handleAddToCart = (
    product: Product,
    customOptions?: { name: string; number: number; size: string }
  ) => {
    const optionsStr = customOptions
      ? `المقاس: ${customOptions.size} | الاسم: ${customOptions.name} #${customOptions.number}`
      : undefined;

    setCartItems((prev) => [
      ...prev,
      {
        id: product.id + (customOptions ? '-' + Date.now() : ''),
        name: product.name,
        price: product.price,
        quantity: 1,
        options: optionsStr,
      },
    ]);
  };

  const handleTicketBooked = (ticket: any) => {
    // Convex subscriptions update the persisted requests automatically.
  };

  // Expose switchScreen & goBack globally and set up delegated events
  useEffect(() => {
    (window as any).switchScreen = switchScreen;
    (window as any).goBack = goBack;

    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Handle back icons
      if (target.classList.contains('back-icon') || target.closest('.back-icon')) {
        e.preventDefault();
        goBack();
        return;
      }

      // Handle "تفاصيل المباراة" button click
      const btn = target.closest('button');
      if (btn && btn.textContent?.includes('تفاصيل المباراة')) {
        e.preventDefault();
        switchScreen('matches-screen');
        return;
      }

      // Handle "شراء التذاكر" button click
      if (btn && btn.textContent?.includes('شراء التذاكر')) {
        e.preventDefault();
        switchScreen('tickets-screen');
        return;
      }
    };

    document.addEventListener('click', handleGlobalClick);
    return () => {
      document.removeEventListener('click', handleGlobalClick);
    };
  }, [screenHistory]);

  const isBottomNavVisible =
    currentScreen !== 'splash-screen' && currentScreen !== 'login-screen';

  return (
    <div className="club-app min-h-screen bg-[#070d1a] text-white flex justify-center font-['Cairo',sans-serif] selection:bg-[#e30613] selection:text-white">
      {/* Main Container tailored natively for phones and responsive viewports */}
      <main
        id="app-container"
        className="w-full max-w-md min-h-screen h-[100dvh] relative overflow-hidden bg-[#070d1a] text-white flex flex-col shadow-2xl"
        style={{
          backgroundImage:
            currentScreen === 'splash-screen'
              ? 'radial-gradient(circle at center 30%, #17274a 0%, #070d1a 60%)'
              : 'none',
        }}
      >
        {/* Screen Switcher */}
        <div key={currentScreen} className="screen-stage flex-1 min-h-0 relative overflow-hidden flex flex-col">
          {/* SCREEN 1: Splash Screen (الكليشة 1) */}
          {currentScreen === 'splash-screen' && (
            <SplashScreen
              onStart={handleStartFromSplash}
              onExploreGuest={handleGuestFromSplash}
            />
          )}

          {/* SCREEN 2: Login / Register Screen (الكليشة 2) */}
          {currentScreen === 'login-screen' && (
            <LoginScreen
              onBack={() => switchScreen('splash-screen', true)}
              onLoginSuccess={handleLoginSuccess}
              onContinueGuest={handleGuestFromSplash}
            />
          )}

          {/* SCREEN 3: Home Screen (الكليشة 3) */}
          {currentScreen === 'home-screen' && (
            <HomeTab
              onOpenTickets={(m) => {
                setSelectedTicketMatch(m || UPCOMING_MATCH);
                switchScreen('tickets-screen');
              }}
              onOpenStore={() => switchScreen('store-screen')}
              onOpenNews={() => switchScreen('news-screen')}
              onOpenMedia={() => switchScreen('media-screen')}
              onOpenAnthem={() => setIsAnthemOpen(true)}
              onOpenProfile={() => switchScreen('profile-screen')}
              onSelectNews={(n) => setSelectedNews(n)}
              onNavigateTab={(tab) => {
                if (tab === 'matches') switchScreen('matches-screen');
                else if (tab === 'team') switchScreen('players-screen');
                else if (tab === 'more') switchScreen('more-screen');
                else switchScreen('home-screen');
              }}
              onOpenMenu={() => setIsMenuOpen(true)}
              onOpenLiveStream={() => setIsLiveStreamOpen(true)}
              onOpenAcademy={() => switchScreen('academy-screen')}
            />
          )}

          {/* SCREEN 5: Matches Screen (الكليشة 5) */}
          {currentScreen === 'matches-screen' && (
            <MatchesTab
              onOpenTickets={(m) => {
                setSelectedTicketMatch(m || UPCOMING_MATCH);
                switchScreen('tickets-screen');
              }}
              onBack={goBack}
              onOpenMenu={() => setIsMenuOpen(true)}
            />
          )}

          {/* SCREEN 6: Players Screen (الكليشة 6) */}
          {currentScreen === 'players-screen' && (
            <TeamTab
              onBack={goBack}
              onOpenMenu={() => setIsMenuOpen(true)}
              onSelectPlayer={(p: Player) => {
                setSelectedPlayerForDetails(p);
                switchScreen('player-details-screen');
              }}
            />
          )}

          {/* SCREEN 7: Player Details Screen (الكليشة 7) */}
          {currentScreen === 'player-details-screen' && (
            <PlayerDetailsScreen
              player={selectedPlayerForDetails}
              onBack={goBack}
              onOpenMenu={() => setIsMenuOpen(true)}
            />
          )}

          {/* SCREEN 8: Media Screen (الكليشة 8) */}
          {currentScreen === 'media-screen' && (
            <MediaScreen
              onBack={goBack}
              onOpenMenu={() => setIsMenuOpen(true)}
              onOpenLiveStream={() => setIsLiveStreamOpen(true)}
            />
          )}

          {/* SCREEN 9: Tickets Screen (الكليشة 9) */}
          {currentScreen === 'tickets-screen' && (
            <TicketsScreen
              match={selectedTicketMatch || UPCOMING_MATCH}
              onBack={goBack}
              onOpenMenu={() => setIsMenuOpen(true)}
              onSuccessBooking={(newTicket) => {
                handleTicketBooked(newTicket);
              }}
            />
          )}

          {/* SCREEN 10: Store Screen (الكليشة 10) */}
          {currentScreen === 'store-screen' && (
            <StoreTab
              onBack={goBack}
              onOpenMenu={() => setIsMenuOpen(true)}
              onAddToCart={handleAddToCart}
              cartCount={cartItems.length}
              onOpenCartModal={() => setIsCartOpen(true)}
            />
          )}

          {/* SCREEN 11: Academy Screen (الكليشة 11) */}
          {currentScreen === 'academy-screen' && (
            <AcademyScreen
              onBack={goBack}
              onOpenMenu={() => setIsMenuOpen(true)}
            />
          )}

          {/* SCREEN 12: More Screen (الكليشة 12) */}
          {currentScreen === 'more-screen' && (
            <MoreTab
              onBack={goBack}
              onOpenMenu={() => setIsMenuOpen(true)}
              onOpenStore={() => switchScreen('store-screen')}
              onOpenNews={() => switchScreen('news-screen')}
              onOpenMedia={() => switchScreen('media-screen')}
              onOpenProfile={() => switchScreen('profile-screen')}
              onOpenAnthem={() => setIsAnthemOpen(true)}
              onOpenTickets={() => {
                setSelectedTicketMatch(UPCOMING_MATCH);
                switchScreen('tickets-screen');
              }}
              onOpenAcademy={() => switchScreen('academy-screen')}
              onLogout={handleLogout}
              userName={user.name}
              userRole={user.role}
              cartCount={cartItems.length}
            />
          )}

          {/* SCREEN: News Screen */}
          {currentScreen === 'news-screen' && (
            <NewsTab
              onSelectNews={(n) => setSelectedNews(n)}
              onBack={goBack}
              onOpenMenu={() => setIsMenuOpen(true)}
            />
          )}

          {/* SCREEN: Profile Screen */}
          {currentScreen === 'profile-screen' && (
            <div className="w-full h-full flex flex-col">
              <div className="p-3 bg-[#0a1120] border-b border-white/10 flex items-center justify-between">
                <button
                  onClick={goBack}
                  className="text-xs text-[#8c96aa] hover:text-white flex items-center gap-1.5 cursor-pointer"
                >
                  <i className="fa-solid fa-arrow-right"></i>
                  <span>العودة</span>
                </button>
                <span className="text-xs font-bold text-white">بطاقة المشجع الرقمية</span>
              </div>
              <div className="flex-1 overflow-y-auto">
                <ProfileTab
                  user={user}
                  tickets={bookedTickets}
                  onReturnToSplash={() => {
                    setScreenHistory(['splash-screen']);
                    setCurrentScreen('splash-screen');
                  }}
                  onLogout={handleLogout}
                />
              </div>
            </div>
          )}
        </div>

        {/* شريط التنقل السفلي (Bottom Nav) */}
        {isBottomNavVisible && (
          <BottomNav
            activeScreen={currentScreen}
            onSelectScreen={(screenId: NavTabId) => switchScreen(screenId)}
            cartCount={cartItems.length}
          />
        )}
      </main>

      {/* Side Drawer */}
      <SideDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        userName={user.name}
        userRole={user.role}
        onOpenAnthem={() => {
          setIsMenuOpen(false);
          setIsAnthemOpen(true);
        }}
        onOpenStore={() => {
          setIsMenuOpen(false);
          switchScreen('store-screen');
        }}
        onOpenMedia={() => {
          setIsMenuOpen(false);
          switchScreen('media-screen');
        }}
        onOpenAcademy={() => {
          setIsMenuOpen(false);
          switchScreen('academy-screen');
        }}
        onOpenTickets={() => {
          setIsMenuOpen(false);
          setSelectedTicketMatch(UPCOMING_MATCH);
          switchScreen('tickets-screen');
        }}
        onOpenProfile={() => {
          setIsMenuOpen(false);
          switchScreen('profile-screen');
        }}
        onLogout={handleLogout}
      />

      {/* Modals */}
      {isAnthemOpen && (
        <AnthemModal onClose={() => setIsAnthemOpen(false)} />
      )}

      {isCartOpen && (
        <CartModal
          items={cartItems}
          onClose={() => setIsCartOpen(false)}
          onClear={() => setCartItems([])}
          onRemoveItem={(idx) =>
            setCartItems((prev) => prev.filter((_, i) => i !== idx))
          }
        />
      )}

      {selectedNews && (
        <NewsDetailModal
          news={selectedNews}
          onClose={() => setSelectedNews(null)}
        />
      )}

      {isLiveStreamOpen && (
        <LiveStreamModal isOpen={isLiveStreamOpen} onClose={() => setIsLiveStreamOpen(false)} />
      )}
    </div>
  );
}
