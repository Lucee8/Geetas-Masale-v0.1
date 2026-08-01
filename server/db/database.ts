/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const DATA_DIR = path.join(process.cwd(), 'server', 'db', 'data');

// Ensure database directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Helper to read JSON file synchronously with type safety
function readDataFile<T>(filename: string, defaultData: T): T {
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2), 'utf-8');
    return defaultData;
  }
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as T;
  } catch (err) {
    console.error(`Error reading ${filename}, re-initializing:`, err);
    return defaultData;
  }
}

// Helper to write JSON file synchronously
function writeDataFile(filename: string, data: any): void {
  const filePath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// Structures mimicking MySQL tables
export interface Admin {
  id: number;
  username: string;
  passwordHash: string;
  role: 'Super Admin' | 'Manager' | 'Staff';
  name: string;
}

export interface Category {
  id: string; // e.g. 'Masale'
  name: string;
  description: string;
  image: string;
  count: number;
  hidden: boolean;
}

export interface Product {
  id: string;
  category: string;
  name: string;
  weight: string;
  mrp: number;
  ratePerKg: number;
  description: string;
  ingredients: string;
  usage: string;
  shelfLife: string;
  notes: string;
  image: string;
  stock?: number;
  isBestseller?: boolean;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  weight: string;
}

export interface Order {
  id: string; // Order ID
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerEmail: string;
  items: OrderItem[];
  paymentType: 'UPI' | 'COD';
  amount: number;
  paidAmount: number;
  pendingAmount: number;
  status: 'Inquiry' | 'Pending' | 'Confirmed' | 'Processing' | 'Dispatched' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  paymentStatus?: 'Pending' | 'Paid' | 'Failed';
  trackingNumber?: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  method: string;
  transactionReference: string;
  status: 'Success' | 'Pending' | 'Failed';
  createdAt: string;
}

export interface Review {
  id: number;
  name: string;
  ratingValue: number; // 1-5
  comment: string;
  date: string;
  verified: boolean;
  approved: boolean;
}


export interface Recipe {
  id: string;
  title: string;
  prepTime: string;
  cookTime: string;
  difficulty: 'Easy' | 'Medium' | 'Expert';
  servings: number;
  ingredients: string[];
  steps: string[];
  description: string;
  image: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'New' | 'In Progress' | 'Resolved';
  createdAt: string;
}

export interface WebsiteSettings {
  logo: string;
  upiId: string;
  contactNumber: string;
  email: string;
  address: string;
  socialLinks: {
    instagram: string;
    facebook: string;
    whatsapp: string;
  };
  footer: string;
  storeStatus: 'Open' | 'Closed' | 'Maintenance';
}

export interface Banner {
  id: number;
  title: string;
  image: string;
  active: boolean;
}

export interface Coupon {
  id: number;
  code: string;
  discountType: 'Percentage' | 'Fixed';
  value: number;
  minOrderAmount: number;
  active: boolean;
}

// Dynamic seeds directly in-file to make Express completely standalone
const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'Masale',
    name: 'Malvani Masalas & Chutneys',
    description: 'Generations of expertise in roasting and blending coastal spices, red chillies, and garlic.',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&auto=format&fit=crop&q=80',
    count: 11,
    hidden: false
  },
  {
    id: 'Pith',
    name: 'Traditional Flours (Pith)',
    description: 'Freshly milled rice, pulse, and grain flours prepared for authentic Bhakri, Vade, and Modak.',
    image: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=600&auto=format&fit=crop&q=80',
    count: 7,
    hidden: false
  },
  {
    id: 'Malvani products',
    name: 'Konkan Specialties & Meva',
    description: 'Sun-dried Kokum, parboiled rice, fruit leathers (Poli), and authentic farm-fresh items.',
    image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=600&auto=format&fit=crop&q=80',
    count: 11,
    hidden: false
  },
  {
    id: 'Laddoos',
    name: 'Handmade Laddoos',
    description: 'Sweet, nutritious daily delicacies rolled with pure ghee, organic jaggery, peanuts, and dry fruits.',
    image: 'https://images.unsplash.com/photo-1581781868311-6415779c13dd?w=600&auto=format&fit=crop&q=80',
    count: 4,
    hidden: false
  },
  {
    id: 'Kaju',
    name: 'Premium Malvan Cashews (Kaju)',
    description: 'Export-grade whole cashews, salted variants, masala-flavored crunch, and healthy split kernels.',
    image: '/src/assets/images/cashew_premium_1780594672474.png',
    count: 7,
    hidden: false
  }
];

const DEFAULT_PRODUCTS: Product[] = [
  // Masale Category
  {
    id: 'm1',
    category: 'Masale',
    name: 'Malvani Special Sunday Masala',
    weight: '250gm',
    mrp: 275,
    ratePerKg: 1100,
    description: 'Our crown jewel. A secret multi-generational blend of heavy-roast spices and rich Ghati chillies designed for your slow-cooked Sunday feasts.',
    ingredients: 'Coriander, Red Chilli, Cumin, Turmeric, Black Pepper, Dagad Phool, Star Anise, Jaiphal, Aromatic Konkan Spices',
    usage: 'Add 2-3 tablespoons during the gravy tempering phase. Cook on low heat to release slow-roasted essential oils.',
    shelfLife: '12 Months',
    notes: 'No artificial colors, preservatives, or added MSG. Strictly vegetarian.',
    image: '/src/assets/images/Masale/malvani-spl-sunday-masala.webp'  
  },
  {
    id: 'm2',
    category: 'Masale',
    name: 'Malvani Fish Fry Masala',
    weight: '300gm',
    mrp: 240,
    ratePerKg: 800,
    description: 'High-acid, fiery spice blend optimized to grip fish skin and create an elite, gold-paneled outer crunch during pan frying.',
    ingredients: 'Red Chilli, Roasted Coriander, Pure Turmeric, Dried Garlic, Iodized Salt, Coastal Heritage Spices',
    usage: 'Mix with lime juice or kokum water to make a paste. Generously coat fish slices, dust with semolina, and shallow fry.',
    shelfLife: '12 Months',
    notes: 'Specially crafted for Pomfret, Surmai, Bangda, and prawns.',
    image: '/src/assets/images/Masale/Malvani fish fry masala.webP'     
  },
  {
    id: 'm3',
    category: 'Masale',
    name: 'Biryani Masala',
    weight: '250gm',
    mrp: 300,
    ratePerKg: 1320,
    description: 'A sovereign blend of fragrant whole spices, ground precisely to deliver that trademark royal aromatic cloud when you crack open the handi dum.',
    ingredients: 'Green Cardamom, Cloves, Cinnamon Bark, Bay Leaf, Nutmeg, Mace, Black Cumin, Rose Petals',
    usage: 'Add during rice boiling and sprinkle between layers of rice and meat/vegetables before dum sealing.',
    shelfLife: '12 Months',
    notes: 'Magnificently suited for both authentic vegetable and slow-cooked meat biryanis.',
    image: '/src/assets/images/Masale/Biryani masala.webP'
  },
  {
    id: 'm4',
    category: 'Masale',
    name: 'Kashmiri Mirchi Powder',
    weight: '250gm',
    mrp: 220,
    ratePerKg: 880,
    description: 'Expertly selected mild-heat Kashmiri chillies ground at low temperature to preserve the shiny carotenoidal red oils and sweet natural glaze.',
    ingredients: 'Premium, hand-picked deseeded Kashmiri Red Chillies',
    usage: 'Incorporate in slow curries, subzis, and marinades for a brilliant, photogenic crimson hue without burning heat.',
    shelfLife: '12 Months',
    notes: 'Dual action: works as an organic visual glaze and a mild warm aroma enhancer.',
    image: '/src/assets/images/Masale/Kashmiri mirchi powder copy.webP'
  },
  {
    id: 'm5',
    category: 'Masale',
    name: 'Malvani Special Bhajka Masala',
    weight: '250gm',
    mrp: 225,
    ratePerKg: 900,
    description: 'Slow-roasted to charcoal edges, this bhaji/gravy base blend delivers an irreplaceable smoky, complex undertone unique to traditional Konkan hearths.',
    ingredients: 'Roasted Coriander, Roasted Cumin, Dry Grated Coconut, Roasted Kashmiri & Sankeshwari Chillies, Bay Leaves',
    usage: 'Use as a thickening and flavoring agent directly in veg sprouts, local shev bhaji, or dry mutton thick gravies.',
    shelfLife: '12 Months',
    notes: 'Extremely authentic. Delivers the classic dark brown coastal gravy look.',
    image: '/src/assets/images/Masale/Malvani special bhajka masala.webP'
  },
  {
    id: 'm6',
    category: 'Masale',
    name: 'Malvani Special Mutton Masala',
    weight: '250gm',
    mrp: 325,
    ratePerKg: 1300,
    description: 'Fierce, full-blooded signature masala engineered to penetrate tough red meat fibers and marry cleanly with rich caramelized onions.',
    ingredients: 'Coriander, Red Sankeshwari Chilli, Black Pepper, Strong Garam Masala formulation, Cloves, Ginger, Garlic',
    usage: 'Whisk with yogurt/oil and marinate raw mutton for 2 hours, then saute on high heat before adding water to cook.',
    shelfLife: '12 Months',
    notes: 'Produces a thin, fiery oil layer (tarri) on top of curries.',
    image: '/src/assets/images/Masale/malvani special mutton masala.webP'
  },
  {
    id: 'm7',
    category: 'Masale',
    name: 'Malvani Fish Curry Masala',
    weight: '250gm',
    mrp: 250,
    ratePerKg: 1000,
    description: 'Light, tangy-spice blend created to fuse perfectly with freshly grated coconut milk or raw fresh grated coconut paste for a velvety gravy.',
    ingredients: 'Dehydrated White Coconut, Coriander, Lavangi Chilli, Turmeric, Dried Garlic Pearls, Star Anise, Black Pepper',
    usage: 'Grind this masala with fresh wet coconut and water, boil with Kokum/Tamarind juice, and add raw fish at the very end.',
    shelfLife: '12 Months',
    notes: 'Replicates the taste of Malvani beach-side shacks.',
    image: '/src/assets/images/Masale/malvani fish curry masala.webP'
  },
  {
    id: 'm8',
    category: 'Masale',
    name: 'Khobra Lasun Chutney',
    weight: '200gm',
    mrp: 120,
    ratePerKg: 600,
    description: 'A coarse, dry, punchy side-dish chutney made from premium dried coconut flakes and spicy raw garlic cloves.',
    ingredients: 'Graded Dry Coconut, Peeled Malvan Garlic, Red Chilli Flakes, Sea Salt',
    usage: 'Ready to consume. Best enjoyed alongside freshly made hot Bajra/Jowar Bhakris, Vada Pav, or simply mixed with oil over warm rice.',
    shelfLife: '6 Months',
    notes: 'No preservatives, very low moisture content for enduring crunch.',
    image: '/src/assets/images/Masale/Kanda lasun masala.webP'
  },
  {
    id: 'm9',
    category: 'Masale',
    name: 'Kanda Lasun Masala',
    weight: '250gm',
    mrp: 140,
    ratePerKg: 560,
    description: 'The staple onion-garlic masala that defines Western Maharashtra household cooking. Dark red, spicy, and extremely aromatic.',
    ingredients: 'Dehydrated Onions, Premium Garlic cloves, Sankeshwari red chillies, Salt, Special spice mix',
    usage: 'Add to everyday dry stir-fries, egg curries, potato rassa, and spicy street-style gravies.',
    shelfLife: '12 Months',
    notes: 'Saves preparation time; provides instant garlicky depth to any everyday dish.',
    image: '/src/assets/images/Masale/Kanda lasun masala.webP'
  },
  {
    id: 'm10',
    category: 'Masale',
    name: 'Special Misal Masala',
    weight: '250gm',
    mrp: 220,
    ratePerKg: 880,
    description: 'A fiery, high-color, hot-spice blend that produces the iconic spicy rassa/kat that makes Misal Pav unforgettable.',
    ingredients: 'Red Sankeshwari Chilli, Coriander, Black Cardamom, Dry Cumin, Fresh Garlic oil, Cloves, Spices',
    usage: 'Add during the bean sprout boiling and oil-separation phase. Serves with farsan, dry potatoes, and soft pav.',
    shelfLife: '12 Months',
    notes: 'Specially engineered for high heat tolerance without turning bitter.',
    image: '/src/assets/images/Masale/special misal masala.webP'
  },
  {
    id: 'm11',
    category: 'Masale',
    name: 'Shengdana Chutney',
    weight: '200gm',
    mrp: 120,
    ratePerKg: 480,
    description: 'Rich, dry peanut chutney ground to a clipboard state, discharging a delightful nutty oiliness paired with fiery red chilli.',
    ingredients: 'Carefully Roasted Deseeded Peanuts, Red Chilli Powder, Raw Garlic Pearls, Salt',
    usage: 'Pair with flatbreads, curd-rice, idlis, parathas or use in morning sandwich rolls for instant zinc and protein boosts.',
    shelfLife: '6 Months',
    notes: 'Dry, granular texture. Made of export-quality, sweet-kernel peanuts.',
    image: '/src/assets/images/Masale/shengdana chutney.webP'
  },

  // Pith Category
  {
    id: 'p1',
    category: 'Pith',
    name: 'Gavthi Kulith Pithi',
    weight: '250gm',
    mrp: 85,
    ratePerKg: 340,
    description: 'Super-finely ground indigenous horse gram. Highly valued for its warmth-producing and high-protein therapeutic properties.',
    ingredients: 'Selected Native Horse Gram (Kulith)',
    usage: 'Boil with water, garlic, green chillies, and kokum water to create the thick, comforting traditional Malvani "pithi" soup.',
    shelfLife: '6 Months',
    notes: 'Extremely rich in dietary fiber, iron, and proteins. Great for winter wellness.',
    image: '/src/assets/images/Pith/Gavthi kulith pithi.webP'
  },
  {
    id: 'p2',
    category: 'Pith',
    name: 'Thalipith Bhajni',
    weight: '500gm',
    mrp: 90,
    ratePerKg: 180,
    description: 'Multigrain roasted flour mixed with aromatic spices. Perfectly roasted grains milled slowly to maintain gut-friendly properties.',
    ingredients: 'Roasted Jowar, Bajra, Wheat, Bengal Gram, Split Black Gram, Coriander Seeds, Cumin Seeds',
    usage: 'Knead with grated onions, coriander, green chillies, and hot water. Press directly onto a wet tawa with damp fingers and cook with ghee.',
    shelfLife: '6 Months',
    notes: 'Highly nutritious, ready-made breakfast mix.',
    image: '/src/assets/images/Pith/Thalipith bhajni.webP'
  },
  {
    id: 'p3',
    category: 'Pith',
    name: 'Basmati Modak Pith',
    weight: '500gm',
    mrp: 80,
    ratePerKg: 160,
    description: 'Pure, ultra-refined fragrant Basmati rice flour milled specifically to yield extremely soft, tear-resistant outer shells for sweet Modaks.',
    ingredients: 'Fragrant Premium Basmati Rice kernels',
    usage: 'Prepare Ukad (steamed dough) by boiling flour with water/milk and some ghee, knead thoroughly, stuff with coconut-jaggery, and steam.',
    shelfLife: '6 Months',
    notes: 'Superior aroma and white satin finish. Perfect for Ukdiche Modak during Ganeshotsav.',
    image: '/src/assets/images/Pith/Basmati modak pith.webP'
  },
  {
    id: 'p4',
    category: 'Pith',
    name: 'Ghavne Pith',
    weight: '500gm',
    mrp: 80,
    ratePerKg: 160,
    description: 'Ready-mix rice flour blended with precise mineral salts to yield paper-thin, lace-like coastal crêpes without stickiness.',
    ingredients: 'Finely polished coastal rice grains, Sea Salt, baking aids',
    usage: 'Mix with water to achieve a very watery, buttermilk-like consistency. Pour from height onto a blazing hot, oiled cast-iron grid tawa.',
    shelfLife: '6 Months',
    notes: 'Pre-treated to ensure the crêpes can be peeled off easily without tearing.',
    image: '/src/assets/images/Pith/Ghavane pith.webP'
  },
  {
    id: 'p5',
    category: 'Pith',
    name: 'Malvani Vade Pith',
    weight: '500gm',
    mrp: 80,
    ratePerKg: 160,
    description: 'Pre-roasted and seasoned blend of grains and lentils designed to rise and form fluffy, crispy Malvani Kombdi Vade.',
    ingredients: 'Parboiled Rice, Wheat, Bengal Gram, Black Gram, Fenugreek Seeds, Fennel Seeds, Coriander Seeds',
    usage: 'Knead with warm water, let sit for 30 minutes, pat small rounds on a damp plastic wrap, and deep fry in piping hot oil.',
    shelfLife: '6 Months',
    notes: 'The classic accomplice to Malvani Chicken/Mutton Rassa.',
    image: '/src/assets/images/Pith/Malvani vade pith.webP'
  },
  {
    id: 'p6',
    category: 'Pith',
    name: 'Aamboli Pith',
    weight: '500gm',
    mrp: 90,
    ratePerKg: 180,
    description: 'A fermented-grade rice and split black lentil flour formulation that yields sponge-like, fluffy breakfast pancakes (Amboli).',
    ingredients: 'Polished Rice, Graded Urad Dal, Fenugreek Seeds',
    usage: 'Soak with warm water to a smooth thick batter, let sit overnight for natural fermentation, pour thick on tawa, cover and cook.',
    shelfLife: '6 Months',
    notes: 'Produces highly nutritious, naturally aerated and soft breakfast pancakes.',
    image: '/src/assets/images/Pith/Aamboli pith.webP'
  },
  {
    id: 'p7',
    category: 'Pith',
    name: 'Shirwale Pith',
    weight: '500gm',
    mrp: 80,
    ratePerKg: 160,
    description: 'Special formulation rice flour prepared with optimal starch gelatinization temperature to seamlessly press into local steamed noodles.',
    ingredients: 'Premium high-starch rice grains',
    usage: 'Boil into dry dough, press through a heavy brass Shirvale/Shevya squeezer, steam noodles, and serve with sweet cardamom coconut milk.',
    shelfLife: '6 Months',
    notes: 'Authentic Konkani sweet dish helper ingredient.',
    image: '/src/assets/images/Pith/Shirwale pith.webP'
  },

  // Malvani Products Category
  {
    id: 'mp1',
    category: 'Malvani products',
    name: 'Malvani Sola (Aamsul)',
    weight: '250gm',
    mrp: 150,
    ratePerKg: 600,
    description: 'Deep purple, thick black-kokum rinds wet-salted and sun-dried to lock in maximum hydroxycitric acid for souring curries.',
    ingredients: 'Freshly harvested Red Kokum fruit rinds, Pure Sea Salt',
    usage: 'Drop 3-4 solos directly into fish curries or soak in warm water to extract beautiful crimson juice for Solkadhi cream.',
    shelfLife: '12 Months',
    notes: 'Pure organic souring agent; rich in natural antioxidants.',
    image: '/src/assets/images/Malvani product/Malvani Sola ( Aamsul ).webP'
  },
  {
    id: 'mp2',
    category: 'Malvani products',
    name: 'Gavthi Ukde Tandul',
    weight: '500gm',
    mrp: 80,
    ratePerKg: 160,
    description: 'Coarse, parboiled local brown rice harvested by small-scale Konkan farmers. Retains the highly nutritious outer bran layer.',
    ingredients: 'Authentic parboiled red rice hulls',
    usage: 'Wash thrice, cook in plenty of water (takes longer than white rice), drain excess water. Best served piping hot with fish rassa.',
    shelfLife: '12 Months',
    notes: 'Has a highly distinct earthy aroma and rich fiber profile.',
    image: '/src/assets/images/Malvani product/Gavathi ukde tandul.webP'
  },
  {
    id: 'mp3',
    category: 'Malvani products',
    name: 'Homemade Gul Khobravadi',
    weight: '1 unit (Approx 300g)',
    mrp: 90,
    ratePerKg: 300,
    description: 'Traditional sweets crafted with absolute purity, mixing fresh wet-grated coconut milk, rich dark organic jaggery, and cardamom.',
    ingredients: 'Wet-grated Coconut, Organic Sugarcane Jaggery, Pure Cow Ghee, Green Cardamom seeds',
    usage: 'Ready to eat sweet treat post meals or as healthy dessert snacks during the day.',
    shelfLife: '3 Months',
    notes: 'Handmade by local women artisans, entirely chemical-free.',
    image: '/src/assets/images/Malvani product/Homemade gul khobra vadi.webP'
  },
  {
    id: 'mp4',
    category: 'Malvani products',
    name: 'Taak Mirchi',
    weight: '1 packet',
    mrp: 70,
    ratePerKg: 70,
    description: 'Mild green hot pepper lines soaked in sour salted buttermilk, cured under heavy sun till they shrink to white-golden crisp crusts.',
    ingredients: 'Punctured Green Chillies, Fermented Cow Buttermilk, Graded Rock Salt',
    usage: 'Deep fry in hot oil for 5-10 seconds until they turn dark brown. Serve instantly alongside dal-rice or khichdi.',
    shelfLife: '12 Months',
    notes: 'Irreplaceable salty, sour, and mildly hot side-dish accompaniment.',
    image: '/src/assets/images/Malvani product/Taak mirchi.webP'
  },
  {
    id: 'mp5',
    category: 'Malvani products',
    name: 'Sandgi Mirchi',
    weight: '1 packet',
    mrp: 70,
    ratePerKg: 70,
    description: 'Hand-split chillies stuffed with toasted Fenugreek, Cumin, Mustard, and Turmeric, soaked in salted buttermilk and thoroughly sun-dried.',
    ingredients: 'Thick local Green Peppers, Fenugreek seeds, Cumin seeds, Turmeric, Buttermilk, Salt',
    usage: 'Fry in hot oil until charcoal brown and crunchy. Crush over flatbreads or plain curd rice.',
    shelfLife: '12 Months',
    notes: 'Spicier, more fragrant spice-stuffed alternative to Taak Mirchi.',
    image: '/src/assets/images/Malvani product/Sandgi mirchi.webP'
  },
  {
    id: 'mp6',
    category: 'Malvani products',
    name: 'Awala Candy 100 gm',
    weight: '100gm',
    mrp: 40,
    ratePerKg: 400,
    description: 'Delectable sweet and tangy segments of fleshy gooseberries saturated with sugar juice and sun-dehydrated. Juicy and chewy.',
    ingredients: 'Fresh Indian Gooseberry (Amla) pulp, Granulated Sugar, Citric acid',
    usage: 'Ready to eat digestive aid. Chew a couple of candies post meal for cooling and fresh digestion.',
    shelfLife: '6 Months',
    notes: 'Rich source of natural Vitamin C and mineral nutrients.',
    image: '/src/assets/images/Malvani product/Awala Candy.webP'
  },
  {
    id: 'mp7',
    category: 'Malvani products',
    name: 'Fanas Wafers',
    weight: '1 packet (Approx 150gm)',
    mrp: 90,
    ratePerKg: 600,
    description: 'Extravagantly crunchy, bright-yellow salty snacks made by slicing raw, firm flesh of Konkan jackfruits.',
    ingredients: 'Raw Jackfruit slices, Double-refined Edible Vegetable Oil, Graded Sea Salt',
    usage: 'Ready to consume crispy tea-time savory snack.',
    shelfLife: '4 Months',
    notes: 'Unique woody flavor and highly distinct high-density crunch. Highly addictive!',
    image: '/src/assets/images/Malvani product/Fanas wafers.webP'
  },
  {
    id: 'mp8',
    category: 'Malvani products',
    name: 'Gavthi Poha',
    weight: '1 packet (Approx 250gm)',
    mrp: 70,
    ratePerKg: 280,
    description: 'Thick, rustically flattened brown rice flakes, retaining wholesome fiber. Offers deep mineral goodness.',
    ingredients: 'Earthy local paddy parboiled rice grains',
    usage: 'Wash, drain (let water soak in for 10 mins), and prepare standard traditional Kanda Poha with mustard, chillies, and yellow turmeric.',
    shelfLife: '6 Months',
    notes: 'Keeps you full for longer compared to thin industrial white rice flakes.',
    image: '/src/assets/images/Malvani product/Gavathi pohe.webP'
  },
  {
    id: 'mp9',
    category: 'Malvani products',
    name: 'Amba Poli',
    weight: '1 packet (Approx 200gm)',
    mrp: 90,
    ratePerKg: 450,
    description: 'True Alphonso Mango fruit leather. Fresh sweet mango pulp concentrated layer by layer on bamboo mats under pure coastal sun beams.',
    ingredients: 'Authentic Devgad Alphonso Mango Pulp, Granulated Sugar',
    usage: 'Ready to consume. Cut into square sheets and enjoy as clean natural mango candy slices.',
    shelfLife: '6 Months',
    notes: 'Exquisite, bright gold color. Pure fruit essence without artificial colors.',
    image: '/src/assets/images/Malvani product/Aamba poli.webP'
  },
  {
    id: 'mp10',
    category: 'Malvani products',
    name: 'Fanas Poli',
    weight: '1 packet (Approx 200gm)',
    mrp: 90,
    ratePerKg: 450,
    description: 'Dark brown, sticky, highly distinct sweet jackfruit leather cooked intensely and thin-spread over traditional straw frames.',
    ingredients: 'Golden Ripe Jackfruit pulp, Pure Jaggery traces',
    usage: 'Ready to devour. Features an exotic warm aroma and delightful deep organic chewiness.',
    shelfLife: '6 Months',
    notes: 'Very famous regional specialty of traditional Konkani homes.',
    image: '/src/assets/images/Malvani product/Fanas poli.webP'
  },
  {
    id: 'mp11',
    category: 'Malvani products',
    name: 'Malvani Khaja',
    weight: '1 packet (Approx 200gm)',
    mrp: 40,
    ratePerKg: 200,
    description: 'Crispy, ribbon-like finger-length sweet flour crisps fried till light and coated with warm dissolved ginger-jaggery syrup.',
    ingredients: 'Refined Wheat Flour, Ghee, Jaggery, Fresh Ginger extract, Sesame seeds',
    usage: 'Eat straight out of the box. Traditional local fair (Jatra) sweet of Malvan.',
    shelfLife: '2 Months',
    notes: 'Features a sweet, warm ginger-jaggery spice glaze.',
    image: '/src/assets/images/Malvani product/Malvani Khaja.webP'
  },

  // Laddoos Category
  {
    id: 'l1',
    category: 'Laddoos',
    name: 'Khadkhade Laddoos',
    weight: '25 unit box',
    mrp: 80,
    ratePerKg: 80,
    description: 'Unique, hollow and incredibly crispy sweet balls rolled traditionally using dried rice flour flakes and molten hot jaggery.',
    ingredients: 'Fine Rice flakes, Molten Jaggery, Cow Ghee, Cardamom seeds',
    usage: 'Ready to enjoy. Features a highly unique hollow crisp snap when bitten!',
    shelfLife: '2 Months',
    notes: 'Our absolute specialty. Handmade using complex antique folding ratios.',
    image: '/src/assets/images/Laddoos/Khadkhade laddoo.webP'
  },
  {
    id: 'l2',
    category: 'Laddoos',
    name: 'Kadak Bundi Laddoo',
    weight: '25 unit box',
    mrp: 80,
    ratePerKg: 80,
    description: 'Crunchy, dense sugar-glazed golden chickpea flour drops mixed with warm cardamom and pressed tightly into classic sphere formats.',
    ingredients: 'Bengal Gram flour (Besan), Sugar crystals, Pure Cow Ghee, Nutmeg, Cardamom',
    usage: 'Ready to eat festive sweet treats.',
    shelfLife: '2 Months',
    notes: 'Beloved child-hood treat; retains crunchy bead textures throughout.',
    image: '/src/assets/images/Laddoos/Kadak bundi laddoo.webP'
  },
  {
    id: 'l3',
    category: 'Laddoos',
    name: 'Shev Laddoo',
    weight: '25 unit box',
    mrp: 80,
    ratePerKg: 80,
    description: 'Inimitable local salty-sweet combination laddoos made with fine chickpea flour noodles glazed in thick cardamom-infused jaggery syrup.',
    ingredients: 'Bengal Gram flour noodles, Sugarcane Jaggery, Ghee, Sesame seeds',
    usage: 'Ready to eat. Melts easily with a satisfying moist crumbly texture.',
    shelfLife: '2 Months',
    notes: 'Perfect pairing with savory snack menus.',
    image: '/src/assets/images/Laddoos/Shev laddoo.webP'
  },
  {
    id: 'l4',
    category: 'Laddoos',
    name: 'Shengdana Laddoo',
    weight: '20 unit box',
    mrp: 90,
    ratePerKg: 90,
    description: 'Extremely nutritious, protein-concentrated balls of coarse crushed sweet peanuts bound with pure melted organic jaggery.',
    ingredients: 'Selected Roasted Peanuts, Molten sugarcane Jaggery, Ghee highlights',
    usage: 'Perfect healthy breakfast bite or immediate non-chemical energy boost post gym/school.',
    shelfLife: '3 Months',
    notes: 'Preservative-free energy food, rich in plant-based proteins.',
    image: '/src/assets/images/Laddoos/Shengdana laddoo.webP'
  },

  // Kaju Category
  {
    id: 'k1',
    category: 'Kaju',
    name: 'Polish Kaju (Big Size)',
    weight: '250gm',
    mrp: 380,
    ratePerKg: 1520,
    description: 'Sovereign white premium jumbo cashews carefully hand-sorted to exclude any blemishes. Pristine ivory shine.',
    ingredients: 'Export-grade whole Raw Cashew Nuts (Kaju)',
    usage: 'Consume raw as premium snacks, gift in dynamic occasions, or chop into luxury desserts and rich royal gravies.',
    shelfLife: '9 Months',
    notes: 'Grown on Malvan family plantations, carefully polished without heat.',
    image: '/src/assets/images/Kaju/polish kaju (big size).webP',
    stock: 0,
    isBestseller: false
  },
  {
    id: 'k2',
    category: 'Kaju',
    name: 'Salwale Kaju (Big Size)',
    weight: '250gm',
    mrp: 250,
    ratePerKg: 950,
    description: 'Salted, premium jumbo roasted cashews. Lightly pan-toasted to unlock full creamy richness with high-grade hand-sprinkled sea salt.',
    ingredients: 'Premium Jumbo Cashew Kernels, Organic Sea Salt, trace refined oils',
    usage: 'Ready-to-eat gourmet snack. Incredible tea-time luxury.',
    shelfLife: '9 Months',
    notes: 'Roasted at low temperature to protect healthy fats.',
    image: '/src/assets/images/Kaju/Salwale kaju (big size).webP',
    stock: 0,
    isBestseller: false
  },
  {
    id: 'k3',
    category: 'Kaju',
    name: 'Salwale Kaju (Medium)',
    weight: '250gm',
    mrp: 250,
    ratePerKg: 880,
    description: 'Perfect daily-snack salted cashews of medium sizing, exhibiting sweet butteriness balanced by crisp sea salt dust.',
    ingredients: 'Medium Cashew Kernels, Sea Salt, trace oil',
    usage: 'Ready-to-eat luxury snacks for hosting guests or office munching.',
    shelfLife: '9 Months',
    notes: 'Highly cost-effective family snack pack size.',
    image: '/src/assets/images/Kaju/Salwale kaju (medium size).webP',
    stock: 0,
    isBestseller: false
  },
  {
    id: 'k4',
    category: 'Kaju',
    name: 'Salted Kaju',
    weight: '200gm',
    mrp: 230,
    ratePerKg: 1150,
    description: 'Intensely crispy salted whole cashew nut snacks, vacuum packed to sustain absolute freshness and oil balance.',
    ingredients: 'Premium Cashews, Salt',
    usage: 'Eat straight out of the jar. Pairs well with juices, snacks, and sweet platters.',
    shelfLife: '9 Months',
    notes: 'Protected with gas-flush packaging to avoid oxygen-staling.',
    image: '/src/assets/images/Kaju/Salted kaju.webP',
    stock: 0,
    isBestseller: false
  },
  {
    id: 'k5',
    category: 'Kaju',
    name: 'Masala Kaju',
    weight: '200gm',
    mrp: 230,
    ratePerKg: 1150,
    description: 'Fiery, highly appetizing roasted whole cashews dressed with our secret Malvani seasoning blend. Creamy, spicy, and tangy.',
    ingredients: 'Premium whole cashews, Malvani ground red pepper, garlic oil, amchur dry mango, sea salt',
    usage: 'Stellar premium savory snack for high-end hospitality.',
    shelfLife: '9 Months',
    notes: 'A perfect explosion of Konkan flavors in every single kernel.',
    image: '/src/assets/images/Kaju/Masala kaju.webP',
    stock: 0,
    isBestseller: false
  },
  {
    id: 'k6',
    category: 'Kaju',
    name: 'Tukda Kaju',
    weight: '200gm',
    mrp: 175,
    ratePerKg: 875,
    description: 'Premium raw split cashew pieces. Retains identical sweet fatty flavor of whole nuts but in split forms for cooking convenience.',
    ingredients: 'Raw Cashew pieces and halves',
    usage: 'Incorporate in rice puddings (kheer), cake batters, festive sweets, or blend for rich Mughlai cashew paste bases.',
    shelfLife: '9 Months',
    notes: 'Highly economical kitchen utility ingredient.',
    image: '/src/assets/images/Kaju/Tukda kaju.webP',
    stock: 0,
    isBestseller: false
  },
  {
    id: 'k7',
    category: 'Kaju',
    name: 'Polish Kaju (Medium Size)',
    weight: '250gm',
    mrp: 260,
    ratePerKg: 1040,
    description: 'Pristine raw ivory cashews of medium caliber, hand-shelled and polished cleanly. Yields delightful natural creaminess.',
    ingredients: 'Raw medium Cashew Kernels',
    usage: 'Excellent dry snack, useful for school-going kids, or as dry fruit decor plates.',
    shelfLife: '9 Months',
    notes: 'Pure raw cashews, entirely unroasted.',
    image: '/src/assets/images/Kaju/polish kaju (medium size).webP',
    stock: 0,
    isBestseller: false
  }
];

const DEFAULT_REVIEWS: Review[] = [
  {
    id: 1,
    name: "Prasad Gawde",
    ratingValue: 5,
    comment: "Pure organic Sankeshwari and Ghati chilli mix. True taste of Malvan kitchen. The Sunday masala is out of this world!",
    date: "2026-06-15",
    verified: true,
    approved: true
  },
  {
    id: 2,
    name: "Aparna Parab",
    ratingValue: 5,
    comment: "The Peanuts Chutney and Khobra Lasun Chutney are delicious with bhakri. Strongly suggest this to everyone who loves home-style Konkan cooking.",
    date: "2026-06-14",
    verified: true,
    approved: true
  }
];

const DEFAULT_SETTINGS: WebsiteSettings = {
  logo: "https://ik.imagekit.io/9f6w6a0wf/logo.png.png",
  upiId: "bhaveshkoyande62@okaxis",
  contactNumber: "+91 91762 04289",
  email: "geetasmasale@gmail.com",
  address: "Near Dewoolwada along Kasal-Malvan Highway, Malvan, Maharashtra, India",
  socialLinks: {
    instagram: "https://instagram.com/geetasmasale",
    facebook: "https://facebook.com/geetasmasale",
    whatsapp: "https://wa.me/917620428920"
  },
  footer: "© 2026 Sri Geeta's Spices. Handcrafted along the beautiful shores of Malvan. Built with absolute love.",
  storeStatus: "Open"
};

const DEFAULT_COUPONS: Coupon[] = [
  { id: 1, code: "GEETA50", discountType: "Fixed", value: 50, minOrderAmount: 399, active: true },
  { id: 2, code: "KONKAN10", discountType: "Percentage", value: 10, minOrderAmount: 500, active: true }
];

const DEFAULT_BANNERS: Banner[] = [
  { id: 1, title: "Pure Sunday Griddle Roast", image: "/src/assets/images/masala_hero_1780594616996.png", active: true }
];

// Initialize database storage collections
export const getAdmins = () => {
  const admins = readDataFile<Admin[]>('admins.json', []);
  if (admins.length === 0) {
    const salt = bcrypt.genSaltSync(10);
    // Secure default password geeta2004
    const passwordHash = bcrypt.hashSync('geeta2004', salt);
    const superAdmin: Admin = {
      id: 1,
      username: 'admin',
      passwordHash,
      role: 'Super Admin',
      name: 'Bhavesh Admin'
    };
    admins.push(superAdmin);
    writeDataFile('admins.json', admins);
  }
  return admins;
};

export const getCategories = () => readDataFile<Category[]>('categories.json', DEFAULT_CATEGORIES);
export const saveCategories = (categories: Category[]) => writeDataFile('categories.json', categories);

export const getProducts = () => readDataFile<Product[]>('products.json', DEFAULT_PRODUCTS);
export const saveProducts = (products: Product[]) => writeDataFile('products.json', products);

export const getOrders = () => readDataFile<Order[]>('orders.json', []);
export const saveOrders = (orders: Order[]) => writeDataFile('orders.json', orders);

export const getPayments = () => readDataFile<Payment[]>('payments.json', []);
export const savePayments = (payments: Payment[]) => writeDataFile('payments.json', payments);

export const getReviews = () => readDataFile<Review[]>('reviews.json', DEFAULT_REVIEWS);
export const saveReviews = (reviews: Review[]) => writeDataFile('reviews.json', reviews);

export const getContactMessages = () => readDataFile<ContactMessage[]>('contact_messages.json', []);
export const saveContactMessages = (messages: ContactMessage[]) => writeDataFile('contact_messages.json', messages);

export const getWebsiteSettings = () => readDataFile<WebsiteSettings>('website_settings.json', DEFAULT_SETTINGS);
export const saveWebsiteSettings = (settings: WebsiteSettings) => writeDataFile('website_settings.json', settings);

export const getBanners = () => readDataFile<Banner[]>('banners.json', DEFAULT_BANNERS);
export const saveBanners = (banners: Banner[]) => writeDataFile('banners.json', banners);

export const getCoupons = () => readDataFile<Coupon[]>('coupons.json', DEFAULT_COUPONS);
export const saveCoupons = (coupons: Coupon[]) => writeDataFile('coupons.json', coupons);

export const getRecipes = (): Recipe[] => readDataFile<Recipe[]>('recipes.json', []);
export const saveRecipes = (data: Recipe[]): void => writeDataFile('recipes.json', data);
