const sampleCategories = [
  { id: "c1", name: "Laptops", slug: "laptops" },
  { id: "c2", name: "Mobiles", slug: "mobiles" },
  { id: "c3", name: "Earbuds & Headphones", slug: "audio" },
  { id: "c4", name: "Smartwatches", slug: "smartwatches" },
  { id: "c5", name: "Tablets", slug: "tablets" },
  { id: "c6", name: "Accessories", slug: "accessories" },
  { id: "c7", name: "Gaming", slug: "gaming" },
  { id: "c8", name: "Cameras", slug: "cameras" },
  { id: "c9", name: "Components", slug: "components" },
  { id: "c10", name: "Networking", slug: "networking" }
];
const sampleProducts = [
  {
    id: "p1",
    name: "Vantage 14 Ultrabook",
    slug: "vantage-14-ultrabook",
    description: "A 14-inch ultrabook built for all-day work: 12-core processor, 16GB RAM, and a 1TB NVMe drive in a 1.2kg magnesium shell.",
    price: 289e3,
    discountPrice: 259900,
    stock: 14,
    images: [
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800"
    ],
    brand: "Vantage",
    categoryId: "c1",
    specs: {
      Processor: "12-core, 4.4GHz boost",
      RAM: "16GB LPDDR5",
      Storage: "1TB NVMe SSD",
      Display: '14" 2.8K OLED, 90Hz',
      Battery: "Up to 18 hours"
    },
    ratingAvg: 4.6,
    ratingCount: 128
  },
  {
    id: "p2",
    name: "Ferrite X7 Gaming Laptop",
    slug: "ferrite-x7-gaming-laptop",
    description: "16-inch 240Hz QHD display paired with a discrete GPU, tuned for competitive frame rates without throttling.",
    price: 415e3,
    discountPrice: null,
    stock: 6,
    images: [
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800"
    ],
    brand: "Ferrite",
    categoryId: "c1",
    specs: {
      GPU: "12GB discrete",
      RAM: "32GB DDR5",
      Storage: "2TB NVMe SSD",
      Display: '16" QHD 240Hz'
    },
    ratingAvg: 4.8,
    ratingCount: 71
  },
  {
    id: "p3",
    name: "Nimbus S24 Smartphone",
    slug: "nimbus-s24-smartphone",
    description: "A 6.7-inch AMOLED flagship with a 3-lens camera system and 5000mAh battery with 65W fast charging.",
    price: 189900,
    discountPrice: 174900,
    stock: 32,
    images: [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800"
    ],
    brand: "Nimbus",
    categoryId: "c2",
    specs: {
      Display: '6.7" AMOLED 120Hz',
      Camera: "50MP + 12MP + 10MP",
      Battery: "5000mAh, 65W",
      Storage: "256GB"
    },
    ratingAvg: 4.5,
    ratingCount: 340
  },
  {
    id: "p4",
    name: "Pulse Air Wireless Earbuds",
    slug: "pulse-air-wireless-earbuds",
    description: "Active noise cancellation, 32-hour total battery life with the case, and IPX5 sweat resistance.",
    price: 24900,
    discountPrice: 18900,
    stock: 80,
    images: [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800"
    ],
    brand: "Pulse",
    categoryId: "c3",
    specs: {
      ANC: "Adaptive, up to 32dB",
      Battery: "8h + 24h case",
      Water: "IPX5"
    },
    ratingAvg: 4.4,
    ratingCount: 512
  },
  {
    id: "p5",
    name: "Orbit Watch SE",
    slug: "orbit-watch-se",
    description: "AMOLED always-on display, blood-oxygen and heart-rate sensors, and 10-day battery life.",
    price: 34900,
    discountPrice: null,
    stock: 45,
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800"
    ],
    brand: "Orbit",
    categoryId: "c4",
    specs: { Display: '1.4" AMOLED', Battery: "10 days", Sensors: "SpO2, HR, GPS" },
    ratingAvg: 4.3,
    ratingCount: 96
  },
  {
    id: "p6",
    name: "Slate 11 Tablet",
    slug: "slate-11-tablet",
    description: "11-inch 2K display, stylus support, and a metal unibody \u2014 built for note-taking and light creative work.",
    price: 79900,
    discountPrice: 69900,
    stock: 21,
    images: [
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800"
    ],
    brand: "Slate",
    categoryId: "c5",
    specs: { Display: '11" 2K', Storage: "128GB", Stylus: "Included" },
    ratingAvg: 4.2,
    ratingCount: 58
  }
];
function getSampleProduct(slug) {
  return sampleProducts.find((p) => p.slug === slug);
}
export {
  getSampleProduct,
  sampleCategories,
  sampleProducts
};
