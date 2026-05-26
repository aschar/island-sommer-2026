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
    { id:'vest', name:'Vestmannaeyjar', dates:'15.–17. Juli',         emoji:'🌊', color:'#1a4a6a', light:'#d6eaf8' },
    { id:'laug', name:'Laugarás',       dates:'17.–20. Juli',         emoji:'♨️', color:'#1a4a2a', light:'#d5f5e3' },
    { id:'sued', name:'Südküste',       dates:'20.–23. Juli',         emoji:'🏔', color:'#4a2a1a', light:'#fdebd0' },
    { id:'haug', name:'Hauganes',       dates:'23.–27. Juli',         emoji:'🐋', color:'#2a1a4a', light:'#e8daef' },
    { id:'reyk', name:'Reykjavík',      dates:'27. Juli – 3. August', emoji:'🏙', color:'#0e3a3a', light:'#d1f2eb' },
  ],

  categories: ['🎯 Aktivität','🏠 Unterkunft','🚗 Transport','⛽ Benzin','🛒 Einkauf','🍽️ Essen & Trinken','🛍️ Shopping','📦 Sonstiges'],

  start_date: new Date('2026-07-15'),
  end_date:   new Date('2026-08-03'),
};
