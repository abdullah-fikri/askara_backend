const bcrypt = require('bcryptjs');

// Pre-hashed 'admin123'
const defaultAdminHash = bcrypt.hashSync('admin123', 10);

// ====================================================================
// 1. USERS SEED
// ====================================================================
const initialUsers = [
  {
    id: 1,
    name: 'Askara Administrator',
    email: 'admin@askara.co.id',
    password_hash: defaultAdminHash,
    role: 'admin',
    created_at: new Date().toISOString()
  }
];

// ====================================================================
// 2. PRODUCT CATEGORIES SEED
// ====================================================================
const initialCategories = [
  {
    id: 1,
    name_en: 'Instrument',
    name_id: 'Instrumen',
    slug: 'instrument',
    description_en: 'Automated analyzers and laboratory instruments for food quality testing.',
    description_id: 'Penganalisis otomatis dan instrumen laboratorium untuk pengujian kualitas pangan.',
    image: '/images/y15.png',
    is_active: true,
    sort_order: 1,
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    name_en: 'Chemical Reagents',
    name_id: 'Reagent Kimia',
    slug: 'reagent-kimia',
    description_en: 'Analytical reagents and test kits for food quality laboratories.',
    description_id: 'Reagen analitis dan kit pengujian untuk laboratorium kualitas makanan & minuman.',
    image: '/images/gluten.png',
    is_active: true,
    sort_order: 2,
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    name_en: 'Rapid Test',
    name_id: 'Rapid Test',
    slug: 'rapid-test',
    description_en: 'Fast food safety and allergen testing solutions with instant results.',
    description_id: 'Solusi pengujian keamanan pangan dan alergen cepat dengan hasil akurat.',
    image: '/images/histamine.png',
    is_active: true,
    sort_order: 3,
    created_at: new Date().toISOString()
  },
  {
    id: 4,
    name_en: 'WWTP / IPAL',
    name_id: 'IPAL',
    slug: 'ipal',
    description_en: 'Wastewater treatment solutions for food and beverage manufacturing industries.',
    description_id: 'Solusi instalasi pengolahan air limbah untuk industri makanan dan minuman.',
    image: null,
    is_active: true,
    sort_order: 4,
    created_at: new Date().toISOString()
  },
  {
    id: 5,
    name_en: 'RO System',
    name_id: 'Sistem RO',
    slug: 'ro-system',
    description_en: 'High-purity reverse osmosis water purification systems for laboratories.',
    description_id: 'Sistem pemurnian air reverse osmosis kemurnian tinggi untuk laboratorium.',
    image: null,
    is_active: true,
    sort_order: 5,
    created_at: new Date().toISOString()
  },
  {
    id: 6,
    name_en: 'Microbiology',
    name_id: 'Mikrobiologi',
    slug: 'microbiology',
    description_en: 'Microbiological testing solutions and media for quality assurance labs.',
    description_id: 'Solusi dan media pengujian mikrobiologi untuk laboratorium penjaminan mutu.',
    image: null,
    is_active: true,
    sort_order: 6,
    created_at: new Date().toISOString()
  }
];

// ====================================================================
// 3. PRODUCTS SEED
// ====================================================================
const initialProducts = [
  {
    id: 1,
    product_category_id: 1,
    category_slug: 'instrument',
    name_en: 'BioSystems Y15 Clinical Chemistry Analyzer',
    name_id: 'BioSystems Y15 Clinical Chemistry Analyzer',
    slug: 'biosystems-y15-clinical-chemistry-analyzer',
    principal: 'BioSystems',
    short_description_en: 'Automated benchtop analyzer for clinical chemistry and food quality testing.',
    short_description_id: 'Penganalisis otomatis benchtop untuk uji kimia klinis dan pengujian kualitas pangan.',
    description_en: 'The Y15 is a compact, fully automated photometric analyzer built for laboratories that need reliable throughput without a large footprint. It handles reagents, sample rotors, and wash cycles automatically, reducing manual handling and operator error.',
    description_id: 'Y15 adalah penganalisis fotometri otomatis kompak yang dirancang untuk laboratorium yang membutuhkan throughput andal tanpa memakan banyak tempat. Menangani reagen, rotor sampel, dan siklus pencucian secara otomatis, meminimalkan penanganan manual dan potensi kesalahan operator.',
    image: '/images/y15.png',
    specifications: 'Throughput | Up to 200 tests/hour\nSample volume | 2-35 µL\nReagent positions | 30 onboard\nPower | 100-240V AC, 50/60Hz\nDimensions | 60 x 55 x 45 cm',
    applications_en: 'Food and beverage quality control\nClinical chemistry laboratories\nResearch and academic laboratories',
    applications_id: 'Kontrol kualitas makanan dan minuman\nLaboratorium kimia klinis\nLaboratorium penelitian dan akademis',
    features_en: 'Fully automated pipetting and wash cycle\nOnboard reagent and sample cooling\nColor touchscreen interface\nBuilt-in QC and calibration tracking',
    features_id: 'Siklus pemipetan dan pencucian otomatis penuh\nPendingin reagen dan sampel terintegrasi\nAntarmuka layar sentuh berwarna\nPelacakan QC dan kalibrasi terintegrasi',
    brochure: null,
    is_active: true,
    is_featured: true,
    sort_order: 1,
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    product_category_id: 1,
    category_slug: 'instrument',
    name_en: 'BioSystems Y15 New Benchtop Analyzer',
    name_id: 'BioSystems Y15 New Benchtop Analyzer',
    slug: 'biosystems-y15-new-benchtop-analyzer',
    principal: 'BioSystems',
    short_description_en: 'Updated Y-series analyzer with expanded reagent capacity and rotor-based sampling.',
    short_description_id: 'Penganalisis seri Y terbaru dengan kapasitas reagen lebih besar dan pengambilan sampel berbasis rotor.',
    description_en: 'An updated revision of the Y-series analyzer line, with a larger reaction rotor and expanded reagent kit capacity for laboratories running higher daily sample volumes.',
    description_id: 'Revisi terbaru dari lini penganalisis seri Y, dilengkapi rotor reaksi lebih besar dan kapasitas kit reagen yang diperluas untuk laboratorium dengan volume sampel harian tinggi.',
    image: '/images/Y15 New.png',
    specifications: 'Throughput | Up to 240 tests/hour\nReaction rotor | 60 positions\nPower | 100-240V AC, 50/60Hz',
    applications_en: 'High-volume food testing laboratories\nContract testing laboratories',
    applications_id: 'Laboratorium pengujian pangan volume tinggi\nLaboratorium pengujian independen & kontrak',
    features_en: 'Larger reaction rotor capacity\nExpanded onboard reagent storage\nFaster cycle time per batch',
    features_id: 'Kapasitas rotor reaksi lebih besar\nPenyimpanan reagen onboard yang diperluas\nWaktu siklus per batch lebih cepat',
    brochure: null,
    is_active: true,
    is_featured: false,
    sort_order: 2,
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    product_category_id: 5,
    category_slug: 'ro-system',
    name_en: 'RO Water Purification System 100 LPH',
    name_id: 'Sistem Pemurnian Air RO 100 LPH',
    slug: 'ro-water-purification-system-100-lph',
    principal: 'Askara',
    short_description_en: 'Reverse osmosis system producing laboratory-grade purified water.',
    short_description_id: 'Sistem reverse osmosis yang menghasilkan air murni berstandar laboratorium.',
    description_en: 'A multi-stage reverse osmosis unit for laboratories that need a consistent supply of purified water for reagent preparation, glassware washing, and instrument feed water.',
    description_id: 'Unit reverse osmosis multi-tahap untuk laboratorium yang membutuhkan pasokan air murni yang konsisten untuk preparasi reagen, pencucian alat kaca, dan air umpan instrumen analitik.',
    image: '/images/header.png',
    specifications: 'Output capacity | 100 liters/hour\nRejection rate | 99%\nInlet pressure | 2-4 bar\nMembrane type | Thin-film composite',
    applications_en: 'Laboratory reagent-grade water supply\nInstrument feed water\nGlassware rinsing',
    applications_id: 'Pasokan air standar reagen laboratorium\nAir umpan instrumen analisis\nPembilasan peralatan kaca laboratorium',
    features_en: 'Multi-stage sediment and carbon pre-filtration\nRO membrane with 99% rejection rate\nAutomatic low-pressure shutoff',
    features_id: 'Pra-filtrasi sedimen dan karbon multi-tahap\nMembran RO dengan tingkat penolakan 99%\nSistem pemutus tekanan rendah otomatis',
    brochure: null,
    is_active: true,
    is_featured: true,
    sort_order: 3,
    created_at: new Date().toISOString()
  },
  {
    id: 4,
    product_category_id: 2,
    category_slug: 'reagent-kimia',
    name_en: 'Y15 Reagent Kit - Glucose',
    name_id: 'Y15 Reagent Kit - Glukosa',
    slug: 'y15-reagent-kit-glucose',
    principal: 'BioSystems',
    short_description_en: 'Enzymatic colorimetric reagent kit for D-Glucose determination on Y-series analyzers.',
    short_description_id: 'Kit reagen kolorimetri enzimatik untuk penentuan D-Glukosa pada penganalisis seri Y.',
    description_en: 'A ready-to-use liquid reagent kit for the quantitative determination of glucose, formulated for direct use on BioSystems Y-series analyzers.',
    description_id: 'Kit reagen cair siap pakai untuk penentuan kuantitatif glukosa, diformulasikan untuk penggunaan langsung pada penganalisis seri BioSystems Y.',
    image: '/images/gluten.png',
    specifications: 'Method | Enzymatic colorimetric (GOD-POD)\nPack size | 4 x 50 mL\nStorage | 2-8°C\nShelf life | 24 months unopened',
    applications_en: 'Food and beverage glucose testing\nFermentation process monitoring',
    applications_id: 'Pengujian glukosa makanan dan minuman\nPemantauan proses fermentasi',
    features_en: 'Ready-to-use liquid reagent, no reconstitution\nEnzymatic colorimetric method\nStable at 2-8°C',
    features_id: 'Reagen cair siap pakai tanpa rekonstitusi\nMetode kolorimetri enzimatik akurat\nStabil pada suhu 2-8°C',
    brochure: null,
    is_active: true,
    is_featured: false,
    sort_order: 4,
    created_at: new Date().toISOString()
  },
  {
    id: 5,
    product_category_id: 3,
    category_slug: 'rapid-test',
    name_en: 'Gluten ELISA Rapid Test Kit',
    name_id: 'Kit Rapid Test Gluten ELISA',
    slug: 'gluten-elisa-rapid-test-kit',
    principal: 'BioSystems',
    short_description_en: 'AOAC-certified ELISA kit for gluten detection in food products.',
    short_description_id: 'Kit ELISA bersertifikasi AOAC untuk deteksi kandungan gluten pada produk pangan.',
    description_en: 'A colorimetric ELISA test kit for the detection and quantification of gluten in food products and raw materials, certified under the AOAC Performance Tested program.',
    description_id: 'Kit uji ELISA kolorimetri untuk deteksi dan kuantifikasi gluten dalam produk makanan dan bahan baku, bersertifikat dalam program AOAC Performance Tested.',
    image: '/images/gluten.png',
    specifications: 'Certification | AOAC Performance Tested\nDetection range | 2.5-80 ppm\nPack size | 25 mL kit (REF 31000)\nTest time | Approx. 30 minutes',
    applications_en: 'Gluten-free product certification\nRaw material incoming inspection\nCross-contamination verification',
    applications_id: 'Sertifikasi produk bebas gluten (Gluten-Free)\nPemeriksaan penerimaan bahan baku\nVerifikasi kontaminasi silang lini produksi',
    features_en: 'AOAC Research Institute Performance Tested\nColorimetric readout, no special equipment required\nQuantitative results within the assay range',
    features_id: 'Teruji Kinerja AOAC Research Institute\nPembacaan kolorimetri cepat dan mudah\nHasil kuantitatif akurat dalam rentang uji',
    brochure: null,
    is_active: true,
    is_featured: true,
    sort_order: 5,
    created_at: new Date().toISOString()
  },
  {
    id: 6,
    product_category_id: 3,
    category_slug: 'rapid-test',
    name_en: 'Histamine Rapid Strip Test',
    name_id: 'Rapid Strip Test Histamin',
    slug: 'histamine-rapid-strip-test',
    principal: 'BioSystems',
    short_description_en: 'Rapid qualitative/semi-quantitative strip for histamine screening in fish and seafood.',
    short_description_id: 'Strip cepat kualitatif/semi-kuantitatif untuk skrining histamin pada ikan dan hasil laut.',
    description_en: 'Fast visual screening test strip designed for seafood processing plants and cold chain inspection to ensure histamine safety standards.',
    description_id: 'Strip uji skrining visual cepat yang dirancang untuk pabrik pengolahan makanan laut dan inspeksi rantai dingin guna memastikan standar batas aman histamin.',
    image: '/images/histamine.png',
    specifications: 'Test time | 5-10 minutes\nSample type | Fish, tuna, seafood extract\nStorage | Room temperature',
    applications_en: 'Seafood export compliance\nFreshness testing at receiving dock\nHACCP monitoring',
    applications_id: 'Kepatuhan ekspor produk perikanan & makanan laut\nPengujian kesegaran di dermaga penerimaan\nPemantauan titik kritis HACCP',
    features_en: 'Fast 5-10 minute results\nEasy sample extraction\nVisual color comparison guide',
    features_id: 'Hasil cepat dalam 5-10 menit\nEkstraksi sampel yang praktis\nPanduan perbandingan warna visual jelas',
    brochure: null,
    is_active: true,
    is_featured: true,
    sort_order: 6,
    created_at: new Date().toISOString()
  }
];

// ====================================================================
// 4. PARTNERS & PRINCIPALS SEED
// ====================================================================
const initialPartners = [
  {
    id: 1,
    name: 'BioSystems',
    slug: 'biosystems',
    logo: '/images/logo.png',
    country: 'Spain (Barcelona)',
    category: 'Automated Photometric Chemistry & Rapid Test Kits',
    website_url: 'https://www.biosystems.es',
    description_en: 'BioSystems S.A. is a world-renowned European developer and manufacturer of clinical and agri-food analytical solutions. Founded in Barcelona in 1981, BioSystems provides automated photometric analyzers, dedicated liquid reagents, and rapid allergen testing kits trusted in over 100 countries.',
    description_id: 'BioSystems S.A. adalah pengembang dan produsen solusi analitis klinis dan agro-pangan terkemuka dari Eropa. Didirikan di Barcelona pada tahun 1981, BioSystems menyediakan penganalisis fotometris otomatis, reagen cair khusus, dan kit uji cepat alergen yang dipercaya di lebih dari 100 negara.',
    documentation_gallery: [
      {
        id: 'gal-1',
        url: '/images/y15.png',
        caption_en: 'BioSystems Y15 automated analyzer unit calibration and QC commissioning',
        caption_id: 'Kalibrasi unit penganalisis otomatis BioSystems Y15 dan uji kendali mutu',
        date: '2026-02-15'
      },
      {
        id: 'gal-2',
        url: '/images/gluten.png',
        caption_en: 'Food allergen strip validation workshop with certified QC specialists',
        caption_id: 'Workshop validasi strip alergen pangan bersama spesialis kendali mutu bersertifikat',
        date: '2026-01-20'
      },
      {
        id: 'gal-3',
        url: '/images/histamine.png',
        caption_en: 'Histamine seafood screening demonstration at fishery processing plant',
        caption_id: 'Demonstrasi skrining histamin produk perikanan di pabrik pengolahan hasil laut',
        date: '2025-12-10'
      },
      {
        id: 'gal-4',
        url: '/images/header.png',
        caption_en: 'Annual principal application training and technology symposium',
        caption_id: 'Pelatihan aplikasi prinsipal tahunan dan simposium teknologi laboratorium',
        date: '2025-10-05'
      }
    ],
    is_active: true,
    sort_order: 1,
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    name: 'FOSS Analytics',
    slug: 'foss',
    logo: null,
    country: 'Denmark (Hillerød)',
    category: 'Dedicated Analytical Quality Solutions',
    website_url: 'https://www.fossanalytics.com',
    description_en: 'FOSS is the global pioneer in dedicated analytical solutions for the food and agricultural industry, delivering fast, precise NIR, FTIR, and reference chemistry methods.',
    description_id: 'FOSS adalah pelopor global dalam solusi analitis khusus untuk industri pangan dan pertanian, menghadirkan metode NIR, FTIR, dan kimia referensi yang cepat dan presisi.',
    documentation_gallery: [
      {
        id: 'gal-f1',
        url: '/images/y15.png',
        caption_en: 'Spectroscopy NIR analyzer setup in dairy and grain processing facility',
        caption_id: 'Pengaturan instrumen spektroskopi NIR pada fasilitas pengolahan susu dan biji-bijian',
        date: '2026-02-01'
      },
      {
        id: 'gal-f2',
        url: '/images/header.png',
        caption_en: 'Routine service and optics diagnostic check with regional engineers',
        caption_id: 'Servis rutin dan pemeriksaan diagnostik optik bersama tim insinyur regional',
        date: '2025-11-18'
      }
    ],
    is_active: true,
    sort_order: 2,
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    name: 'Waters Corporation',
    slug: 'waters',
    logo: null,
    country: 'United States (Milford, MA)',
    category: 'Liquid Chromatography & Mass Spectrometry',
    website_url: 'https://www.waters.com',
    description_en: 'Waters Corporation creates business advantages for laboratory-dependent organizations by delivering scientific innovations in liquid chromatography (HPLC/UPLC) and mass spectrometry.',
    description_id: 'Waters Corporation menghadirkan inovasi ilmiah dalam kromatografi cair (HPLC/UPLC) dan spektrometri massa untuk organisasi yang bergantung pada laboratorium analitis presisi tinggi.',
    documentation_gallery: [
      {
        id: 'gal-w1',
        url: '/images/gluten.png',
        caption_en: 'UPLC column installation and column lifetime optimization briefing',
        caption_id: 'Instalasi kolom UPLC dan pengarahan optimasi masa pakai kolom analitis',
        date: '2026-01-12'
      }
    ],
    is_active: true,
    sort_order: 3,
    created_at: new Date().toISOString()
  },
  {
    id: 4,
    name: 'Merck Millipore',
    slug: 'merck',
    logo: null,
    country: 'Germany (Darmstadt)',
    category: 'Reagents, Pure Water & Microbiology Solutions',
    website_url: 'https://www.merckgroup.com',
    description_en: 'Merck Life Science delivers high-purity analytical chemicals, reference standards, and water purification systems to ensure laboratory accuracy and safety.',
    description_id: 'Merck Life Science menyediakan bahan kimia analitis dengan kemurnian tinggi, standar referensi, dan sistem pemurnian air laboratorium untuk memastikan keandalan hasil riset.',
    documentation_gallery: [
      {
        id: 'gal-m1',
        url: '/images/header.png',
        caption_en: 'Milli-Q water purification system filter cartridge replacement demonstration',
        caption_id: 'Demonstrasi penggantian filter cartridge sistem pemurnian air laboratorium Milli-Q',
        date: '2025-12-05'
      }
    ],
    is_active: true,
    sort_order: 4,
    created_at: new Date().toISOString()
  },
  {
    id: 5,
    name: 'Shimadzu',
    slug: 'shimadzu',
    logo: null,
    country: 'Japan (Kyoto)',
    category: 'Precision Analytical & Measuring Instruments',
    website_url: 'https://www.shimadzu.com',
    description_en: 'Shimadzu Corporation is a Japanese manufacturer of precision instruments, measuring instruments and medical equipment contributing to societal safety and innovation.',
    description_id: 'Shimadzu Corporation adalah produsen instrumen presisi dan peralatan analitis asal Jepang yang berkontribusi pada keselamatan masyarakat dan inovasi industri pangan.',
    documentation_gallery: [
      {
        id: 'gal-s1',
        url: '/images/y15.png',
        caption_en: 'UV-Vis spectrophotometer detector check and wavelength verification',
        caption_id: 'Pemeriksaan detektor spektrofotometer UV-Vis dan verifikasi panjang gelombang',
        date: '2026-02-10'
      }
    ],
    is_active: true,
    sort_order: 5,
    created_at: new Date().toISOString()
  },
  {
    id: 6,
    name: 'Thermo Fisher Scientific',
    slug: 'thermo-scientific',
    logo: null,
    country: 'United States (Waltham, MA)',
    category: 'Scientific Instruments & Consumables',
    website_url: 'https://www.thermofisher.com',
    description_en: 'Thermo Fisher Scientific provides advanced scientific instrumentation, reagents, and software solutions helping food scientists solve complex analytical challenges.',
    description_id: 'Thermo Fisher Scientific menyediakan instrumentasi ilmiah canggih, reagen, dan perangkat lunak untuk membantu ilmuwan pangan menyelesaikan tantangan analitis yang kompleks.',
    documentation_gallery: [
      {
        id: 'gal-t1',
        url: '/images/histamine.png',
        caption_en: 'Rapid diagnostic test kit quality evaluation session',
        caption_id: 'Sesi evaluasi kualitas kit uji diagnostik analitis cepat',
        date: '2026-01-25'
      }
    ],
    is_active: true,
    sort_order: 6,
    created_at: new Date().toISOString()
  }
];

// ====================================================================
// 5. ARTICLES SEED
// ====================================================================
const initialArticles = [
  {
    id: 1,
    title_en: 'The Importance of Rapid Testing in Food Safety',
    title_id: 'Pentingnya Rapid Testing dalam Keamanan Pangan Modern',
    category_en: 'Food Safety',
    category_id: 'Keamanan Pangan',
    image: '/images/gluten.png',
    published_at: '2026-05-10',
    linkedin_url: 'https://www.linkedin.com/company/askara-tekno-pangan',
    is_active: true,
    sort_order: 1,
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    title_en: 'The Role of Modern Photometric Chemistry in Food Laboratories',
    title_id: 'Peran Analisis Fotometri Otomatis di Laboratorium Pangan',
    category_en: 'Technology',
    category_id: 'Teknologi',
    image: '/images/y15.png',
    published_at: '2026-04-28',
    linkedin_url: 'https://www.linkedin.com/company/askara-tekno-pangan',
    is_active: true,
    sort_order: 2,
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    title_en: 'Water Quality Monitoring for a Sustainable F&B Future',
    title_id: 'Pemantauan Kualitas Air & Sistem RO untuk Industri Berkelanjutan',
    category_en: 'Environment',
    category_id: 'Lingkungan',
    image: '/images/header.png',
    published_at: '2026-04-15',
    linkedin_url: 'https://www.linkedin.com/company/askara-tekno-pangan',
    is_active: true,
    sort_order: 3,
    created_at: new Date().toISOString()
  },
  {
    id: 4,
    title_en: 'Understanding AOAC Certification for Allergen Test Kits',
    title_id: 'Memahami Standar Sertifikasi AOAC untuk Kit Uji Alergen',
    category_en: 'Food Safety',
    category_id: 'Keamanan Pangan',
    image: '/images/histamine.png',
    published_at: '2026-03-30',
    linkedin_url: 'https://www.linkedin.com/company/askara-tekno-pangan',
    is_active: true,
    sort_order: 4,
    created_at: new Date().toISOString()
  },
  {
    id: 5,
    title_en: 'Askara Supports National Food Industry Quality Standards 2026',
    title_id: 'Askara Mendukung Standarisasi Mutu Industri Pangan Nasional',
    category_en: 'Company News',
    category_id: 'Berita Perusahaan',
    image: '/images/logo.png',
    published_at: '2026-03-12',
    linkedin_url: 'https://www.linkedin.com/company/askara-tekno-pangan',
    is_active: true,
    sort_order: 5,
    created_at: new Date().toISOString()
  }
];

// ====================================================================
// 6. CAREERS SEED
// ====================================================================
const initialCareers = [
  {
    id: 1,
    slug: 'sales-executive-laboratory-instruments',
    job_title_en: 'Sales Executive - Laboratory Instruments',
    job_title_id: 'Sales Executive - Instrumen Laboratorium',
    department_en: 'Commercial Sales & Business Development',
    department_id: 'Penjualan Komersial & Pengembangan Bisnis',
    location_en: 'Jakarta, Indonesia',
    location_id: 'Jakarta, Indonesia',
    employment_type_en: 'Full-time',
    employment_type_id: 'Penuh Waktu',
    experience_level_en: '2-5 Years Experience',
    experience_level_id: 'Pengalaman 2-5 Tahun',
    salary_range: 'Competitive + Commission',
    description_en: 'Lead business development and client engagement for high-end laboratory analyzers and automated chemistry instruments across food manufacturing and testing laboratories.',
    description_id: 'Memimpin pengembangan bisnis dan relasi klien untuk instrumen penganalisis laboratorium dan kimia otomatis di industri makanan serta laboratorium pengujian mutu.',
    responsibilities_en: '• Expand market penetration for BioSystems analyzers and analytical instruments\n• Maintain strong relationship with QA/QC managers and lab directors\n• Deliver product demos and commercial proposals\n• Meet quarterly sales targets and support marketing events',
    responsibilities_id: '• Memperluas penetrasi pasar instrumen analitis dan analyzer BioSystems\n• Membina hubungan baik dengan manajer QA/QC dan pimpinan laboratorium\n• Melakukan demo produk dan menyusun proposal komersial\n• Mencapai target penjualan berkala dan berpartisipasi dalam pameran',
    requirements_en: '• Bachelor’s degree in Chemistry, Biology, Food Science, or related field\n• 2+ years of B2B sales experience in analytical laboratory instruments\n• Strong communication, presentation, and negotiation skills\n• Valid driving license (SIM A / C)',
    requirements_id: '• S1 Kimia, Biologi, Teknologi Pangan, atau bidang terkait\n• Pengalaman minimal 2 tahun di penjualan B2B alat laboratorium analitis\n• Keterampilan komunikasi, presentasi, dan negosiasi yang baik\n• Memiliki SIM A / C aktif',
    benefits_en: '• Competitive base salary & attractive sales commission\n• BPJS Kesehatan & Ketenagakerjaan\n• Vehicle / operational allowance\n• Continuous product training from global principals',
    benefits_id: '• Gaji pokok kompetitif & komisi penjualan menarik\n• BPJS Kesehatan & Ketenagakerjaan\n• Tunjangan kendaraan dan operasional dinas\n• Pelatihan produk berkala langsung dari prinsipal global',
    linkedin_url: 'https://www.linkedin.com/company/askara-tekno-pangan/jobs',
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    slug: 'field-application-scientist-jakarta',
    job_title_en: 'Field Application Scientist',
    job_title_id: 'Field Application Scientist',
    department_en: 'Technical Applications & Support',
    department_id: 'Aplikasi & Dukungan Teknis',
    location_en: 'Jakarta, Indonesia',
    location_id: 'Jakarta, Indonesia',
    employment_type_en: 'Full-time',
    employment_type_id: 'Penuh Waktu',
    experience_level_en: '2-4 Years Experience',
    experience_level_id: 'Pengalaman 2-4 Tahun',
    salary_range: 'Competitive Package',
    description_en: 'Provide expert technical consultation, method validation, and hands-on application training for clients utilizing automated enzymatic analyzers and food safety rapid test kits.',
    description_id: 'Memberikan konsultasi teknis, validasi metode pengujian laboratorium, dan pelatihan langsung untuk pelanggan pengguna analyzer enzimatik otomatis serta kit rapid test keamanan pangan.',
    responsibilities_en: '• Perform on-site instrument installation, calibration, and customer training\n• Validate analytical assay methods and assist clients with standard operating procedures (SOP)\n• Troubleshoot biochemical assay and instrument method discrepancies\n• Provide technical input for marketing collaterals and seminars',
    responsibilities_id: '• Melakukan instalasi instrumen di lokasi pelanggan, kalibrasi, dan pelatihan pengguna\n• Memvalidasi metode pengujian analitis dan membantu pelanggan menyusun SOP uji lab\n• Menangani kendala teknis metode pengujian biokimia dan analitis\n• Memberikan materi teknis untuk kegiatan seminar dan publikasi edukasi',
    requirements_en: '• Bachelor’s or Master’s in Chemistry, Biochemistry, or Food Science\n• 2+ years of hands-on laboratory experience with spectrophotometry, ELISA, or chromatography\n• Good analytical thinking and problem-solving abilities\n• Proficiency in technical English (written and spoken)',
    requirements_id: '• S1 atau S2 Kimia, Biokimia, atau Ilmu Pangan\n• Pengalaman minimal 2 tahun di laboratorium dengan spektrofotometri, ELISA, atau kromatografi\n• Kemampuan berpikir analitis dan pemecahan masalah yang baik\n• Menguasai bahasa Inggris teknis (lisan dan tulisan)',
    benefits_en: '• Professional career progression into senior application management\n• BPJS Kesehatan & Ketenagakerjaan\n• Technical development workshops with international principals\n• Travel allowance and daily per diem for on-site projects',
    benefits_id: '• Jalur karir profesional menuju manajemen aplikasi senior\n• BPJS Kesehatan & Ketenagakerjaan\n• Workshop pengembangan teknis bersama prinsipal global\n• Tunjangan perjalanan dinas dan uang harian proyek',
    linkedin_url: 'https://www.linkedin.com/company/askara-tekno-pangan/jobs',
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    slug: 'technical-support-engineer-surabaya',
    job_title_en: 'Technical Support Engineer',
    job_title_id: 'Technical Support Engineer',
    department_en: 'Customer Engineering Service',
    department_id: 'Layanan Servis Teknik',
    location_en: 'Surabaya, Indonesia',
    location_id: 'Surabaya, Indonesia',
    employment_type_en: 'Full-time',
    employment_type_id: 'Penuh Waktu',
    experience_level_en: '1-3 Years Experience',
    experience_level_id: 'Pengalaman 1-3 Tahun',
    salary_range: 'Competitive Package',
    description_en: 'Responsible for preventive maintenance, hardware repairs, optical alignments, and emergency technical support for automated laboratory analyzers in East Java and Eastern Indonesia.',
    description_id: 'Bertanggung jawab atas pemeliharaan berkala, perbaikan perangkat keras, kalibrasi optik, dan dukungan darurat untuk instrumen analitis di wilayah Jawa Timur dan Indonesia Timur.',
    responsibilities_en: '• Perform routine preventive maintenance and scheduled service visits\n• Diagnose and repair electromechanical and fluidic issues on analyzers\n• Manage local spare parts inventory and service report documentation\n• Assist customers with hardware troubleshooting via phone and on-site',
    responsibilities_id: '• Menjalankan kunjungan servis pemeliharaan berkala dan perawatan preventif\n• Mendiagnosis dan memperbaiki kendala elektromekanik dan sistem fluida alat lab\n• Mengelola inventaris suku cadang lokal dan dokumentasi laporan servis\n• Membantu penanganan kendala perangkat keras melalui telepon dan kunjungan lokasi',
    requirements_en: '• Diploma or Bachelor in Electrical Engineering, Mechatronics, or Biomedical Engineering\n• Minimum 1 year experience as Field Service Engineer for medical or lab equipment\n• Strong troubleshooting skills and understanding of electronics/fluidics\n• Driver’s license (SIM A / C) and willingness to travel regionally',
    requirements_id: '• D3 atau S1 Teknik Elektro, Mekatronika, atau Teknik Biomedis\n• Pengalaman minimal 1 tahun sebagai Field Service Engineer alat medis / lab\n• Keterampilan troubleshooting perangkat elektronik dan sistem fluida yang kuat\n• Memiliki SIM A / C dan bersedia melakukan perjalanan dinas regional',
    benefits_en: '• Competitive salary & on-call standby bonuses\n• Comprehensive health insurance (BPJS)\n• Official certification training for laboratory instrument maintenance\n• Vehicle & fuel allowance for field service',
    benefits_id: '• Gaji kompetitif & bonus siaga dinas teknis\n• Asuransi kesehatan lengkap (BPJS)\n• Pelatihan sertifikasi resmi perawatan instrumen laboratorium\n• Tunjangan kendaraan & bahan bakar operasional lapangan',
    linkedin_url: 'https://www.linkedin.com/company/askara-tekno-pangan/jobs',
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 4,
    slug: 'product-specialist-food-safety-testing-jakarta',
    job_title_en: 'Product Specialist - Food Safety Testing',
    job_title_id: 'Product Specialist - Pengujian Keamanan Pangan',
    department_en: 'Product & Application Marketing',
    department_id: 'Pemasaran Produk & Aplikasi',
    location_en: 'Jakarta, Indonesia',
    location_id: 'Jakarta, Indonesia',
    employment_type_en: 'Full-time',
    employment_type_id: 'Penuh Waktu',
    experience_level_en: '2-4 Years Experience',
    experience_level_id: 'Pengalaman 2-4 Tahun',
    salary_range: 'Competitive Package',
    description_en: 'Drive market adoption for food safety rapid test kits, AOAC allergen detection strips, and enzyme assays across commercial food processing, dairy, and export inspection laboratories.',
    description_id: 'Mendorong adopsi pasar kit rapid test keamanan pangan, strip deteksi alergen standar AOAC, dan uji enzimatik di industri pengolahan pangan komersial, susu, dan laboratorium inspeksi ekspor.',
    responsibilities_en: '• Conduct customer trials, assay comparisons, and validation studies on-site\n• Deliver technical product presentations at conferences, webinars, and customer seminars\n• Build product battle-cards, marketing application notes, and regulatory compliance guides\n• Work alongside sales representatives to close strategic laboratory accounts',
    responsibilities_id: '• Melakukan uji coba komparasi metode uji dan studi validasi di laboratorium klien\n• Memberikan presentasi teknis produk pada seminar, webinar, dan pameran industri pangan\n• Menyusun materi edukasi aplikasi produk dan panduan kepatuhan regulasi mutu\n• Mendampingi tim sales dalam memenangkan akun laboratorium strategis',
    requirements_en: '• Bachelor’s or Master’s in Food Science, Microbiology, or Biochemistry\n• Hands-on expertise with ELISA, lateral flow test strips, or rapid allergen testing kits\n• Strong public speaking and consultative presentation skills\n• Good analytical skills and understanding of ISO 22000 / HACCP standards',
    requirements_id: '• S1 atau S2 Ilmu Pangan, Mikrobiologi, atau Biokimia\n• Pengalaman praktis dengan ELISA, uji strip lateral flow, atau kit uji alergen pangan\n• Kemampuan presentasi dan konsultasi teknis yang komunikatif dan meyakinkan\n• Memahami standar sertifikasi keamanan pangan ISO 22000 / HACCP',
    benefits_en: '• Competitive salary & annual performance bonus\n• BPJS Kesehatan & Ketenagakerjaan\n• Opportunities for international product training with European principals\n• Travel allowances and flexible working arrangements',
    benefits_id: '• Gaji kompetitif & bonus kinerja tahunan\n• BPJS Kesehatan & Ketenagakerjaan\n• Kesempatan pelatihan produk internasional bersama prinsipal Eropa\n• Tunjangan dinas dan fasilitas kerja yang mendukung',
    linkedin_url: 'https://www.linkedin.com/company/askara-tekno-pangan/jobs',
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 5,
    slug: 'laboratory-service-technician-bandung',
    job_title_en: 'Laboratory Service Technician',
    job_title_id: 'Teknisi Servis Laboratorium',
    department_en: 'Customer Engineering Service',
    department_id: 'Layanan Servis Teknik',
    location_en: 'Bandung, Indonesia',
    location_id: 'Bandung, Indonesia',
    employment_type_en: 'Contract',
    employment_type_id: 'Kontrak',
    experience_level_en: '1-2 Years Experience',
    experience_level_id: 'Pengalaman 1-2 Tahun',
    salary_range: 'Competitive Package',
    description_en: 'Assist with hardware calibration, routine scheduled inspections, and fluidic system maintenance for analytical analyzers across West Java partner laboratories.',
    description_id: 'Membantu kalibrasi perangkat keras, inspeksi berkala terjadwal, dan pemeliharaan sistem fluida instrumen analitis di laboratorium mitra wilayah Jawa Barat.',
    responsibilities_en: '• Execute routine maintenance checklists on photometric laboratory instruments\n• Replace consumable parts, tubing, and optical filters according to maintenance schedules\n• Maintain clean service logbooks and customer service records\n• Support senior service engineers during on-site installations',
    responsibilities_id: '• Menjalankan checklist pemeliharaan berkala pada instrumen laboratorium fotometri\n• Mengganti suku cadang consumable, selang fluida, dan filter optik sesuai jadwal servis\n• Mencatat logbook pemeliharaan dan dokumentasi tanda terima servis pelanggan\n• Mendukung teknisi senior saat instalasi alat di lokasi klien',
    requirements_en: '• Diploma (D3) in Electrical Engineering, Mechatronics, or Instrument Technology\n• Minimum 1 year experience in laboratory or electronic device maintenance\n• Detail-oriented with strong mechanical aptitude\n• Must hold valid driver’s license (SIM C)',
    requirements_id: '• D3 Teknik Elektro, Mekatronika, atau Teknik Instrumentasi\n• Pengalaman minimal 1 tahun dalam pemeliharaan alat elektronik atau instrumen lab\n• Teliti, disiplin, dan memiliki keterampilan mekanik/elektronik yang baik\n• Memiliki SIM C aktif untuk operasional dinas',
    benefits_en: '• Standard monthly salary & overtime allowances\n• BPJS Health and Employment coverage\n• Practical training and technical mentoring by senior engineers\n• Potential conversion to permanent employment based on performance',
    benefits_id: '• Gaji bulanan standar & tunjangan lembur/dinas\n• Jaminan BPJS Kesehatan dan Ketenagakerjaan\n• Pelatihan praktis dan bimbingan teknis intensif dari engineer senior\n• Peluang pengangkatan menjadi karyawan tetap berdasarkan kinerja',
    linkedin_url: 'https://www.linkedin.com/company/askara-tekno-pangan/jobs',
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 6,
    slug: 'marketing-communication-intern-jakarta',
    job_title_en: 'Marketing & Communication Intern',
    job_title_id: 'Magang Marketing & Komunikasi',
    department_en: 'Commercial Marketing',
    department_id: 'Pemasaran Komersial',
    location_en: 'Jakarta, Indonesia',
    location_id: 'Jakarta, Indonesia',
    employment_type_en: 'Internship',
    employment_type_id: 'Magang',
    experience_level_en: 'Fresh Graduate / Final Year Student',
    experience_level_id: 'Fresh Graduate / Mahasiswa Tingkat Akhir',
    salary_range: 'Monthly Internship Allowance',
    description_en: 'Support our digital communication, LinkedIn corporate content, product catalog materials, and event coordination for scientific seminars and exhibitions.',
    description_id: 'Mendukung publikasi komunikasi digital, konten korporat LinkedIn, materi katalog produk, dan koordinasi acara seminar ilmiah serta pameran industri pangan.',
    responsibilities_en: '• Assist in drafting educational LinkedIn articles and product launch announcements\n• Help prepare webinar materials, certificates, and event registration logistics\n• Coordinate design assets and product photoshoots for website and catalogs\n• Analyze website and social media traffic to improve engagement',
    responsibilities_id: '• Membantu penyusunan artikel edukasi LinkedIn dan pengumuman peluncuran produk\n• Membantu persiapan materi webinar, sertifikat, dan logistik registrasi acara\n• Mengkoordinasikan aset grafis dan katalog produk untuk website serta brosur\n• Menganalisis interaksi media sosial dan website untuk meningkatkan jangkauan',
    requirements_en: '• Final year student or fresh graduate in Marketing, Communications, Food Science, or Design\n• Strong writing skills in Indonesian and good working proficiency in English\n• Familiar with Canva / Figma and social media publishing tools\n• Creative, communicative, and eager to learn in a B2B scientific technology environment',
    requirements_id: '• Mahasiswa tingkat akhir atau fresh graduate Ilmu Komunikasi, Manajemen, Teknologi Pangan, atau DKV\n• Kemampuan menulis yang baik dalam bahasa Indonesia dan bahasa Inggris dasar\n• Terbiasa menggunakan Canva / Figma dan platform media sosial profesional\n• Kreatif, komunikatif, dan antusias belajar di industri teknologi B2B sains',
    benefits_en: '• Monthly internship stipend\n• Hands-on exposure to B2B food technology industry marketing\n• Official certificate of internship completion & letter of recommendation\n• Friendly and supportive collaborative work culture',
    benefits_id: '• Uang saku magang bulanan\n• Pengalaman langsung di dunia pemasaran teknologi analitis pangan B2B\n• Sertifikat resmi penyelesaian magang & surat rekomendasi kerja\n• Lingkungan kerja kolaboratif yang suportif dan profesional',
    linkedin_url: 'https://www.linkedin.com/company/askara-tekno-pangan/jobs',
    is_active: true,
    created_at: new Date().toISOString()
  }
];

// ====================================================================
// 7. INQUIRIES SEED
// ====================================================================
const initialInquiries = [
  {
    id: 1,
    product_id: 1,
    product_name: 'BioSystems Y15 Clinical Chemistry Analyzer',
    name: 'Dr. Budi Santoso',
    company: 'PT Pangan Sejahtera Pratama',
    email: 'budi@pangansejahtera.com',
    phone: '+6281234567890',
    message: 'Kami ingin meminta penawaran harga resmi dan demo alat untuk BioSystems Y15.',
    status: 'new',
    created_at: new Date().toISOString()
  }
];

// ====================================================================
// 8. HERO SLIDES SEED
// ====================================================================
const initialHeroSlides = [
  {
    id: 1,
    badge_en: 'Leading Analytical Distributor',
    badge_id: 'Distributor Solusi Analitis Terdepan',
    title_en: 'Delivering Quality and Trust in Every Test Result',
    title_id: 'Mewujudkan Kualitas dan Kepercayaan di Setiap Hasil Uji',
    subtitle_en: 'Your trusted partner for food quality analysis solutions, laboratory instruments, and analytical reagents.',
    subtitle_id: 'Mitra terpercaya Anda untuk solusi analisis kualitas pangan, instrumen laboratorium, dan reagen analitis.',
    image: '/images/header.png',
    tag_en: 'Featured Product: BioSystems Y15',
    tag_id: 'Produk Unggulan: BioSystems Y15',
    primary_btn_text_en: 'Explore Solutions',
    primary_btn_text_id: 'Jelajahi Solusi',
    primary_btn_url: '/products',
    secondary_btn_text_en: 'Contact Us',
    secondary_btn_text_id: 'Hubungi Kami',
    secondary_btn_url: '/contact',
    primary_cta_text_en: 'Explore Solutions',
    primary_cta_text_id: 'Jelajahi Solusi',
    primary_cta_link: '/products',
    secondary_cta_text_en: 'Contact Us',
    secondary_cta_text_id: 'Hubungi Kami',
    secondary_cta_link: '/contact',
    sort_order: 1,
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    badge_en: 'Rapid Diagnostics',
    badge_id: 'Diagnostik Cepat',
    title_en: 'High-Precision Automated Food Analysis Technology',
    title_id: 'Teknologi Analisis Pangan Otomatis Berpresisi Tinggi',
    subtitle_en: 'Empowering laboratories with cutting-edge photometric analyzers, allergen screening, and certified application support.',
    subtitle_id: 'Memberdayakan laboratorium dengan penganalisis fotometris terdepan, skrining alergen, dan dukungan aplikasi bersertifikasi.',
    image: '/images/y15.png',
    tag_en: 'Certified Rapid Test',
    tag_id: 'Rapid Test Tersertifikasi',
    primary_btn_text_en: 'View Instruments',
    primary_btn_text_id: 'Lihat Instrumen',
    primary_btn_url: '/products/instrument',
    secondary_btn_text_en: 'About Askara',
    secondary_btn_text_id: 'Tentang Askara',
    secondary_btn_url: '/about',
    primary_cta_text_en: 'View Instruments',
    primary_cta_text_id: 'Lihat Instrumen',
    primary_cta_link: '/products/instrument',
    secondary_cta_text_en: 'About Askara',
    secondary_cta_text_id: 'Tentang Askara',
    secondary_cta_link: '/about',
    sort_order: 2,
    is_active: true,
    created_at: new Date().toISOString()
  }
];

// ====================================================================
// 9. SHOWCASE SLIDES SEED
// ====================================================================
const initialShowcaseSlides = [
  {
    id: 1,
    tag_en: 'Automated Photometry',
    tag_id: 'Fotometri Otomatis',
    title_en: 'BioSystems Y15 Automatic Analyzer',
    title_id: 'BioSystems Y15 Penganalisis Otomatis',
    caption_en: 'BioSystems Y15 Automatic Photometric Analyzer',
    caption_id: 'Penganalisis Fotometris Otomatis BioSystems Y15',
    desc_en: 'Compact, fully automated random access analyzer with dedicated liquid-stable reagents for food and beverage quality parameters.',
    desc_id: 'Penganalisis random-access otomatis berukuran ringkas dengan reagen cair stabil untuk pengujian parameter mutu industri pangan.',
    image: '/images/y15.png',
    cta_text_en: 'Explore Y15 Details',
    cta_text_id: 'Pelajari Detail Y15',
    cta_link: '/products/biosystems-y15-clinical-chemistry-analyzer',
    features_en: ['150 tests/hour throughput', 'Low reagent consumption per test', 'Pre-programmed official validated methods', 'Dedicated barcoded reagents'],
    features_id: ['Kapasitas 150 uji/jam', 'Konsumsi reagen sangat hemat per uji', 'Metode resmi terprogram & tervalidasi', 'Reagen khusus dengan kode batang'],
    sort_order: 1,
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    tag_en: 'Rapid Safety Screening',
    tag_id: 'Skrining Cepat',
    title_en: 'Allergen & Contaminant Strip Tests',
    title_id: 'Kit Uji Strip Alergen & Kontaminan',
    caption_en: 'Rapid Allergen & Gluten Testing Solution',
    caption_id: 'Solusi Pengujian Cepat Alergen & Gluten',
    desc_en: 'Ultra-sensitive qualitative test strips delivering unambiguous results within minutes for allergen verification and export compliance.',
    desc_id: 'Strip uji kualitatif ultra-sensitif yang memberikan hasil visual jelas dalam hitungan menit untuk verifikasi alergen dan kepatuhan standar ekspor.',
    image: '/images/gluten.png',
    cta_text_en: 'View Rapid Test Lineup',
    cta_text_id: 'Lihat Lini Rapid Test',
    cta_link: '/products?category=rapid-test',
    features_en: ['Visual result in 5-10 minutes', 'AOAC-RI certified performance', 'No high-cost instrumentation required', 'High specificity without cross-reaction'],
    features_id: ['Hasil visual jelas dalam 5-10 menit', 'Kinerja tersertifikasi AOAC-RI', 'Tidak membutuhkan alat mahal', 'Spesifisitas tinggi bebas reaksi silang'],
    sort_order: 2,
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    tag_en: 'Seafood Safety',
    tag_id: 'Keamanan Hasil Laut',
    title_en: 'Histamine Rapid Strip Test',
    title_id: 'Kit Uji Cepat Histamin Perikanan',
    caption_en: 'Accurate Seafood & Fishery Histamine Test Kit',
    caption_id: 'Kit Uji Histamin Akurat untuk Produk Perikanan',
    desc_en: 'Fast visual screening test strip designed for seafood processing plants and cold chain inspection to ensure histamine safety standards.',
    desc_id: 'Strip uji visual cepat untuk pabrik pengolahan hasil laut dan inspeksi rantai dingin guna menjamin batas aman histamin ekspor.',
    image: '/images/histamine.png',
    cta_text_en: 'View Histamine Test',
    cta_text_id: 'Lihat Uji Histamin',
    cta_link: '/products/histamine-rapid-strip-test',
    features_en: ['Fast 5-10 minute results', 'Direct field testing', 'Visual comparison color card', 'Cost-effective screening'],
    features_id: ['Hasil cepat 5-10 menit', 'Pengujian langsung di lapangan', 'Kartu perbandingan warna visual', 'Skrining hemat biaya'],
    sort_order: 3,
    is_active: true,
    created_at: new Date().toISOString()
  }
];

// ====================================================================
// 10. HOMEPAGE SECTIONS SEED
// ====================================================================
const initialHomeSections = [
  {
    id: 1,
    section_key: 'who_we_are',
    badge_en: 'WHO WE ARE',
    badge_id: 'TENTANG KAMI',
    tag_en: 'WHO WE ARE',
    tag_id: 'TENTANG KAMI',
    title_en: 'Dedicated to Advancing Food Quality & Lab Solutions',
    title_id: 'Berdedikasi Memajukan Kualitas Pangan & Solusi Laboratorium',
    subtitle_en: 'Partnering with global leaders for reliable food safety and testing.',
    subtitle_id: 'Bermitra dengan prinsipal terkemuka dunia untuk keamanan dan pengujian pangan terpercaya.',
    description_en: 'PT Askara Tekno Pangan is an innovative provider of laboratory instruments, solutions, and services for food quality testing and research. We partner with global leaders to support a safer, healthier, and more sustainable future.',
    description_id: 'PT Askara Tekno Pangan adalah penyedia instrumen, solusi, dan layanan laboratorium inovatif untuk pengujian dan riset kualitas pangan. Kami bermitra dengan pemimpin global untuk mendukung masa depan yang lebih aman, sehat, dan berkelanjutan.',
    button_text_en: 'Learn More',
    button_text_id: 'Pelajari Selengkapnya',
    button_url: '/about',
    cta_text_en: 'Learn More',
    cta_text_id: 'Pelajari Selengkapnya',
    cta_link: '/about',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    section_key: 'showcase',
    badge_en: 'Advanced Analytical Solutions',
    badge_id: 'Solusi Analitis Mutakhir',
    tag_en: 'FEATURED SOLUTIONS',
    tag_id: 'SOLUSI UNGGULAN',
    title_en: 'Precision Equipment for Modern Testing',
    title_id: 'Peralatan Presisi untuk Pengujian Modern',
    subtitle_en: 'Engineered for reliability, reproducibility, and compliance across food production and QC laboratories.',
    subtitle_id: 'Dirancang untuk keandalan, reprodusibilitas, dan kepatuhan di seluruh industri pangan dan laboratorium QC.',
    description_en: 'Engineered for reliability, reproducibility, and compliance across food production, quality control laboratories, and environmental monitoring.',
    description_id: 'Dirancang untuk keandalan, reprodusibilitas, dan kepatuhan di seluruh industri pangan, laboratorium QC, dan pemantauan lingkungan.',
    button_text_en: 'View All Products',
    button_text_id: 'Lihat Semua Produk',
    button_url: '/products',
    cta_text_en: 'View All Products',
    cta_text_id: 'Lihat Semua Produk',
    cta_link: '/products',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 3,
    section_key: 'industries',
    badge_en: 'Industries We Serve',
    badge_id: 'Sektor yang Kami Layani',
    tag_en: 'KEY INDUSTRIES',
    tag_id: 'SEKTOR INDUSTRI',
    title_en: 'Testing & Quality Solutions for Every Industry',
    title_id: 'Solusi Pengujian Mutu untuk Berbagai Industri',
    subtitle_en: 'Tailored analytical instruments, rapid screening kits, and laboratory solutions designed specifically for your industry.',
    subtitle_id: 'Instrumen analitis, rapid test kit, dan solusi laboratorium yang dirancang khusus untuk memenuhi standar industri Anda.',
    description_en: 'Tailored analytical instruments, rapid screening kits, and laboratory solutions designed specifically for your industry standards.',
    description_id: 'Instrumen analitis, rapid test kit, dan solusi laboratorium yang dirancang khusus untuk memenuhi standar industri Anda.',
    button_text_en: 'Explore All Industries',
    button_text_id: 'Jelajahi Semua Industri',
    button_url: '/industries',
    cta_text_en: 'Explore All Industries',
    cta_text_id: 'Jelajahi Semua Industri',
    cta_link: '/industries',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// ====================================================================
// 11. INDUSTRIES SEED
// ====================================================================
const initialIndustries = [
  {
    id: 1,
    slug: 'food-beverage',
    name_en: 'Food & Beverage (F&B)',
    name_id: 'Makanan & Minuman (F&B)',
    title_en: 'Food & Beverage (F&B)',
    title_id: 'Makanan & Minuman (F&B)',
    subtitle_en: 'Sugar, Acid, SO2 & Allergen Testing',
    subtitle_id: 'Uji Gula, Keasaman, SO2 & Alergen',
    description_en: 'Composition analysis, nutritional labeling, and contaminant screening for packaged food and beverage manufacturers.',
    description_id: 'Analisis komposisi, pelabelan nutrisi, dan skrining kontaminan untuk produsen makanan dan minuman kemasan.',
    icon: 'Utensils',
    icon_name: 'Utensils',
    image: '/images/y15.png',
    tags_en: ['Instruments', 'Chemical Reagents', 'Rapid Test'],
    tags_id: ['Instrumen', 'Reagent Kimia', 'Rapid Test'],
    target_category_slug: 'instrument',
    show_on_homepage: true,
    sort_order: 1,
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    slug: 'fisheries-seafood',
    name_en: 'Fisheries & Seafood Processing',
    name_id: 'Industri Perikanan & Hasil Laut',
    title_en: 'Fisheries & Seafood Export',
    title_id: 'Perikanan & Hasil Laut',
    subtitle_en: 'Histamine, Freshness & Heavy Metal Safety',
    subtitle_id: 'Uji Histamin, Kesegaran & Logam Berat',
    description_en: 'Histamine testing, heavy metals, and freshness verification for seafood processors and exporters complying with international standards.',
    description_id: 'Pengujian histamin, logam berat, dan kesegaran untuk pengolah dan eksportir makanan laut sesuai standar ekspor internasional.',
    icon: 'Fish',
    icon_name: 'Fish',
    image: '/images/histamine.png',
    tags_en: ['Rapid Test', 'Instruments'],
    tags_id: ['Rapid Test', 'Instrumen'],
    target_category_slug: 'rapid-test',
    show_on_homepage: true,
    sort_order: 2,
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    slug: 'food-manufacturing',
    name_en: 'Food Manufacturing & Agro-Industry',
    name_id: 'Manufaktur Pangan & Agroindustri',
    title_en: 'Food Manufacturing & Processing',
    title_id: 'Manufaktur Pangan',
    subtitle_en: 'Raw Material Intake & Process Control',
    subtitle_id: 'Penerimaan Bahan Baku & Kontrol Proses',
    description_en: 'Industrial-scale processing quality control and final product testing to prevent quality deviations before distribution.',
    description_id: 'Kontrol kualitas proses produksi dan produk akhir skala pabrik untuk mencegah deviasi mutu sebelum produk dipasarkan.',
    icon: 'Factory',
    icon_name: 'Factory',
    image: '/images/header.png',
    tags_en: ['Instruments', 'Microbiology', 'WWTP'],
    tags_id: ['Instrumen', 'Mikrobiologi', 'IPAL'],
    target_category_slug: 'instrument',
    show_on_homepage: true,
    sort_order: 3,
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 4,
    slug: 'lab-quality-testing',
    name_en: 'Testing Labs & Quality Institutions',
    name_id: 'Laboratorium Pengujian & Lembaga Mutu',
    title_en: 'Laboratories & Quality Testing',
    title_id: 'Laboratorium & Pengujian Mutu',
    subtitle_en: 'Analytical Precision & Method Compliance',
    subtitle_id: 'Presisi Analitis & Kepatuhan Standar Uji',
    description_en: 'Instrumentation, reagents, and certified reference materials for commercial and in-house testing labs requiring utmost accuracy.',
    description_id: 'Instrumentasi, reagen, dan bahan referensi untuk laboratorium pengujian independen dan in-house yang membutuhkan hasil presisi.',
    icon: 'FlaskConical',
    icon_name: 'FlaskConical',
    image: '/images/gluten.png',
    tags_en: ['Instruments', 'Chemical Reagents', 'Microbiology', 'RO Systems'],
    tags_id: ['Instrumen', 'Reagent Kimia', 'Mikrobiologi', 'Sistem RO'],
    target_category_slug: 'reagent-kimia',
    show_on_homepage: true,
    sort_order: 4,
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 5,
    slug: 'environmental-water',
    name_en: 'Environmental & Industrial Water',
    name_id: 'Lingkungan & Pengolahan Air Industri',
    title_en: 'Environmental & Water Treatment',
    title_id: 'Lingkungan & Pengolahan Air',
    subtitle_en: 'Effluent, Wastewater & Clean Water QC',
    subtitle_id: 'Pengawasan Limbah & Mutu Air Bersih',
    description_en: 'Wastewater treatment plants (WWTP/IPAL) and reverse osmosis process water purification systems for environmental compliance.',
    description_id: 'Instalasi pengolahan air limbah (IPAL) dan sistem pemurnian air proses untuk kepatuhan baku mutu lingkungan.',
    icon: 'Trees',
    icon_name: 'Trees',
    image: '/images/header.png',
    tags_en: ['WWTP', 'RO Systems', 'Microbiology'],
    tags_id: ['IPAL', 'Sistem RO', 'Mikrobiologi'],
    target_category_slug: 'ipal',
    show_on_homepage: true,
    sort_order: 5,
    is_active: true,
    created_at: new Date().toISOString()
  }
];

// ====================================================================
// 12. ABOUT US CONTENT SEED
// ====================================================================
const initialAboutContent = {
  key: 'main',
  hero_badge_en: 'About PT Askara Tekno Pangan',
  hero_badge_id: 'Tentang PT Askara Tekno Pangan',
  hero_title_en: 'Empowering Food Quality Laboratories in Indonesia',
  hero_title_id: 'Memajukan Laboratorium Kualitas Pangan di Indonesia',
  hero_subtitle_en: 'Through trusted laboratory technology, professional support, and reliable solutions for the food and beverage industry.',
  hero_subtitle_id: 'Melalui teknologi laboratorium terpercaya, dukungan profesional, dan solusi handal untuk industri makanan & minuman.',

  who_we_are_tag_en: 'Who We Are',
  who_we_are_tag_id: 'Tentang Kami',
  who_we_are_heading_en: 'Your Trusted Partner for Food Quality Analysis',
  who_we_are_heading_id: 'Mitra Terpercaya Anda untuk Analisis Kualitas Pangan',
  who_we_are_p1_en: 'PT Askara Tekno Pangan is an Indonesian laboratory solution provider specializing in food quality analysis and analytical solutions.',
  who_we_are_p1_id: 'PT Askara Tekno Pangan adalah penyedia solusi laboratorium di Indonesia yang berfokus pada analisis mutu pangan dan solusi analitis.',
  who_we_are_p2_en: 'Established in 2019, Askara delivers reliable analytical instruments, reagents, and professional support to help laboratories achieve accurate and efficient testing performance.',
  who_we_are_p2_id: 'Didirikan pada tahun 2019, Askara menghadirkan instrumen analitis handal, reagen, serta dukungan profesional untuk membantu laboratorium mencapai performa pengujian yang akurat dan efisien.',
  who_we_are_points_en: [
    'Authorized distributor of BioSystems Food & Beverage',
    'Certified application scientists & field engineers across Indonesia',
    'Full warranty, calibration, and preventive maintenance support'
  ],
  who_we_are_points_id: [
    'Distributor resmi BioSystems Food & Beverage',
    'Application scientist & field engineer tersertifikasi di seluruh Indonesia',
    'Dukungan garansi penuh, kalibrasi, dan pemeliharaan preventif'
  ],
  who_we_are_images: [
    {
      image: '/images/y15.png',
      caption_en: 'BioSystems Y15 Automated Photometric Analyzer',
      caption_id: 'BioSystems Y15 Automated Photometric Analyzer',
      alt_text: 'BioSystems Y15 Analyzer'
    },
    {
      image: '/images/gluten.png',
      caption_en: 'Gluten & Allergen Rapid Testing Solution',
      caption_id: 'Solusi Uji Cepat Gluten & Alergen',
      alt_text: 'Gluten Test Kit'
    },
    {
      image: '/images/histamine.png',
      caption_en: 'Histamine Food Safety Screening Kits',
      caption_id: 'Kit Skrining Keamanan Pangan Histamin',
      alt_text: 'Histamine Test Strips'
    }
  ],

  why_choose_badge_en: 'Why Choose Askara',
  why_choose_badge_id: 'Mengapa Memilih Askara',
  why_choose_heading_en: 'Built for the Food & Beverage Industry',
  why_choose_heading_id: 'Dirancang untuk Industri Makanan & Minuman',
  why_choose_reasons: [
    {
      icon: 'ShieldCheck',
      title_en: 'Food & Beverage Specialist',
      title_id: 'Spesialis Makanan & Minuman',
      desc_en: 'Dedicated laboratory solutions for quality analysis and testing in the food and beverage industry.',
      desc_id: 'Solusi laboratorium berdedikasi untuk analisis mutu dan pengujian di industri pangan & minuman.'
    },
    {
      icon: 'Award',
      title_en: 'Official BioSystems Distributor',
      title_id: 'Distributor Resmi BioSystems',
      desc_en: 'Providing trusted analytical technology solutions across laboratories in Indonesia.',
      desc_id: 'Menyediakan solusi teknologi analitis terpercaya untuk laboratorium di seluruh Indonesia.'
    },
    {
      icon: 'Wrench',
      title_en: 'Installation & Training',
      title_id: 'Instalasi & Pelatihan',
      desc_en: 'Professional installation, application support, and user training by experienced specialists.',
      desc_id: 'Instalasi profesional, dukungan aplikasi, dan pelatihan pengguna oleh spesialis berpengalaman.'
    },
    {
      icon: 'Headphones',
      title_en: 'Technical Support',
      title_id: 'Dukungan Teknis Handal',
      desc_en: 'Reliable after-sales service and scheduled maintenance to support long-term laboratory operations.',
      desc_id: 'Layanan purna jual responsif dan pemeliharaan berkala untuk mendukung kelancaran operasional laboratorium.'
    }
  ]
};


// ====================================================================
// PROGRAMMATIC DATABASE SEEDER HELPER
// ====================================================================
/**
 * Seeds all initial data into a PostgreSQL client/pool
 * @param {import('pg').Client | import('pg').Pool} client - Connected pg client or pool
 */
async function seedDatabase(client) {
  console.log('🌱 [Seeder] Starting database seed from centralized initialData.js...');

  // 1. Users
  for (const u of initialUsers) {
    await client.query(
      `INSERT INTO users (id, name, email, password_hash, role)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (email) DO UPDATE SET
         name = EXCLUDED.name,
         password_hash = EXCLUDED.password_hash,
         role = EXCLUDED.role`,
      [u.id, u.name, u.email, u.password_hash, u.role]
    );
  }
  console.log(`  ✓ Seeded ${initialUsers.length} users`);

  // 2. Product Categories
  for (const c of initialCategories) {
    await client.query(
      `INSERT INTO product_categories (id, name_en, name_id, slug, description_en, description_id, image, is_active, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (slug) DO UPDATE SET
         name_en = EXCLUDED.name_en,
         name_id = EXCLUDED.name_id,
         description_en = EXCLUDED.description_en,
         description_id = EXCLUDED.description_id,
         image = EXCLUDED.image,
         is_active = EXCLUDED.is_active,
         sort_order = EXCLUDED.sort_order`,
      [c.id, c.name_en, c.name_id, c.slug, c.description_en, c.description_id, c.image, c.is_active, c.sort_order]
    );
  }
  console.log(`  ✓ Seeded ${initialCategories.length} product categories`);

  // 3. Products
  for (const p of initialProducts) {
    await client.query(
      `INSERT INTO products (
         id, product_category_id, category_slug, name_en, name_id, slug, principal,
         short_description_en, short_description_id, description_en, description_id,
         image, specifications, applications_en, applications_id, features_en, features_id,
         brochure, is_active, is_featured, sort_order
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
       ON CONFLICT (slug) DO UPDATE SET
         product_category_id = EXCLUDED.product_category_id,
         category_slug = EXCLUDED.category_slug,
         name_en = EXCLUDED.name_en,
         name_id = EXCLUDED.name_id,
         principal = EXCLUDED.principal,
         short_description_en = EXCLUDED.short_description_en,
         short_description_id = EXCLUDED.short_description_id,
         description_en = EXCLUDED.description_en,
         description_id = EXCLUDED.description_id,
         image = EXCLUDED.image,
         specifications = EXCLUDED.specifications,
         applications_en = EXCLUDED.applications_en,
         applications_id = EXCLUDED.applications_id,
         features_en = EXCLUDED.features_en,
         features_id = EXCLUDED.features_id,
         is_active = EXCLUDED.is_active,
         is_featured = EXCLUDED.is_featured,
         sort_order = EXCLUDED.sort_order`,
      [
        p.id, p.product_category_id, p.category_slug, p.name_en, p.name_id, p.slug, p.principal,
        p.short_description_en, p.short_description_id, p.description_en, p.description_id,
        p.image, p.specifications, p.applications_en, p.applications_id, p.features_en, p.features_id,
        p.brochure, p.is_active, p.is_featured, p.sort_order
      ]
    );
  }
  console.log(`  ✓ Seeded ${initialProducts.length} products`);

  // 4. Partners
  for (const part of initialPartners) {
    await client.query(
      `INSERT INTO partners (id, name, slug, logo, country, category, description_en, description_id, documentation_gallery, website_url, is_active, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb, $10, $11, $12)
       ON CONFLICT (id) DO UPDATE SET
         name = EXCLUDED.name,
         slug = EXCLUDED.slug,
         logo = EXCLUDED.logo,
         country = EXCLUDED.country,
         category = EXCLUDED.category,
         description_en = EXCLUDED.description_en,
         description_id = EXCLUDED.description_id,
         documentation_gallery = EXCLUDED.documentation_gallery,
         website_url = EXCLUDED.website_url,
         is_active = EXCLUDED.is_active,
         sort_order = EXCLUDED.sort_order`,
      [
        part.id, part.name, part.slug, part.logo, part.country, part.category,
        part.description_en, part.description_id, JSON.stringify(part.documentation_gallery || []),
        part.website_url, part.is_active, part.sort_order
      ]
    );
  }
  console.log(`  ✓ Seeded ${initialPartners.length} partners`);

  // 5. Articles
  for (const art of initialArticles) {
    await client.query(
      `INSERT INTO articles (id, title_en, title_id, category_en, category_id, image, published_at, linkedin_url, is_active, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       ON CONFLICT (id) DO UPDATE SET
         title_en = EXCLUDED.title_en,
         title_id = EXCLUDED.title_id,
         category_en = EXCLUDED.category_en,
         category_id = EXCLUDED.category_id,
         image = EXCLUDED.image,
         published_at = EXCLUDED.published_at,
         linkedin_url = EXCLUDED.linkedin_url,
         is_active = EXCLUDED.is_active,
         sort_order = EXCLUDED.sort_order`,
      [art.id, art.title_en, art.title_id, art.category_en, art.category_id, art.image, art.published_at, art.linkedin_url, art.is_active, art.sort_order]
    );
  }
  console.log(`  ✓ Seeded ${initialArticles.length} articles`);

  // 6. Careers
  for (const car of initialCareers) {
    await client.query(
      `INSERT INTO careers (
         id, slug, job_title_en, job_title_id, department_en, department_id,
         location_en, location_id, employment_type_en, employment_type_id,
         experience_level_en, experience_level_id, salary_range, description_en, description_id,
         responsibilities_en, responsibilities_id, requirements_en, requirements_id,
         benefits_en, benefits_id, linkedin_url, is_active
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)
       ON CONFLICT (id) DO UPDATE SET
         slug = EXCLUDED.slug,
         job_title_en = EXCLUDED.job_title_en,
         job_title_id = EXCLUDED.job_title_id,
         department_en = EXCLUDED.department_en,
         department_id = EXCLUDED.department_id,
         location_en = EXCLUDED.location_en,
         location_id = EXCLUDED.location_id,
         employment_type_en = EXCLUDED.employment_type_en,
         employment_type_id = EXCLUDED.employment_type_id,
         experience_level_en = EXCLUDED.experience_level_en,
         experience_level_id = EXCLUDED.experience_level_id,
         salary_range = EXCLUDED.salary_range,
         description_en = EXCLUDED.description_en,
         description_id = EXCLUDED.description_id,
         responsibilities_en = EXCLUDED.responsibilities_en,
         responsibilities_id = EXCLUDED.responsibilities_id,
         requirements_en = EXCLUDED.requirements_en,
         requirements_id = EXCLUDED.requirements_id,
         benefits_en = EXCLUDED.benefits_en,
         benefits_id = EXCLUDED.benefits_id,
         linkedin_url = EXCLUDED.linkedin_url,
         is_active = EXCLUDED.is_active`,
      [
        car.id, car.slug, car.job_title_en, car.job_title_id, car.department_en, car.department_id,
        car.location_en, car.location_id, car.employment_type_en, car.employment_type_id,
        car.experience_level_en, car.experience_level_id, car.salary_range, car.description_en, car.description_id,
        car.responsibilities_en, car.responsibilities_id, car.requirements_en, car.requirements_id,
        car.benefits_en, car.benefits_id, car.linkedin_url, car.is_active
      ]
    );
  }
  console.log(`  ✓ Seeded ${initialCareers.length} careers`);

  // 7. Hero Slides
  for (const s of initialHeroSlides) {
    await client.query(
      `INSERT INTO hero_slides (
         id, badge_en, badge_id, title_en, title_id, subtitle_en, subtitle_id, image,
         tag_en, tag_id, primary_btn_text_en, primary_btn_text_id, primary_btn_url,
         secondary_btn_text_en, secondary_btn_text_id, secondary_btn_url,
         primary_cta_text_en, primary_cta_text_id, primary_cta_link,
         secondary_cta_text_en, secondary_cta_text_id, secondary_cta_link,
         sort_order, is_active
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24)
       ON CONFLICT (id) DO UPDATE SET
         badge_en = EXCLUDED.badge_en,
         badge_id = EXCLUDED.badge_id,
         title_en = EXCLUDED.title_en,
         title_id = EXCLUDED.title_id,
         subtitle_en = EXCLUDED.subtitle_en,
         subtitle_id = EXCLUDED.subtitle_id,
         image = EXCLUDED.image,
         tag_en = EXCLUDED.tag_en,
         tag_id = EXCLUDED.tag_id,
         primary_btn_text_en = EXCLUDED.primary_btn_text_en,
         primary_btn_text_id = EXCLUDED.primary_btn_text_id,
         primary_btn_url = EXCLUDED.primary_btn_url,
         secondary_btn_text_en = EXCLUDED.secondary_btn_text_en,
         secondary_btn_text_id = EXCLUDED.secondary_btn_text_id,
         secondary_btn_url = EXCLUDED.secondary_btn_url,
         primary_cta_text_en = EXCLUDED.primary_cta_text_en,
         primary_cta_text_id = EXCLUDED.primary_cta_text_id,
         primary_cta_link = EXCLUDED.primary_cta_link,
         secondary_cta_text_en = EXCLUDED.secondary_cta_text_en,
         secondary_cta_text_id = EXCLUDED.secondary_cta_text_id,
         secondary_cta_link = EXCLUDED.secondary_cta_link,
         sort_order = EXCLUDED.sort_order,
         is_active = EXCLUDED.is_active`,
      [
        s.id, s.badge_en, s.badge_id, s.title_en, s.title_id, s.subtitle_en, s.subtitle_id, s.image,
        s.tag_en, s.tag_id, s.primary_btn_text_en, s.primary_btn_text_id, s.primary_btn_url,
        s.secondary_btn_text_en, s.secondary_btn_text_id, s.secondary_btn_url,
        s.primary_cta_text_en, s.primary_cta_text_id, s.primary_cta_link,
        s.secondary_cta_text_en, s.secondary_cta_text_id, s.secondary_cta_link,
        s.sort_order, s.is_active
      ]
    );
  }
  console.log(`  ✓ Seeded ${initialHeroSlides.length} hero slides`);

  // 8. Showcase Slides
  for (const sc of initialShowcaseSlides) {
    await client.query(
      `INSERT INTO showcase_slides (
         id, tag_en, tag_id, title_en, title_id, caption_en, caption_id,
         desc_en, desc_id, image, cta_text_en, cta_text_id, cta_link,
         features_en, features_id, sort_order, is_active
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14::jsonb, $15::jsonb, $16, $17)
       ON CONFLICT (id) DO UPDATE SET
         tag_en = EXCLUDED.tag_en,
         tag_id = EXCLUDED.tag_id,
         title_en = EXCLUDED.title_en,
         title_id = EXCLUDED.title_id,
         caption_en = EXCLUDED.caption_en,
         caption_id = EXCLUDED.caption_id,
         desc_en = EXCLUDED.desc_en,
         desc_id = EXCLUDED.desc_id,
         image = EXCLUDED.image,
         cta_text_en = EXCLUDED.cta_text_en,
         cta_text_id = EXCLUDED.cta_text_id,
         cta_link = EXCLUDED.cta_link,
         features_en = EXCLUDED.features_en,
         features_id = EXCLUDED.features_id,
         sort_order = EXCLUDED.sort_order,
         is_active = EXCLUDED.is_active`,
      [
        sc.id, sc.tag_en, sc.tag_id, sc.title_en, sc.title_id, sc.caption_en, sc.caption_id,
        sc.desc_en, sc.desc_id, sc.image, sc.cta_text_en, sc.cta_text_id, sc.cta_link,
        JSON.stringify(sc.features_en || []), JSON.stringify(sc.features_id || []),
        sc.sort_order, sc.is_active
      ]
    );
  }
  console.log(`  ✓ Seeded ${initialShowcaseSlides.length} showcase slides`);

  // 9. Home Sections
  for (const hs of initialHomeSections) {
    await client.query(
      `INSERT INTO home_sections (
         id, section_key, badge_en, badge_id, tag_en, tag_id, title_en, title_id,
         subtitle_en, subtitle_id, description_en, description_id,
         button_text_en, button_text_id, button_url, cta_text_en, cta_text_id, cta_link
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
       ON CONFLICT (section_key) DO UPDATE SET
         badge_en = EXCLUDED.badge_en,
         badge_id = EXCLUDED.badge_id,
         tag_en = EXCLUDED.tag_en,
         tag_id = EXCLUDED.tag_id,
         title_en = EXCLUDED.title_en,
         title_id = EXCLUDED.title_id,
         subtitle_en = EXCLUDED.subtitle_en,
         subtitle_id = EXCLUDED.subtitle_id,
         description_en = EXCLUDED.description_en,
         description_id = EXCLUDED.description_id,
         button_text_en = EXCLUDED.button_text_en,
         button_text_id = EXCLUDED.button_text_id,
         button_url = EXCLUDED.button_url,
         cta_text_en = EXCLUDED.cta_text_en,
         cta_text_id = EXCLUDED.cta_text_id,
         cta_link = EXCLUDED.cta_link`,
      [
        hs.id, hs.section_key, hs.badge_en, hs.badge_id, hs.tag_en, hs.tag_id,
        hs.title_en, hs.title_id, hs.subtitle_en, hs.subtitle_id, hs.description_en, hs.description_id,
        hs.button_text_en, hs.button_text_id, hs.button_url, hs.cta_text_en, hs.cta_text_id, hs.cta_link
      ]
    );
  }
  console.log(`  ✓ Seeded ${initialHomeSections.length} home sections`);

  // 10. Industries
  for (const ind of initialIndustries) {
    await client.query(
      `INSERT INTO industries (
         id, slug, icon, icon_name, name_en, name_id, title_en, title_id,
         subtitle_en, subtitle_id, description_en, description_id, image,
         tags_en, tags_id, target_category_slug, show_on_homepage, sort_order, is_active
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14::jsonb, $15::jsonb, $16, $17, $18, $19)
       ON CONFLICT (slug) DO UPDATE SET
         icon = EXCLUDED.icon,
         icon_name = EXCLUDED.icon_name,
         name_en = EXCLUDED.name_en,
         name_id = EXCLUDED.name_id,
         title_en = EXCLUDED.title_en,
         title_id = EXCLUDED.title_id,
         subtitle_en = EXCLUDED.subtitle_en,
         subtitle_id = EXCLUDED.subtitle_id,
         description_en = EXCLUDED.description_en,
         description_id = EXCLUDED.description_id,
         image = EXCLUDED.image,
         tags_en = EXCLUDED.tags_en,
         tags_id = EXCLUDED.tags_id,
         target_category_slug = EXCLUDED.target_category_slug,
         show_on_homepage = EXCLUDED.show_on_homepage,
         sort_order = EXCLUDED.sort_order,
         is_active = EXCLUDED.is_active`,
      [
        ind.id, ind.slug, ind.icon, ind.icon_name, ind.name_en, ind.name_id,
        ind.title_en, ind.title_id, ind.subtitle_en, ind.subtitle_id,
        ind.description_en, ind.description_id, ind.image,
        JSON.stringify(ind.tags_en || []), JSON.stringify(ind.tags_id || []),
        ind.target_category_slug, ind.show_on_homepage, ind.sort_order, ind.is_active
      ]
    );
  }
  console.log(`  ✓ Seeded ${initialIndustries.length} industries`);

  // 11. About Us Content
  await client.query(
    `INSERT INTO about_content (
       key, hero_badge_en, hero_badge_id, hero_title_en, hero_title_id, hero_subtitle_en, hero_subtitle_id,
       who_we_are_tag_en, who_we_are_tag_id, who_we_are_heading_en, who_we_are_heading_id,
       who_we_are_p1_en, who_we_are_p1_id, who_we_are_p2_en, who_we_are_p2_id,
       who_we_are_points_en, who_we_are_points_id, who_we_are_images,
       why_choose_badge_en, why_choose_badge_id, why_choose_heading_en, why_choose_heading_id,
       why_choose_reasons
     ) VALUES (
       $1, $2, $3, $4, $5, $6, $7,
       $8, $9, $10, $11,
       $12, $13, $14, $15,
       $16::jsonb, $17::jsonb, $18::jsonb,
       $19, $20, $21, $22,
       $23::jsonb
     )
     ON CONFLICT (key) DO UPDATE SET
       hero_badge_en = EXCLUDED.hero_badge_en,
       hero_badge_id = EXCLUDED.hero_badge_id,
       hero_title_en = EXCLUDED.hero_title_en,
       hero_title_id = EXCLUDED.hero_title_id,
       hero_subtitle_en = EXCLUDED.hero_subtitle_en,
       hero_subtitle_id = EXCLUDED.hero_subtitle_id,
       who_we_are_tag_en = EXCLUDED.who_we_are_tag_en,
       who_we_are_tag_id = EXCLUDED.who_we_are_tag_id,
       who_we_are_heading_en = EXCLUDED.who_we_are_heading_en,
       who_we_are_heading_id = EXCLUDED.who_we_are_heading_id,
       who_we_are_p1_en = EXCLUDED.who_we_are_p1_en,
       who_we_are_p1_id = EXCLUDED.who_we_are_p1_id,
       who_we_are_p2_en = EXCLUDED.who_we_are_p2_en,
       who_we_are_p2_id = EXCLUDED.who_we_are_p2_id,
       who_we_are_points_en = EXCLUDED.who_we_are_points_en,
       who_we_are_points_id = EXCLUDED.who_we_are_points_id,
       who_we_are_images = EXCLUDED.who_we_are_images,
       why_choose_badge_en = EXCLUDED.why_choose_badge_en,
       why_choose_badge_id = EXCLUDED.why_choose_badge_id,
       why_choose_heading_en = EXCLUDED.why_choose_heading_en,
       why_choose_heading_id = EXCLUDED.why_choose_heading_id,
       why_choose_reasons = EXCLUDED.why_choose_reasons`,
    [
      initialAboutContent.key,
      initialAboutContent.hero_badge_en,
      initialAboutContent.hero_badge_id,
      initialAboutContent.hero_title_en,
      initialAboutContent.hero_title_id,
      initialAboutContent.hero_subtitle_en,
      initialAboutContent.hero_subtitle_id,
      initialAboutContent.who_we_are_tag_en,
      initialAboutContent.who_we_are_tag_id,
      initialAboutContent.who_we_are_heading_en,
      initialAboutContent.who_we_are_heading_id,
      initialAboutContent.who_we_are_p1_en,
      initialAboutContent.who_we_are_p1_id,
      initialAboutContent.who_we_are_p2_en,
      initialAboutContent.who_we_are_p2_id,
      JSON.stringify(initialAboutContent.who_we_are_points_en || []),
      JSON.stringify(initialAboutContent.who_we_are_points_id || []),
      JSON.stringify(initialAboutContent.who_we_are_images || []),
      initialAboutContent.why_choose_badge_en,
      initialAboutContent.why_choose_badge_id,
      initialAboutContent.why_choose_heading_en,
      initialAboutContent.why_choose_heading_id,
      JSON.stringify(initialAboutContent.why_choose_reasons || [])
    ]
  );
  console.log('  ✓ Seeded about content');

  // Reset sequence IDs for serial columns to prevent collision on future inserts
  const tablesWithSerial = ['users', 'product_categories', 'products', 'partners', 'articles', 'careers', 'hero_slides', 'showcase_slides', 'home_sections', 'industries', 'inquiries', 'about_content'];
  for (const t of tablesWithSerial) {
    try {
      await client.query(`SELECT setval(pg_get_serial_sequence('${t}', 'id'), coalesce(max(id), 1)) FROM ${t}`);
    } catch {}
  }

  console.log('✅ [Seeder] Database seeding completed successfully!');
}

module.exports = {
  initialUsers,
  initialCategories,
  initialProducts,
  initialPartners,
  initialArticles,
  initialCareers,
  initialInquiries,
  initialHeroSlides,
  initialShowcaseSlides,
  initialHomeSections,
  initialIndustries,
  initialAboutContent,
  seedDatabase
};
