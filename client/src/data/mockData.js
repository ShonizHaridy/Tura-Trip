// src/data/mockData.js

export const mockDestinations = [
  {
    id: 1,
    name: 'Hurghada',
    slug: 'hurghada',
    description: 'A hub for marine activities and desert safaris.',
    image: '/src/assets/Hurgada.jpg'
  },
  {
    id: 2,
    name: 'Sharm ElShiekh',
    slug: 'sharm-el-sheikh',
    description: 'Known for its stunning beaches and diving spots.',
    image: '/src/assets/sharm.jpg'
  },
  {
    id: 3,
    name: 'Marsa Alam',
    slug: 'marsa-alam',
    description: 'A serene escape with pristine coral reefs.',
    image: '/src/assets/Marsa.jpg'
  }
];

export const mockCityData = {
  'hurghada': {
    name: 'Hurghada',
    description: 'A hub for marine activities and desert safaris.',
    longDescription: 'Kick up the desert dust as you race across the sands on your own all-terrain vehicle (ATV) on this thrilling adrenaline safari, with door-to-door transfers from Hurghada hotels. Learn the basics and take a test drive before your guide leads you on a 12-mile (20-kilometer) journey across the desert to a Bedouin village, where you can drink traditional Bedouin tea and take a camel ride before you head back through the sand to the start point.',
    heroImage: '/src/assets/destinations/hurghada-hero.jpg',
    features: [
      'No Prepayment',
      'Insurance is Valid', 
      'No Hidden Extra',
      'English Speaking Guides',
      'Personal Manager'
    ]
  },
  'sharm-el-sheikh': {
    name: 'Sharm El Sheikh',
    description: 'Known for its stunning beaches and diving spots.',
    longDescription: 'Sharm El Sheikh is a world-renowned diving destination located at the southern tip of the Sinai Peninsula. Famous for its crystal-clear waters, vibrant coral reefs, and diverse marine life, it offers some of the best underwater experiences in the Red Sea.',
    heroImage: '/src/assets/destinations/sharm-hero.jpg',
    features: [
      'World-class diving sites',
      'Luxury resorts',
      'Desert adventures',
      'Vibrant nightlife'
    ]
  },
  'marsa-alam': {
    name: 'Marsa Alam',
    description: 'A serene escape with pristine coral reefs.',
    longDescription: 'Marsa Alam is a hidden gem on the Red Sea coast, offering untouched coral reefs, pristine beaches, and incredible marine biodiversity. Perfect for those seeking a more tranquil and authentic Egyptian experience.',
    heroImage: '/src/assets/destinations/marsa-hero.jpg',
    features: [
      'Pristine coral reefs',
      'Dolphin encounters',
      'Turtle spotting',
      'Peaceful atmosphere'
    ]
  }
};

export const mockTrips = {
  'hurghada': [
    {
      id: 1,
      title: "Ras Mohammed and White Island (Diving Experience)",
      image: "/src/assets/ras_mohammed.jpeg",
      category: "Sea Excursions",
      duration: "9",
      durationUnit: "hours",
      transportation: "By Boat",
      daysOfWeek: "Daily",
      reviews: "23",
      price: "26",
      originalPrice: "35",
      priceUnit: "per person",
      isFeatured: true,
      featuredLabel: "Popular"
    },
    {
      id: 2,
      title: "Orange Bay Paradise",
      image: "/src/assets/safari.jpg",
      category: "Sea Excursions",
      duration: "8",
      durationUnit: "hours",
      transportation: "By Boat",
      daysOfWeek: "Daily",
      reviews: "584",
      price: "35",
      priceUnit: "per person",
      isFeatured: true,
      featuredLabel: "Hot Deal"
    },
    {
      id: 3,
      title: "Desert Safari Adventure",
      image: "/src/assets/safari.jpg",
      category: "Desert Tours",
      duration: "6",
      durationUnit: "hours",
      transportation: "4WD Vehicle",
      daysOfWeek: "Mon, Wed, Fri",
      reviews: "156",
      price: "45",
      originalPrice: "60",
      priceUnit: "per person"
    },
    {
      id: 4,
      title: "Snorkeling at Giftun Island",
      image: "/src/assets/luxor.png",
      category: "Sea Excursions",
      duration: "7",
      durationUnit: "hours",
      transportation: "By Boat",
      daysOfWeek: "Daily",
      reviews: "342",
      price: "30",
      priceUnit: "per person"
    }
  ],
  'sharm-el-sheikh': [
    {
      id: 5,
      title: "Blue Hole Diving Experience",
      image: "/src/assets/safari.jpg",
      category: "Sea Excursions",
      duration: "Full Day",
      durationUnit: "",
      transportation: "By Bus",
      daysOfWeek: "Tue, Thu, Sat",
      reviews: "89",
      price: "65",
      priceUnit: "per person"
    },
    {
      id: 6,
      title: "Colored Canyon Adventure",
      image: "/src/assets/luxor.png",
      category: "Desert Tours",
      duration: "1",
      durationUnit: "day",
      transportation: "4WD Vehicle",
      daysOfWeek: "Daily",
      reviews: "267",
      price: "55",
      priceUnit: "per person"
    }
  ],
  'marsa-alam': [
    {
      id: 7,
      title: "Dolphin House Snorkeling",
      image: "/src/assets/safari.jpg",
      category: "Sea Excursions",
      duration: "Full Day",
      durationUnit: "",
      transportation: "By Boat",
      daysOfWeek: "Daily",
      reviews: "156",
      price: "40",
      priceUnit: "per person"
    }
  ]
};

export const mockCategories = {
  'hurghada': ['Sea Excursions', 'Desert Tours', 'Historical Cities'],
  'sharm-el-sheikh': ['Sea Excursions', 'Desert Tours', 'Safari and Adventure'],
  'marsa-alam': ['Sea Excursions', 'Entertainment and SPA']
};

export const mockTripDetails = {
  1: {
    id: 1,
    title: "Ras Mohammed and White Island (Diving Experience)",
    cityName: "hurghada",
    description: "Kick up the desert dust as you race across the sands on your own all-terrain vehicle (ATV) on this thrilling adrenaline safari, with door-to-door transfers from Hurghada hotels. Learn the basics and take a test drive before your guide leads you on a 12-mile (20-kilometer) journey across the desert to a Bedouin village.",
    images: [
      "/src/assets/ras-mohammed.jpg",
      "/src/assets/ras-mohammed-2.jpg",
      "/src/assets/ras-mohammed-3.jpg",
      "/src/assets/ras-mohammed-4.jpg"
    ],
    category: "Sea Excursions",
    duration: "9",
    durationUnit: "hours",
    location: "Hurghada, Egypt",
    reviews: "23",
    price: "26",
    originalPrice: "35",
    priceUnit: "per person",
    program: [
      "Transfer approximately 06:30 the exact time is announced after booking, the road to the port is from 10 to 45 minutes. Departure from the port on board depending on the weather.",
      "Two snorkeling stops on the reefs, lasting about one hour each (at the discretion of the guide on site).",
      "Disembarkation on one of the islands of Ras Mohammed (20-30 minutes), where there are benches and a buffet (covered area).",
      "Stop at an inflatable banana and a trailer (covered one trip from 3 minutes very slightly).",
      "Relax on an inflatable banana and a buffet covered one trip from 3 minutes, fish sausages, cola, Pepsi, tea, coffee).",
      "Transfer to hotels around 17:00 (subject to vary slightly)."
    ],
    included: [
      "Hotel Pick-up & Drop-off",
      "Air-conditioned vehicle",
      "Camel Ride",
      "Bedouin Village & Bedouin Tea",
      "Lunch & Drinks on Yacht"
    ],
    notIncluded: [
      "Masks",
      "Fins",
      "Diving Suits"
    ]
  },
  2: {
    id: 2,
    title: "Orange Bay Paradise",
    cityName: "hurghada",
    description: "Experience the pristine beauty of Orange Bay, one of the most beautiful islands in the Red Sea. Crystal clear waters, white sandy beaches, and vibrant coral reefs await you.",
    images: [
      "/src/assets/orange-bay.jpg",
      "/src/assets/orange-bay-2.jpg",
      "/src/assets/orange-bay-3.jpg"
    ],
    category: "Sea Excursions",
    duration: "8",
    durationUnit: "hours",
    location: "Hurghada, Egypt",
    reviews: "584",
    price: "35",
    priceUnit: "per person",
    program: [
      "Hotel pickup and transfer to marina",
      "Boat departure to Orange Bay",
      "Snorkeling at coral reef site",
      "Relaxation time on Orange Bay beach",
      "Lunch buffet on the boat",
      "Water activities and swimming",
      "Return to marina and hotel transfer"
    ],
    included: [
      "Hotel Pick-up & Drop-off",
      "Boat transfers",
      "Snorkeling equipment",
      "Lunch buffet",
      "Soft drinks and water"
    ],
    notIncluded: [
      "Personal expenses",
      "Tips",
      "Alcoholic beverages"
    ]
  }
  // Add more trip details as needed...
};

export const mockRelatedTrips = {
  1: [
    {
      id: 2,
      title: "Orange Bay Paradise",
      image: "/src/assets/orange-bay.jpg",
      category: "Sea Excursions",
      duration: "8",
      durationUnit: "hours",
      transportation: "By Boat",
      reviews: "584",
      price: "35",
      priceUnit: "per person",
      isFeatured: false
    },
    {
      id: 3,
      title: "Desert Safari Adventure", 
      image: "/src/assets/desert-safari.jpg",
      category: "Desert Tours",
      duration: "6",
      durationUnit: "hours", 
      transportation: "4WD Vehicle",
      reviews: "156",
      price: "45",
      originalPrice: "60",
      priceUnit: "per person",
      isFeatured: false
    },
    {
      id: 4,
      title: "Snorkeling at Giftun Island",
      image: "/src/assets/giftun.jpg",
      category: "Sea Excursions", 
      duration: "7",
      durationUnit: "hours",
      transportation: "By Boat",
      reviews: "342",
      price: "30",
      priceUnit: "per person",
      isFeatured: false
    },
    {
      id: 7,
      title: "Dolphin House Snorkeling",
      image: "/src/assets/safari.jpg",
      category: "Sea Excursions",
      duration: "8",
      durationUnit: "hours", 
      transportation: "By Boat",
      reviews: "156",
      price: "40",
      priceUnit: "per person",
      isFeatured: false
    }
  ],
  2: [
    {
      id: 1,
      title: "Ras Mohammed and White Island (Diving Experience)",
      image: "/src/assets/ras_mohammed.jpeg",
      category: "Sea Excursions",
      duration: "9", 
      durationUnit: "hours",
      transportation: "By Boat",
      reviews: "23",
      price: "26",
      originalPrice: "35",
      priceUnit: "per person",
      isFeatured: false
    },
    {
      id: 3,
      title: "Desert Safari Adventure",
      image: "/src/assets/safari.jpg", 
      category: "Desert Tours",
      duration: "6",
      durationUnit: "hours",
      transportation: "4WD Vehicle", 
      reviews: "156",
      price: "45",
      originalPrice: "60",
      priceUnit: "per person",
      isFeatured: false
    },
    {
      id: 4,
      title: "Snorkeling at Giftun Island",
      image: "/src/assets/luxor.png",
      category: "Sea Excursions",
      duration: "7",
      durationUnit: "hours",
      transportation: "By Boat",
      reviews: "342", 
      price: "30",
      priceUnit: "per person",
      isFeatured: false
    },
    {
      id: 5,
      title: "Blue Hole Diving Experience", 
      image: "/src/assets/safari.jpg",
      category: "Sea Excursions",
      duration: "8",
      durationUnit: "hours",
      transportation: "By Bus",
      reviews: "89",
      price: "65",
      priceUnit: "per person",
      isFeatured: false
    }
  ]
  // Add more trip IDs as needed
};