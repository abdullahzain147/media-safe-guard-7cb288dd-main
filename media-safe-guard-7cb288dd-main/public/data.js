// Quran Database

// 114 Surahs metadata
const SURAH_LIST = [
  { "number": 1, "arabic": "سُورَةُ الْفَاتِحَةِ", "transliteration": "Al-Fatiha", "translation": "The Opening", "urduName": "الفاتحہ", "verses": 7, "type": "Meccan" },
  { "number": 2, "arabic": "سُورَةُ الْبَقَرَةِ", "transliteration": "Al-Baqarah", "translation": "The Cow", "urduName": "البقرہ", "verses": 286, "type": "Medinan" },
  { "number": 3, "arabic": "سُورَةُ آلِ عِمْرَانَ", "transliteration": "Al-Imran", "translation": "The Family of Imran", "urduName": "آل عمران", "verses": 200, "type": "Medinan" },
  { "number": 4, "arabic": "سُورَةُ النِّسَاءِ", "transliteration": "An-Nisa", "translation": "The Women", "urduName": "النساء", "verses": 176, "type": "Medinan" },
  { "number": 5, "arabic": "سُورَةُ الْمَائِدَةِ", "transliteration": "Al-Ma'idah", "translation": "The Table Spread", "urduName": "المائدہ", "verses": 120, "type": "Medinan" },
  { "number": 6, "arabic": "سُورَةُ الأَنْعَامِ", "transliteration": "Al-An'am", "translation": "The Cattle", "urduName": "الانعام", "verses": 165, "type": "Meccan" },
  { "number": 7, "arabic": "سُورَةُ الأَعْرَافِ", "transliteration": "Al-A'raf", "translation": "The Heights", "urduName": "الاعراف", "verses": 206, "type": "Meccan" },
  { "number": 8, "arabic": "سُورَةُ الأَنْفَالِ", "transliteration": "Al-Anfal", "translation": "The Spoils of War", "urduName": "الانفال", "verses": 75, "type": "Medinan" },
  { "number": 9, "arabic": "سُورَةُ التَّوْبَةِ", "transliteration": "At-Tawbah", "translation": "The Repentance", "urduName": "التوبہ", "verses": 129, "type": "Medinan" },
  { "number": 10, "arabic": "سُورَةُ يُونُسَ", "transliteration": "Yunus", "translation": "Jonah", "urduName": "یونس", "verses": 109, "type": "Meccan" },
  { "number": 11, "arabic": "سُورَةُ هُودٍ", "transliteration": "Hud", "translation": "Hud", "urduName": "ہود", "verses": 123, "type": "Meccan" },
  { "number": 12, "arabic": "سُورَةُ يُوسُفَ", "transliteration": "Yusuf", "translation": "Joseph", "urduName": "یوسف", "verses": 111, "type": "Meccan" },
  { "number": 13, "arabic": "سُورَةُ الرَّعْدِ", "transliteration": "Ar-Ra'd", "translation": "The Thunder", "urduName": "الرعد", "verses": 43, "type": "Medinan" },
  { "number": 14, "arabic": "سُورَةُ إِبْرَاهِيمَ", "transliteration": "Ibrahim", "translation": "Abraham", "urduName": "ابراہیم", "verses": 52, "type": "Meccan" },
  { "number": 15, "arabic": "سُورَةُ الْحِجْرِ", "transliteration": "Al-Hijr", "translation": "The Rocky Tract", "urduName": "الحجر", "verses": 99, "type": "Meccan" },
  { "number": 16, "arabic": "سُورَةُ النَّحْلِ", "transliteration": "An-Nahl", "translation": "The Bee", "urduName": "النحل", "verses": 128, "type": "Meccan" },
  { "number": 17, "arabic": "سُورَةُ الإِسْرَاءِ", "transliteration": "Al-Isra", "translation": "The Night Journey", "urduName": "بنی اسرائیل", "verses": 111, "type": "Meccan" },
  { "number": 18, "arabic": "سُورَةُ الْكَهْفِ", "transliteration": "Al-Kahf", "translation": "The Cave", "urduName": "الکہف", "verses": 110, "type": "Meccan" },
  { "number": 19, "arabic": "سُورَةُ مَرْيَمَ", "transliteration": "Maryam", "translation": "Mary", "urduName": "مریم", "verses": 98, "type": "Meccan" },
  { "number": 20, "arabic": "سُورَةُ طه", "transliteration": "Taha", "translation": "Ta-Ha", "urduName": "طٰہٰ", "verses": 135, "type": "Meccan" },
  { "number": 21, "arabic": "سُورَةُ الأَنْبِيَاءِ", "transliteration": "Al-Anbiya", "translation": "The Prophets", "urduName": "الانبیاء", "verses": 112, "type": "Meccan" },
  { "number": 22, "arabic": "سُورَةُ الْحَجِّ", "transliteration": "Al-Hajj", "translation": "The Pilgrimage", "urduName": "الحج", "verses": 78, "type": "Medinan" },
  { "number": 23, "arabic": "سُورَةُ الْمُؤْمِنُونَ", "transliteration": "Al-Mu'minun", "translation": "The Believers", "urduName": "المؤمنون", "verses": 118, "type": "Meccan" },
  { "number": 24, "arabic": "سُورَةُ النُّورِ", "transliteration": "An-Nur", "translation": "The Light", "urduName": "النور", "verses": 64, "type": "Medinan" },
  { "number": 25, "arabic": "سُورَةُ الْفُرْقَانِ", "transliteration": "Al-Furqan", "translation": "The Criterion", "urduName": "الفرقان", "verses": 77, "type": "Meccan" },
  { "number": 26, "arabic": "سُورَةُ الشُّعَرَاءِ", "transliteration": "Ash-Shu'ara", "translation": "The Poets", "urduName": "الشعراء", "verses": 227, "type": "Meccan" },
  { "number": 27, "arabic": "سُورَةُ النَّمْلِ", "transliteration": "An-Naml", "translation": "The Ant", "urduName": "النمل", "verses": 93, "type": "Meccan" },
  { "number": 28, "arabic": "سُورَةُ الْقَصَصِ", "transliteration": "Al-Qasas", "translation": "The Stories", "urduName": "القصص", "verses": 88, "type": "Meccan" },
  { "number": 29, "arabic": "سُورَةُ الْعَنْكَبُوتِ", "transliteration": "Al-Ankabut", "translation": "The Spider", "urduName": "العنکبوت", "verses": 69, "type": "Meccan" },
  { "number": 30, "arabic": "سُورَةُ الرُّومِ", "transliteration": "Ar-Rum", "translation": "The Romans", "urduName": "الروم", "verses": 60, "type": "Meccan" },
  { "number": 31, "arabic": "سُورَةُ لُقْمَانَ", "transliteration": "Luqman", "translation": "Luqman", "urduName": "لقمان", "verses": 34, "type": "Meccan" },
  { "number": 32, "arabic": "سُورَةُ السَّجْدَةِ", "transliteration": "As-Sajdah", "translation": "The Prostration", "urduName": "السجدہ", "verses": 30, "type": "Meccan" },
  { "number": 33, "arabic": "سُورَةُ الأَحْزَابِ", "transliteration": "Al-Ahzab", "translation": "The Combined Forces", "urduName": "الاحزاب", "verses": 73, "type": "Medinan" },
  { "number": 34, "arabic": "سُورَةُ سَبَإٍ", "transliteration": "Saba", "translation": "Sheba", "urduName": "سبا", "verses": 54, "type": "Meccan" },
  { "number": 35, "arabic": "سُورَةُ فَاطِرٍ", "transliteration": "Fatir", "translation": "The Originator", "urduName": "فاطر", "verses": 45, "type": "Meccan" },
  { "number": 36, "arabic": "سُورَةُ يس", "transliteration": "Yaseen", "translation": "Ya-Sin", "urduName": "یس", "verses": 83, "type": "Meccan" },
  { "number": 37, "arabic": "سُورَةُ الصَّافَّاتِ", "transliteration": "As-Saffat", "translation": "Those Ranges in Ranks", "urduName": "الصافات", "verses": 182, "type": "Meccan" },
  { "number": 38, "arabic": "سُورَةُ ص", "transliteration": "Sad", "translation": "The Letter Sad", "urduName": "ص", "verses": 88, "type": "Meccan" },
  { "number": 39, "arabic": "سُورَةُ الزُّمَرِ", "transliteration": "Az-Zumar", "translation": "The Groups", "urduName": "الزمر", "verses": 75, "type": "Meccan" },
  { "number": 40, "arabic": "سُورَةُ غَافِرٍ", "transliteration": "Ghafir", "translation": "The Forgiver", "urduName": "غافر", "verses": 85, "type": "Meccan" },
  { "number": 41, "arabic": "سُورَةُ فُصِّلَتْ", "transliteration": "Fussilat", "translation": "Explained in Detail", "urduName": "فصلت", "verses": 54, "type": "Meccan" },
  { "number": 42, "arabic": "سُورَةُ الشُّورَىٰ", "transliteration": "Ash-Shura", "translation": "The Consultation", "urduName": "الشوریٰ", "verses": 53, "type": "Meccan" },
  { "number": 43, "arabic": "سُورَةُ الزُّخْرُفِ", "transliteration": "Az-Zukhruf", "translation": "The Gold Adornments", "urduName": "الزخرف", "verses": 89, "type": "Meccan" },
  { "number": 44, "arabic": "سُورَةُ الدُّخَانِ", "transliteration": "Ad-Dukhan", "translation": "The Smoke", "urduName": "الدخان", "verses": 59, "type": "Meccan" },
  { "number": 45, "arabic": "سُورَةُ الْجَاثِيَةِ", "transliteration": "Al-Jathiyah", "translation": "The Crouching", "urduName": "الجاثیہ", "verses": 37, "type": "Meccan" },
  { "number": 46, "arabic": "سُورَةُ الأَحْقَافِ", "transliteration": "Al-Ahqaf", "translation": "The Wind-Curved Sandhills", "urduName": "الاحقاف", "verses": 35, "type": "Meccan" },
  { "number": 47, "arabic": "سُورَةُ مُحَمَّدٍ", "transliteration": "Muhammad", "translation": "Muhammad", "urduName": "محمد", "verses": 38, "type": "Medinan" },
  { "number": 48, "arabic": "سُورَةُ الْفَتْحِ", "transliteration": "Al-Fath", "translation": "The Victory", "urduName": "الفتح", "verses": 29, "type": "Medinan" },
  { "number": 49, "arabic": "سُورَةُ الْحُجُرَاتِ", "transliteration": "Al-Hujurat", "translation": "The Dwellings", "urduName": "الحجرات", "verses": 18, "type": "Medinan" },
  { "number": 50, "arabic": "سُورَةُ ق", "transliteration": "Qaf", "translation": "The Letter Qaf", "urduName": "ق", "verses": 45, "type": "Meccan" },
  { "number": 51, "arabic": "سُورَةُ الذَّارِيَاتِ", "transliteration": "Adh-Dhariyat", "translation": "The Winnowing Winds", "urduName": "الذاریات", "verses": 60, "type": "Meccan" },
  { "number": 52, "arabic": "سُورَةُ الطُّورِ", "transliteration": "At-Tur", "translation": "The Mount", "urduName": "الطور", "verses": 49, "type": "Meccan" },
  { "number": 53, "arabic": "سُورَةُ النَّجْمِ", "transliteration": "An-Najm", "translation": "The Star", "urduName": "النجم", "verses": 62, "type": "Meccan" },
  { "number": 54, "arabic": "سُورَةُ الْقَمَرِ", "transliteration": "Al-Qamar", "translation": "The Moon", "urduName": "القمر", "verses": 55, "type": "Meccan" },
  { "number": 55, "arabic": "سُورَةُ الرَّحْمَٰنِ", "transliteration": "Ar-Rahman", "translation": "The Beneficent", "urduName": "الرحمن", "verses": 78, "type": "Medinan" },
  { "number": 56, "arabic": "سُورَةُ الْوَاقِعَةِ", "transliteration": "Al-Waqi'ah", "translation": "The Inevitable Event", "urduName": "الواقعہ", "verses": 96, "type": "Meccan" },
  { "number": 57, "arabic": "سُورَةُ الْحَدِيدِ", "transliteration": "Al-Hadid", "translation": "The Iron", "urduName": "الحدید", "verses": 29, "type": "Medinan" },
  { "number": 58, "arabic": "سُورَةُ الْمُجَادِلَةِ", "transliteration": "Al-Mujadilah", "translation": "The Pleading Woman", "urduName": "المجادلہ", "verses": 22, "type": "Medinan" },
  { "number": 59, "arabic": "سُورَةُ الْحَشْرِ", "transliteration": "Al-Hashr", "translation": "The Exile", "urduName": "الحشر", "verses": 24, "type": "Medinan" },
  { "number": 60, "arabic": "سُورَةُ الْمُمْتَحَنَةِ", "transliteration": "Al-Mumtahanah", "translation": "She That Is to Be Examined", "urduName": "الممتحنہ", "verses": 13, "type": "Medinan" },
  { "number": 61, "arabic": "سُورَةُ الصَّفِّ", "transliteration": "As-Saff", "translation": "The Ranks", "urduName": "الصف", "verses": 14, "type": "Medinan" },
  { "number": 62, "arabic": "سُورَةُ الْجُمُعَةِ", "transliteration": "Al-Jumu'ah", "translation": "Friday", "urduName": "الجمعہ", "verses": 11, "type": "Medinan" },
  { "number": 63, "arabic": "سُورَةُ الْمُنَافِقُونَ", "transliteration": "Al-Munafiqun", "translation": "The Hypocrites", "urduName": "المنافقون", "verses": 11, "type": "Medinan" },
  { "number": 64, "arabic": "سُورَةُ التَّغَابُنِ", "transliteration": "At-Taghabun", "translation": "Mutual Disillusion", "urduName": "التغابن", "verses": 18, "type": "Medinan" },
  { "number": 65, "arabic": "سُورَةُ الطَّلَاقِ", "transliteration": "At-Talaq", "translation": "The Divorce", "urduName": "الطلاق", "verses": 12, "type": "Medinan" },
  { "number": 66, "arabic": "سُورَةُ التَّحْرِيمِ", "transliteration": "At-Tahrim", "translation": "The Prohibition", "urduName": "التحریم", "verses": 12, "type": "Medinan" },
  { "number": 67, "arabic": "سُورَةُ الْمُلْكِ", "transliteration": "Al-Mulk", "translation": "The Sovereignty", "urduName": "الملک", "verses": 30, "type": "Meccan" },
  { "number": 68, "arabic": "سُورَةُ الْقَلَمِ", "transliteration": "Al-Qalam", "translation": "The Pen", "urduName": "القلم", "verses": 52, "type": "Meccan" },
  { "number": 69, "arabic": "سُورَةُ الْحَاقَّةِ", "transliteration": "Al-Haqqah", "translation": "The Reality", "urduName": "الحاقہ", "verses": 52, "type": "Meccan" },
  { "number": 70, "arabic": "سُورَةُ الْمَعَارِجِ", "transliteration": "Al-Ma'arij", "translation": "The Ascending Stairways", "urduName": "المعارج", "verses": 44, "type": "Meccan" },
  { "number": 71, "arabic": "سُورَةُ نُوحٍ", "transliteration": "Nuh", "translation": "Noah", "urduName": "نوح", "verses": 28, "type": "Meccan" },
  { "number": 72, "arabic": "سُورَةُ الْجِنِّ", "transliteration": "Al-Jinn", "translation": "The Jinn", "urduName": "الجن", "verses": 28, "type": "Meccan" },
  { "number": 73, "arabic": "سُورَةُ الْمُزَّمِّلِ", "transliteration": "Al-Muzzammil", "translation": "The Enshrouded One", "urduName": "المزمل", "verses": 20, "type": "Meccan" },
  { "number": 74, "arabic": "سُورَةُ الْمُدَّثِّرِ", "transliteration": "Al-Muddaththir", "translation": "The Cloaked One", "urduName": "المدثر", "verses": 56, "type": "Meccan" },
  { "number": 75, "arabic": "سُورَةُ الْقِيَامَةِ", "transliteration": "Al-Qiyamah", "translation": "The Resurrection", "urduName": "القیامہ", "verses": 40, "type": "Meccan" },
  { "number": 76, "arabic": "سُورَةُ الْإِنْسَانِ", "transliteration": "Al-Insan", "translation": "Man", "urduName": "الانسان", "verses": 31, "type": "Medinan" },
  { "number": 77, "arabic": "سُورَةُ الْمُرْسَلَاتِ", "transliteration": "Al-Mursalat", "translation": "The Emissaries", "urduName": "المرسلات", "verses": 50, "type": "Meccan" },
  { "number": 78, "arabic": "سُورَةُ النَّبَإِ", "transliteration": "An-Naba", "translation": "The Announcement", "urduName": "النبا", "verses": 40, "type": "Meccan" },
  { "number": 79, "arabic": "سُورَةُ النَّازِعَاتِ", "transliteration": "An-Nazi'at", "translation": "Those Who Drag Forth", "urduName": "النازعات", "verses": 46, "type": "Meccan" },
  { "number": 80, "arabic": "سُورَةُ عَبَسَ", "transliteration": "Abasa", "translation": "He Frowned", "urduName": "عبس", "verses": 42, "type": "Meccan" },
  { "number": 81, "arabic": "سُورَةُ التَّكْوِيرِ", "transliteration": "At-Takwir", "translation": "The Overthrowing", "urduName": "التکویر", "verses": 29, "type": "Meccan" },
  { "number": 82, "arabic": "سُورَةُ الِانْفِطَارِ", "transliteration": "Al-Infitar", "translation": "The Cleaving", "urduName": "الانفطار", "verses": 19, "type": "Meccan" },
  { "number": 83, "arabic": "سُورَةُ الْمُطَفِّفِينَ", "transliteration": "Al-Mutaffifin", "translation": "Defrauding", "urduName": "المطففین", "verses": 36, "type": "Meccan" },
  { "number": 84, "arabic": "سُورَةُ الِانْشِقَاقِ", "transliteration": "Al-Inshiqaq", "translation": "The Splitting Open", "urduName": "الانشقاق", "verses": 25, "type": "Meccan" },
  { "number": 85, "arabic": "سُورَةُ الْبُرُوجِ", "transliteration": "Al-Burooj", "translation": "The Constellations", "urduName": "البروج", "verses": 22, "type": "Meccan" },
  { "number": 86, "arabic": "سُورَةُ الطَّارِقِ", "transliteration": "At-Tariq", "translation": "The Morning Star", "urduName": "الطارق", "verses": 17, "type": "Meccan" },
  { "number": 87, "arabic": "سُورَةُ الْأَعْلَىٰ", "transliteration": "Al-A'la", "translation": "The Most High", "urduName": "الاعلیٰ", "verses": 19, "type": "Meccan" },
  { "number": 88, "arabic": "سُورَةُ الْغَاشِيَةِ", "transliteration": "Al-Ghaashiyah", "translation": "The Overwhelming Event", "urduName": "الغاشیہ", "verses": 26, "type": "Meccan" },
  { "number": 89, "arabic": "سُورَةُ الْفَجْرِ", "transliteration": "Al-Fajr", "translation": "The Dawn", "urduName": "الفجر", "verses": 30, "type": "Meccan" },
  { "number": 90, "arabic": "سُورَةُ الْبَلَدِ", "transliteration": "Al-Balad", "translation": "The City", "urduName": "البلد", "verses": 20, "type": "Meccan" },
  { "number": 91, "arabic": "سُورَةُ الشَّمْسِ", "transliteration": "Ash-Shams", "translation": "The Sun", "urduName": "الشمس", "verses": 15, "type": "Meccan" },
  { "number": 92, "arabic": "سُورَةُ اللَّيْلِ", "transliteration": "Al-Lail", "translation": "The Night", "urduName": "اللیل", "verses": 21, "type": "Meccan" },
  { "number": 93, "arabic": "سُورَةُ الضُّحَىٰ", "transliteration": "Ad-Duha", "translation": "The Morning Hours", "urduName": "الضحیٰ", "verses": 11, "type": "Meccan" },
  { "number": 94, "arabic": "سُورَةُ الشَّرْحِ", "transliteration": "Ash-Sharh", "translation": "The Relief", "urduName": "الانشراح", "verses": 8, "type": "Meccan" },
  { "number": 95, "arabic": "سُورَةُ التِّينِ", "transliteration": "At-Tin", "translation": "The Fig", "urduName": "التین", "verses": 8, "type": "Meccan" },
  { "number": 96, "arabic": "سُورَةُ الْعَلَقِ", "transliteration": "Al-Alaq", "translation": "The Clot", "urduName": "العلق", "verses": 19, "type": "Meccan" },
  { "number": 97, "arabic": "سُورَةُ الْقَدْرِ", "transliteration": "Al-Qadr", "translation": "The Power, Fate", "urduName": "القدر", "verses": 5, "type": "Meccan" },
  { "number": 98, "arabic": "سُورَةُ الْبَيِّنَةِ", "transliteration": "Al-Bayyinah", "translation": "The Clear Proof", "urduName": "البینہ", "verses": 8, "type": "Medinan" },
  { "number": 99, "arabic": "سُورَةُ الزَّلْزَلَةِ", "transliteration": "Az-Zalzalah", "translation": "The Earthquake", "urduName": "الزلزلہ", "verses": 8, "type": "Medinan" },
  { "number": 100, "arabic": "سُورَةُ الْعَادِيَاتِ", "transliteration": "Al-Adiyat", "translation": "The Courser", "urduName": "العادیات", "verses": 11, "type": "Meccan" },
  { "number": 101, "arabic": "سُورَةُ الْقَارِعَةِ", "transliteration": "Al-Qari'ah", "translation": "The Calamity", "urduName": "القارعہ", "verses": 11, "type": "Meccan" },
  { "number": 102, "arabic": "سُورَةُ التَّكَاثُرِ", "transliteration": "At-Takathur", "translation": "The Rivalry in World Increase", "urduName": "التکاثر", "verses": 8, "type": "Meccan" },
  { "number": 103, "arabic": "سُورَةُ الْعَصْرِ", "transliteration": "Al-Asr", "translation": "The Declining Day", "urduName": "العصر", "verses": 3, "type": "Meccan" },
  { "number": 104, "arabic": "سُورَةُ الْهُمَزَةِ", "transliteration": "Al-Humazah", "translation": "The Traducer", "urduName": "الہمزہ", "verses": 9, "type": "Meccan" },
  { "number": 105, "arabic": "سُورَةُ الْفِيلِ", "transliteration": "Al-Fil", "translation": "The Elephant", "urduName": "الفیل", "verses": 5, "type": "Meccan" },
  { "number": 106, "arabic": "سُورَةُ قُرَيْشٍ", "transliteration": "Quraish", "translation": "Quraysh", "urduName": "قریش", "verses": 4, "type": "Meccan" },
  { "number": 107, "arabic": "سُورَةُ الْمَاعُونِ", "transliteration": "Al-Ma'un", "translation": "The Small Kindnesses", "urduName": "الماعون", "verses": 7, "type": "Meccan" },
  { "number": 108, "arabic": "سُورَةُ الْكَوْثَرِ", "transliteration": "Al-Kawthar", "translation": "Abundance", "urduName": "الکوثر", "verses": 3, "type": "Meccan" },
  { "number": 109, "arabic": "سُورَةُ الْكَافِرُونَ", "transliteration": "Al-Kafirun", "translation": "The Disbelievers", "urduName": "الکافرون", "verses": 6, "type": "Meccan" },
  { "number": 110, "arabic": "سُورَةُ النَّصْرِ", "transliteration": "An-Nasr", "translation": "The Divine Support", "urduName": "النصر", "verses": 3, "type": "Medinan" },
  { "number": 111, "arabic": "سُورَةُ الْمَسَدِ", "transliteration": "Al-Masad", "translation": "The Palm Fiber", "urduName": "المسد", "verses": 5, "type": "Meccan" },
  { "number": 112, "arabic": "سُورَةُ الْإِخْلَاصِ", "transliteration": "Al-Ikhlas", "translation": "Sincerity", "urduName": "الاخلاص", "verses": 4, "type": "Meccan" },
  { "number": 113, "arabic": "سُورَةُ الْفَلَقِ", "transliteration": "Al-Falaq", "translation": "The Daybreak", "urduName": "الفلق", "verses": 5, "type": "Meccan" },
  { "number": 114, "arabic": "سُورَةُ النَّاسِ", "transliteration": "An-Nas", "translation": "Mankind", "urduName": "الناس", "verses": 6, "type": "Meccan" }
];

// 30 Paras / Juz metadata
const PARA_LIST = [
  { "juz": 1, "arabic": "آلم", "transliteration": "Alif Lam Meem", "urdu": "الف لام میم", "description": "Starts from Surah Al-Fatihah Ayah 1" },
  { "juz": 2, "arabic": "سَيَقُولُ", "transliteration": "Sayaqool", "urdu": "سیقول", "description": "Starts from Surah Al-Baqarah Ayah 142" },
  { "juz": 3, "arabic": "تِلْكَ الرُّسُلُ", "transliteration": "Tilkal Rusulu", "urdu": "تلک الرسل", "description": "Starts from Surah Al-Baqarah Ayah 253" },
  { "juz": 4, "arabic": "لَنْ تَنَالُوا", "transliteration": "Lan Tanalu", "urdu": "لن تنالو", "description": "Starts from Surah Al-Imran Ayah 93" },
  { "juz": 5, "arabic": "وَالْمُحْصَنَاتُ", "transliteration": "Wal Mohsanatu", "urdu": "والمحصنات", "description": "Starts from Surah An-Nisa Ayah 24" },
  { "juz": 6, "arabic": "لَا يُحِبُّ اللَّهُ", "transliteration": "La Yuhibbullah", "urdu": "لا یحب اللہ", "description": "Starts from Surah An-Nisa Ayah 148" },
  { "juz": 7, "arabic": "وَإِذَا سَمِعُوا", "transliteration": "Wa Iza Samiu", "urdu": "واذا سمعو", "description": "Starts from Surah Al-Ma'idah Ayah 82" },
  { "juz": 8, "arabic": "وَلَوْ أَنَّنَا", "transliteration": "Wa Lau Annana", "urdu": "ولو اننا", "description": "Starts from Surah Al-An'am Ayah 111" },
  { "juz": 9, "arabic": "قَالَ الْمَلَأُ", "transliteration": "Qalal Malao", "urdu": "قال الملا", "description": "Starts from Surah Al-A'raf Ayah 88" },
  { "juz": 10, "arabic": "وَاعْلَمُوا", "transliteration": "Wa A'lamu", "urdu": "واعلموا", "description": "Starts from Surah Al-Anfal Ayah 41" },
  { "juz": 11, "arabic": "يَعْتَذِرُونَ", "transliteration": "Yatazeroon", "urdu": "یعتذرون", "description": "Starts from Surah At-Tawbah Ayah 93" },
  { "juz": 12, "arabic": "وَمَا مِنْ دَابَّةٍ", "transliteration": "Wa Mamin Da'abatin", "urdu": "وما من دابة", "description": "Starts from Surah Hud Ayah 6" },
  { "juz": 13, "arabic": "وَمَا أُبَرِّئُ", "transliteration": "Wa Ma Ubrioo", "urdu": "وما ابرئ", "description": "Starts from Surah Yusuf Ayah 53" },
  { "juz": 14, "arabic": "رُبَمَا", "transliteration": "Rubama", "urdu": "ربما", "description": "Starts from Surah Al-Hijr Ayah 1" },
  { "juz": 15, "arabic": "سُبْحَانَ الَّذِي", "transliteration": "Subhan Alladhi", "urdu": "سبحان الذی", "description": "Starts from Surah Al-Isra Ayah 1" },
  { "juz": 16, "arabic": "قَالَ أَلَمْ", "transliteration": "Qala Alam", "urdu": "قال الم", "description": "Starts from Surah Al-Kahf Ayah 75" },
  { "juz": 17, "arabic": "اقْتَرَبَ لِلنَّاسِ", "transliteration": "Iqtaraba li'n-nasi", "urdu": "اقترب للناس", "description": "Starts from Surah Al-Anbiya Ayah 1" },
  { "juz": 18, "arabic": "قَدْ أَفْلَحَ", "transliteration": "Qadd Aflaha", "urdu": "قد افلح", "description": "Starts from Surah Al-Mu'minun Ayah 1" },
  { "juz": 19, "arabic": "وَقَالَ الَّذِينَ", "transliteration": "Wa Qala illadhina", "urdu": "وقال الذین", "description": "Starts from Surah Al-Furqan Ayah 21" },
  { "juz": 20, "arabic": "أَمَّنْ خَلَقَ", "transliteration": "A'man Khalaqa", "urdu": "امن خلق", "description": "Starts from Surah An-Naml Ayah 60" },
  { "juz": 21, "arabic": "اتْلُ مَا أُوحِيَ", "transliteration": "Utlu Ma Oohiya", "urdu": "اتل ما اوحی", "description": "Starts from Surah Al-Ankabut Ayah 46" },
  { "juz": 22, "arabic": "وَمَنْ يَقْنُتْ", "transliteration": "Wa-Man yaqnut", "urdu": "ومن یقنت", "description": "Starts from Surah Al-Ahzab Ayah 31" },
  { "juz": 23, "arabic": "وَمَا لِي", "transliteration": "Wa Mali", "urdu": "وما لی", "description": "Starts from Surah Yaseen Ayah 28" },
  { "juz": 24, "arabic": "فَمَنْ أَظْلَمُ", "transliteration": "Fa-man Azlamu", "urdu": "فمن اظلم", "description": "Starts from Surah Az-Zumar Ayah 32" },
  { "juz": 25, "arabic": "إِلَيْهِ يُرَدُّ", "transliteration": "Ilayhi Yuruddu", "urdu": "الیہ یرد", "description": "Starts from Surah Ash-Shura Ayah 47" },
  { "juz": 26, "arabic": "حم", "transliteration": "Ha Meem", "urdu": "حم", "description": "Starts from Surah Al-Ahqaf Ayah 1" },
  { "juz": 27, "arabic": "قَالَ فَمَا خَطْبُكُمْ", "transliteration": "Qala Fama Khatbukum", "urdu": "قال فما خطبکم", "description": "Starts from Surah Adh-Dhariyat Ayah 31" },
  { "juz": 28, "arabic": "قَدْ سَمِعَ اللَّهُ", "transliteration": "Qadd Sami Allah", "urdu": "قد سمع اللہ", "description": "Starts from Surah Al-Mujadilah Ayah 1" },
  { "juz": 29, "arabic": "تَبَارَكَ الَّذِي", "transliteration": "Tabaraka lladhi", "urdu": "تبارک الذی", "description": "Starts from Surah Al-Mulk Ayah 1" },
  { "juz": 30, "arabic": "عَمَّ", "transliteration": "Amma Yatasa'aloon", "urdu": "عم", "description": "Starts from Surah An-Naba Ayah 1" }
];

// YouTube Video IDs for each Surah (Urdu Translation recitations)
const SURAH_VIDEO_MAP = {
  1: "rIusdV6kH_h", 2: "2Kpgm_SBpGM", 3: "JZ9FDj4BN8Y", 4: "9iH-oBCK3vs", 5: "4MgRuKzBhH0",
  6: "zH2NpjxS3Hw", 7: "MvsCARiMGkM", 8: "XLiQV1oeQ7E", 9: "CQNB5tRdnAE", 10: "m-3QvnRBCOs",
  11: "sMuEqjiBj0g", 12: "AXnqCCE8s9U", 13: "Hw3D7qduvbY", 14: "1Lz4CCSH5DY", 15: "eS3koioOlpQ",
  16: "I0ZHlHrEI4U", 17: "QR0cDfWYx2Y", 18: "SSfbH0QEQQU", 19: "YFuwNqXwEP0", 20: "jGWWRXQiKs4",
  21: "EB-QBmvRV5o", 22: "E3Iqr3qZqXk", 23: "TjBjH-kQ-bQ", 24: "HxEDvSqKoGI", 25: "gznT7bHgaY8",
  26: "N6sJDlZ3u5w", 27: "fk3UMfDSd2I", 28: "5fRwFRvNQbo", 29: "pnlVJYHVHYs", 30: "eK3P1bX1t8Y",
  31: "DKD8LGc4GEg", 32: "J8WbS2b2k3A", 33: "oqQrHuAoSrI", 34: "QvM0S3rfhTk", 35: "tVz4DTJM5sU",
  36: "f_KWjFTLe9M", 37: "mPJX0Zp8jGg", 38: "vkY1iH3yAiE", 39: "vg3LjRFJOoM", 40: "D9j3c4vUMmU",
  41: "9mWNqh_xMZo", 42: "7A5qPo0dkyg", 43: "2A9u7oHfEsM", 44: "jLs9Jl0wQ3E", 45: "sZ5NTPKO-7U",
  46: "s7gJjVq5TaI", 47: "yFTECxv4L40", 48: "KnMQ9f5s6mE", 49: "Ym_JGO5aeWI", 50: "bOdkyX9ygE0",
  51: "9hQk3jOO3LQ", 52: "G3S3aHa2bI4", 53: "Sp0Qw4OJ1Qo", 54: "EIkG27gUQzw", 55: "1kRJAw5aR_0",
  56: "Qb-fzM9XQHE", 57: "Qe0K3gCZ_xM", 58: "wv9sJCwS6Ag", 59: "nzb2iAu6Khg", 60: "7kDgzjrTFMo",
  61: "FECWrKG0P6c", 62: "FMl1DNAB7rk", 63: "lEBsMEYRmB0", 64: "nzYsRzLQ_2g", 65: "zO4F0NHqHBk",
  66: "t0xGxrI0BaA", 67: "exbBkqvknD4", 68: "kL0EXEMjVW0", 69: "3lWq_xYE4lk", 70: "LhgTY88yqRA",
  71: "lh0X0O7NVMQ", 72: "5lHw8kJrGgQ", 73: "VmO5h7gRJHI", 74: "gk8ioq2VjJw", 75: "9Y5IvJT6LRQ",
  76: "0zTqKq5apA8", 77: "f8H1CaBf53g", 78: "cLRh7biqjAA", 79: "KGmjW9-vIJI", 80: "zY9o_s6Mn30",
  81: "5ItOmC3pKKM", 82: "Rld_GKF_DaA", 83: "e_5p_q1RAVE", 84: "7h2n4kcqXWY", 85: "S5VFWoGZBfM",
  86: "XWKQd7RoqvI", 87: "OxHiJGxz_Ks", 88: "fBqUn_-bSBY", 89: "sSmJbSLtBqU", 90: "9djqDhzJPMQ",
  91: "PsCVrJaHsB0", 92: "NJ9k35_P5bE", 93: "vHIhqpJT6Uc", 94: "9TxkA59Gmco", 95: "N2XF1IhViFA",
  96: "JN7EB2VxXbg", 97: "3eXlhqL7bOM", 98: "wYUEYkFuQrk", 99: "dEGHH7kp5GA", 100: "Y6hwP9qhBiE",
  101: "vDUFZh41Mhk", 102: "5tIwMf2CJZY", 103: "X5uRjYNF-Ks", 104: "3ZtN7sVD-Cg", 105: "3Zn1jzADU_k",
  106: "Bz7r0fOJMGU", 107: "bU7L-9eL2wk", 108: "vHmxADT0eBQ", 109: "CStOQHKbMmA", 110: "ORo0EZbfBzc",
  111: "XRy1oFPm_DE", 112: "pn2GGpZj7yw", 113: "d3hqVxSMaKg", 114: "4HXUXlCzHqA"
};

// YouTube Video IDs for each Para/Juz (Urdu Translation)
const PARA_VIDEO_MAP = {
  1: "2Kpgm_SBpGM", 2: "JDdKRFgcXzI", 3: "z6BDXz7UT5A", 4: "E8sAp7MFrGE", 5: "7xm9sSn0uyU",
  6: "Wk7b8F3k45E", 7: "9L4K2iWdEaQ", 8: "qPOqDHs3dBM", 9: "2o1nZ8lS6YI", 10: "tJBNfE7D8vQ",
  11: "HiKkP7oRLCQ", 12: "mIUpwB8j0hc", 13: "pHyOrIZ8tS0", 14: "KbN6GkRqD7U", 15: "QR0cDfWYx2Y",
  16: "SSfbH0QEQQU", 17: "EB-QBmvRV5o", 18: "TjBjH-kQ-bQ", 19: "N6sJDlZ3u5w", 20: "fk3UMfDSd2I",
  21: "pnlVJYHVHYs", 22: "oqQrHuAoSrI", 23: "f_KWjFTLe9M", 24: "vg3LjRFJOoM", 25: "7A5qPo0dkyg",
  26: "yFTECxv4L40", 27: "9hQk3jOO3LQ", 28: "wv9sJCwS6Ag", 29: "exbBkqvknD4", 30: "cLRh7biqjAA"
};

function getRecitationSearchQuery(type, id) {
  if (type === 'surah') {
    const surah = SURAH_LIST.find((item) => item.number === id);
    if (!surah) return null;
    return `Surah ${surah.transliteration} Urdu Translation Quran`;
  }

  const para = PARA_LIST.find((item) => item.juz === id);
  if (!para) return null;
  return `Para ${para.juz} ${para.transliteration} Urdu Translation Quran`;
}

const URDU_PART_VIDEO_MAP = {
  1: 'SbBchB7xmRY', 2: 'DuX-NsG6Ipg', 3: 'XcEtVMoCZG0', 4: 'jwhj7GYwhes', 5: '5kkJbhb6QcQ',
  6: 'aKBSUpSRT1s', 7: 'OqLHe18mCgg', 8: '_wLtT5wE1xM', 9: 'jKsyD8DtKKM', 10: '8qYWVt8MrtY',
  11: 'k87aEkEWG0Y', 12: 'CyTAtqubp6s', 13: 'idVUmElT3WM', 14: 'AZwJ3xSTb4Y', 15: 'LDnoSVjfmZo',
  16: '8gjpqb5s7Fw', 17: '3DUtqDpV4ew', 22: 'bTgRdNVxIY4', 23: 'rP6g71vNiX0', 24: 'm4XAZfg_DhY',
  25: 'xixDi2-NI7g', 26: 'DWjuoPaehWU', 27: 'wUteCeNAce0', 28: 'Mk1thoeyRjI', 29: '6WxN6reVBbY',
  30: 'ZQxvegb5vo4'
};

const JUZ_SURAH_STARTS = [
  { juz: 1, surah: 1 }, { juz: 2, surah: 2 }, { juz: 3, surah: 2 }, { juz: 4, surah: 3 }, { juz: 5, surah: 4 },
  { juz: 6, surah: 4 }, { juz: 7, surah: 5 }, { juz: 8, surah: 6 }, { juz: 9, surah: 7 }, { juz: 10, surah: 8 },
  { juz: 11, surah: 9 }, { juz: 12, surah: 11 }, { juz: 13, surah: 12 }, { juz: 14, surah: 15 }, { juz: 15, surah: 17 },
  { juz: 16, surah: 18 }, { juz: 17, surah: 21 }, { juz: 18, surah: 23 }, { juz: 19, surah: 25 }, { juz: 20, surah: 27 },
  { juz: 21, surah: 29 }, { juz: 22, surah: 33 }, { juz: 23, surah: 36 }, { juz: 24, surah: 39 }, { juz: 25, surah: 41 },
  { juz: 26, surah: 46 }, { juz: 27, surah: 51 }, { juz: 28, surah: 58 }, { juz: 29, surah: 67 }, { juz: 30, surah: 78 }
];

function getVideoPartNumber(type, id) {
  if (type === 'para') return id;

  let currentJuz = 1;
  for (const point of JUZ_SURAH_STARTS) {
    if (id >= point.surah) {
      currentJuz = point.juz;
    } else {
      break;
    }
  }
  return currentJuz;
}

function getYouTubeEmbedUrl(type, id) {
  const partNumber = getVideoPartNumber(type, id);
  const videoId = URDU_PART_VIDEO_MAP[partNumber];
  if (!videoId) return null;

  return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&playsinline=1`;
}

// Audio URL builder (Mishary Rashid Alafasy)
function getAudioUrl(surahNumber) {
  const n = String(surahNumber).padStart(3, '0');
  return `https://server8.mp3quran.net/afs/${n}.mp3`;
}

function getPdfUrl(surahNumber) {
  return `https://quranpdf.blogspot.com/`;
}
