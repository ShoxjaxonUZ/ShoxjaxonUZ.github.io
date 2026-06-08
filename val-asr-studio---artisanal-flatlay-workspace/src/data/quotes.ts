export interface Quote {
  text: string;
  author: string;
  category: 'Tasavvuf' | 'Hikmat' | 'Sokinlik' | 'She’riyat' | 'Modern';
}

export const QUOTE_COLLECTION: Quote[] = [
  {
    text: "Qayg‘uga botganingda tushkunlikka tushma. Eng qimmat xazinalar eng qorong‘i g‘orlarda yashiringan bo‘ladi. Hayotingdagi har bir sinov seni kuchliroq va dono qilish uchun kelgan.",
    author: "val_asr_studio",
    category: "Hikmat"
  },
  {
    text: "Shikoyat qilma, sabr qil. Sabr achchiqdir, ammo uning mevasi shakar kabi totlidir. Yo‘lning boshi qorong‘ulik bo‘lsa, oxiri albatta nur bo‘ladi.",
    author: "Jaloliddin Rumiy",
    category: "Tasavvuf"
  },
  {
    text: "Qaerda singan ko‘ngil bo‘lsa, Tangrining nuri va daldasi o‘sha erga tushadi. Yuraging jarohatlanganda g‘am chekma, chunki nur aynan shu teshiklardan kiradi.",
    author: "Jaloliddin Rumiy",
    category: "Tasavvuf"
  },
  {
    text: "Yaxshi so‘z — bog‘-u bo‘stondir. Agar kishiga shirin so‘z aytilsa, uning qalbi gullar kabi ochilur, gina va g‘uborlar tarqalib ketur.",
    author: "Alisher Navoiy",
    category: "Hikmat"
  },
  {
    text: "Ushbu kichik oqshomda dilingni g‘amga berma, chunki har g‘am ortidan keluvchi xursandchilik buyukdir. Taqdirdan rozi bo‘lshing — chinakam boylikdir.",
    author: "Bobur Mirzo",
    category: "She’riyat"
  },
  {
    text: "Hayot nima? U shunchaki bir lahzadan iboratdir. Kelajak hayol, o‘tmish esa tush. Faqatgina ushbu soniya haqiqiydir. Uni go‘zallik va tinchlik bilan to‘ldir.",
    author: "Umar Xayyom",
    category: "Sokinlik"
  },
  {
    text: "Asrab qoling qisqa umrda dil sadoqatini, zero hamma narsa vaqt e’tiboridan tez o‘tadi, ammo qalbdagi mehru shafqat mangu qoladi.",
    author: "Ibn Sino",
    category: "Hikmat"
  },
  {
    text: "Tashqaridagi to‘fonga aldanmang, qalb xonangizni sokin tuting. Cho‘kayotgan kema suvdagi to‘lqinlar tufayli emas, o‘z ichiga suv kirgani uchun halok bo‘ladi.",
    author: "Dono hikmat",
    category: "Sokinlik"
  },
  {
    text: "Do not feel lonely, the entire universe is inside you. What you seek is seeking you. Your task is not to seek for love, but merely to seek and find all the barriers.",
    author: "Rumi",
    category: "Modern"
  },
  {
    text: "To live is the rarest thing in the world. Most people exist, that is all. In the depth of winter, I finally learned that there was in me an invincible summer.",
    author: "Albert Camus",
    category: "Modern"
  }
];
