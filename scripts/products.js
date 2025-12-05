const products = [
  {
    id: 'ultrabook-x1',
    name: 'UltraBook X1',
    price: '$1,899',
    priceValue: 1899,
    category: 'laptop',
    cpuFamily: 'Intel i7',
    ramSize: 16,
    screenType: 'OLED',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80',
    shortSpecs: ['Intel Evo i7', '16GB RAM', '1TB SSD'],
    description: 'A featherweight 14" laptop with a 3K OLED display, instant wake, and battery that keeps pace for long workdays.',
    specs: {
      cpu: 'Intel Core i7-1360P',
      ram: '16GB LPDDR5',
      storage: '1TB NVMe SSD',
      screen: '14" 3K OLED (400 nits)',
      gpu: 'Intel Iris Xe',
      battery: 'Up to 18 hours',
      weight: '2.4 lbs'
    }
  },
  {
    id: 'creator-16',
    name: 'Creator 16 Pro',
    price: '$2,399',
    priceValue: 2399,
    category: 'laptop',
    cpuFamily: 'Ryzen 9',
    ramSize: 32,
    screenType: 'QHD',
    image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=900&q=80',
    shortSpecs: ['Ryzen 9', '32GB RAM', 'RTX 4070'],
    description: 'A 16" workstation tuned for creative suites with a calibrated display and quiet thermals.',
    specs: {
      cpu: 'AMD Ryzen 9 7940HS',
      ram: '32GB DDR5',
      storage: '1TB NVMe SSD',
      screen: '16" 165Hz QHD+ (100% DCI-P3)',
      gpu: 'NVIDIA RTX 4070 8GB',
      battery: 'Up to 10 hours',
      weight: '4.5 lbs'
    }
  },
  {
    id: 'everyday-air',
    name: 'Everyday Air',
    price: '$899',
    priceValue: 899,
    category: 'laptop',
    cpuFamily: 'Intel i5',
    ramSize: 8,
    screenType: 'FHD',
    image: 'https://images.unsplash.com/photo-1527430253228-e93688616381?auto=format&fit=crop&w=900&q=80',
    shortSpecs: ['Intel i5', '8GB RAM', '512GB SSD'],
    description: 'Light and reliable with plenty of ports and a bright screen for study, browsing, and streaming.',
    specs: {
      cpu: 'Intel Core i5-1335U',
      ram: '8GB DDR4',
      storage: '512GB NVMe SSD',
      screen: '14" FHD IPS (350 nits)',
      gpu: 'Intel Iris Xe',
      battery: 'Up to 14 hours',
      weight: '2.9 lbs'
    }
  },
  {
    id: 'tab-vision',
    name: 'Tab Vision',
    price: '$649',
    priceValue: 649,
    category: 'tablet',
    cpuFamily: 'Snapdragon',
    ramSize: 8,
    screenType: 'OLED',
    image: 'https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=900&q=80',
    shortSpecs: ['OLED 11"', '8GB RAM', '256GB'],
    description: 'A vibrant OLED tablet with quad speakers, pen support, and desktop mode for multitasking.',
    specs: {
      cpu: 'Snapdragon 8 Gen 2',
      ram: '8GB LPDDR5',
      storage: '256GB UFS 4.0',
      screen: '11" 120Hz OLED',
      gpu: 'Adreno',
      battery: 'Up to 12 hours',
      weight: '1.1 lbs'
    }
  },
  {
    id: 'gaming-edge',
    name: 'Gaming Edge 15',
    price: '$1,599',
    priceValue: 1599,
    category: 'laptop',
    cpuFamily: 'Intel i7',
    ramSize: 16,
    screenType: 'FHD',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=900&q=80',
    shortSpecs: ['Intel i7', '16GB RAM', 'RTX 4060'],
    description: 'Built for 1080p and QHD gaming with a fast refresh screen and a quiet, efficient cooling system.',
    specs: {
      cpu: 'Intel Core i7-13700H',
      ram: '16GB DDR5',
      storage: '1TB NVMe SSD',
      screen: '15.6" 240Hz FHD+',
      gpu: 'NVIDIA RTX 4060 8GB',
      battery: 'Up to 8 hours',
      weight: '4.2 lbs'
    }
  },
  {
    id: 'studio-allinone',
    name: 'Studio All-in-One',
    price: '$1,299',
    priceValue: 1299,
    category: 'desktop',
    cpuFamily: 'Intel i7',
    ramSize: 16,
    screenType: '5K',
    image: 'https://images.unsplash.com/photo-1456428199391-a3b1cb5e93ab?auto=format&fit=crop&w=900&q=80',
    shortSpecs: ['27" 5K', '16GB RAM', '1TB SSD'],
    description: 'A desk-friendly 5K all-in-one with front-facing speakers, fast ports, and a minimalist footprint.',
    specs: {
      cpu: 'Intel Core i7-12700',
      ram: '16GB DDR5',
      storage: '1TB NVMe SSD',
      screen: '27" 5K Retina',
      gpu: 'Integrated',
      battery: 'N/A (desktop)',
      weight: '16 lbs'
    }
  },
  {
    id: 'travel-2in1',
    name: 'Travel 2-in-1',
    price: '$1,049',
    priceValue: 1049,
    category: 'laptop',
    cpuFamily: 'Intel i5',
    ramSize: 12,
    screenType: 'Touch',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80',
    shortSpecs: ['Convertible', '12GB RAM', '512GB SSD'],
    description: 'A slim convertible with a sturdy hinge, bright touchscreen, and solid battery for travel.',
    specs: {
      cpu: 'Intel Core i5-1340P',
      ram: '12GB LPDDR5',
      storage: '512GB NVMe SSD',
      screen: '13.5" 120Hz Touch',
      gpu: 'Intel Iris Xe',
      battery: 'Up to 15 hours',
      weight: '2.7 lbs'
    }
  },
  {
    id: 'mini-desktop',
    name: 'Mini Desktop Pro',
    price: '$799',
    priceValue: 799,
    category: 'desktop',
    cpuFamily: 'Ryzen 7',
    ramSize: 16,
    screenType: 'External',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
    shortSpecs: ['Ryzen 7', '16GB RAM', '1TB SSD'],
    description: 'Tiny footprint desktop with silent cooling, multiple monitor support, and fast Wi‑Fi 6E.',
    specs: {
      cpu: 'AMD Ryzen 7 7840HS',
      ram: '16GB DDR5',
      storage: '1TB NVMe SSD',
      screen: 'External (up to 3 displays)',
      gpu: 'Radeon 780M',
      battery: 'N/A (desktop)',
      weight: '3.1 lbs'
    }
  }
];
