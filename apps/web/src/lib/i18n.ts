export type Language = 'en' | 'om' | 'am';

export interface LanguageOption {
  code: Language;
  label: string;
  nativeLabel: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'English', flag: '🇬🇧' },
  { code: 'om', label: 'Afaan Oromoo', nativeLabel: 'Afaan Oromoo', flag: '🌳' },
  { code: 'am', label: 'Amharic', nativeLabel: 'አማርኛ', flag: '🇪🇹' },
];

export const translations = {
  en: {
    // Top Banner
    badge: 'Official Ethiopian MoA / EAA Registry & Verified Oromia Suppliers',
    title: 'Crop Protection & Agricultural Medicines',
    subtitle:
      'Discover registered fungicides, insecticides, herbicides, seed protectants, and biological controls approved for Ethiopia. Compare prices from verified dealers across Oromia woredas, view safe application labels, and cross-reference with Gebere Vision AI.',
    regionalNote: 'Serving Farmers Across All Zones of Oromia',
    aiDiagnoseBtn: 'Diagnose Leaf Disease with AI',
    listDealerBtn: 'List as Authorized Agro-Dealer',

    // Stats
    statRegistered: 'Registered Medicines',
    statOffers: 'Verified Dealer Offers',
    statCoverage: 'Oromia Wide Coverage',
    statVerified: '100% MoA / EAA Verified',

    // Search and Filters
    searchPlaceholder:
      'Search product name, active ingredient, disease (e.g. rust, CBD, blotch), or registration #...',
    searchBtn: 'Search',
    filterByCrop: 'Filter by Priority Crop:',
    allCrops: 'All Crops',
    allCategories: 'All Categories',
    allZones: 'All Zones',
    categories: {
      all: 'All Categories',
      fungicide: 'Fungicides',
      insecticide: 'Insecticides',
      herbicide: 'Herbicides',
      seed_treatment: 'Seed Treatments',
      biological_control: 'Biological Controls',
    },
    crops: {
      all: 'All',
      Coffee: 'Coffee',
      Teff: 'Teff',
      Wheat: 'Wheat',
      Barley: 'Barley',
    },

    // Product Card
    approvedCrops: 'Approved Crops:',
    targetPests: 'Target Diseases / Pests:',
    phiLabel: '⏱️ PHI:',
    days: 'days',
    localOffersFrom: 'Local Offers from:',
    dealersOnRequest: 'Dealers on request',
    viewLabelBtn: 'View Label & Dealers',
    brand: 'Brand',
    activeIng: 'Active Ingredient',

    // Modal Details
    modalRegBadge: 'Verified National Registry Record',
    regAuthority: 'Registration Authority:',
    sourceOrg: 'Source Authority:',
    whoRating: 'WHO Toxicity Rating:',
    phiDays: 'Pre-Harvest Interval (PHI):',
    approvedUsesTitle: 'Approved Agricultural Uses & Application Instructions',
    cropLabel: 'Crop:',
    targetProblemLabel: 'Target Problem:',
    appMethodLabel: 'Application Method:',
    optimalTimingLabel: 'Optimal Timing:',
    safetyLabelNote: 'Safety Label Note:',
    mandatoryPPE: 'Mandatory PPE Equipment',
    safetyPrecautions: 'Safety Precautions',
    safeStorage: 'Safe Storage:',
    safeDisposal: 'Safe Disposal:',
    localDealersTitle: 'Verified Local Input Dealers in Oromia',
    offersAvailable: 'offers available',
    licensedDealer: 'Licensed Dealer',
    inStock: 'In Stock',
    inquireBuyBtn: 'Inquire / Buy',
    closeBtn: 'Close Label',
    noDealersInZone:
      'No active input dealer listings currently registered in this zone. You can contact your Woreda Agricultural Cooperative Union directly.',

    // Inquiry Modal
    inquiryTitle: 'Contact Authorized Dealer',
    directLine: 'Direct Dealer Line:',
    fullNameLabel: 'Your Full Name:',
    phoneLabel: 'Your Phone Number:',
    quantityLabel: 'Quantity Needed:',
    totalEstLabel: 'Total Estimated:',
    messageLabel: 'Message or Pickup Note:',
    sendInquiryBtn: 'Send Order Inquiry',
    sendingBtn: 'Sending...',
    cancelBtn: 'Cancel',
    inquirySuccessTitle: 'Inquiry Transmitted!',
    inquirySuccessMsg:
      'The dealer has received your contact details and will call you shortly.',

    // Dealer Listing Modal
    dealerListingTitle: 'Authorized Agro-Dealer Listing',
    dealerListingSubtitle:
      'Publish verified inventory for legal crop-protection medicines in Oromia.',
    selectProductLabel: 'Select Registered Product (Mandatory Registration Check):',
    selectProductDefault: '-- Choose Registered Product --',
    dealerNameLabel: 'Dealer / Company Name:',
    storeNameLabel: 'Store / Depot Name:',
    packageSizeLabel: 'Package Size:',
    priceLabel: 'Price (ETB):',
    zoneLabel: 'Zone (Oromia):',
    woredaLabel: 'Woreda:',
    licenseLabel: 'Dealer License #:',
    contactPhoneLabel: 'Contact Phone:',
    publishBtn: 'Publish Inventory',
    publishingBtn: 'Publishing...',
    publishSuccessTitle: 'Inventory Listed Successfully!',
    publishSuccessMsg: 'Your offer is now visible to farmers across Oromia.',

    // IPM Educational Guide
    ipmTitle: 'Integrated Pest Management (IPM) & Safety Policy',
    ipmBody:
      'Chemical crop medicines must never be applied as a routine prophylactic measure. Always adopt IPM hierarchy: (1) Plant certified disease-resistant varieties developed by EIAR/JARC/DZARC; (2) Implement field sanitation and 2-year crop rotations with non-host legumes; (3) Encourage beneficial biological predators and bio-control protectants; (4) Apply synthetic chemical treatments strictly when economic thresholds are breached and confirmed with your Kebele Development Agent (DA).',
    ipmRule1: 'Never spray during flowering hours to protect honeybee colonies.',
    ipmRule2: 'Triple-rinse and puncture chemical containers; never store food in them.',
    ipmRule3: 'Strictly observe Pre-Harvest Intervals (PHI) before marketing crops.',

    // Empty / Error
    noProductsMatch: 'No registered products matched your filters',
    noProductsAdvice:
      'Try broadening your search term or select "All Crops" and "All Categories" to view all officially evaluated Ethiopian crop protection products.',
    resetFiltersBtn: 'Reset Filters',
    loadingText: 'Querying verified agricultural medicines...',

    // Gebere Vision AI Integration
    aiIntegrationTitle: 'Verified Crop Protection Medicines',
    aiSafetyWarningTitle: 'Strict Safety & Non-Prescription Notice:',
    aiSafetyWarningBody:
      'AI diagnosis is strictly preliminary and does NOT prescribe chemical pesticides. Never guess mixing dosages or apply off-label products. Always prioritize cultural sanitation and inspect field economic damage thresholds with your local Development Agent (DA).',
    aiExploreCatalog: 'Explore Catalog',
    aiFindDealers: 'Find Dealers',
  },

  om: {
    // Top Banner
    badge: 'Galmee Mootummaa Itiyoophiyaa (MoA/EAA) fi Daldaltoota Hayyama Qaban Oromiyaa',
    title: 'Eegumsa Oomishaa fi Qorichoota Qonnaa',
    subtitle:
      'Qorichoota farra fangaasii, farra ilbiisotaa, farra aramaa, qoricha sanyii, fi to’annoo baayoloojikaalaa Itiyoophiyaatti beekamtii argatan argadhaa. Gatii daldaltoota hayyama qaban aanaalee Oromiyaa keessaa wal-bira qabaa, qajeelfama fayyadama nageenyaa dubbisaa, akkasumas Gebere Vision AI waliin qindeessaa.',
    regionalNote: 'Qonnaan Bultoota Godinoota Oromiyaa Hundaaf',
    aiDiagnoseBtn: 'Dhibee Baalaa AI dhaan Qoradhu',
    listDealerBtn: 'Akka Daldalaa Qorichaatti Galmaa’i',

    // Stats
    statRegistered: 'Qorichoota Galmaa’an',
    statOffers: 'Dhiyeessii Daldaltootaa',
    statCoverage: 'Oromiyaa Guutuu',
    statVerified: '100% MoA / EAA Eeyyamame',

    // Search and Filters
    searchPlaceholder:
      'Maqaa qorichaa, qabiyyee keemikaalaa, dhibee (fakkeenyaaf: waagii, CBD), ykn lakk. galmee barbaadaa...',
    searchBtn: 'Barbaadi',
    filterByCrop: 'Akka Oomishaatti Calali:',
    allCrops: 'Oomisha Hunda',
    allCategories: 'Kutaa Qorichaa Hunda',
    allZones: 'Godinaalee Hunda',
    categories: {
      all: 'Kutaa Hunda',
      fungicide: 'Farra Fangaasii (Dhibee)',
      insecticide: 'Farra Ilbiisotaa',
      herbicide: 'Farra Aramaa',
      seed_treatment: 'Qoricha Qulqullina Sanyii',
      biological_control: 'To’annoo Baayoloojikaalaa',
    },
    crops: {
      all: 'Hunda',
      Coffee: 'Buna',
      Teff: 'Xaafii',
      Wheat: 'Qamadii',
      Barley: 'Garbuu',
    },

    // Product Card
    approvedCrops: 'Oomishaalee Eeyyamaman:',
    targetPests: 'Dhibeewwan fi Ilbiisota Qiyyaafatan:',
    phiLabel: '⏱️ Yeroo Eegumsaa (PHI):',
    days: 'guyyoota',
    localOffersFrom: 'Gatii Daldaltoota Naannoo:',
    dealersOnRequest: 'Gaaffiidhaan dhiyaata',
    viewLabelBtn: 'Qajeelfama fi Daldaltoota Ilaali',
    brand: 'Gosa Brandii',
    activeIng: 'Qabiyyee Qorichaa',

    // Modal Details
    modalRegBadge: 'Galmee Mootummaa Eeyyamamee fi Mirkanaa’e',
    regAuthority: 'Abbaa Taayitaa Galmeesse:',
    sourceOrg: 'Madda Odeeffannoo:',
    whoRating: 'Sadarkaa Balaa WHO:',
    phiDays: 'Yeroo Eegumsa Haamaa Duraa (PHI):',
    approvedUsesTitle: 'Fayyadama Qonnaa Eeyyamame fi Qajeelfama Biifaa',
    cropLabel: 'Oomisha:',
    targetProblemLabel: 'Dhibee / Ilbiisa:',
    appMethodLabel: 'Mala Itti Fayyadamaa:',
    optimalTimingLabel: 'Yeroo Sirrii Itti Biifamu:',
    safetyLabelNote: 'Hubachiisa Nageenya Waraqaa Qorichaa:',
    mandatoryPPE: 'Meeshaalee Eegumsa Dhuunfaa Dirqamaa',
    safetyPrecautions: 'Of Eeggannoo Nageenyaa',
    safeStorage: 'Haala Kuusaa Nageenya Qabu:',
    safeDisposal: 'Qodaa Qorichaa Dhabamsiisuu:',
    localDealersTitle: 'Daldaltoota Qorichaa Hayyama Qaban Oromiyaa Keessatti',
    offersAvailable: 'dhiyeessiin jiru',
    licensedDealer: 'Daldalaa Hayyama Qabu',
    inStock: 'Kuusaa Keessa Jira',
    inquireBuyBtn: 'Biti / Gaafadhu',
    closeBtn: 'Cufi',
    noDealersInZone:
      'Godina kana keessatti daldalaan qoricha kana gurguru yeroof hin galmoofne. Yuuniyeenii Qonnaan Bultoota Aanaa keessanii qunnamaa.',

    // Inquiry Modal
    inquiryTitle: 'Daldalaa Hayyama Qabu Qunnami',
    directLine: 'Bilbila Daldalaa Qajeeltoo:',
    fullNameLabel: 'Maqaa Keessan Guutuu:',
    phoneLabel: 'Lakk. Bilbila Keessanii:',
    quantityLabel: 'Hamma Barbaaddan:',
    totalEstLabel: 'Gatii Tilmaamaa Waliigalaa:',
    messageLabel: 'Ergaa ykn Ibsa Fudhannaa:',
    sendInquiryBtn: 'Gaaffii Ajajaa Ergi',
    sendingBtn: 'Ergamaa jira...',
    cancelBtn: 'Dhiisi',
    inquirySuccessTitle: 'Gaaffiin Keessan Daldalaaf Ergameera!',
    inquirySuccessMsg:
      'Daldalaan odeeffannoo keessan argatee jira, dafee isiniif bilbila.',

    // Dealer Listing Modal
    dealerListingTitle: 'Galmee Daldalaa Qoricha Qonnaa Hayyama Qabuu',
    dealerListingSubtitle:
      'Qorichoota seeraan eeyyamaman qonnaan bultoota Oromiyaatiif dhiyeessaa.',
    selectProductLabel: 'Qoricha Galmaa’e Filadhu (Dirqama Seeraa):',
    selectProductDefault: '-- Qoricha Galmaa’e Filadhaa --',
    dealerNameLabel: 'Maqaa Daldalaa / Dhaabbataa:',
    storeNameLabel: 'Maqaa Kuusaa / Suuqii:',
    packageSizeLabel: 'Hamma Qodaa (Saayizii):',
    priceLabel: 'Gatii (Qarshii):',
    zoneLabel: 'Godina (Oromiyaa):',
    woredaLabel: 'Aanaa:',
    licenseLabel: 'Lakk. Hayyama Daldalaa:',
    contactPhoneLabel: 'Lakk. Bilbilaa:',
    publishBtn: 'Gabaaf Dhiyeessi',
    publishingBtn: 'Dhiyaachaa jira...',
    publishSuccessTitle: 'Qorichi Milkaa’inaan Galmaa’eera!',
    publishSuccessMsg: 'Qorichi keessan amma qonnaan bultoota Oromiyaa hundaaf mul’ata.',

    // IPM Educational Guide
    ipmTitle: 'Imaammata Nageenyaa fi To’annoo Dhibee Qindaa’aa (IPM)',
    ipmBody:
      'Qorichi keemikaalaa matumaa akka barachuutti yeroo hunda biifamuu hin qabu. Yeroo hunda sadarkaa IPM hordofaa: (1) Sanyii filatamaa dhibee dandamatu kan EIAR/JARC/DZARC qopheesse facaasaa; (2) Qulqullina maasii eegaa, oomisha jijjiirraa waggaa lamaa dhangaggoo waliin godhaa; (3) Uumamoota ilbiisa gaarii fi qoricha uumamaa jajjabeessaa; (4) Keemikaala yeroo miidhaan dinagdee guddatee fi ogeessa DA aanaatiin mirkanaa’e qofa biifaa.',
    ipmRule1: 'Kanniisa dammaa eeguuf yeroo abaaboon darbutti matumaa hin biifinaa.',
    ipmRule2: 'Qodaa qorichaa si’a sadii dhiqaatii tarsaasaa; matumaa nyaata keessa hin kaa’inaa.',
    ipmRule3: 'Oomisha gabaatti dhiyeessuun dura yeroo eegumsa haamaa (PHI) sirriitti eegaa.',

    // Empty / Error
    noProductsMatch: 'Qorichi barbaaddan hin argamne',
    noProductsAdvice:
      'Jecha biraatiin barbaadaa ykn "Oomisha Hunda" fi "Kutaa Hunda" filachuun qorichoota eeyyamaman hunda ilaalaa.',
    resetFiltersBtn: 'Calaltuu Jalqabatti Deebisi',
    loadingText: 'Qorichoonni qonnaa eeyyamaman fe’amaa jiru...',

    // Gebere Vision AI Integration
    aiIntegrationTitle: 'Qorichoota Qonnaa Eeyyamaman',
    aiSafetyWarningTitle: 'Akeekkachiisa Nageenyaa fi Ajaja Hin Taane:',
    aiSafetyWarningBody:
      'Qorannoon AI kun odeeffannoo qofaaf; matumaa qoricha keemikaalaa hin ajaju. Qoricha utuu hin beekin hin biifinaa. Qulqullina maasii dura dursaa, ogeessa DA aanaa keessanii mariisisaa.',
    aiExploreCatalog: 'Kataloogii Guutuu Ilaali',
    aiFindDealers: 'Daldaltoota Bari',
  },

  am: {
    // Top Banner
    badge: 'የኢትዮጵያ ግብርና ሚኒስቴር (MoA/EAA) ሕጋዊ ምዝገባ እና የኦሮሚያ አቅራቢዎች',
    title: 'የሰብል ጥበቃ እና የግብርና መድኃኒቶች',
    subtitle:
      'በኢትዮጵያ ውስጥ የተመዘገቡ የፈንገስ፣ የተባይ፣ የአረም፣ የዘር ማከሚያ እና ባዮሎጂካል መድኃኒቶችን ያግኙ። በኦሮሚያ ወረዳዎች ውስጥ ካሉ ሕጋዊ አቅራቢዎች ዋጋዎችን ያወዳድሩ፣ የደህንነት መመሪያዎችን ይመልከቱ፣ እና ከገበሬ ቪዥን AI ጋር ያገናኙ።',
    regionalNote: 'ለሁሉም የኦሮሚያ ዞኖች አርሶ አደሮች የቀረበ',
    aiDiagnoseBtn: 'የቅጠል በሽታን በAI መርምር',
    listDealerBtn: 'ሕጋዊ አቅራቢ ሆነው ይመዝገቡ',

    // Stats
    statRegistered: 'የተመዘገቡ መድኃኒቶች',
    statOffers: 'የአቅራቢዎች ምርቶች',
    statCoverage: 'መላው ኦሮሚያ ሽፋን',
    statVerified: '100% ሕጋዊና የተረጋገጠ',

    // Search and Filters
    searchPlaceholder:
      'የመድኃኒቱን ስም፣ ንቁ ኬሚካል ቅመም፣ በሽታ (ለምሳሌ፡ ዝገት፣ ቦረንቲ)፣ ወይም የምዝገባ ቁጥር ይፈልጉ...',
    searchBtn: 'ፈልግ',
    filterByCrop: 'በሰብል ዓይነት ይለዩ:',
    allCrops: 'ሁሉም ሰብሎች',
    allCategories: 'ሁሉም ምድቦች',
    allZones: 'ሁሉም ዞኖች',
    categories: {
      all: 'ሁሉም ምድቦች',
      fungicide: 'የፈንገስ ማጥፊያ',
      insecticide: 'የተባይ ማጥፊያ',
      herbicide: 'የአረም ማጥፊያ',
      seed_treatment: 'የዘር ማከሚያ',
      biological_control: 'የተፈጥሮ ባዮ-ቁጥጥር',
    },
    crops: {
      all: 'ሁሉም',
      Coffee: 'ቡና',
      Teff: 'ጤፍ',
      Wheat: 'ስንዴ',
      Barley: 'ገብስ',
    },

    // Product Card
    approvedCrops: 'የተፈቀዱ ሰብሎች:',
    targetPests: 'የሚከላከላቸው በሽታዎች / ተባዮች:',
    phiLabel: '⏱️ የጥበቃ ቀናት (PHI):',
    days: 'ቀናት',
    localOffersFrom: 'የአካባቢ አቅራቢዎች ዋጋ:',
    dealersOnRequest: 'በጥያቄ የሚቀርብ',
    viewLabelBtn: 'መመሪያ እና አቅራቢዎችን እይ',
    brand: 'የንግድ ስም (ብራንድ)',
    activeIng: 'ንቁ ኬሚካል ቅመም',

    // Modal Details
    modalRegBadge: 'በመንግሥት የተመዘገበ ሕጋዊ ሰነድ',
    regAuthority: 'መዝጋቢ ባለሥልጣን:',
    sourceOrg: 'የመረጃ ምንጭ:',
    whoRating: 'የዓለም ጤና ድርጅት (WHO) የአደጋ ደረጃ:',
    phiDays: 'ከምርት ስብሰባ በፊት መቆየት ያለበት ጊዜ (PHI):',
    approvedUsesTitle: 'የተፈቀዱ የግብርና አጠቃቀሞች እና የመርጫ መመሪያዎች',
    cropLabel: 'ሰብል:',
    targetProblemLabel: 'ዒላማ ችግር / በሽታ:',
    appMethodLabel: 'የአጠቃቀም ዘዴ:',
    optimalTimingLabel: 'ተመራጭ የመርጫ ወቅት:',
    safetyLabelNote: 'የመለያ ደህንነት ማስታወሻ:',
    mandatoryPPE: 'ግዴታ የሆኑ የግል ደህንነት መጠበቂያ አልባሳት',
    safetyPrecautions: 'የጥንቃቄ እርምጃዎች',
    safeStorage: 'ደህንነቱ የተጠበቀ የመድኃኒት አያያዝ:',
    safeDisposal: 'የባዶ እቃዎች አወጋገድ:',
    localDealersTitle: 'በኦሮሚያ ያሉ ሕጋዊ የግብርና መድኃኒት አቅራቢዎች',
    offersAvailable: 'ያሉ አቅራቢዎች',
    licensedDealer: 'ሕጋዊ ፈቃድ ያለው',
    inStock: 'በክምችት ላይ ያለ',
    inquireBuyBtn: 'ይዘዙ / ይጠይቁ',
    closeBtn: 'ዝጋ',
    noDealersInZone:
      'በዚህ ዞን ውስጥ በአሁኑ ጊዜ የተመዘገበ አቅራቢ የለም። የወረዳዎን የግብርና ኅብረት ሥራ ማህበር በቀጥታ ማነጋገር ይችላሉ።',

    // Inquiry Modal
    inquiryTitle: 'ሕጋዊ አቅራቢውን ያነጋግሩ',
    directLine: 'የአቅራቢው ቀጥታ ስልክ:',
    fullNameLabel: 'ሙሉ ስምዎት:',
    phoneLabel: 'ስልክ ቁጥርዎት:',
    quantityLabel: 'የሚፈልጉት መጠን:',
    totalEstLabel: 'የተገመተ ጠቅላላ ዋጋ:',
    messageLabel: 'መልእክት ወይም የማስታወሻ ጽሑፍ:',
    sendInquiryBtn: 'የትዕዛዝ ጥያቄውን ላክ',
    sendingBtn: 'እየተላከ ነው...',
    cancelBtn: 'ተመለስ',
    inquirySuccessTitle: 'ጥያቄዎት ለአቅራቢው ደርሷል!',
    inquirySuccessMsg: 'አቅራቢው የእርስዎን መረጃ ተቀብሏል፤ በቅርቡ በስልክ ያነጋግርዎታል።',

    // Dealer Listing Modal
    dealerListingTitle: 'የሕጋዊ ግብርና መድኃኒት አቅራቢ ምዝገባ',
    dealerListingSubtitle:
      'በኦሮሚያ ላሉ አርሶ አደሮች ሕጋዊ የሆኑ የግብርና መድኃኒቶችን ያቅርቡ።',
    selectProductLabel: 'የተመዘገበውን መድኃኒት ይምረጡ (የሕግ ግዴታ):',
    selectProductDefault: '-- የተመዘገበ መድኃኒት ይምረጡ --',
    dealerNameLabel: 'የአቅራቢው / ድርጅቱ ስም:',
    storeNameLabel: 'የመደብሩ / መጋዘኑ ስም:',
    packageSizeLabel: 'የእቃው መጠን (ጥቅል):',
    priceLabel: 'ዋጋ (በብር):',
    zoneLabel: 'ዞን (ኦሮሚያ):',
    woredaLabel: 'ወረዳ:',
    licenseLabel: 'የንግድ ፈቃድ ቁጥር:',
    contactPhoneLabel: 'ስልክ ቁጥር:',
    publishBtn: 'ምርቱን ለገበያ አቅርብ',
    publishingBtn: 'እየቀረበ ነው...',
    publishSuccessTitle: 'ምርቱ በተሳካ ሁኔታ ተመዝግቧል!',
    publishSuccessMsg: 'ያቀረቡት ምርት አሁን በመላው ኦሮሚያ ላሉ አርሶ አደሮች ይታያል።',

    // IPM Educational Guide
    ipmTitle: 'የተቀናጀ የተባይ እና የበሽታ መቆጣጠሪያ መመሪያ (IPM)',
    ipmBody:
      'የኬሚካል መድኃኒቶችን እንደ ተራ ልማድ ሁልጊዜ መርጨት በጥብቅ የተከለከለ ነው። ሁልጊዜ የተቀናጀ ዘዴን ይከተሉ፡ (1) በምርምር ማዕከላት የተረጋገጡ በሽታ-ተከላካይ ዘሮችን ይዝሩ፤ (2) ማሳዎን ያጽዱ፣ የሁለት ዓመት የሰብል ፈረቃን ከአተርና ባቄላ ጋር ይተግብሩ፤ (3) ጠቃሚ የተፈጥሮ ነፍሳትን እና ባዮሎጂካል መድኃኒቶችን ይጠቀሙ፤ (4) የኢኮኖሚ ጉዳት ደረጃው ሲያልፍ እና በወረዳው የልማት ጣቢያ ባለሙያ (DA) ሲረጋገጥ ብቻ ኬሚካል ይጠቀሙ።',
    ipmRule1: 'የማር ንቦችን ለመጠበቅ ሰብሉ ባበበበት ወቅት በጭራሽ አይርጩ።',
    ipmRule2: 'የመድኃኒት እቃዎችን ሦስት ጊዜ በማጠብ ያበላሹ፤ ለምግብ ማስቀመጫ በጭራሽ አይጠቀሙ።',
    ipmRule3: 'ምርቱን ለገበያ ከማቅረብዎ በፊት የተገለጸውን የጥበቃ ቀናት (PHI) በጥብቅ ይተግብሩ።',

    // Empty / Error
    noProductsMatch: 'ምንም የተመዘገበ ምርት አልተገኘም',
    noProductsAdvice:
      'እባክዎ ሌላ ቃል ይፈልጉ ወይም "ሁሉንም ሰብሎች" እና "ሁሉንም ምድቦች" በመምረጥ የተመዘገቡትን ምርቶች ይመልከቱ።',
    resetFiltersBtn: 'ማጣሪያውን ወደ ነበረበት መልስ',
    loadingText: 'የተመዘገቡ የግብርና መድኃኒቶች እየተፈለጉ ነው...',

    // Gebere Vision AI Integration
    aiIntegrationTitle: 'የተፈቀዱ የሰብል ጥበቃ መድኃኒቶች',
    aiSafetyWarningTitle: 'ጥብቅ የደህንነት እና ያለሐኪም ትዕዛዝ ያለመጠቀም ማሳሰቢያ:',
    aiSafetyWarningBody:
      'የአርቴፊሻል ኢንተለጀንስ (AI) ውጤት ቅድመ-ምርመራ ብቻ እንጂ ኬሚካል አያዝም። መጠኑን ሳይረዱ በግምት በጭራሽ አይርጩ። ሁልጊዜ የተፈጥሮ መከላከያዎችን ያስቀድሙ፣ የኬሚካል መድኃኒት ከመጠቀምዎ በፊት የአካባቢዎን የልማት ጣቢያ ሠራተኛ (DA) ያማክሩ።',
    aiExploreCatalog: 'ሁሉንም ይመልከቱ',
    aiFindDealers: 'አቅራቢዎችን ፈልግ',
  },
};

export const platformTranslations = {
  en: {
    brandName: 'Gebere 360',
    tagline: 'Know Your Farm. Control Your Costs. Grow Your Profits.',
    nav: {
      dashboard: 'Dashboard',
      farms: 'My Farm',
      landCalculator: 'Land Calculator',
      crops: 'Crops',
      expenses: 'Expenses',
      finance: 'Finance Dashboard',
      marketplace: 'Markets',
      cropHealth: 'Gebere Vision AI',
      cropProtection: 'Crop Protection',
      profile: 'Settings',
      help: 'Help',
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
    },
    home: {
      badge: "Built for Ethiopia's growers",
      heroTitle: 'Better farming starts with a clearer view.',
      heroDesc:
        'Gebere 360 brings farm intelligence, field operations, crop health, and market access into one calm, practical workspace.',
      startBtn: 'Start your farm workspace',
      exploreBtn: 'Explore the platform',
      approachLabel: 'The Gebere 360 approach',
      approachTitle: 'Less guesswork. More progress.',
      approachDesc:
        'Your farm is a living system. We designed the platform to keep the important signals together, so farmers, cooperatives, and agronomists can act with confidence.',
      openWorkspace: 'Open workspace',
      ctaTitle: 'A professional operating layer for every growing season.',
      ctaDesc:
        'Create your account, add your first farm, and build a reliable record of the decisions that move your harvest forward.',
      ctaBtn: 'Create your account',
    },
    auth: {
      welcomeBack: 'Welcome Back',
      createAccount: 'Create Your Account',
      emailOrPhone: 'Phone Number or Email',
      emailLabel: 'Email address',
      fullName: 'Full Name',
      password: 'Password',
      forgotPassword: 'Forgot password?',
      loginBtn: 'Login',
      signingIn: 'Signing in...',
      registerBtn: 'Register',
      creatingAccount: 'Creating Account...',
      noAccount: "Don't have an account?",
      hasAccount: 'Already have an account?',
      farmLocation: 'Farm Location',
      selectZone: 'Select your farm zone',
      accountRole: 'Account Role',
      preferredLang: 'Preferred Language',
      selectLang: 'Select a language',
      roles: {
        farmer: 'Farmer',
        buyer: 'Agricultural Buyer',
        agronomist: 'Agricultural Expert',
        cooperative_manager: 'Cooperative Manager',
      },
    },
    dashboard: {
      title: 'Farm Operations Dashboard',
      subtitle: 'Centralized telemetry for registered land parcels, seasonal costs, and harvest lots.',
      goToFarm: 'Go to My Farm',
      registeredLand: 'Registered Land',
      seasonalExpenses: 'Seasonal Expenses',
      expectedRevenue: 'Expected Revenue',
      measuredPlots: 'Measured Plots',
    },
    farms: {
      title: 'My Registered Farms',
      subtitle: 'Manage farm parcels, planting & harvesting dates, and field activities across Ethiopia.',
      addFarm: 'Register New Farm',
    },
    land: {
      title: 'Land-Area & Valuation Calculator',
      subtitle: 'Measure rectangular plots or draw map boundaries with instant hectare and ETB valuation.',
      rectangularTab: 'Rectangular Plot',
      polygonTab: 'Map Polygon',
      calculateBtn: 'Calculate Area',
      saveBtn: 'Save Land Record',
    },
    finance: {
      title: 'Financial Analytics & Profit/Loss',
      subtitle: 'Monitor input costs, harvest revenues, and net farm profitability in ETB.',
      expensesTitle: 'Farm Expense Ledger',
      expensesSubtitle: 'Record seeds, fertilizers, pesticides, labor, irrigation, and transport costs.',
      addExpense: 'Log Expense',
      addHarvest: 'Record Harvest',
    },
    marketplace: {
      title: 'Agricultural B2B Marketplace',
      subtitle: 'Connect verified Ethiopian farmers and cooperatives directly with buyers.',
      listProduce: 'List Produce',
      searchPlaceholder: 'Search commodity, variety, or woreda...',
    },
    actions: {
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      submit: 'Submit',
      search: 'Search',
      loading: 'Loading...',
      calculate: 'Calculate',
    },
    errors: {
      unauthorized: 'Please sign in to access your farm records.',
      network: 'Unable to reach Gebere 360 server. Please check your connection.',
      validation: 'Please check the required fields and try again.',
    },
  },
  om: {
    brandName: 'Gebere 360',
    tagline: 'Maasii Kee Beeki. Baasii Kee To’adhu. Bu’aa Kee Guddisi.',
    nav: {
      dashboard: 'Daashboordii',
      farms: 'Maasii Koo',
      landCalculator: 'Shakallii Lafaa',
      crops: 'Oomishaalee',
      expenses: 'Baasiiwwan',
      finance: 'Fayinaansii',
      marketplace: 'Gabaa',
      cropHealth: 'Gebere Vision AI',
      cropProtection: 'Eegumsa Oomishaa',
      profile: "Qindaa'ina",
      help: 'Gargaarsa',
      login: 'Seeni',
      register: 'Galmaa’i',
      logout: 'Ba’i',
    },
    home: {
      badge: 'Qonnaan bultoota Itoophiyaaf kan qophaa’e',
      heroTitle: 'Qonni gaariin mul’ata qulqulluu irraa eegala.',
      heroDesc:
        'Gebere 360 beekumsa qonnaa, hojii maasii, fayyaa midhaanii fi carraa gabaa bakka tokkotti fida.',
      startBtn: 'Maasii kee eegali',
      exploreBtn: 'Tajaajiloota ilaali',
      approachLabel: 'Mala Gebere 360',
      approachTitle: 'Tilmaama hir’isuu. Bu’aa dabaluu.',
      approachDesc:
        'Maasiin kee sirna lubbuu qabuudha. Qonnaan bultoonni, waldaaleen fi ogeeyyiin qonnaa murtoo sirrii akka fudhatan gargaarra.',
      openWorkspace: 'Bani',
      ctaTitle: 'Waqtii qonnaa hundaaf sirna hojii ammayyaa.',
      ctaDesc:
        'Herrega kee bani, maasii kee jalqabaa galmeessi, murtoo oomisha kee guddisu hunda galmeeffadhu.',
      ctaBtn: 'Herrega bani',
    },
    auth: {
      welcomeBack: 'Baga Nagaan Deebitan',
      createAccount: 'Herrega Haaraa Bani',
      emailOrPhone: 'Lakkoofsa Bilbilaa ykn Iimeelii',
      emailLabel: 'Teessoo Iimeelii',
      fullName: 'Maqaa Guutuu',
      password: 'Jecha Darbii',
      forgotPassword: 'Jecha darbii dagattee?',
      loginBtn: 'Seeni',
      signingIn: 'Seenaa jira...',
      registerBtn: 'Galmaa’i',
      creatingAccount: 'Galmaa’aa jira...',
      noAccount: 'Herrega hin qabduu?',
      hasAccount: 'Kanaan dura herrega qabdaa?',
      farmLocation: 'Bakka Maasii',
      selectZone: 'Godina maasii keetii filadhu',
      accountRole: 'Gahee Herregaa',
      preferredLang: 'Afaan Filatamaa',
      selectLang: 'Afaan filadhu',
      roles: {
        farmer: 'Qonnaan Bulaa',
        buyer: 'Bitaa Oomisha Qonnaa',
        agronomist: 'Ogeessa Qonnaa',
        cooperative_manager: 'Hoggansa Waldaa',
      },
    },
    dashboard: {
      title: 'Daashboordii Hojii Maasii',
      subtitle: 'Odeeffannoo lafa galmaa’ee, baasii waqtii fi oomisha sassaabamee.',
      goToFarm: 'Gara Maasii Koo',
      registeredLand: 'Lafa Galmaa’e',
      seasonalExpenses: 'Baasii Waqtii',
      expectedRevenue: 'Galii Tilmaamame',
      measuredPlots: 'Lafaawwan Safaraman',
    },
    farms: {
      title: 'Maasiiwwan Koo Galmaa’an',
      subtitle: 'Maasiiwwan, guyyaa facaasaa fi sassaabbii akkasumas hojiiwwan maasii to’adhu.',
      addFarm: 'Maasii Haaraa Galmeessi',
    },
    land: {
      title: 'Shallaggii Bal’ina fi Gatii Lafaa',
      subtitle: 'Bal’ina lafaa meetiraafi heektaaraan akkasumas gatii lafaa ETB’n shallagi.',
      rectangularTab: 'Lafa Rog-afree',
      polygonTab: 'Kaartaa Pooliigoonii',
      calculateBtn: 'Bal’ina Shallagi',
      saveBtn: 'Galmee Lafaa Olkaa’i',
    },
    finance: {
      title: 'Xiinxala Faayinaansii fi Bu’aa/Kasaaraa',
      subtitle: 'Baasii galteewwanii, galii oomishaa fi bu’aa qulqulluu ETB’n hordofi.',
      expensesTitle: 'Galmee Baasii Maasii',
      expensesSubtitle: 'Baasii sanyii, xaa’oo, qorichaa, humna namaa, jallisii fi geejjibaa galmeessi.',
      addExpense: 'Baasii Galmeessi',
      addHarvest: 'Oomisha Galmeessi',
    },
    marketplace: {
      title: 'Gabaa Oomisha Qonnaa B2B',
      subtitle: 'Qonnaan bultootaafi waldaalee qonnaa bittoota waliin kallattiin walqunnamsiisa.',
      listProduce: 'Oomisha Gabaa Baasi',
      searchPlaceholder: 'Oomisha, gosa ykn aanaa barbaadi...',
    },
    actions: {
      save: 'Olkaa’i',
      cancel: 'Haqi',
      delete: 'Balleessi',
      edit: 'Gulaali',
      submit: 'Ergi',
      search: 'Barbaadi',
      loading: 'Fe’aa jira...',
      calculate: 'Shallagi',
    },
    errors: {
      unauthorized: 'Galmee maasii keessanii arguuf maaloo seenaa.',
      network: 'Sarvarii Gebere 360 argachuu hin dandeenye. Interneetii keessan mirkaneessaa.',
      validation: 'Maaloo iddoowwan barbaachisan sirriitti guutaa.',
    },
  },
  am: {
    brandName: 'Gebere 360',
    tagline: 'ማሳዎን ይወቁ። ወጪዎን ይቆጣጠሩ። ትርፍዎን ያሳድጉ።',
    nav: {
      dashboard: 'ዳሽቦርድ',
      farms: 'ማሳዬ',
      landCalculator: 'የመሬት ስሌት',
      crops: 'ሰብሎች',
      expenses: 'ወጪዎች',
      finance: 'ፋይናንስ',
      marketplace: 'ገበያ',
      cropHealth: 'Gebere Vision AI',
      cropProtection: 'የሰብል ጥበቃ',
      profile: 'ቅንብሮች',
      help: 'እርዳታ',
      login: 'ግባ',
      register: 'ተመዝገብ',
      logout: 'ውጣ',
    },
    home: {
      badge: 'ለኢትዮጵያ አርሶ አደሮች የተዘጋጀ',
      heroTitle: 'የተሻለ ግብርና በግልጽ እይታ ይጀምራል።',
      heroDesc:
        'Gebere 360 የግብርና መረጃን፣ የማሳ አስተዳደርን፣ የሰብል ጤናን እና የገበያ ትስስርን በአንድ ቦታ ያቀርባል።',
      startBtn: 'የማሳ ስራዎን ይጀምሩ',
      exploreBtn: 'መድረኩን ይጎብኙ',
      approachLabel: 'የGebere 360 አቀራረብ',
      approachTitle: 'ግምትን ይቀንሱ። ውጤትን ያሳድጉ።',
      approachDesc:
        'ማሳዎ ሕያው ሥርዓት ነው። አርሶ አደሮች፣ ኅብረት ሥራ ማኅበራት እና የግብርና ባለሙያዎች በልበ ሙሉነት እንዲወስኑ እንረዳለን።',
      openWorkspace: 'ክፈት',
      ctaTitle: 'ለእያንዳንዱ የምርት ወቅት ዘመናዊ የአሠራር መድረክ።',
      ctaDesc:
        'መለያዎን ይፍጠሩ፣ የመጀመሪያ ማሳዎን ይመዝግቡ እና ምርትዎን የሚያሳድጉ ውሳኔዎችን በመረጃ ይደግፉ።',
      ctaBtn: 'መለያ ይፍጠሩ',
    },
    auth: {
      welcomeBack: 'እንኳን በደህና ተመለሱ',
      createAccount: 'መለያዎን ይፍጠሩ',
      emailOrPhone: 'ስልክ ቁጥር ወይም ኢሜይል',
      emailLabel: 'የኢሜይል አድራሻ',
      fullName: 'ሙሉ ስም',
      password: 'የይለፍ ቃል',
      forgotPassword: 'የይለፍ ቃል ረሱ?',
      loginBtn: 'ግባ',
      signingIn: 'በመግባት ላይ...',
      registerBtn: 'ተመዝገብ',
      creatingAccount: 'መለያ በመፍጠር ላይ...',
      noAccount: 'መለያ የለዎትም?',
      hasAccount: 'ከዚህ በፊት መለያ አለዎት?',
      farmLocation: 'የማሳ አካባቢ',
      selectZone: 'የማሳዎን ዞን ይምረጡ',
      accountRole: 'የመለያ ሚና',
      preferredLang: 'የሚመርጡት ቋንቋ',
      selectLang: 'ቋንቋ ይምረጡ',
      roles: {
        farmer: 'አርሶ አደር',
        buyer: 'የግብርና ምርት ገዢ',
        agronomist: 'የግብርና ባለሙያ',
        cooperative_manager: 'የኅብረት ሥራ ማኅበር ሥራ አስኪያጅ',
      },
    },
    dashboard: {
      title: 'የማሳ ሥራዎች ዳሽቦርድ',
      subtitle: 'የተመዘገቡ መሬቶች፣ የወቅቱ ወጪዎች እና የምርት መረጃዎች በአንድ ቦታ።',
      goToFarm: 'ወደ ማሳዬ ሂድ',
      registeredLand: 'የተመዘገበ መሬት',
      seasonalExpenses: 'የወቅቱ ወጪዎች',
      expectedRevenue: 'የሚጠበቅ ገቢ',
      measuredPlots: 'የተለኩ መሬቶች',
    },
    farms: {
      title: 'የተመዘገቡ ማሳዎቼ',
      subtitle: 'ማሳዎችን፣ የመዝሪያና የመሰብሰቢያ ቀናትን እና የእርሻ ተግባራትን ያስተዳድሩ።',
      addFarm: 'አዲስ ማሳ መዝግብ',
    },
    land: {
      title: 'የመሬት ስፋት እና ዋጋ ስሌት',
      subtitle: 'የመሬት ስፋትን በካሬ ሜትር እና በሄክታር እንዲሁም የመሬት ዋጋን በETB ያስሉ።',
      rectangularTab: 'አራት ማዕዘን መሬት',
      polygonTab: 'የካርታ ፖሊጎን',
      calculateBtn: 'ስፋት አስላ',
      saveBtn: 'የመሬት መረጃ አስቀምጥ',
    },
    finance: {
      title: 'የፋይናንስ ትንታኔ እና ትርፍ/ኪሳራ',
      subtitle: 'የግብዓት ወጪዎችን፣ የምርት ገቢን እና የተጣራ ትርፍን በETB ይከታተሉ።',
      expensesTitle: 'የማሳ ወጪዎች መዝገብ',
      expensesSubtitle: 'የዘር፣ ማዳበሪያ፣ ፀረ-ተባይ፣ የጉልበት፣ መስኖ እና ትራንስፖርት ወጪዎችን ይመዝግቡ።',
      addExpense: 'ወጪ መዝግብ',
      addHarvest: 'ምርት መዝግብ',
    },
    marketplace: {
      title: 'የግብርና B2B ገበያ',
      subtitle: 'አርሶ አደሮችን እና ኅብረት ሥራ ማኅበራትን ከገዢዎች ጋር በቀጥታ ያገናኛል።',
      listProduce: 'ምርት ለገበያ አቅርብ',
      searchPlaceholder: 'ምርት፣ ዝርያ ወይም ወረዳ ይፈልጉ...',
    },
    actions: {
      save: 'አስቀምጥ',
      cancel: 'ሰርዝ',
      delete: 'አጥፋ',
      edit: 'አርትዕ',
      submit: 'ላክ',
      search: 'ፈልግ',
      loading: 'በመጫን ላይ...',
      calculate: 'አስላ',
    },
    errors: {
      unauthorized: 'የማሳ መረጃዎን ለማየት እባክዎ ይግቡ።',
      network: 'ከGebere 360 አገልጋይ ጋር መገናኘት አልተቻለም። ግንኙነትዎን ያረጋግጡ።',
      validation: 'እባክዎ የሚያስፈልጉትን መረጃዎች በትክክል ይሙሉ።',
    },
  },
} as const;
