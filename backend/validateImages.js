const fs = require('fs');
const https = require('https');

const products = [
  {
    "id": 1,
    "name": "NexVision VR Headset 3.0",
    "price": 45000,
    "discountPrice": 39999,
    "description": "Immerse yourself in stunning 8K virtual reality with ultra-low latency tracking and spatial audio.",
    "category": "Gaming",
    "stock": 10,
    "image": "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  },
  {
    "id": 2,
    "name": "Quantum Mechanical Keyboard",
    "price": 12500,
    "description": "Wireless mechanical keyboard with haptic feedback, custom RGB, and silent linear switches.",
    "category": "Peripherals",
    "stock": 25,
    "image": "https://images.unsplash.com/photo-1595225476474-87563907a212?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  },
  {
    "id": 3,
    "name": "Aura Smart Mirror",
    "price": 32000,
    "description": "Interactive smart mirror that displays your schedule, weather, and fitness metrics while you get ready.",
    "category": "Smart Home",
    "stock": 5,
    "image": "https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  },
  {
    "id": 4,
    "name": "SonicPulse Wireless Earbuds",
    "price": 8500,
    "description": "Next-gen earbuds with adaptive noise cancellation, 3D audio mapping, and 40-hour battery life.",
    "category": "Audio",
    "stock": 50,
    "image": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  },
  {
    "id": 5,
    "name": "Captain Hover Drone Pro",
    "price": 75000,
    "discountPrice": 69999,
    "description": "Professional 4K drone with AI obstacle avoidance, follow-me mode, and 10km transmission range.",
    "category": "Cameras",
    "stock": 8,
    "image": "https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  },
  {
    "id": 6,
    "name": "HoloDisplay Smart Projector",
    "price": 42000,
    "description": "Portable 4K laser projector capable of rendering 3D holograms with built-in Android TV.",
    "category": "Entertainment",
    "stock": 12,
    "image": "https://images.unsplash.com/photo-1588698188168-5a6b0c2a5105?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  },
  {
    "id": 7,
    "name": "CyberLink Ergonomic Mouse",
    "price": 5500,
    "description": "Vertical ergonomic mouse designed to eliminate wrist strain during long coding sessions.",
    "category": "Peripherals",
    "stock": 40,
    "image": "https://images.unsplash.com/photo-1615663245857-ac1eeb536624?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  },
  {
    "id": 8,
    "name": "Nova Smart Desk Lamp",
    "price": 3800,
    "description": "Minimalist LED desk lamp with auto-dimming, eye-protection tech, and a wireless charging pad.",
    "category": "Smart Home",
    "stock": 35,
    "image": "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  },
  {
    "id": 9,
    "name": "Titanium Fitness Ring",
    "price": 18000,
    "description": "Ultra-lightweight titanium smart ring that tracks sleep, heart rate, and body temperature.",
    "category": "Wearables",
    "stock": 20,
    "image": "https://images.unsplash.com/photo-1599643478524-fb66f72199b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  },
  {
    "id": 10,
    "name": "EcoCharge Solar Powerbank",
    "price": 4500,
    "description": "Rugged 20,000mAh powerbank with high-efficiency solar panels and fast-charging capabilities.",
    "category": "Accessories",
    "stock": 60,
    "image": "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  },
  {
    "id": 11,
    "name": "NexPad Pro Tablet",
    "price": 65000,
    "discountPrice": 59900,
    "description": "12-inch OLED tablet tailored for designers and developers, featuring a magnetic stylus.",
    "category": "Computers",
    "stock": 15,
    "image": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  },
  {
    "id": 12,
    "name": "Orbit Bluetooth Speaker",
    "price": 7200,
    "description": "Levitating 360-degree bluetooth speaker that delivers deep bass and crystal clear highs.",
    "category": "Audio",
    "stock": 22,
    "image": "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  },
  {
    "id": 13,
    "name": "Sentinel Security Camera",
    "price": 9500,
    "description": "AI-powered 4K security camera with facial recognition and colored night vision.",
    "category": "Smart Home",
    "stock": 30,
    "image": "https://images.unsplash.com/photo-1557324232-b8917d3c3dcb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  },
  {
    "id": 14,
    "name": "Gravity Defying Desk Organizer",
    "price": 2500,
    "description": "Magnetic levitating desk organizer that holds your pens, clips, and looks incredibly futuristic.",
    "category": "Office",
    "stock": 45,
    "image": "https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  },
  {
    "id": 15,
    "name": "HyperSync Smart Notebook",
    "price": 3200,
    "description": "Write with pen on paper, and have your notes instantly digitized and synced to the cloud.",
    "category": "Office",
    "stock": 80,
    "image": "https://images.unsplash.com/photo-1517842645767-c639042777db?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  },
  {
    "id": 16,
    "name": "Onyx E-Ink Monitor",
    "price": 48000,
    "description": "25-inch E-ink monitor designed to completely eliminate eye strain for coders and writers.",
    "category": "Computers",
    "stock": 7,
    "image": "https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  },
  {
    "id": 17,
    "name": "Vortex Air Purifier",
    "price": 14500,
    "description": "Smart HEPA air purifier with laser particle sensors and app-controlled fan curves.",
    "category": "Smart Home",
    "stock": 18,
    "image": "https://images.unsplash.com/photo-1585771724684-38269d6639fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  },
  {
    "id": 18,
    "name": "Pulse Biometric Wallet",
    "price": 8900,
    "discountPrice": 7500,
    "description": "Carbon fiber smart wallet that only opens with your fingerprint. Features GPS tracking.",
    "category": "Accessories",
    "stock": 25,
    "image": "https://images.unsplash.com/photo-1627123424574-724758594e93?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  },
  {
    "id": 19,
    "name": "Lumina WebCam AI",
    "price": 11500,
    "description": "4K DSLR-quality webcam that uses AI to perfectly frame you and blur your background.",
    "category": "Peripherals",
    "stock": 14,
    "image": "https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  },
  {
    "id": 20,
    "name": "Zephyr Smart Backpack",
    "price": 9500,
    "description": "Tech-focused backpack with a built-in powerbank, solar skin, and anti-theft locking system.",
    "category": "Accessories",
    "stock": 35,
    "image": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  }
];

const checkUrl = (url) => {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      resolve(res.statusCode === 200 || res.statusCode === 302 || res.statusCode === 301);
    }).on('error', () => resolve(false));
  });
};

async function run() {
  const validProducts = [];
  for (let i = 0; i < products.length; i++) {
    console.log(`Checking ${products[i].name}...`);
    const isValid = await checkUrl(products[i].image);
    if (isValid) {
      validProducts.push(products[i]);
    } else {
      console.log(`Failed: ${products[i].name}`);
    }
  }
  
  // Save to file
  fs.writeFileSync('data/products.json', JSON.stringify(validProducts, null, 2));
  console.log(`Saved ${validProducts.length} valid products.`);
}

run();
