import { SlidingConfigItem, SlidingImageDescriptor, AccessoAdminLog } from '../types';
import { LanguageCode } from '../i18n/types';

export const FACEBOOK_BASE_PAGE_URL =
  'https://www.facebook.com/p/Braciami-Ancora-Spaccio-carnisalumi-e-formaggi-100063911893005/';

export const SLIDE_TRANSLATIONS_DICTIONARY: Record<
  string,
  Record<LanguageCode, { nomePulsante: string; descrizione: string }>
> = {
  'slide-macelleria-tagli': {
    it_IT: {
      nomePulsante: 'Carni & Frollature Selezionate',
      descrizione:
        'Bistecca Fiorentina, Costate frollate Dry-Aged, Spiedini artigianali e tagli nobili pronti per la brace.'
    },
    en_US: {
      nomePulsante: 'Selected Meats & Dry-Aging',
      descrizione:
        'Florentine T-Bone Steak, Dry-Aged Ribeyes, artisan skewers and prime cuts ready for the grill.'
    },
    de_DE: {
      nomePulsante: 'Ausgewähltes Fleisch & Dry-Aging',
      descrizione:
        'Bistecca Fiorentina, Dry-Aged Ribeye-Steaks, handgemachte Spieße und edle Zuschnitte für den Grill.'
    },
    fr_FR: {
      nomePulsante: 'Viandes & Maturations Sélectionnées',
      descrizione:
        'Bistecca Fiorentina, Côtes de bœuf maturées Dry-Aged, brochettes artisanales et pièces nobles pour la braise.'
    },
    es_ES: {
      nomePulsante: 'Carnes y Maduraciones Seleccionadas',
      descrizione:
        'Bistecca Fiorentina, Chuletones madurados Dry-Aged, brochetas artesanales y cortes nobles listos para la brasa.'
    },
    nl_NL: {
      nomePulsante: 'Geselecteerd Vlees & Dry-Aging',
      descrizione:
        'Florentijnse T-Bone, Dry-Aged ribeyes, ambachtelijke spiesen en edele vleessneden klaar voor de grill.'
    },
    sv_SE: {
      nomePulsante: 'Utvalt Kött & Hängmörning',
      descrizione:
        'Florentinsk T-bone, hängmörade entrecôter, hantverksspett och ädla styckdetaljer redo för grillen.'
    },
    zh_CN: {
      nomePulsante: '精选肉类与干式熟成',
      descrizione: '佛罗伦萨丁骨牛排、干式熟成肋眼、手工烤串以及专为炭火烧烤准备的优质肉块。'
    },
    ja_JP: {
      nomePulsante: '厳選肉＆ドライエイジング',
      descrizione: 'フィオレンティーナ・ステーキ、熟成リブアイ、手作り串焼き、炭火焼き用の極上カット。'
    },
    ru_RU: {
      nomePulsante: 'Отборное мясо и выдержка Dry-Aged',
      descrizione: 'Стейк Фиорентина, выдержанные рибаи Dry-Aged, авторские шашлычки и благородные отрубы для гриля.'
    },
    ar_SA: {
      nomePulsante: 'لحوم مختارة وتعتيق جاف',
      descrizione: 'شريحة لحم فيورنتينا، ريب آي معتق على الجاف، أسياخ حرفية وقطع فاخرة جاهزة للشواء.'
    }
  },
  'slide-fb-spaccio-cento': {
    it_IT: {
      nomePulsante: 'Dal Nostro Banco Facebook',
      descrizione:
        'Scatti reali dallo Spaccio Carni, Salumi e Formaggi in Via Penzale 25 a Cento (FE): preparazioni fresche ogni giorno.'
    },
    en_US: {
      nomePulsante: 'From Our Facebook Counter',
      descrizione:
        'Real photos from our Meat, Cured Meats & Cheese Shop at Via Penzale 25 in Cento (FE): fresh daily preparations.'
    },
    de_DE: {
      nomePulsante: 'Von unserer Facebook-Theke',
      descrizione:
        'Echte Einblicke aus unserem Fleisch-, Wurst- und Käseladen in der Via Penzale 25 in Cento (FE): täglich frisch.'
    },
    fr_FR: {
      nomePulsante: 'De Notre Comptoir Facebook',
      descrizione:
        'Photos réelles de notre boutique de viandes, charcuteries et fromages Via Penzale 25 à Cento (FE) : fraîcheur quotidienne.'
    },
    es_ES: {
      nomePulsante: 'Desde Nuestro Mostrador Facebook',
      descrizione:
        'Fotos reales de nuestra tienda de carnes, embutidos y quesos en Via Penzale 25 en Cento (FE): frescura diaria.'
    },
    nl_NL: {
      nomePulsante: 'Van Onze Facebook Toonbank',
      descrizione:
        'Echte foto’s uit onze vlees-, vleeswaren- en kaaswinkel aan de Via Penzale 25 in Cento (FE): elke dag vers bereid.'
    },
    sv_SE: {
      nomePulsante: 'Från Vår Facebook-disk',
      descrizione:
        'Äkta bilder från vår kött-, chark- och ostbutik på Via Penzale 25 i Cento (FE): färska förberedelser varje dag.'
    },
    zh_CN: {
      nomePulsante: '来自我们的 Facebook 专柜',
      descrizione: '摄于 Cento (FE) Via Penzale 25 肉类、萨拉米与奶酪专卖店的真实照片：每日新鲜制作。'
    },
    ja_JP: {
      nomePulsante: '公式Facebookカウンターより',
      descrizione: 'チェント（FE）Via Penzale 25の精肉・サラミ・チーズ直売所の実際の写真：毎日新鮮に調理。'
    },
    ru_RU: {
      nomePulsante: 'С нашей витрины в Facebook',
      descrizione: 'Реальные фото из нашей лавки мяса, колбас и сыров на Via Penzale 25 в Ченто (FE): свежее каждый день.'
    },
    ar_SA: {
      nomePulsante: 'من منصتنا على فيسبوك',
      descrizione: 'صور حقيقية من متجر اللحوم والسلامي والأجبان في Via Penzale 25 في تشينتو (FE): تحضيرات طازجة يومياً.'
    }
  },
  'slide-salumi-tradizione': {
    it_IT: {
      nomePulsante: 'Salumi Emiliani & Norcineria',
      descrizione:
        'Mortadella Bologna IGP, Salame Gentile, Prosciutto Crudo stagionato 24 mesi e Ciccioli caldi di caldaia.'
    },
    en_US: {
      nomePulsante: 'Emilian Cured Meats & Charcuterie',
      descrizione:
        'Mortadella Bologna PGI, gentle Emilian salami, 24-month aged Prosciutto Crudo and warm artisan pork cracklings.'
    },
    de_DE: {
      nomePulsante: 'Emilianische Wurstwaren & Metzgerei',
      descrizione:
        'Mortadella Bologna g.g.A., Salame Gentile, 24 Monate gereifter Prosciutto Crudo und warme Grieben (Ciccioli).'
    },
    fr_FR: {
      nomePulsante: 'Charcuteries Émiliennes & Tradition',
      descrizione:
        'Mortadelle de Bologne IGP, Saucisson Gentile, Jambon Cru affiné 24 mois et grattons chauds artisanaux.'
    },
    es_ES: {
      nomePulsante: 'Embutidos Emilianos y Charcutería',
      descrizione:
        'Mortadela de Bolonia IGP, Salame Gentile, Jamón Crudo curado 24 meses y chicharrones calientes artesanales.'
    },
    nl_NL: {
      nomePulsante: 'Emiliaanse Vleeswaren & Charcuterie',
      descrizione:
        'Mortadella Bologna BGA, Salame Gentile, 24 maanden gerijpte Prosciutto Crudo en warme ambachtelijke kaantjes.'
    },
    sv_SE: {
      nomePulsante: 'Emilianska Charkuterier',
      descrizione:
        'Mortadella Bologna IGP, Salame Gentile, 24 månader lagrad Prosciutto Crudo och varma hantverksgrevar.'
    },
    zh_CN: {
      nomePulsante: '艾米利亚传统腌肉与香肠',
      descrizione: '博洛尼亚 IGP 摩타德拉香肠、温和萨拉米、24个月熟成生火腿及传统热炸猪油渣。'
    },
    ja_JP: {
      nomePulsante: 'エミリア伝統のサラミ＆生ハム',
      descrizione: 'ボローニャIGPモルタデッラ、サラメ・ジェンティーレ、24ヶ月熟成プロシュット、温かいチッチョリ。'
    },
    ru_RU: {
      nomePulsante: 'Эмилианские деликатесы и колбасы',
      descrizione: 'Мортаделла Болонья IGP, нежная салями, прошутто крудо 24 месяцев выдержки и горячие шкварки чиччоли.'
    },
    ar_SA: {
      nomePulsante: 'اللحوم الإيميلية المقددة والتقليدية',
      descrizione: 'مورتاديلا بولونيا IGP، سلامي جينتيلي، بروشوتو معتق 24 شهراً ومقرمشات تقليدية ساخنة.'
    }
  },
  'slide-formaggi-dop': {
    it_IT: {
      nomePulsante: 'Formaggi DOP & Affinati',
      descrizione:
        'Parmigiano Reggiano DOP 24/36 mesi, Pecorini affinati e selezioni casearie delle valli emiliane.'
    },
    en_US: {
      nomePulsante: 'PDO & Aged Artisan Cheeses',
      descrizione:
        '24/36-month Parmigiano Reggiano PDO, aged Pecorino cheeses and dairy selections from the Emilian valleys.'
    },
    de_DE: {
      nomePulsante: 'DOP-Käse & Gereifte Spezialitäten',
      descrizione:
        'Parmigiano Reggiano DOP (24/36 Monate), gereifter Pecorino und Käsespezialitäten aus den emilianischen Tälern.'
    },
    fr_FR: {
      nomePulsante: 'Fromages AOP & Affinés',
      descrizione:
        'Parmigiano Reggiano AOP 24/36 mois, Pecorinos affinés et sélections fromagères des vallées émiliennes.'
    },
    es_ES: {
      nomePulsante: 'Quesos DOP y Afinados',
      descrizione:
        'Parmigiano Reggiano DOP 24/36 meses, Pecorinos afinados y selecciones queseras de los valles emilianos.'
    },
    nl_NL: {
      nomePulsante: 'BOB Kazen & Gerijpte Selecties',
      descrizione:
        'Parmigiano Reggiano BOB 24/36 maanden, gerijpte Pecorino en kaasselecties uit de Emiliaanse valleien.'
    },
    sv_SE: {
      nomePulsante: 'DOP-ostar & Lagrade Ostar',
      descrizione:
        'Parmigiano Reggiano DOP 24/36 månader, lagrad Pecorino och osturval från de emilianska dalarna.'
    },
    zh_CN: {
      nomePulsante: 'DOP 认证与陈年精制奶酪',
      descrizione: '24/36个月熟成帕玛森雷佳诺 DOP 奶酪、精制佩科里诺羊奶酪及艾米利亚山谷乳制品精选。'
    },
    ja_JP: {
      nomePulsante: 'DOP認定＆熟成チーズ',
      descrizione: '24/36ヶ月熟成パルミジャーノ・レッジャーノDOP、熟成ペコリーノ、エミリア渓谷の厳選チーズ。'
    },
    ru_RU: {
      nomePulsante: 'Сыры DOP и выдержанные сорта',
      descrizione: 'Пармиджано Реджано DOP 24/36 месяцев, выдержанный Пекорино и сырные коллекции эмилианских долин.'
    },
    ar_SA: {
      nomePulsante: 'أجبان DOP والمعتقة الفاخرة',
      descrizione: 'جبن بارميجيانو ريجيانو DOP معتق 24/36 شهراً، بيكورينو فاخر ومختارات ألبان من وديان إيميليا.'
    }
  },
  'slide-gastronomia-brace': {
    it_IT: {
      nomePulsante: 'Gastronomia Pronta & Grill',
      descrizione:
        'Lasagne tradizionali al ragù, Polli allo spiedo su brace viva, Arrosti e contorni pronti da gustare.'
    },
    en_US: {
      nomePulsante: 'Ready-to-Eat Deli & Live Grill',
      descrizione:
        'Traditional Bolognese lasagna, spit-roasted chickens over live embers, roasts and side dishes ready to enjoy.'
    },
    de_DE: {
      nomePulsante: 'Heiße Feinkost & Holzkohlegrill',
      descrizione:
        'Traditionelle Lasagne al Ragù, Grillhähnchen vom Spieß über offener Glut, Braten und fertige Beilagen.'
    },
    fr_FR: {
      nomePulsante: 'Traiteur Chaud & Grillades',
      descrizione:
        'Lasagnes traditionnelles au ragù, poulets rôtis à la broche sur braise vive, rôtis et accompagnements prêts à déguster.'
    },
    es_ES: {
      nomePulsante: 'Gastronomía Lista y Parrilla',
      descrizione:
        'Lasaña tradicional al ragú, pollos al espetón sobre brasa viva, asados y guarniciones listas para disfrutar.'
    },
    nl_NL: {
      nomePulsante: 'Kant-en-klare Delicatessen & Grill',
      descrizione:
        'Traditionele lasagne bolognese, kip van het spit boven gloeiende kolen, gebraad en bijgerechten klaar om van te genieten.'
    },
    sv_SE: {
      nomePulsante: 'Färdiglagad Delikatess & Grill',
      descrizione:
        'Traditionell lasagne al ragù, grillad kyckling över öppen glöd, stekar och tillbehör färdiga att avnjutas.'
    },
    zh_CN: {
      nomePulsante: '熟食美食与明火烧烤',
      descrizione: '传统肉酱千层面、活火旋转烤鸡、精制烤肉及即食配菜。'
    },
    ja_JP: {
      nomePulsante: '出来たて惣菜＆炭火グリル',
      descrizione: '伝統のラグー・ラザニア、炭火ロティサリーチキン、ロースト肉、すぐ味わえるサイドディッシュ。'
    },
    ru_RU: {
      nomePulsante: 'Готовая кулинария и гриль',
      descrizione: 'Традиционная лазанья болоньезе, цыплята на вертеле на живых углях, жаркое и готовые гарниры.'
    },
    ar_SA: {
      nomePulsante: 'مأكولات جاهزة ومشاوي على الجمر',
      descrizione: 'لازانيا تقليدية بالراغو، دجاج مشوي على الجمر الحي، لحوم محمصة وأطباق جانبية جاهزة للتقديم.'
    }
  },
  'slide-fiere-eventi-fb': {
    it_IT: {
      nomePulsante: 'Fiere, Eventi & Serate Grill',
      descrizione:
        'Degustazioni con musica dal vivo, birre artigianali belga e tedesca, grigliate miste e fiere gastronomiche a Cento.'
    },
    en_US: {
      nomePulsante: 'Fairs, Events & Grill Nights',
      descrizione:
        'Live music tastings, Belgian and German craft beers, mixed platter grills and food fairs in Cento.'
    },
    de_DE: {
      nomePulsante: 'Messen, Events & Grillabende',
      descrizione:
        'Verkostungen mit deutscher und belgischer Braukunst, Live-Musik, gemischte Grillplatten und Feste in Cento.'
    },
    fr_FR: {
      nomePulsante: 'Foires, Événements & Soirées Grill',
      descrizione:
        'Dégustations en musique, bières artisanales belges et allemandes, grillades mixtes et foires gastronomiques à Cento.'
    },
    es_ES: {
      nomePulsante: 'Ferias, Eventos y Noches de Parrilla',
      descrizione:
        'Degustaciones con música en vivo, cervezas belgas y alemanas, parrilladas mixtas y ferias gastronómicas en Cento.'
    },
    nl_NL: {
      nomePulsante: 'Beurzen, Evenementen & Grillavonden',
      descrizione:
        'Proeverijen met livemuziek, Belgische en Duitse speciaalbieren, gemengde grillschotels en culinaire feesten in Cento.'
    },
    sv_SE: {
      nomePulsante: 'Mässor, Evenemang & Grillkvällar',
      descrizione:
        'Provsmakningar med livemusik, belgisk och tysk hantverksöl, grilltallrikar och matmässor i Cento.'
    },
    zh_CN: {
      nomePulsante: '展会、活动与烧烤之夜',
      descrizione: '现场音乐品鉴会、比利时与德国精酿啤酒、什锦炭火烧烤以及 Cento 美食博览会。'
    },
    ja_JP: {
      nomePulsante: 'フェア・イベント＆グリルナイト',
      descrizione: 'ライブ音楽と味わうベルギー＆ドイツビール、ミックスグリル、チェントの美食フェア。'
    },
    ru_RU: {
      nomePulsante: 'Ярмарки, события и вечера гриля',
      descrizione: 'Дегустации под живую музыку, бельгийское и немецкое пиво, ассорти на углях и гастрономические праздники в Ченто.'
    },
    ar_SA: {
      nomePulsante: 'المعارض والفعاليات وأمسيات الشواء',
      descrizione: 'تذوق مع موسيقى حية، مشروبات حرفية، مشاوي مشكلة ومعارض تذوق الطعام في تشينتو.'
    }
  },
  'fb-slide-01': {
    it_IT: {
      nomePulsante: 'Spaccio Carni Via Penzale 25',
      descrizione: 'La qualità quotidiana del banco macelleria e salumeria di Manuel & Samanta a Cento.'
    },
    en_US: {
      nomePulsante: 'Meat Shop Via Penzale 25',
      descrizione: 'Everyday quality at Manuel & Samanta’s butcher and charcuterie counter in Cento.'
    },
    de_DE: {
      nomePulsante: 'Fleischladen Via Penzale 25',
      descrizione: 'Tägliche Spitzenqualität an der Metzgerei- und Feinkosttheke von Manuel & Samanta in Cento.'
    },
    fr_FR: {
      nomePulsante: 'Boucherie Via Penzale 25',
      descrizione: 'La qualité quotidienne du comptoir boucherie et charcuterie de Manuel & Samanta à Cento.'
    },
    es_ES: {
      nomePulsante: 'Carnicería Via Penzale 25',
      descrizione: 'La calidad diaria del mostrador de carnicería y charcutería de Manuel y Samanta en Cento.'
    },
    nl_NL: {
      nomePulsante: 'Slagerij Via Penzale 25',
      descrizione: 'De dagelijkse kwaliteit van de slagerij- en delicatessentoonbank van Manuel & Samanta in Cento.'
    },
    sv_SE: {
      nomePulsante: 'Köttbutik Via Penzale 25',
      descrizione: 'Daglig kvalitet vid Manuel & Samantas slakteri- och charkdisk i Cento.'
    },
    zh_CN: {
      nomePulsante: 'Via Penzale 25 肉品直营店',
      descrizione: 'Manuel 与 Samanta 在 Cento 的肉铺和熟食柜台每日为您提供卓越品质。'
    },
    ja_JP: {
      nomePulsante: 'Via Penzale 25 精肉直売所',
      descrizione: 'チェントのManuel & Samantaによる精肉・デリカテッセンカウンターの毎日の品質。'
    },
    ru_RU: {
      nomePulsante: 'Мясная лавка Via Penzale 25',
      descrizione: 'Ежедневное качество мясной и гастрономической витрины Мануэля и Саманты в Ченто.'
    },
    ar_SA: {
      nomePulsante: 'متجر اللحوم Via Penzale 25',
      descrizione: 'الجودة اليومية لمنصة الجزارة والمأكولات لدى مانويل وسامانتا في تشينتو.'
    }
  },
  'fb-slide-02': {
    it_IT: {
      nomePulsante: 'Serate Birra & Grigliata',
      descrizione: 'Serata con musica tedesca, assaggi di birra belga e tedesca e ricchissima Braciami Grigliata.'
    },
    en_US: {
      nomePulsante: 'Beer & Grill Nights',
      descrizione: 'Evening with German music, Belgian & German beer tastings and a rich Braciami Mixed Grill.'
    },
    de_DE: {
      nomePulsante: 'Bier- & Grillabende',
      descrizione: 'Abend mit deutscher Musik, Verkostung belgischer & deutscher Biere und reichhaltigem Braciami-Grillteller.'
    },
    fr_FR: {
      nomePulsante: 'Soirées Bière & Grillades',
      descrizione: 'Soirée avec musique allemande, dégustation de bières belges et allemandes et généreuse grillade Braciami.'
    },
    es_ES: {
      nomePulsante: 'Noches de Cerveza y Parrilla',
      descrizione: 'Velada con música alemana, degustación de cervezas belgas y alemanas y abundante parrillada Braciami.'
    },
    nl_NL: {
      nomePulsante: 'Bier- & Grillavonden',
      descrizione: 'Avond met Duitse muziek, proeverij van Belgische en Duitse bieren en een rijke Braciami-grillschotel.'
    },
    sv_SE: {
      nomePulsante: 'Öl- & Grillkvällar',
      descrizione: 'Kväll med tysk musik, provning av belgisk och tysk öl samt en generös Braciami-grillbricka.'
    },
    zh_CN: {
      nomePulsante: '精酿啤酒与烧烤之夜',
      descrizione: '伴随德国音乐、比利时与德国啤酒品鉴以及丰盛的 Braciami 炭火烤肉拼盘。'
    },
    ja_JP: {
      nomePulsante: 'ビール＆グリルナイト',
      descrizione: 'ドイツ音楽、ベルギー＆ドイツビールの試飲、そして豪華なブラチャミ・ミックスグリルの夜。'
    },
    ru_RU: {
      nomePulsante: 'Вечера пива и гриля',
      descrizione: 'Вечер с немецкой музыкой, дегустацией бельгийского и немецкого пива и щедрым гриль-сетом Braciami.'
    },
    ar_SA: {
      nomePulsante: 'أمسيات المشاوي والموسيقى',
      descrizione: 'أمسية مميزة مع الموسيقى وتشكيلة غنية من مشاوي Braciami الطازجة.'
    }
  },
  'fb-slide-03': {
    it_IT: {
      nomePulsante: 'Pronti da Cuocere',
      descrizione: 'Spiedini, arrosticini, hamburger gourmet e specialità panate preparate a mano ogni mattina.'
    },
    en_US: {
      nomePulsante: 'Ready to Cook Specialties',
      descrizione: 'Skewers, arrosticini, gourmet burgers and breaded specialties handmade every morning.'
    },
    de_DE: {
      nomePulsante: 'Pfannen- & Grillfertig',
      descrizione: 'Spieße, Arrosticini, Gourmet-Burger und panierte Spezialitäten, jeden Morgen von Hand zubereitet.'
    },
    fr_FR: {
      nomePulsante: 'Prêts à Cuire Artisanaux',
      descrizione: 'Brochettes, arrosticini, burgers gourmets et spécialités panées préparés à la main chaque matin.'
    },
    es_ES: {
      nomePulsante: 'Listos para Cocinar',
      descrizione: 'Brochetas, arrosticini, hamburguesas gourmet y especialidades empanadas hechas a mano cada mañana.'
    },
    nl_NL: {
      nomePulsante: 'Klaar om te Bakken & Grillen',
      descrizione: 'Spiesen, arrosticini, gourmetburgers en gepaneerde specialiteiten die elke ochtend met de hand worden bereid.'
    },
    sv_SE: {
      nomePulsante: 'Redo att Tillagas',
      descrizione: 'Grillspett, arrosticini, gourmetburgare och panerade specialiteter handgjorda varje morgon.'
    },
    zh_CN: {
      nomePulsante: '每日手工即烹美食',
      descrizione: '每天清晨手工制作的烤串、羊肉串、美食汉堡和裹粉特色肉排。'
    },
    ja_JP: {
      nomePulsante: '毎朝手作りの調理用スペシャリテ',
      descrizione: '串焼き、アロスティチーニ、グルメバーガー、毎朝手作りのカツレツ各種。'
    },
    ru_RU: {
      nomePulsante: 'Полуфабрикаты ручной работы',
      descrizione: 'Шашлычки, арростичини, гурмэ-бургеры и панированные деликатесы, приготовленные вручную каждое утро.'
    },
    ar_SA: {
      nomePulsante: 'جاهز للطهي يومياً',
      descrizione: 'أسياخ مشاوي، برغر فاخر وتخصصات محضرة يدوياً كل صباح.'
    }
  },
  'fb-slide-04': {
    it_IT: {
      nomePulsante: 'Taglieri Salumi & Formaggi',
      descrizione: 'Selezioni di salumi emiliani e formaggi stagionati ideali per eventi, feste e degustazioni.'
    },
    en_US: {
      nomePulsante: 'Charcuterie & Cheese Boards',
      descrizione: 'Selections of Emilian cured meats and aged cheeses ideal for events, parties and tastings.'
    },
    de_DE: {
      nomePulsante: 'Wurst- & Käseplatten',
      descrizione: 'Auswahl an emilianischen Wurstwaren und gereiftem Käse, ideal für Feiern, Events und Verkostungen.'
    },
    fr_FR: {
      nomePulsante: 'Plateaux Charcuteries & Fromages',
      descrizione: 'Sélections de charcuteries émiliennes et fromages affinés idéales pour événements, fêtes et dégustations.'
    },
    es_ES: {
      nomePulsante: 'Tablas de Embutidos y Quesos',
      descrizione: 'Selecciones de embutidos emilianos y quesos curados ideales para eventos, fiestas y degustaciones.'
    },
    nl_NL: {
      nomePulsante: 'Charcuterie- & Kaasplanken',
      descrizione: 'Selecties van Emiliaanse vleeswaren en gerijpte kazen, ideaal voor evenementen, feesten en proeverijen.'
    },
    sv_SE: {
      nomePulsante: 'Chark- & Ostbrickor',
      descrizione: 'Urval av emilianska charkuterier och lagrade ostar, perfekt för evenemang, fester och provningar.'
    },
    zh_CN: {
      nomePulsante: '熟食与奶酪拼盘',
      descrizione: '精选艾米利亚腌肉与陈年奶酪，适合聚会、庆典与品鉴活动。'
    },
    ja_JP: {
      nomePulsante: 'サラミ＆チーズ盛り合わせ',
      descrizione: 'イベントやパーティー、テイスティングに最適なエミリア産サラミと熟成チーズのセレクション。'
    },
    ru_RU: {
      nomePulsante: 'Мясные и сырные плато',
      descrizione: 'Подборки эмилианских деликатесов и выдержанных сыров для праздников, мероприятий и дегустаций.'
    },
    ar_SA: {
      nomePulsante: 'أطباق اللحوم المقددة والأجبان',
      descrizione: 'تشكيلة مختارة من الأجبان المعتقة واللحوم الفاخرة للمناسبات والتذوق.'
    }
  },
  'fb-slide-05': {
    it_IT: {
      nomePulsante: 'La Brace del Weekend',
      descrizione: 'Grigliate miste su ordinazione e specialità cotte alla brace per il pranzo e la cena a Cento.'
    },
    en_US: {
      nomePulsante: 'The Weekend Live Grill',
      descrizione: 'Mixed grills to order and charcoal-cooked specialties for lunch and dinner in Cento.'
    },
    de_DE: {
      nomePulsante: 'Der Wochenend-Holzkohlegrill',
      descrizione: 'Gemischte Grillplatten auf Vorbestellung und Spezialitäten vom Grill zum Mittag- und Abendessen in Cento.'
    },
    fr_FR: {
      nomePulsante: 'La Braise du Week-end',
      descrizione: 'Grillades mixtes sur commande et spécialités cuites à la braise pour le déjeuner et le dîner à Cento.'
    },
    es_ES: {
      nomePulsante: 'La Brasa del Fin de Semana',
      descrizione: 'Parrilladas mixtas por encargo y especialidades a la brasa para el almuerzo y la cena en Cento.'
    },
    nl_NL: {
      nomePulsante: 'De Weekend Houtskoolgrill',
      descrizione: 'Gemengde grillschotels op bestelling en gegrilde specialiteiten voor lunch en diner in Cento.'
    },
    sv_SE: {
      nomePulsante: 'Helgens Glödgrill',
      descrizione: 'Grillbrickor på beställning och kolgrillade specialiteter till lunch och middag i Cento.'
    },
    zh_CN: {
      nomePulsante: '周末炭火烧烤盛宴',
      descrizione: 'Cento 午餐与晚餐定制什锦烤肉拼盘及炭火现烤特色美食。'
    },
    ja_JP: {
      nomePulsante: '週末の炭火グリル',
      descrizione: 'チェントでのランチやディナーに、予約制ミックスグリルと炭火焼きスペシャリテ。'
    },
    ru_RU: {
      nomePulsante: 'Гриль выходного дня',
      descrizione: 'Ассорти на углях под заказ и фирменные блюда с живого огня на обед и ужин в Ченто.'
    },
    ar_SA: {
      nomePulsante: 'مشاوي عطلة نهاية الأسبوع',
      descrizione: 'مشاوي مشكلة حسب الطلب وتخصصات مطهوة على الفحم للغداء والعشاء في تشينتو.'
    }
  }
};

export function getLocalizedSlideContent(
  slide: SlidingImageDescriptor,
  language: LanguageCode
): {
  nomePulsante: string;
  descrizione: string;
  facebookUrl: string;
  openFbLabel: string;
  prevSlideLabel: string;
  nextSlideLabel: string;
} {
  const fromSlideProp = slide.translations?.[language];
  const fromDict = SLIDE_TRANSLATIONS_DICTIONARY[slide.id]?.[language];

  const nomePulsante =
    fromSlideProp?.nomePulsante || fromDict?.nomePulsante || slide.nomePulsante;
  const descrizione =
    fromSlideProp?.descrizione || fromDict?.descrizione || slide.descrizione;

  const fbLocaleMap: Record<LanguageCode, string> = {
    it_IT: 'it_IT',
    en_US: 'en_GB',
    de_DE: 'de_DE',
    fr_FR: 'fr_FR',
    es_ES: 'es_ES',
    nl_NL: 'nl_NL',
    sv_SE: 'sv_SE',
    zh_CN: 'zh_CN',
    ja_JP: 'ja_JP',
    ru_RU: 'ru_RU',
    ar_SA: 'ar_AR'
  };

  const defaultFbUrl = `${FACEBOOK_BASE_PAGE_URL}?locale=${fbLocaleMap[language] || 'it_IT'}`;
  const facebookUrl = slide.facebookUrl || defaultFbUrl;

  const openFbLabels: Record<LanguageCode, string> = {
    it_IT: 'Clicca sulla foto per aprire la pagina Facebook corrispondente in una nuova scheda',
    en_US: 'Click on the photo to open the corresponding Facebook page in a new tab',
    de_DE: 'Klicken Sie auf das Foto, um die entsprechende Facebook-Seite in einem neuen Tab zu öffnen',
    fr_FR: 'Cliquez sur la photo pour ouvrir la page Facebook correspondante dans un nouvel onglet',
    es_ES: 'Haz clic en la foto para abrir la página de Facebook correspondiente en una nueva pestaña',
    nl_NL: 'Klik op de foto om de bijbehorende Facebook-pagina in een nieuw tabblad te openen',
    sv_SE: 'Klicka på bilden för att öppna motsvarande Facebook-sida i en ny flik',
    zh_CN: '点击照片在新标签页中打开相应的 Facebook 页面',
    ja_JP: '写真をクリックすると対応するFacebookページが新しいタブで開きます',
    ru_RU: 'Нажмите на фото, чтобы открыть соответствующую страницу Facebook в новой вкладке',
    ar_SA: 'انقر على الصورة لفتح صفحة فيسبوك المقابلة في علامة تبويب جديدة'
  };

  const prevLabels: Record<LanguageCode, string> = {
    it_IT: 'Immagine precedente',
    en_US: 'Previous image',
    de_DE: 'Vorheriges Bild',
    fr_FR: 'Image précédente',
    es_ES: 'Imagen anterior',
    nl_NL: 'Vorige afbeelding',
    sv_SE: 'Föregående bild',
    zh_CN: '上一张图片',
    ja_JP: '前の画像',
    ru_RU: 'Предыдущее изображение',
    ar_SA: 'الصورة السابقة'
  };

  const nextLabels: Record<LanguageCode, string> = {
    it_IT: 'Immagine successiva',
    en_US: 'Next image',
    de_DE: 'Nächstes Bild',
    fr_FR: 'Image suivante',
    es_ES: 'Imagen siguiente',
    nl_NL: 'Volgende afbeelding',
    sv_SE: 'Nästa bild',
    zh_CN: '下一张图片',
    ja_JP: '次の画像',
    ru_RU: 'Следующее изображение',
    ar_SA: 'الصورة التالية'
  };

  return {
    nomePulsante,
    descrizione,
    facebookUrl,
    openFbLabel: openFbLabels[language] || openFbLabels.it_IT,
    prevSlideLabel: prevLabels[language] || prevLabels.it_IT,
    nextSlideLabel: nextLabels[language] || nextLabels.it_IT
  };
}

export const DEFAULT_SLIDINGS_CONFIG: SlidingConfigItem[] = [
  {
    id: 'sliding-header-principale',
    nome: 'Carousel Header Principale (Stile Antica Gastronomia)',
    bucketPath: 'gs://braciami-ancora.appspot.com/slidings/header-principale/',
    riferimentoPagina: 'tutte',
    tempoDiSliding: 5500,
    descrizione: [
      {
        id: 'slide-macelleria-tagli',
        fileNameOrUrl: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=1400&q=85',
        nomePulsante: 'Carni & Frollature Selezionate',
        descrizione: 'Bistecca Fiorentina, Costate frollate Dry-Aged, Spiedini artigianali e tagli nobili pronti per la brace.',
        facebookUrl: 'https://www.facebook.com/p/Braciami-Ancora-Spaccio-carnisalumi-e-formaggi-100063911893005/?locale=it_IT',
        translations: SLIDE_TRANSLATIONS_DICTIONARY['slide-macelleria-tagli']
      },
      {
        id: 'slide-fb-spaccio-cento',
        fileNameOrUrl: '/facebook/immaginiFB/braciami_fb_04_772264091_1758258615326421_6096648422453479467_n.jpg',
        nomePulsante: 'Dal Nostro Banco Facebook',
        descrizione: 'Scatti reali dallo Spaccio Carni, Salumi e Formaggi in Via Penzale 25 a Cento (FE): preparazioni fresche ogni giorno.',
        facebookUrl: 'https://www.facebook.com/p/Braciami-Ancora-Spaccio-carnisalumi-e-formaggi-100063911893005/?locale=it_IT',
        translations: SLIDE_TRANSLATIONS_DICTIONARY['slide-fb-spaccio-cento']
      },
      {
        id: 'slide-salumi-tradizione',
        fileNameOrUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1400&q=85',
        nomePulsante: 'Salumi Emiliani & Norcineria',
        descrizione: 'Mortadella Bologna IGP, Salame Gentile, Prosciutto Crudo stagionato 24 mesi e Ciccioli caldi di caldaia.',
        facebookUrl: 'https://www.facebook.com/p/Braciami-Ancora-Spaccio-carnisalumi-e-formaggi-100063911893005/?locale=it_IT',
        translations: SLIDE_TRANSLATIONS_DICTIONARY['slide-salumi-tradizione']
      },
      {
        id: 'slide-formaggi-dop',
        fileNameOrUrl: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=1400&q=85',
        nomePulsante: 'Formaggi DOP & Affinati',
        descrizione: 'Parmigiano Reggiano DOP 24/36 mesi, Pecorini affinati e selezioni casearie delle valli emiliane.',
        facebookUrl: 'https://www.facebook.com/p/Braciami-Ancora-Spaccio-carnisalumi-e-formaggi-100063911893005/?locale=it_IT',
        translations: SLIDE_TRANSLATIONS_DICTIONARY['slide-formaggi-dop']
      },
      {
        id: 'slide-gastronomia-brace',
        fileNameOrUrl: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=1400&q=85',
        nomePulsante: 'Gastronomia Pronta & Grill',
        descrizione: 'Lasagne tradizionali al ragù, Polli allo spiedo su brace viva, Arrosti e contorni pronti da gustare.',
        facebookUrl: 'https://www.facebook.com/p/Braciami-Ancora-Spaccio-carnisalumi-e-formaggi-100063911893005/?locale=it_IT',
        translations: SLIDE_TRANSLATIONS_DICTIONARY['slide-gastronomia-brace']
      },
      {
        id: 'slide-fiere-eventi-fb',
        fileNameOrUrl: '/facebook/immaginiFB/braciami_fb_02_773810549_1039742718767009_7651795546715725946_n.jpg',
        nomePulsante: 'Fiere, Eventi & Serate Grill',
        descrizione: 'Degustazioni con musica dal vivo, birre artigianali belga e tedesca, grigliate miste e fiere gastronomiche a Cento.',
        facebookUrl: 'https://www.facebook.com/p/Braciami-Ancora-Spaccio-carnisalumi-e-formaggi-100063911893005/?locale=it_IT',
        translations: SLIDE_TRANSLATIONS_DICTIONARY['slide-fiere-eventi-fb']
      }
    ]
  },
  {
    id: 'sliding-fiere-facebook',
    nome: 'Galleria Facebook & Fiere Braciami Ancora',
    bucketPath: '/facebook/immaginiFB/',
    riferimentoPagina: 'fiere-eventi',
    tempoDiSliding: 4500,
    descrizione: [
      {
        id: 'fb-slide-01',
        fileNameOrUrl: '/facebook/immaginiFB/braciami_fb_01_770387779_3028301420834387_952132987076154334_n.jpg',
        nomePulsante: 'Spaccio Carni Via Penzale 25',
        descrizione: 'La qualità quotidiana del banco macelleria e salumeria di Manuel & Samanta a Cento.',
        facebookUrl: 'https://www.facebook.com/p/Braciami-Ancora-Spaccio-carnisalumi-e-formaggi-100063911893005/?locale=it_IT',
        translations: SLIDE_TRANSLATIONS_DICTIONARY['fb-slide-01']
      },
      {
        id: 'fb-slide-02',
        fileNameOrUrl: '/facebook/immaginiFB/braciami_fb_02_773810549_1039742718767009_7651795546715725946_n.jpg',
        nomePulsante: 'Serate Birra & Grigliata',
        descrizione: 'Serata con musica tedesca, assaggi di birra belga e tedesca e ricchissima Braciami Grigliata.',
        facebookUrl: 'https://www.facebook.com/p/Braciami-Ancora-Spaccio-carnisalumi-e-formaggi-100063911893005/?locale=it_IT',
        translations: SLIDE_TRANSLATIONS_DICTIONARY['fb-slide-02']
      },
      {
        id: 'fb-slide-03',
        fileNameOrUrl: '/facebook/immaginiFB/braciami_fb_03_773981557_2068966200635558_870045967101874812_n.jpg',
        nomePulsante: 'Pronti da Cuocere',
        descrizione: 'Spiedini, arrosticini, hamburger gourmet e specialità panate preparate a mano ogni mattina.',
        facebookUrl: 'https://www.facebook.com/p/Braciami-Ancora-Spaccio-carnisalumi-e-formaggi-100063911893005/?locale=it_IT',
        translations: SLIDE_TRANSLATIONS_DICTIONARY['fb-slide-03']
      },
      {
        id: 'fb-slide-04',
        fileNameOrUrl: '/facebook/immaginiFB/braciami_fb_05_723215903_2144877559792658_6129166077679313086_n.jpg',
        nomePulsante: 'Taglieri Salumi & Formaggi',
        descrizione: 'Selezioni di salumi emiliani e formaggi stagionati ideali per eventi, feste e degustazioni.',
        facebookUrl: 'https://www.facebook.com/p/Braciami-Ancora-Spaccio-carnisalumi-e-formaggi-100063911893005/?locale=it_IT',
        translations: SLIDE_TRANSLATIONS_DICTIONARY['fb-slide-04']
      },
      {
        id: 'fb-slide-05',
        fileNameOrUrl: '/facebook/immaginiFB/braciami_fb_07_740462124_1357611529645740_814416955790715052_n.jpg',
        nomePulsante: 'La Brace del Weekend',
        descrizione: 'Grigliate miste su ordinazione e specialità cotte alla brace per il pranzo e la cena a Cento.',
        facebookUrl: 'https://www.facebook.com/p/Braciami-Ancora-Spaccio-carnisalumi-e-formaggi-100063911893005/?locale=it_IT',
        translations: SLIDE_TRANSLATIONS_DICTIONARY['fb-slide-05']
      }
    ]
  }
];

export const DEFAULT_ACCESSO_ADMIN: AccessoAdminLog = {
  lastUser: 'diegocimarosa@gmail.com',
  timeStamp: new Date().toISOString(),
  fromIp: '127.0.0.1',
  browser: typeof navigator !== 'undefined' ? navigator.userAgent : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
};
