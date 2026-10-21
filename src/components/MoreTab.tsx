import React, { useRef, useState } from 'react';
import {useMutation} from 'convex/react';
import {clubApi} from '../backend/api';
import {errorMessage} from '../backend/errors';
import { useContent } from '../backend/useContent';
import initialContent from '../data/initialContent.json';
import { LionLogo } from './LionLogo';
import { OFFICIAL_SOCIAL_LINKS, openSocialPlatform } from '../utils/socialLinks';
import {
  Trophy,
  Users,
  MapPin,
  BarChart3,
  FileText,
  Send,
  Phone,
  Settings,
  Shield,
  X,
  CheckCircle,
  Bell,
  Moon,
  Globe,
  Share2,
} from 'lucide-react';

interface MoreTabProps {
  onBack?: () => void;
  onOpenMenu?: () => void;
  onOpenStore?: () => void;
  onOpenNews?: () => void;
  onOpenMedia?: () => void;
  onOpenProfile?: () => void;
  onOpenAnthem?: () => void;
  onOpenTickets?: () => void;
  onOpenAcademy?: () => void;
  onLogout: () => void;
  userName?: string;
  userRole?: string;
  cartCount?: number;
}

export const MoreTab: React.FC<MoreTabProps> = ({
  onBack,
  onOpenMenu,
  onOpenStore,
  onOpenNews,
  onOpenMedia,
  onOpenProfile,
  onOpenAnthem,
  onOpenTickets,
  onOpenAcademy,
  onLogout,
  userName = 'سلطان الشامسي',
  userRole = 'مشجع مخلص',
}) => {
  // Modal state for the 9 menu links
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const contact = useContent('settings', initialContent.settings)[0];
  const [formSubmitted, setFormSubmitted] = useState(false);
  const submitRequest=useMutation(clubApi.submissions.submit);
  const requestNonce=useRef(crypto.randomUUID());
  const [requestError,setRequestError]=useState('');
  const [requestBusy,setRequestBusy]=useState(false);
  const [requestReference,setRequestReference]=useState('');
  const sendRequest=async(e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();const form=new FormData(e.currentTarget);setRequestBusy(true);setRequestError('');
    try{const row=await submitRequest({kind:'contact',nonce:requestNonce.current,data:Object.fromEntries(form)});setRequestReference(row._id.slice(-8).toUpperCase());setFormSubmitted(true);requestNonce.current=crypto.randomUUID();}
    catch(error){setRequestError(errorMessage(error));}finally{setRequestBusy(false);}
  };
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleMenuClick = (key: string) => {
    setActiveModal(key);
  };

  return (
    <div id="more-screen" className="screen active">
      {/* الترويسة العلوية */}
      <div className="screen-header">
        <i
          className="fa-solid fa-chevron-right back-icon"
          onClick={onBack}
          role="button"
          title="رجوع"
        ></i>
        <h2 className="header-title">المزيد</h2>
        <i
          className="fa-solid fa-bars menu-icon"
          onClick={onOpenMenu}
          role="button"
          title="القائمة"
        ></i>
      </div>

      <div className="more-content">
        {/* بطاقة الملف الشخصي للمشجع */}
        <div
          className="user-profile-card"
          onClick={onOpenProfile}
          role="button"
          tabIndex={0}
        >
          <div className="w-[55px] h-[55px] rounded-full bg-[#121c2e] border-2 border-[var(--primary-red)] flex items-center justify-center overflow-hidden shrink-0">
            <LionLogo size={36} />
          </div>
          <div className="user-info">
            <h3 className="user-name">نادي الرجاء العراقي</h3>
            <span className="user-badge">{userRole} · {userName}</span>
          </div>
        </div>

        {/* شعار النادي */}
        <div className="club-slogan-box">
          <p>معاً دائماً... جمهورنا هو قوتنا الحقيقية</p>
          <span className="slogan-hashtag">#الرجاء_العراقي</span>
        </div>

        {/* قائمة الخدمات والروابط */}
        <div className="menu-list">
          {/* 1. عن النادي */}
          <button
            type="button"
            className="menu-item"
            onClick={() => handleMenuClick('about')}
          >
            <div className="menu-item-right">
              <div className="menu-icon-box">
                <i className="fa-solid fa-house"></i>
              </div>
              <span>عن النادي</span>
            </div>
            <i className="fa-solid fa-chevron-left menu-arrow"></i>
          </button>

          {/* 2. الإدارة */}
          <button
            type="button"
            className="menu-item"
            onClick={() => handleMenuClick('management')}
          >
            <div className="menu-item-right">
              <div className="menu-icon-box">
                <i className="fa-solid fa-users-gear"></i>
              </div>
              <span>الإدارة</span>
            </div>
            <i className="fa-solid fa-chevron-left menu-arrow"></i>
          </button>

          {/* 4. البطولات */}
          <button
            type="button"
            className="menu-item"
            onClick={() => handleMenuClick('trophies')}
          >
            <div className="menu-item-right">
              <div className="menu-icon-box">
                <i className="fa-solid fa-trophy"></i>
              </div>
              <span>البطولات</span>
            </div>
            <i className="fa-solid fa-chevron-left menu-arrow"></i>
          </button>

          {/* 5. الإحصائيات */}
          <button
            type="button"
            className="menu-item"
            onClick={() => handleMenuClick('stats')}
          >
            <div className="menu-item-right">
              <div className="menu-icon-box">
                <i className="fa-solid fa-chart-column"></i>
              </div>
              <span>الإحصائيات</span>
            </div>
            <i className="fa-solid fa-chevron-left menu-arrow"></i>
          </button>

          {/* 7. تقديم طلب */}
          <button
            type="button"
            className="menu-item"
            onClick={() => handleMenuClick('request')}
          >
            <div className="menu-item-right">
              <div className="menu-icon-box">
                <i className="fa-solid fa-hand-pointer"></i>
              </div>
              <span>تقديم طلب</span>
            </div>
            <i className="fa-solid fa-chevron-left menu-arrow"></i>
          </button>

          {/* 8. التواصل معنا */}
          <button
            type="button"
            className="menu-item"
            onClick={() => handleMenuClick('contact')}
          >
            <div className="menu-item-right">
              <div className="menu-icon-box">
                <i className="fa-solid fa-phone"></i>
              </div>
              <span>التواصل معنا</span>
            </div>
            <i className="fa-solid fa-chevron-left menu-arrow"></i>
          </button>

          {/* 9. الإعدادات */}
          <button
            type="button"
            className="menu-item"
            onClick={() => handleMenuClick('settings')}
          >
            <div className="menu-item-right">
              <div className="menu-icon-box">
                <i className="fa-solid fa-gear"></i>
              </div>
              <span>الإعدادات</span>
            </div>
            <i className="fa-solid fa-chevron-left menu-arrow"></i>
          </button>
        </div>

        {/* زر تسجيل الخروج */}
        <button
          type="button"
          className="logout-btn"
          onClick={onLogout}
        >
          تسجيل الخروج
        </button>

        {/* روابط التواصل الاجتماعي الرسمية لنادي الرجاء العراقي */}
        <div className="social-links-footer">
          {OFFICIAL_SOCIAL_LINKS.map((social) => (
            <a
              key={social.id}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => openSocialPlatform(e, social)}
              title={`${social.nameAr} - نادي الرجاء العراقي`}
              aria-label={social.nameAr}
              className={social.id}
            >
              <i className={social.iconClass}></i>
            </a>
          ))}
        </div>
      </div>

      {/* مودال الخدمات التفاعلي */}
      {activeModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-[#0a1120] border border-white/10 rounded-3xl p-5 text-right text-white relative shadow-2xl max-h-[85vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[var(--primary-red)]/20 text-[var(--primary-red)] flex items-center justify-center text-sm">
                  {activeModal === 'about' && <Shield className="w-4 h-4" />}
                  {activeModal === 'management' && <Users className="w-4 h-4" />}
                  {activeModal === 'stadium' && <MapPin className="w-4 h-4" />}
                  {activeModal === 'trophies' && <Trophy className="w-4 h-4" />}
                  {activeModal === 'stats' && <BarChart3 className="w-4 h-4" />}
                  {activeModal === 'documents' && <FileText className="w-4 h-4" />}
                  {activeModal === 'request' && <Send className="w-4 h-4" />}
                  {activeModal === 'contact' && <Phone className="w-4 h-4" />}
                  {activeModal === 'settings' && <Settings className="w-4 h-4" />}
                </div>
                <h3 className="font-black text-sm text-white">
                  {activeModal === 'about' && 'عن نادي الرجاء العراقي'}
                  {activeModal === 'management' && 'مجلس الإدارة والكادر الفني'}
                  {activeModal === 'stadium' && 'الملعب والمرافق الرياضية'}
                  {activeModal === 'trophies' && 'سجل البطولات والإنجازات'}
                  {activeModal === 'stats' && 'إحصائيات الموسم الرياضي'}
                  {activeModal === 'documents' && 'اللوائح والوثائق الرسمية'}
                  {activeModal === 'request' && 'تقديم طلب أو مقترح'}
                  {activeModal === 'contact' && 'التواصل الرسمي مع النادي'}
                  {activeModal === 'settings' && 'إعدادات التطبيق'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveModal(null);
                  setFormSubmitted(false);
                }}
                className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-[#8c96aa] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body: 1. عن النادي */}
            {activeModal === 'about' && (
              <div className="space-y-3 text-xs leading-relaxed text-[#c3cad9]">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#121c2e] border border-white/10 flex items-center justify-center mb-2">
                  <LionLogo size={42} />
                </div>
                <p className="font-bold text-white text-center text-sm">
                  نادي الرجاء العراقي الرياضي
                </p>
                <p>
                  نادي الرجاء العراقي صرح رياضي رائد يجمع بين التفوق في المنافسات وبناء أجيال من الرياضيين المتميزين بالروح العالية والانضباط.
                </p>
                <div className="bg-[#121c2e] p-3 rounded-xl border border-white/5 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-[#8c96aa]">اللقب الرسمي:</span>
                    <span className="font-bold text-[var(--primary-red)]">فرسان الرافدين</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8c96aa]">الألوان الأساسية:</span>
                    <span className="font-bold text-white">الأحمر والأسود والأبيض</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8c96aa]">الملعب:</span>
                    <span className="font-bold text-white">ملعب الشعب الدولي</span>
                  </div>
                </div>
              </div>
            )}

            {/* Modal Body: 2. الإدارة */}
            {activeModal === 'management' && (
              <div className="space-y-2 text-xs">
                <p className="text-[#8c96aa] mb-2">
                  مجلس إدارة النادي والإشراف العام على الأنشطة الرياضية:
                </p>
                {[
                  { role: 'رئيس مجلس الإدارة', name: 'سعادة راشد المنصوري' },
                  { role: 'نائب الرئيس', name: 'سعادة خالد العامري' },
                  { role: 'المدير التنفيذي', name: 'د. طارق الحوسني' },
                  { role: 'المشرف العام على الفريق', name: 'كابتن إسماعيل مطر' },
                  { role: 'المدير الفني الأول', name: 'المدرب أرنو بوسيكي' },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-[#121c2e] border border-white/5 flex justify-between items-center"
                  >
                    <div>
                      <div className="font-bold text-white">{item.name}</div>
                      <div className="text-[10px] text-[#8c96aa]">{item.role}</div>
                    </div>
                    <i className="fa-solid fa-circle-check text-emerald-400 text-xs"></i>
                  </div>
                ))}
              </div>
            )}

            {/* Modal Body: 3. الملعب والمرافق */}
            {activeModal === 'stadium' && (
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-[#121c2e] rounded-xl border border-white/5 space-y-1.5">
                  <h4 className="font-bold text-white text-sm">استاد آل نهيان الدولي</h4>
                  <p className="text-[#8c96aa]">الملعب الرئيسي لقلعة العنابي، مجهز بأحدث معايير الفيفا الدولية وتقنية التبريد الذكية.</p>
                  <div className="grid grid-cols-2 gap-2 pt-2 text-[11px]">
                    <div className="bg-black/30 p-2 rounded-lg">
                      <span className="text-[#8c96aa] block">السعة الجماهيرية:</span>
                      <span className="font-bold text-white">15,000 مقعد</span>
                    </div>
                    <div className="bg-black/30 p-2 rounded-lg">
                      <span className="text-[#8c96aa] block">نوع الأرضية:</span>
                      <span className="font-bold text-white">عشب هجين طبيعي</span>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-[#121c2e] rounded-xl border border-white/5 space-y-1 text-[#c3cad9]">
                  <h5 className="font-bold text-white">المرافق الملحقة:</h5>
                  <p>• مجمع المسابح الأولمبية والصالة الرياضية المغلقة</p>
                  <p>• عيادة النادي للتأهيل الطبي والطب الرياضي</p>
                  <p>• متجر النادي والمتحف التاريخي للكؤوس</p>
                </div>
              </div>
            )}

            {/* Modal Body: 4. البطولات */}
            {activeModal === 'trophies' && (
              <div className="space-y-2 text-xs">
                {[
                  { title: 'دوري المحترفين', count: '4 ألقاب', years: '1999, 2001, 2005, 2010' },
                  { title: 'كأس رئيس الدولة', count: '2 ألقاب', years: '2000, 2017' },
                  { title: 'كأس السوبر', count: '3 ألقاب', years: '2002, 2011, 2018' },
                  { title: 'كأس الرابطة للمحترفين', count: '2 ألقاب', years: '2016, 2018' },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-[#121c2e] rounded-xl border border-white/5 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <Trophy className="w-5 h-5 text-[#ffd700]" />
                      <div>
                        <div className="font-bold text-white">{item.title}</div>
                        <div className="text-[10px] text-[#8c96aa]">{item.years}</div>
                      </div>
                    </div>
                    <span className="font-black text-xs text-[var(--primary-red)] bg-[var(--primary-red)]/10 px-2 py-0.5 rounded-full">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Modal Body: 5. الإحصائيات */}
            {activeModal === 'stats' && (
              <div className="space-y-2.5 text-xs">
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="p-3 bg-[#121c2e] rounded-xl border border-white/5">
                    <span className="text-[11px] text-[#8c96aa] block">الانتصارات</span>
                    <span className="text-lg font-black text-emerald-400">14 فوز</span>
                  </div>
                  <div className="p-3 bg-[#121c2e] rounded-xl border border-white/5">
                    <span className="text-[11px] text-[#8c96aa] block">الأهداف المسجلة</span>
                    <span className="text-lg font-black text-white">41 هدف</span>
                  </div>
                  <div className="p-3 bg-[#121c2e] rounded-xl border border-white/5">
                    <span className="text-[11px] text-[#8c96aa] block">الشباك النظيفة</span>
                    <span className="text-lg font-black text-[#ffd700]">7 مباريات</span>
                  </div>
                  <div className="p-3 bg-[#121c2e] rounded-xl border border-white/5">
                    <span className="text-[11px] text-[#8c96aa] block">نسبة الاستحواذ</span>
                    <span className="text-lg font-black text-cyan-400">58.4%</span>
                  </div>
                </div>
              </div>
            )}

            {/* Modal Body: 6. الوثائق والعقود */}
            {activeModal === 'documents' && (
              <div className="space-y-2 text-xs">
                {[
                  { name: 'ميثاق جماهير نادي الرجاء العراقي 2026', size: '1.4 MB' },
                  { name: 'لائحة عضوية النادي وبطاقة المشجع', size: '820 KB' },
                  { name: 'شروط استخدام المرافق والملاعب الفرعية', size: '2.1 MB' },
                  { name: 'سياسة الخصوصية وحماية بيانات المشجعين', size: '450 KB' },
                ].map((doc, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-[#121c2e] rounded-xl border border-white/5 flex items-center justify-between hover:bg-[#18253d] transition-colors cursor-pointer"
                    onClick={() => showToast(`جاري تنزيل: ${doc.name}`)}
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-cyan-400" />
                      <div>
                        <div className="font-bold text-white">{doc.name}</div>
                        <div className="text-[10px] text-[#8c96aa]">{doc.size} · PDF</div>
                      </div>
                    </div>
                    <i className="fa-solid fa-download text-xs text-[#8c96aa]"></i>
                  </div>
                ))}
              </div>
            )}

            {/* Modal Body: 7. تقديم طلب */}
            {activeModal === 'request' && (
              <div>
                {formSubmitted ? (
                  <div className="py-6 text-center space-y-2">
                    <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
                    <h4 className="font-bold text-white text-sm">تم إرسال طلبك بنجاح!</h4>
                    <p className="text-xs text-[#8c96aa]">
                      رقم المتابعة: {requestReference}
                    </p>
                    <button
                      type="button"
                      onClick={() => setFormSubmitted(false)}
                      className="mt-3 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold"
                    >
                      إرسال طلب آخر
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={sendRequest}
                    className="space-y-3 text-xs"
                  >
                    <div>
                      <label className="block text-[#8c96aa] mb-1 font-semibold">نوع الطلب</label>
                      <select name="requestType" className="w-full bg-[#121c2e] border border-white/10 rounded-xl p-2.5 text-white">
                        <option>عضوية جماهيرية جديدة</option>
                        <option>استفسار عن التذاكر والمقاعد</option>
                        <option>اقتراح تطويري للنادي</option>
                        <option>طلب تجارب أداء في الأكاديمية</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[#8c96aa] mb-1 font-semibold">تفاصيل الطلب</label>
                      <textarea
                        name="details"
                        minLength={5}
                        required
                        rows={3}
                        placeholder="اكتب تفاصيل طلبك هنا..."
                        className="w-full bg-[#121c2e] border border-white/10 rounded-xl p-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[var(--primary-red)]"
                      ></textarea>
                    </div>
                    {requestError&&<p role="alert" className="text-red-300">{requestError}</p>}
                    <button
                      type="submit" disabled={requestBusy}
                      className="w-full py-2.5 bg-[var(--primary-red)] hover:bg-[#c20510] text-white rounded-xl font-bold transition-colors"
                    >
                      إرسال الطلب لإدارة النادي
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Modal Body: 8. التواصل معنا */}
            {activeModal === 'contact' && (
              <div className="space-y-2.5 text-xs">
                <div className="p-3 bg-[#121c2e] rounded-xl border border-white/5 space-y-1">
                  <span className="text-[#8c96aa] block">الخط الساخن لخدمة الجماهير</span>
                  <a href={`tel:${contact?.phone || ''}`} className="font-bold text-sm text-white flex items-center justify-between">
                    <span dir="ltr">{contact?.phone}</span>
                    <i className="fa-solid fa-phone text-emerald-400" aria-hidden="true"></i>
                  </a>
                </div>
                <div className="p-3 bg-[#121c2e] rounded-xl border border-white/5 space-y-1">
                  <span className="text-[#8c96aa] block">البريد الإلكتروني الرسمي</span>
                  <a href={`mailto:${contact?.email || ''}`} className="font-bold text-sm text-white flex items-center justify-between">
                    <span dir="ltr">{contact?.email}</span>
                    <i className="fa-solid fa-envelope text-cyan-400" aria-hidden="true"></i>
                  </a>
                </div>
                <div className="p-3 bg-[#121c2e] rounded-xl border border-white/5 space-y-1">
                  <span className="text-[#8c96aa] block">الموقع الجغرافي للنادي</span>
                  <div className="font-bold text-xs text-white">
                    {contact?.address}
                  </div>
                </div>
              </div>
            )}

            {/* Modal Body: 9. الإعدادات */}
            {activeModal === 'settings' && (
              <div className="space-y-2 text-xs">
                <div className="p-3 bg-[#121c2e] rounded-xl border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-[#ffd700]" />
                    <span className="text-white font-bold">تنبيهات المباريات والأهداف</span>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 accent-[var(--primary-red)] rounded"
                  />
                </div>
                <div className="p-3 bg-[#121c2e] rounded-xl border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-cyan-400" />
                    <span className="text-white font-bold">لغة التطبيق</span>
                  </div>
                  <span className="text-xs text-[var(--primary-red)] font-bold">العربية</span>
                </div>
                <div className="p-3 bg-[#121c2e] rounded-xl border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Moon className="w-4 h-4 text-purple-400" />
                    <span className="text-white font-bold">المظهر الداكن (Dark Mode)</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold">مفعّل تلقائياً</span>
                </div>
                <div className="p-3 bg-[#121c2e] rounded-xl border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-[#8c96aa]" />
                    <span className="text-white font-bold">مشاركة التطبيق</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => showToast('تم نسخ رابط التطبيق بنجاح')}
                    className="text-[10px] bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-lg text-white font-bold"
                  >
                    نسخ الرابط
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Toast alert */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-110 bg-[#121c2e] border border-white/20 text-white text-xs font-bold px-4 py-2 rounded-full shadow-2xl animate-in fade-in slide-in-from-bottom-2">
          {toastMessage}
        </div>
      )}
    </div>
  );
};
