/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, Recipe, Testimonial, GalleryItem } from '../types';

// Static assets for categories, gallery, and recipes to ensure Vite bundles them successfully in production
import cookingImage from '../assets/images/categories/Traditional Flours.webP';
import storefrontImage from '../assets/images/categories/meva.png';
import interiorImage from '../assets/images/categories/Handmade Laddoos.webP';
import masalaHeroImage from '../assets/images/categories/Malvani Masalas & Chutneys.webP';
import cashewPremiumImage from '../assets/images/Kaju/Polish kaju 3 (medium size).webP';

export const STORE_CONFIG = {
  googleReviewUrl: 'https://g.page/r/CXYjMiOURBwSEAE/review'
};

export const CATEGORIES = [
  {
    id: 'Masale',
    name: 'Malvani Masalas & Chutneys',
    description: 'Generations of expertise in roasting and blending coastal spices, red chillies, and garlic.',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&auto=format&fit=crop&q=80',
    count: 11
  },
  {
    id: 'Pith',
    name: 'Traditional Flours (Pith)',
    description: 'Freshly milled rice, pulse, and grain flours prepared for authentic Bhakri, Vade, and Modak.',
    image: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=600&auto=format&fit=crop&q=80',
    count: 7
  },
  {
    id: 'Malvani products',
    name: 'Konkan Specialties & Meva',
    description: 'Sun-dried Kokum, parboiled rice, fruit leathers (Poli), and authentic farm-fresh items.',
    image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=600&auto=format&fit=crop&q=80',
    count: 11
  },
  {
    id: 'Kaju',
    name: 'Premium Malvan Cashews (Kaju)',
    description: 'Export-grade whole cashews, salted variants, masala-flavored crunch, and healthy split kernels.',
    image: cashewPremiumImage,
    count: 7
  },
  {
    id: 'Laddoos',
    name: 'Handmade Laddoos',
    description: 'Sweet, nutritious daily delicacies rolled with pure ghee, organic jaggery, peanuts, and dry fruits.',
    image: 'https://images.unsplash.com/photo-1581781868311-6415779c13dd?w=600&auto=format&fit=crop&q=80',
    count: 4
  }
];

export const PRODUCTS: Product[] = [];


export const RECIPES: Recipe[] = [
  {
    id: 'r1',
    title: 'Authentic Crispy Malvani Fish Fry',
    prepTime: '20 mins',
    cookTime: '15 mins',
    difficulty: 'Easy',
    servings: 4,
    description: 'The definitive Konkan-beach standard. Fresh surmai coated with fiery Malvani Fish Fry Masala and pan-fried crisp outside while remaining intensely juicy inside.',
    ingredients: [
      '4 slices of Surmai (King Fish) or Pomfret',
      '2.5 tbsp Geetas Malvani Fish Fry Masala',
      '2 tbsp Kokum water (Aamsul juice)',
      '1 tbsp Ginger-garlic paste',
      '3 tbsp Fine Semolina (Rava) for dusting',
      '1 tbsp Rice flour',
      'Pure coconut oil for shallow frying',
      'Fresh lemon and onion slices for garnish'
    ],
    steps: [
      'Wash fish slices thoroughly and pat dry with paper towels.',
      'In a small bowl, mix Geetas Malvani Fish Fry Masala, kokum water, ginger-garlic paste, and a dash of salt to make a thick, concentrated red paint-like paste.',
      'Generously rub this paste over all surfaces of the fish slices. Marinate for 15-20 minutes.',
      'Mix fine semolina and rice flour on a flat plate.',
      'Gently press each marinated fish slice into the semolina mix to achieve a clean, even coating on both sides.',
      'Heat coconut oil in a flat iron skillet/tawa on medium-high heat.',
      'Shallow fry the fish for 6-7 minutes on each side until the outer skin turns deep dark golden-brown and crispy.',
      'Drain on clean plates and serve screaming hot garnished with onions and lemon slices.'
    ],
    image: cookingImage
  },
  {
    id: 'r2',
    title: 'Royal Malvani Chicken Curry with Vade',
    prepTime: '30 mins',
    cookTime: '45 mins',
    difficulty: 'Medium',
    servings: 6,
    description: 'The soul of Malvani cuisine. Chicken slow-stewed in a fragrant roasted fresh coconut gravy, flavored with Special Sunday Masala, and paired with puffed Kombdi Vade.',
    ingredients: [
      '1 kg Chicken, curry-cut pieces',
      '3 tbsp Geetas Malvani Special Sunday Masala',
      '500g Geetas Kombdi Vade Pith (flour)',
      '1 cup Grated Fresh Wet Coconut',
      '2 large Onions, finely sliced',
      '1 tbsp Ginger-garlic paste',
      '4-5 Malvani Solas (Aamsul/Kokum)',
      '3 tbsp Coconut oil',
      'Fresh coriander leaves for heavy garnish'
    ],
    steps: [
      'Marinate Chicken in turmeric, ginger-garlic paste, and lime juice for 30 minutes.',
      'Dry roast grated fresh coconut and one sliced onion in a pan until chocolate brown. Grind with a little water to make a signature silky "Vatan" paste.',
      'In a deep vessel, heat coconut oil, saute the remaining onions till translucent, add Geetas Malvani Special Sunday Masala and fry for 1 minute.',
      'Add the marinated chicken and roast on high heat for 5 minutes to sear in flavors.',
      'Pour in 2 cups of boiling water, add Kokum solos, and simmer covered for 15 minutes.',
      'Stir in the coconut "Vatan" paste, adjust salt, and simmer uncovered for 10-12 minutes until the chicken is fork-tender and curry is swimming in rich red oil (tarri).',
      'Meanwhile, knead Geetas Vade Pith with warm water, shape small rounds over damp wrap, deep-fry in smoking oil until fully puffed and golden.',
      'Serve chicken rassa in deep brass bowls alongside steaming hot puffed Kombdi Vade.'
    ],
    image: cookingImage
  },
  {
    id: 'r3',
    title: 'Traditional Spicy Kat/Misal',
    prepTime: '15 mins',
    cookTime: '25 mins',
    difficulty: 'Easy',
    servings: 4,
    description: 'Create the ultimate spicy Maharashtrian breakfast at home using our custom roasted Misal Masala to produce a beautiful, red-hot fiery gravy layer.',
    ingredients: [
      '2 cups Mixed sprouts (Matki/moth beans), boiled',
      '2 tbsp Geetas Special Misal Masala',
      '2 Onions & 2 Tomatoes, finely chopped',
      '1 tbsp Ginger-garlic paste',
      '3 tbsp Refined oil (generous amount is key for Kat)',
      '1 cup Mixed Spicy Farsan (namkeen)',
      'Chopped onion, lemon, and fresh coriander',
      '4 fresh soft Pav buns'
    ],
    steps: [
      'Heat oil in a deep kadai. Saute chopped onions and ginger-garlic paste until rich brown.',
      'Add chopped tomatoes and cook until oil starts separating from the masala edges.',
      'Incorporate 2 tablespoons of Geetas Special Misal Masala and cook for 1 minute on very low heat to avoid scorching spices.',
      'Stir in boiled sprouts along with their cooking water. Add another 2 cups of hot water to make a thin, flowing rassa.',
      'Let cook on a rolling boil for 12-15 minutes until a beautiful, glistening layer of spicy red oil ("Kat") floats on top.',
      'To assemble: ladle sprouts first in a deep bowl, pour plenty of hot sizzling rassa on top, throw a heavy handful of fresh farsan, garnish with onions and coriander.',
      'Serve with soft pav and a wedge of lemon.'
    ],
    image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=600&auto=format&fit=crop&q=80'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'Suhas Parab',
    location: 'Mumbai, Maharashtra',
    rating: 5,
    review: 'I have lived in Mumbai for 20 years, but my kitchen always smells like Malvan thanks to Geeta’s Sunday Masala. The coarse roast and oil release is exactly how my grandmother used to grind spices in Kasal. Highly recommended!',
    product: 'Malvani Special Sunday Masala',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    level: 'Local Guide Level 6',
    stats: '45 reviews • 12 ratings',
    points: '1,200 / 1,500 points',
    link: 'https://share.google/pB6m8wqRKfTtjjBQG'
  },
  {
    id: 't2',
    name: 'Sneha Shirodkar',
    location: 'Pune, Maharashtra',
    rating: 5,
    review: 'Their Basmati Modak Pith was an absolute lifesaver during Ganesh Chaturthi! The modaks turned out beautiful white, extremely soft, and didn’t develop a single tear. Absolute high-quality flour.',
    product: 'Basmati Modak Pith',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    level: 'Local Guide Level 4',
    stats: '20 reviews • 5 ratings',
    points: '400 / 500 points',
    link: 'https://share.google/fpisQ5AJlVNHpgOoe'
  },
  {
    id: 't3',
    name: 'Anoushka Ghosh Das',
    location: 'Littlearth Square, Ooty',
    rating: 5,
    review: 'The food is extraordinary, one of the must visit places in Ooty. Also, special mention to Manasa, she was very sweet and kind and made our experience extra special.',
    product: 'Store Visit',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    level: 'Local Guide Level 5',
    stats: '13 reviews • 3 ratings',
    points: '528 / 1,500 points',
    link: 'https://share.google/NcpY1oAMFBXnyuQDA'
  },
  {
    id: 't4',
    name: 'Rohit Kadam',
    location: 'Thane, Maharashtra',
    rating: 5,
    review: 'Authentic taste! The Malvani Fish Fry Masala gives the exact crispy texture and spicy kick you expect from a proper coastal meal. Best I have found outside of Konkan.',
    product: 'Malvani Fish Fry Masala',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    level: 'Local Guide Level 3',
    stats: '10 reviews • 2 ratings',
    points: '150 / 300 points',
    link: 'https://share.google/tnlrmunaFTNblcSZy'
  },
  {
    id: 't5',
    name: 'Priyanka Desai',
    location: 'Bengaluru, Karnataka',
    rating: 5,
    review: 'Fast shipping and brilliant packaging. The Kanda Lasun Masala is so potent you only need a little bit to flavor the entire dish. Really impressed with Geeta\'s Masale.',
    product: 'Kanda Lasun Masala',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
    level: 'Local Guide Level 7',
    stats: '120 reviews • 45 ratings',
    points: '4,500 / 5,000 points',
    link: 'https://share.google/oPiu1fp23C1IEVazR'
  }
];

export const GALLERY_PHOTOS: GalleryItem[] = [
  {
    id: 'g1',
    title: 'Geeta’s Masale Kasal Storefront',
    category: 'Store',
    image: storefrontImage
  },
  {
    id: 'g2',
    title: 'Boutique Shelves Filled with Spices',
    category: 'Interior',
    image: interiorImage
  },
  {
    id: 'g3',
    title: 'Authentic Sundried Malvani Sola (Kokum)',
    category: 'Products',
    image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'g4',
    title: 'Slow Roasted Indian Griddle Spices',
    category: 'Heritage',
    image: masalaHeroImage
  },
  {
    id: 'g5',
    title: 'Premium Raw Jumbo Cashews',
    category: 'Kaju',
    image: cashewPremiumImage
  },
  {
    id: 'g6',
    title: 'Freshly Steamed Malvani Chicken & Vatan',
    category: 'Cooking',
    image: cookingImage
  }
];

export function resolveProductImage(p: Product | null | undefined): string {
  if (!p) return '';
  
  // 1. If it's a known product ID, look it up in our static local map to get the correct compiled/imported asset
  const localProduct = PRODUCTS.find(item => item.id === p.id);
  if (localProduct && localProduct.image) {
    return localProduct.image;
  }
  
  // 2. Fallback to the image property (e.g. if custom created product from admin dashboard)
  return p.image || '';
}

export function resolveCategoryImage(c: any): string {
  if (!c) return '';
  
  // If user uploaded a base64 or external url via admin dashboard, that should override the static asset if they explicitly modified it.
  // Wait, if it's the exact default string like '/src/assets...', we should fall back to local asset.
  if (c.image && !c.image.startsWith('/src/assets')) {
    return c.image;
  }
  
  const localCategory = CATEGORIES.find(item => item.id === c.id);
  if (localCategory && localCategory.image) {
    return localCategory.image;
  }
  
  return c.image || '';
}


