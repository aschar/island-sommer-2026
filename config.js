const TRIP = {
  name:     'Island Sommer 2026',
  dates:    '15. Juli – 3. August 2026',
  flag:     '🇮🇸',
  currency: 'CHF',
  supabase_url: 'https://uyrobughcarayzswecza.supabase.co',
  supabase_key: 'sb_publishable_7CBVAbJ0_nXLsn8AOnSt9g_IN7m8ofG',

  people: ['Adrian','Cristina','Claudio','Patrizia','Peter','Carmen','Lorean','Melanie','Mauro'],
  people_late: ['Adrian','Cristina','Claudio','Patrizia','Peter','Carmen'], // from 28 July

  phases: [
    { id:'vest', name:'Vestmannaeyjar', dates:'15.–17. Juli · 🛏 2 Nächte',           emoji:'🌊', color:'#1a4a6a', light:'#d6eaf8',
      booking:'https://secure.booking.com/confirmation.fr.html?label=fr-ch-booking-desktop-pNsapuasFxmB0Q2VQRL5ewS652796014221%3Apl%3Ata%3Ap1%3Ap2%3Aac%3Aap%3Aneg%3Afi%3Atikwd-65526620%3Alp9188707%3Ali%3Adec%3Adm&sid=7d548b277a6abe1e3643e6f8b8675366&gclid=CjwKCAjw5s_QBhAdEiwADD_gBpwUEKqp0Kllmws_z48_gqnr0UMQGd0klIKGmcc8ZPO8Q2dd8bOkJRoCTs0QAvD_BwE&aid=2311236&auth_key=KGp8ioVXnd1iBXtM&source=mytrips' },
    { id:'laug', name:'Laugarás',       dates:'17.–20. Juli · 🛏 3 Nächte',           emoji:'♨️', color:'#1a4a2a', light:'#d5f5e3' },
    { id:'sued', name:'Südküste',       dates:'20.–23. Juli · 🛏 3 Nächte',           emoji:'🏔', color:'#4a2a1a', light:'#fdebd0',
      booking:'https://www.booking.com/hotel/is/house-in-fjordur-in-lon-south-east-of-iceland-birta-rentals.fr.html' },
    { id:'haug', name:'Hauganes',       dates:'23.–27. Juli · 🛏 4 Nächte',           emoji:'🐋', color:'#2a1a4a', light:'#e8daef' },
    { id:'reyk', name:'Reykjavík',      dates:'27. Juli – 3. August · 🛏 7 Nächte',   emoji:'🏙', color:'#0e3a3a', light:'#d1f2eb' },
  ],

  categories: ['🎯 Aktivität','🏠 Unterkunft','🚗 Transport','⛽ Benzin','🛒 Einkauf','🍽️ Essen & Trinken','🛍️ Shopping','📦 Sonstiges'],

  start_date: new Date('2026-07-15'),
  end_date:   new Date('2026-08-03'),
};
