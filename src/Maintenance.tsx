import './maintenance.css';
export default function Maintenance(){return <main className="maintenance" dir="rtl" aria-labelledby="maintenance-title">
  <header className="maintenance-brand"><img src={import.meta.env.BASE_URL+'rajaa-logo.png'} alt="شعار نادي الرجاء العراقي"/><span>نادي الرجاء العراقي<small>المنصة الرسمية للنادي</small></span></header>
  <section className="maintenance-card">
    <span className="maintenance-status"><i aria-hidden="true"/>صيانة مؤقتة</span>
    <div className="maintenance-art" role="img" aria-label="قفل يرمز إلى توقف النظام مؤقتًا للصيانة">
      <div className="maintenance-orbit"/><svg viewBox="0 0 240 240" fill="none" aria-hidden="true"><defs><linearGradient id="lock-gold" x1="60" y1="40" x2="180" y2="205" gradientUnits="userSpaceOnUse"><stop stopColor="#fff0b9"/><stop offset=".5" stopColor="#e5bd60"/><stop offset="1" stopColor="#9c6d27"/></linearGradient></defs><path d="M78 108V79a42 42 0 0 1 84 0v29" stroke="url(#lock-gold)" strokeWidth="16" strokeLinecap="round"/><rect x="51" y="101" width="138" height="105" rx="28" fill="#111e33" stroke="url(#lock-gold)" strokeWidth="3"/><path d="M61 123c0-8 6-14 14-14h90" stroke="#fff0b9" strokeOpacity=".25" strokeWidth="2" strokeLinecap="round"/><circle cx="120" cy="146" r="12" fill="url(#lock-gold)"/><path d="M120 154v18" stroke="#e5bd60" strokeWidth="9" strokeLinecap="round"/><path d="m190 63 5 9 10 2-7 7 1 10-9-5-9 5 2-10-7-7 10-2z" fill="#e5bd60"/><circle cx="44" cy="86" r="4" fill="#e5bd60" fillOpacity=".65"/></svg>
    </div>
    <p className="maintenance-eyebrow">نرتّب التفاصيل… حتى نرجعلكم بأفضل صورة</p>
    <h1 id="maintenance-title">النظام قيد الصيانة</h1>
    <p className="maintenance-description">نعمل حاليًا على تحديث خدمات النادي وتحسين تجربتكم.<br/>التطبيق ولوحة الإدارة متوقفان مؤقتًا، ونرجعلكم قريبًا.</p>
    <div className="maintenance-divider"/><p className="maintenance-thanks">شكرًا لصبركم وتفهّمكم</p>
  </section>
  <footer className="maintenance-footer">نادي الرجاء العراقي <span aria-hidden="true">·</span> نلتقي قريبًا</footer>
</main>}
