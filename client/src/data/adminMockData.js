// src/data/adminMockData.js

export const mockAdminUser = {
  id: "admin001",
  name: "Admin",
  email: "ahmed.ashraf@turatrip.com",
  avatar: "/src/assets/admin-avatar.jpg",
  role: "Admin",
};

export const mockStats = {
  totalTours: 82,
  activeTours: 58,
  deactivatedTours: 24,
};

export const mockTourCategories = [
  {
    id: 1,
    name: "Historical Cities",
    cities: "Hurghada, Sharm Elsheikh, Marsa Alam",
    numberOfTours: 213,
    status: "Active",
  },
  {
    id: 2,
    name: "Sea Excursions",
    cities: "Hurghada, Sharm Elsheikh, Marsa Alam",
    numberOfTours: 340,
    status: "Active",
  },
  {
    id: 3,
    name: "Safari & Adventure",
    cities: "Hurghada, Sharm Elsheikh, Marsa Alam",
    numberOfTours: 115,
    status: "Active",
  },
  {
    id: 4,
    name: "Entertainment & Spa",
    cities: "Hurghada, Sharm Elsheikh, Marsa Alam",
    numberOfTours: 30,
    status: "Active",
  },
  {
    id: 5,
    name: "Transfer",
    cities: "Hurghada, Sharm Elsheikh, Marsa Alam",
    numberOfTours: 14,
    status: "Active",
  },
  {
    id: 6,
    name: "Individual",
    cities: "Hurghada, Sharm Elsheikh, Marsa Alam",
    numberOfTours: 120,
    status: "Active",
  },
];

export const mockCities = [
  { id: 1, name: "Hurghada", isActive: true },
  { id: 2, name: "Sharm el-Sheikh", isActive: true },
  { id: 3, name: "Marsa Alam", isActive: true },
  { id: 4, name: "Cairo", isActive: false },
  { id: 5, name: "Luxor", isActive: false },
];

export const mockAdminTours = [
  {
    id: 1,
    title: "Cairo from Hurghada (by Plane)",
    city: "Hurghada",
    type: "Historical Cities",
    priceAdult: 45,
    priceChild: 17,
    status: "Active",
    image: "/src/assets/cairo-tour.jpg",
    views: 1250,
  },
  {
    id: 2,
    title: "Orange Bay",
    city: "Hurghada",
    type: "Sea Excursions",
    priceAdult: 45,
    priceChild: 17,
    status: "Active",
    image: "/src/assets/orange-bay.jpg",
    views: 980,
  },
  {
    id: 3,
    title: "Diving the Hole Day",
    city: "Marsa Alam",
    type: "Sea Excursions",
    priceAdult: 45,
    priceChild: 17,
    status: "Active",
    image: "/src/assets/diving-tour.jpg",
    views: 850,
  },
  {
    id: 4,
    title: "Paradise Island",
    city: "Sharm el-Sheikh",
    type: "Sea Excursions",
    priceAdult: 45,
    priceChild: 17,
    status: "Active",
    image: "/src/assets/paradise-island.jpg",
    views: 760,
  },
  {
    id: 5,
    title: "Luxor Temples from Hurghada (by Bus)",
    city: "Hurghada",
    type: "Historical Cities",
    priceAdult: 45,
    priceChild: 17,
    status: "Active",
    image: "/src/assets/luxor-temples.jpg",
    views: 690,
  },
  {
    id: 6,
    title: "Tranquil Nimo Island",
    city: "Hurghada",
    type: "Individual",
    priceAdult: 45,
    priceChild: 17,
    status: "Active",
    image: "/src/assets/nimo-island.jpg",
    views: 580,
  },
];

export const mockNotifications = [
  {
    id: 1,
    type: "booking",
    count: 3,
    message: "New bookings pending approval",
  },
  {
    id: 2,
    type: "review",
    count: 5,
    message: "New tour reviews",
  },
];

export const mockFilterOptions = {
  cities: ["Hurghada", "Marsa Alam", "Sharm El-Sheikh"],
  types: [
    "Sea Excursions",
    "Historical Cities",
    "Individual",
    "Safari and Adventure",
    "Entertainment and SPA",
    "Transfer",
  ],
  priceRange: { min: 1, max: 1000 },
};
