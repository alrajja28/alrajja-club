export interface Match {
  id: string;
  opponent: string;
  opponentLogoText: string;
  opponentLogo?:string;
  competition: string;
  stadium: string;
  date: string;
  time: string;
  isHome: boolean;
  status: 'upcoming' | 'live' | 'finished';
  score?: { wahda: number; opponent: number };
  scorers?: string[];
  ticketPrice: number;
  ticketPrices?: Record<'vip'|'first'|'second'|'third',number>;
  ticketSalesEnabled?: boolean;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  date: string;
  category: 'فريق أول' | 'تذاكر' | 'مؤتمر' | 'أكاديمية' | 'أخبار' | 'تقارير' | 'تصريحات' | 'صور' | 'فيديو';
  readTime: string;
  imageBg: string;
}

export interface Product {
  id: string;
  name: string;
  category?: 'أطقم' | 'إكسسوارات' | 'شالات' | 'معدات' | string;
  price: number;
  originalPrice?: number;
  tag?: string;
  imagePlaceholder?: string;
  colors?: string[];
  image?: string;
}

export interface Player {
  number: number;
  name: string;
  position: 'حارس' | 'دفاع' | 'وسط' | 'هجوم';
  nationality: string;
  goals?: number;
}

export const UPCOMING_MATCH: Match = {
  id: 'm-1',
  opponent: 'نادي الزوراء',
  opponentLogoText: 'الزوراء',
  competition: 'دوري نجوم العراق - الجولة 18',
  stadium: 'ملعب الشعب الدولي - بغداد',
  date: 'السبت، 4 أكتوبر 2026',
  time: '20:30',
  isHome: true,
  status: 'upcoming',
  ticketPrice: 10000,
};

export const RECENT_MATCHES: Match[] = [
  {
    id: 'm-2',
    opponent: 'نادي القوة الجوية',
    opponentLogoText: 'الجوية',
    competition: 'دوري نجوم العراق',
    stadium: 'ملعب الشعب الدولي',
    date: 'الجمعة الماضية',
    time: 'انتهت',
    isHome: false,
    status: 'finished',
    score: { wahda: 2, opponent: 1 },
    scorers: ['علي حسين 24\'', 'محمد قاسم 67\''],
    ticketPrice: 0,
  },
  {
    id: 'm-3',
    opponent: 'نادي الشرطة',
    opponentLogoText: 'الشرطة',
    competition: 'كأس العراق لكرة القدم',
    stadium: 'ملعب البصرة الدولي',
    date: '14 أكتوبر 2026',
    time: '19:15',
    isHome: true,
    status: 'upcoming',
    ticketPrice: 15000,
  },
  {
    id: 'm-4',
    opponent: 'نادي الطلبة',
    opponentLogoText: 'الطلبة',
    competition: 'دوري نجوم العراق',
    stadium: 'ملعب المدينة الدولي',
    date: '21 أكتوبر 2026',
    time: '20:00',
    isHome: false,
    status: 'upcoming',
    ticketPrice: 10000,
  },
];

export const STANDINGS = [
  { rank: 1, team: 'الرجاء العراقي', played: 17, won: 13, draw: 3, lost: 1, points: 42, form: ['W', 'W', 'W', 'D', 'W'] },
  { rank: 2, team: 'القوة الجوية', played: 17, won: 12, draw: 4, lost: 1, points: 40, form: ['W', 'W', 'D', 'W', 'W'] },
  { rank: 3, team: 'الشرطة', played: 17, won: 12, draw: 2, lost: 3, points: 38, form: ['L', 'W', 'W', 'W', 'L'] },
  { rank: 4, team: 'الزوراء', played: 17, won: 10, draw: 4, lost: 3, points: 34, form: ['W', 'D', 'W', 'L', 'W'] },
  { rank: 5, team: 'الطلبة', played: 17, won: 9, draw: 4, lost: 4, points: 31, form: ['D', 'W', 'L', 'W', 'D'] },
];

export const CLUB_NEWS: NewsItem[] = [
  {
    id: 'n-1',
    title: 'نادي الرجاء العراقي يختتم تدريباته التكتيكية استعداداً لكلاسيكو الدوري',
    summary: 'أنهى الفريق الأول لكرة القدم بنادي الرجاء العراقي مساء اليوم تحضيراته الميدانية وسط معنويات عالية وتكامل تام في التشكيلة.',
    content: 'أنهى الفريق الأول لكرة القدم بنادي الرجاء العراقي مساء اليوم تحضيراته الميدانية استعداداً للمواجهة المرتقبة. وركز الجهاز الفني خلال الحصة التدريبية على الجوانب التكتيكية والتحولات الهجومية السريعة.',
    date: 'منذ ساعتين',
    category: 'فريق أول',
    readTime: '3 دقائق',
    imageBg: 'from-red-950 to-slate-900',
  },
  {
    id: 'n-2',
    title: 'طرح تذاكر مباراة نادي الرجاء العراقي والزوراء للجماهير',
    summary: 'أعلنت إدارة نادي الرجاء العراقي عن فتح باب حجز تذاكر مدرج النادي مع تسهيلات خاصة لحاملي بطاقات العضوية السنوية.',
    content: 'أعلنت إدارة نادي الرجاء العراقي طرح تذاكر قمة الجولة عبر المنصة الرسمية. وتهيب الإدارة بجماهير النادي الوفية الحضور المبكر ومساندة اللاعبين.',
    date: 'أمس',
    category: 'تذاكر',
    readTime: '2 دقيقة',
    imageBg: 'from-amber-950 to-slate-900',
  },
  {
    id: 'n-3',
    title: 'أكاديمية نادي الرجاء العراقي تتوج بلقب دوري الناشئين',
    summary: 'واصلت مدرسة الكرة بنادي الرجاء العراقي إنجازاتها المشرفة بفوز فريق الناشئين ببطولة الدوري دون أي خسارة طوال الموسم.',
    content: 'توج فريق ناشئي نادي الرجاء العراقي بكأس البطولة وسط احتفالية كبيرة بملعب النادي، مؤكدين ريادة أكاديمية الرجاء في صقل المواهب الكروية الشابة.',
    date: 'منذ 3 أيام',
    category: 'أكاديمية',
    readTime: '4 دقائق',
    imageBg: 'from-blue-950 to-slate-900',
  },
];

export const CLUB_PRODUCTS: Product[] = [
  {
    id: 'p-1',
    name: 'تيشرت أساسي 2026 - نادي الرجاء العراقي',
    category: 'أطقم',
    price: 35000,
    originalPrice: 40000,
    tag: 'الأكثر طلباً',
    imagePlaceholder: 'bg-gradient-to-br from-[#e30613] to-[#80040b]',
    colors: ['#e30613', '#ffffff', '#070d1a'],
  },
  {
    id: 'p-2',
    name: 'تيشرت احتياطي 2026 - نادي الرجاء العراقي',
    category: 'أطقم',
    price: 35000,
    imagePlaceholder: 'bg-gradient-to-br from-slate-200 to-slate-400',
    colors: ['#ffffff', '#e30613'],
  },
  {
    id: 'p-3',
    name: 'شال نادي الرجاء العراقي الرسمي',
    category: 'شالات',
    price: 12000,
    tag: 'جديد',
    imagePlaceholder: 'bg-gradient-to-r from-[#e30613] via-[#070d1a] to-[#d4af37]',
    colors: ['#e30613', '#070d1a'],
  },
  {
    id: 'p-4',
    name: 'قبعة نادي الرجاء العراقي المطرزة',
    category: 'إكسسوارات',
    price: 10000,
    imagePlaceholder: 'bg-gradient-to-br from-[#0c1424] to-[#121c2e]',
    colors: ['#0c1424', '#e30613'],
  },
];

export const KEY_PLAYERS: Player[] = [
  { number: 1, name: 'جلال حسن', position: 'حارس', nationality: '🇮🇶 العراق' },
  { number: 4, name: 'سعد ناطق', position: 'دفاع', nationality: '🇮🇶 العراق' },
  { number: 7, name: 'محمد قاسم', position: 'وسط', nationality: '🇮🇶 العراق', goals: 6 },
  { number: 9, name: 'أيمن حسين', position: 'هجوم', nationality: '🇮🇶 العراق', goals: 18 },
  { number: 10, name: 'علي جاسم', position: 'وسط', nationality: '🇮🇶 العراق', goals: 9 },
  { number: 11, name: 'إبراهيم بايش', position: 'هجوم', nationality: '🇮🇶 العراق', goals: 8 },
];

export const CLUB_ANTHEM_LYRICS = [
  'رجاء العراق يا فخر البطولة والريادة',
  'أصحاب العزيمة في الملاعب سادة',
  'حيوا الرجاء رافع الرايات',
  'تاريخنا أمجاد وانتصارات',
  'يا رجاء العز عالي شأنك ومقامك',
  'كل القلوب تنبض بنصرك وسلامك',
];
