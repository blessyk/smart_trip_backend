const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

const Destination = require('../models/Destination');
const connectDB = require('../config/db');

const destinationsData = [
  // --- BEACH DESTINATIONS (20) ---
  {
    name: "Calangute Beach, Goa",
    country: "India",
    category: "Beach",
    description: "The 'Queen of Beaches' in Goa, famous for water sports, beach shacks, and vibrant nightlife.",
    price: 8500,
    duration: "3 days / 2 nights",
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Radhanagar Beach, Havelock Island",
    country: "India",
    category: "Beach",
    description: "Crowned as Asia's best beach, featuring pristine white sands, turquoise waters, and lush forests.",
    price: 32000,
    duration: "5 days / 4 nights",
    images: [
      "https://images.unsplash.com/photo-1589982424075-8120610360a0?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Varkala Cliff Beach, Kerala",
    country: "India",
    category: "Beach",
    description: "Unique red cliffs bordering the Arabian Sea, famous for natural springs and peaceful sunsets.",
    price: 12500,
    duration: "4 days / 3 nights",
    images: [
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Kovalam Beach, Trivandrum",
    country: "India",
    category: "Beach",
    description: "An internationally renowned beach with three adjacent crescent beaches and an iconic red-and-white lighthouse.",
    price: 14000,
    duration: "4 days / 3 nights",
    images: [
      "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Om Beach, Gokarna",
    country: "India",
    category: "Beach",
    description: "A naturally shaped beach resembling the spiritual 'Om' symbol, ideal for surfing and beach camping.",
    price: 9500,
    duration: "3 days / 2 nights",
    images: [
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Puri Golden Beach, Odisha",
    country: "India",
    category: "Beach",
    description: "A sacred pilgrimage beach on the Bay of Bengal, known for its fine golden sand and sand art displays.",
    price: 11000,
    duration: "3 days / 2 nights",
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Marina Beach, Chennai",
    country: "India",
    category: "Beach",
    description: "The longest natural urban beach in the country, buzzing with local food stalls and cool evening sea breezes.",
    price: 6500,
    duration: "2 days / 1 night",
    images: [
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Radhanagar Sunset Point, Andaman",
    country: "India",
    category: "Beach",
    description: "Stunning sunset views with crystal clear coral waters along Havelock island.",
    price: 35000,
    duration: "6 days / 5 nights",
    images: [
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Alibaug Beach, Maharashtra",
    country: "India",
    category: "Beach",
    description: "Popular weekend getaway from Mumbai, featuring historical sea forts and black sand beaches.",
    price: 7800,
    duration: "2 days / 1 night",
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Diu Fort Beach, Diu",
    country: "India",
    category: "Beach",
    description: "A calm, clean coastal escape with Portuguese heritage, featuring the beautiful Nagoa Beach.",
    price: 13500,
    duration: "3 days / 2 nights",
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Kashid White Sand Beach, Maharashtra",
    country: "India",
    category: "Beach",
    description: "Prinstine white sand beach along the Konkan coast, surrounded by casuarina groves.",
    price: 8900,
    duration: "2 days / 1 night",
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Marari Beach, Alleppey",
    country: "India",
    category: "Beach",
    description: "A quiet, untouched beach retreat in Kerala, perfect for absolute relaxation and Ayurvedic therapies.",
    price: 18000,
    duration: "4 days / 3 nights",
    images: [
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Mandarmani Beach, West Bengal",
    country: "India",
    category: "Beach",
    description: "A seaside resort village with a long drivable beach, popular for red crabs and high speed boat rides.",
    price: 9800,
    duration: "3 days / 2 nights",
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Palolem Beach, South Goa",
    country: "India",
    category: "Beach",
    description: "A scenic, semi-circular bay lined with coconut palms and colorful wooden beach shacks.",
    price: 11000,
    duration: "3 days / 2 nights",
    images: [
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Kanyakumari Triveni Beach",
    country: "India",
    category: "Beach",
    description: "The unique meeting point of the Arabian Sea, the Bay of Bengal, and the Indian Ocean, with spectacular sunrise/sunset views.",
    price: 12000,
    duration: "3 days / 2 nights",
    images: [
      "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Tarkarli Beach, Malvan",
    country: "India",
    category: "Beach",
    description: "Famous for its clear water, coral reefs, and scuba diving opportunities along the Maharashtra coast.",
    price: 10500,
    duration: "3 days / 2 nights",
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Elephant Beach, Havelock",
    country: "India",
    category: "Beach",
    description: "Famous for its vibrant coral reefs and marine life, making it a prime destination for snorkeling and sea walking.",
    price: 28000,
    duration: "5 days / 4 nights",
    images: [
      "https://images.unsplash.com/photo-1589982424075-8120610360a0?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Paradise Beach, Pondicherry",
    country: "India",
    category: "Beach",
    description: "An isolated beach reachable via a scenic backwater boat ride, featuring soft golden sands and calm waves.",
    price: 8000,
    duration: "2 days / 1 night",
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Yarada Beach, Visakhapatnam",
    country: "India",
    category: "Beach",
    description: "Surrounded by hills on three sides and the Bay of Bengal on the fourth, offering absolute privacy and scenic beauty.",
    price: 9000,
    duration: "3 days / 2 nights",
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Gopalpur Beach, Odisha",
    country: "India",
    category: "Beach",
    description: "A heritage beach town once used as an ancient seaport, now popular for calm sands and olive ridley turtles.",
    price: 11500,
    duration: "3 days / 2 nights",
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
    ]
  },

  // --- ADVENTURE DESTINATIONS (20) ---
  {
    name: "Pangong Tso Lake, Ladakh",
    country: "India",
    category: "Adventure",
    description: "High altitude salt-water lake situated at 14,000 feet, famous for changing colors from blue to green.",
    price: 29000,
    duration: "6 days / 5 nights",
    images: [
      "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1548252619-9b8e907567df?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Solang Valley, Manali",
    country: "India",
    category: "Adventure",
    description: "Adventure hub of Himachal, offering paragliding, zorbing, quad biking, and skiing in winter.",
    price: 12500,
    duration: "4 days / 3 nights",
    images: [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Rishikesh River Rafting, Uttarakhand",
    country: "India",
    category: "Adventure",
    description: "Experience white water rafting on the holy Ganges River, alongside cliff jumping and beach camping.",
    price: 7500,
    duration: "3 days / 2 nights",
    images: [
      "https://images.unsplash.com/photo-1530866495561-507c9faab2ed?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Auli Ski Slopes, Uttarakhand",
    country: "India",
    category: "Adventure",
    description: "India's premier skiing destination with beautiful meadows and panoramic views of Himalayan peaks like Nanda Devi.",
    price: 18500,
    duration: "5 days / 4 nights",
    images: [
      "https://images.unsplash.com/photo-1482862549707-f63cb32c5fd9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1518098268026-4e43a1a009de?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Spiti Valley Road Trip, Himachal",
    country: "India",
    category: "Adventure",
    description: "A cold desert mountain valley with high altitude monasteries, rugged terrain, and spectacular starry nights.",
    price: 24500,
    duration: "8 days / 7 nights",
    images: [
      "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Bir Billing Paragliding, Himachal",
    country: "India",
    category: "Adventure",
    description: "World's second highest paragliding landing site, offering soaring flights above beautiful tea gardens and hills.",
    price: 11000,
    duration: "3 days / 2 nights",
    images: [
      "https://images.unsplash.com/photo-1530866495561-507c9faab2ed?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Gulmarg Gondola Ride, Kashmir",
    country: "India",
    category: "Adventure",
    description: "One of the highest cable cars in the world, taking you up to Apharwat Peak for skiing and snowboarding.",
    price: 26000,
    duration: "5 days / 4 nights",
    images: [
      "https://images.unsplash.com/photo-1482862549707-f63cb32c5fd9?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Zanskar Frozen River Trek, Ladakh",
    country: "India",
    category: "Adventure",
    description: "The famous 'Chadar Trek' on the frozen Zanskar River, an extreme adventure at sub-zero temperatures.",
    price: 45000,
    duration: "9 days / 8 nights",
    images: [
      "https://images.unsplash.com/photo-1548252619-9b8e907567df?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Tawang Monastery Trek, Arunachal",
    country: "India",
    category: "Adventure",
    description: "Trek through high passes and waterfalls to reach the largest monastery in India near the Tibet border.",
    price: 32000,
    duration: "7 days / 6 nights",
    images: [
      "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Roopkund Skeleton Lake Trek, Uttarakhand",
    country: "India",
    category: "Adventure",
    description: "High altitude glacial trek famous for hundreds of ancient human skeletons visible at the edge of the lake.",
    price: 21000,
    duration: "8 days / 7 nights",
    images: [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Valley of Flowers Trek, Uttarakhand",
    country: "India",
    category: "Adventure",
    description: "UNESCO World Heritage site featuring endemic alpine flower meadows and diverse wildlife species.",
    price: 15500,
    duration: "6 days / 5 nights",
    images: [
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Sela Pass Mountain Pass, Arunachal",
    country: "India",
    category: "Adventure",
    description: "A high-altitude border mountain pass situated at 13,700 feet, covered in snow throughout the year.",
    price: 28000,
    duration: "6 days / 5 nights",
    images: [
      "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Khardung La Pass Motorbike Trip",
    country: "India",
    category: "Adventure",
    description: "Ride through one of the highest motorable passes in the world at 17,582 feet above sea level.",
    price: 35000,
    duration: "7 days / 6 nights",
    images: [
      "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Sandhan Valley Canyoning, Maharashtra",
    country: "India",
    category: "Adventure",
    description: "The 'Valley of Shadows', offering rock climbing, rappelling, and canyoning through deep water pools.",
    price: 6000,
    duration: "2 days / 1 night",
    images: [
      "https://images.unsplash.com/photo-1530866495561-507c9faab2ed?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Har Ki Dun Valley Trek, Uttarakhand",
    country: "India",
    category: "Adventure",
    description: "A cradle-shaped hanging valley trek offering views of snow-capped mountains and ancient village cultures.",
    price: 16800,
    duration: "7 days / 6 nights",
    images: [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Munnar Trekking & Camping, Kerala",
    country: "India",
    category: "Adventure",
    description: "Trek through tea plantations and cloud forests up to Chokramudi Peak for hill-top sunrise camping.",
    price: 9000,
    duration: "3 days / 2 nights",
    images: [
      "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Shimla Jakhoo Temple Hill Climb",
    country: "India",
    category: "Adventure",
    description: "A steep, adventurous pine forest trek to reach Jakhoo hill, the highest peak in Shimla.",
    price: 5500,
    duration: "2 days / 1 night",
    images: [
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Chembra Heart Lake Trek, Wayanad",
    country: "India",
    category: "Adventure",
    description: "Trek up the highest peak in Wayanad to see the legendary natural heart-shaped lake.",
    price: 8500,
    duration: "3 days / 2 nights",
    images: [
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Dudhsagar Waterfall Trek, Goa",
    country: "India",
    category: "Adventure",
    description: "A challenging railway track trek leading to the magnificent four-tiered 'Sea of Milk' waterfall.",
    price: 7000,
    duration: "2 days / 1 night",
    images: [
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Kudremukh Peak Trek, Karnataka",
    country: "India",
    category: "Adventure",
    description: "Trek through tropical shola forests and rolling green hills resembling a horse's face.",
    price: 8000,
    duration: "2 days / 1 night",
    images: [
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80"
    ]
  },

  // --- CULTURAL DESTINATIONS (20) ---
  {
    name: "Taj Mahal & Agra Fort",
    country: "India",
    category: "Cultural",
    description: "Witness the spectacular symbol of eternal love, crafted entirely of white marble, and the red sandstone Agra Fort.",
    price: 6000,
    duration: "2 days / 1 night",
    images: [
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1542856391-010fb87dcfed?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Ganga Aarti, Varanasi",
    country: "India",
    category: "Cultural",
    description: "Experience the mesmerizing spiritual light ritual on the steps of the holy Ganges river in one of the oldest living cities.",
    price: 7500,
    duration: "3 days / 2 nights",
    images: [
      "https://images.unsplash.com/photo-1561361513-2d000a50f0db?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Ruins of Hampi, Karnataka",
    country: "India",
    category: "Cultural",
    description: "Explore the vast stone ruins, monoliths, and temples of the historical Vijayanagara Empire situated amidst boulder hills.",
    price: 12500,
    duration: "3 days / 2 nights",
    images: [
      "https://images.unsplash.com/photo-1600100397608-f010e4616812?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "The Pink City, Jaipur",
    country: "India",
    category: "Cultural",
    description: "Visit royal heritage palaces including Hawa Mahal, Amer Fort, and City Palace in Rajasthan's capital.",
    price: 11000,
    duration: "3 days / 2 nights",
    images: [
      "https://images.unsplash.com/photo-1477587458883-471a5ed94245?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Lake Palace, Udaipur",
    country: "India",
    category: "Cultural",
    description: "The 'Venice of the East', featuring floating palaces on Lake Pichola and magnificent Rajput fortress architecture.",
    price: 16500,
    duration: "3 days / 2 nights",
    images: [
      "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Golden Temple, Amritsar",
    country: "India",
    category: "Cultural",
    description: "The most sacred pilgrimage site of Sikhism, famous for its pure gold-gilded walls and massive free kitchen.",
    price: 7000,
    duration: "2 days / 1 night",
    images: [
      "https://images.unsplash.com/photo-1588096344356-9b9db2833118?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Khajuraho Group of Temples, MP",
    country: "India",
    category: "Cultural",
    description: "Famous UNESCO heritage temples showcasing intricate medieval carvings and Nagara-style architecture.",
    price: 14000,
    duration: "3 days / 2 nights",
    images: [
      "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Ajanta & Ellora Caves, Maharashtra",
    country: "India",
    category: "Cultural",
    description: "Ancient rock-cut caves carved by hand from basalt cliffs, showcasing Buddhist, Hindu, and Jain scriptures.",
    price: 15000,
    duration: "4 days / 3 nights",
    images: [
      "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Meenakshi Temple, Madurai",
    country: "India",
    category: "Cultural",
    description: "A historical temple complex with towering, brightly colored gopurams dedicated to Goddess Meenakshi.",
    price: 9500,
    duration: "2 days / 1 night",
    images: [
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Sun Temple, Konark",
    country: "India",
    category: "Cultural",
    description: "A 13th-century stone temple shaped like a giant solar chariot with 24 carved stone wheels, dedicated to the Sun God.",
    price: 11000,
    duration: "3 days / 2 nights",
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Mysore Palace, Karnataka",
    country: "India",
    category: "Cultural",
    description: "The historical residence of the Wodeyar dynasty, illuminated by 97,000 light bulbs on holidays.",
    price: 8500,
    duration: "2 days / 1 night",
    images: [
      "https://images.unsplash.com/photo-1600100397608-f010e4616812?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Ranakpur Jain Temple, Rajasthan",
    country: "India",
    category: "Cultural",
    description: "A marble temple supported by 1,444 uniquely carved pillars, representing absolute architectural perfection.",
    price: 12000,
    duration: "2 days / 1 night",
    images: [
      "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Mahabalipuram Shore Temple, Tamil Nadu",
    country: "India",
    category: "Cultural",
    description: "7th-century rock-cut monuments and structural stone temples overlooking the Bay of Bengal.",
    price: 9000,
    duration: "2 days / 1 night",
    images: [
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Brihadeeswarar Temple, Tanjore",
    country: "India",
    category: "Cultural",
    description: "An architectural marvel constructed of absolute granite by Rajaraja Chola I, featuring a massive stone monolith Nandi.",
    price: 10500,
    duration: "2 days / 1 night",
    images: [
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Jaisalmer Fort City, Rajasthan",
    country: "India",
    category: "Cultural",
    description: "The 'Golden City', constructed of yellow sandstone in the Thar desert, housing palaces and Jain temples.",
    price: 14500,
    duration: "3 days / 2 nights",
    images: [
      "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Fatehpur Sikri, Agra",
    country: "India",
    category: "Cultural",
    description: "The grand ghost city constructed of red sandstone by Emperor Akbar, featuring Buland Darwaza.",
    price: 6500,
    duration: "2 days / 1 night",
    images: [
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Victoria Memorial, Kolkata",
    country: "India",
    category: "Cultural",
    description: "A large white marble monument built during the British Raj, displaying royal galleries and lush gardens.",
    price: 8000,
    duration: "2 days / 1 night",
    images: [
      "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Badrinath Temple, Himalayas",
    country: "India",
    category: "Cultural",
    description: "One of the sacred Char Dham temples situated in the snowy Garhwal hills, dedicated to Lord Vishnu.",
    price: 19500,
    duration: "4 days / 3 nights",
    images: [
      "https://images.unsplash.com/photo-1548252619-9b8e907567df?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Kedarnath Temple, Uttarakhand",
    country: "India",
    category: "Cultural",
    description: "Sacred stone temple dedicated to Lord Shiva, surrounded by majestic snow-capped peaks.",
    price: 21000,
    duration: "4 days / 3 nights",
    images: [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Sanchi Stupa, Madhya Pradesh",
    country: "India",
    category: "Cultural",
    description: "One of the oldest stone structures in India, commissioned by Ashoka the Great to house Buddhist relics.",
    price: 11500,
    duration: "2 days / 1 night",
    images: [
      "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80"
    ]
  },

  // --- WILDLIFE DESTINATIONS (20) ---
  {
    name: "Jim Corbett National Park",
    country: "India",
    category: "Wildlife",
    description: "India's oldest national park, famous for royal Bengal tigers, wild elephants, and river safaris.",
    price: 14500,
    duration: "3 days / 2 nights",
    images: [
      "https://images.unsplash.com/photo-1615959189197-48400dc26446?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Kaziranga Rhino Sanctuary, Assam",
    country: "India",
    category: "Wildlife",
    description: "UNESCO world heritage site sheltering two-thirds of the world's great one-horned rhinoceros population.",
    price: 19500,
    duration: "4 days / 3 nights",
    images: [
      "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Ranthambore Tiger Reserve, Rajasthan",
    country: "India",
    category: "Wildlife",
    description: "Historically a royal hunting ground, famous for diurnal tigers, lake-side crocodiles, and ruins.",
    price: 17500,
    duration: "3 days / 2 nights",
    images: [
      "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Gir Lion National Park, Gujarat",
    country: "India",
    category: "Wildlife",
    description: "The exclusive home of the wild Asiatic lions, featuring dry deciduous teak forests.",
    price: 15500,
    duration: "3 days / 2 nights",
    images: [
      "https://images.unsplash.com/photo-1615959189197-48400dc26446?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Sundarbans Mangrove Forest, Bengal",
    country: "India",
    category: "Wildlife",
    description: "The largest mangrove forest on Earth, famous for swimming Bengal tigers and saltwater crocodiles.",
    price: 13000,
    duration: "3 days / 2 nights",
    images: [
      "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Periyar Elephant Sanctuary, Kerala",
    country: "India",
    category: "Wildlife",
    description: "A protected forest surrounding a scenic artificial lake, hosting wild elephant herds and spices.",
    price: 14000,
    duration: "3 days / 2 nights",
    images: [
      "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Bandhavgarh Tiger Reserve, MP",
    country: "India",
    category: "Wildlife",
    description: "Known for having one of the highest densities of Royal Bengal Tigers in India, set amidst steep valleys.",
    price: 21000,
    duration: "4 days / 3 nights",
    images: [
      "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Kanha Tiger Reserve, MP",
    country: "India",
    category: "Wildlife",
    description: "The inspiration for Rudyard Kipling's 'The Jungle Book', sheltering the endangered Barasingha swamp deer.",
    price: 18500,
    duration: "4 days / 3 nights",
    images: [
      "https://images.unsplash.com/photo-1615959189197-48400dc26446?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Kabini Forest Reserve, Karnataka",
    country: "India",
    category: "Wildlife",
    description: "A popular wildlife sanctuary bordering Kabini River, famous for elephant congregations and black leopards.",
    price: 26000,
    duration: "3 days / 2 nights",
    images: [
      "https://images.unsplash.com/photo-1600100397608-f010e4616812?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Tadoba Andhari Tiger Reserve",
    country: "India",
    category: "Wildlife",
    description: "Maharashtra's oldest national park, boasting dry deciduous forests and excellent tiger sightings.",
    price: 16000,
    duration: "3 days / 2 nights",
    images: [
      "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Silent Valley National Park, Kerala",
    country: "India",
    category: "Wildlife",
    description: "A pristine tropical evergreen rainforest containing rare flora and the endangered lion-tailed macaque.",
    price: 15000,
    duration: "3 days / 2 nights",
    images: [
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Sariska Tiger Reserve, Rajasthan",
    country: "India",
    category: "Wildlife",
    description: "Set in the rocky Aravalli range, home to leopards, wild boars, and successfully relocated tigers.",
    price: 13500,
    duration: "3 days / 2 nights",
    images: [
      "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Bannerghatta Biological Park",
    country: "India",
    category: "Wildlife",
    description: "A unique park on Bengaluru outskirts offering caged bus safaris to view lions and tigers in natural enclosures.",
    price: 5000,
    duration: "1 day",
    images: [
      "https://images.unsplash.com/photo-1600100397608-f010e4616812?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Manas Wildlife Sanctuary, Assam",
    country: "India",
    category: "Wildlife",
    description: "A UNESCO heritage biosphere reserve on the Bhutan border, known for golden langurs and pygmy hogs.",
    price: 18000,
    duration: "4 days / 3 nights",
    images: [
      "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Eravikulam National Park, Munnar",
    country: "India",
    category: "Wildlife",
    description: "High altitude hills sheltering the largest surviving population of the endangered Nilgiri Tahr mountain goat.",
    price: 10000,
    duration: "2 days / 1 night",
    images: [
      "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Great Himalayan National Park",
    country: "India",
    category: "Wildlife",
    description: "A high-altitude glacial sanctuary sheltering snow leopards, blue sheep, and the colorful Western Tragopan.",
    price: 25000,
    duration: "6 days / 5 nights",
    images: [
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Hemis National Park, Ladakh",
    country: "India",
    category: "Wildlife",
    description: "A cold desert sanctuary world-famous for its high population of snow leopards.",
    price: 38000,
    duration: "7 days / 6 nights",
    images: [
      "https://images.unsplash.com/photo-1548252619-9b8e907567df?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Dachigam National Park, Kashmir",
    country: "India",
    category: "Wildlife",
    description: "Protected montane forest sheltering the Hangul, or Kashmir stag, the only surviving red deer species in India.",
    price: 22000,
    duration: "3 days / 2 nights",
    images: [
      "https://images.unsplash.com/photo-1482862549707-f63cb32c5fd9?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Chilika Lake Bird Sanctuary, Odisha",
    country: "India",
    category: "Wildlife",
    description: "The largest brackish water lagoon in Asia, famous for migratory winter birds and Irrawaddy dolphins.",
    price: 9500,
    duration: "2 days / 1 night",
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Keoladeo Bird Sanctuary, Bharatpur",
    country: "India",
    category: "Wildlife",
    description: "A famous man-made wetland sheltering thousands of migratory water birds, especially Siberian cranes.",
    price: 8000,
    duration: "2 days / 1 night",
    images: [
      "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80"
    ]
  },

  // --- RELAXATION DESTINATIONS (20) ---
  {
    name: "Munnar Hill Station, Kerala",
    country: "India",
    category: "Relaxation",
    description: "Lush green rolling hills covered with tea plantations, misty valleys, and cool mountain air.",
    price: 13500,
    duration: "4 days / 3 nights",
    images: [
      "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Alleppey Houseboat Backwaters",
    country: "India",
    category: "Relaxation",
    description: "Cruising slowly down narrow palm-fringed canals in a traditional luxury wooden houseboat.",
    price: 16000,
    duration: "2 days / 1 night",
    images: [
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Ooty Botanical Valley, Tamil Nadu",
    country: "India",
    category: "Relaxation",
    description: "Explore the Nilgiri Toy Train, rose gardens, and calm boat rides on Ooty Lake.",
    price: 11500,
    duration: "3 days / 2 nights",
    images: [
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Coorg Coffee Plantations, Karnataka",
    country: "India",
    category: "Relaxation",
    description: "Stay in a cozy homestay surrounded by fragrant cardamom and coffee plantations.",
    price: 12500,
    duration: "3 days / 2 nights",
    images: [
      "https://images.unsplash.com/photo-1600100397608-f010e4616812?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Srinagar Shikara Dal Lake, Kashmir",
    country: "India",
    category: "Relaxation",
    description: "Stay on a handcrafted wooden houseboat on Dal Lake and ride a shikara through floating flower markets.",
    price: 24000,
    duration: "4 days / 3 nights",
    images: [
      "https://images.unsplash.com/photo-1482862549707-f63cb32c5fd9?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Darjeeling Tea Hill, West Bengal",
    country: "India",
    category: "Relaxation",
    description: "Watch the spectacular sunrise over Mount Kanchenjunga and visit sprawling heritage tea estates.",
    price: 15000,
    duration: "4 days / 3 nights",
    images: [
      "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Gangtok Hill Station, Sikkim",
    country: "India",
    category: "Relaxation",
    description: "A clean, modern hill town featuring views of snowy peaks, Buddhist monasteries, and ropeway rides.",
    price: 17500,
    duration: "4 days / 3 nights",
    images: [
      "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Kodaikanal Lake Hill Station, Tamil Nadu",
    country: "India",
    category: "Relaxation",
    description: "The 'Gift of the Forest', famous for a star-shaped lake, pine forests, and misty valleys.",
    price: 12000,
    duration: "3 days / 2 nights",
    images: [
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Wayanad Spice Plantations, Kerala",
    country: "India",
    category: "Relaxation",
    description: "Relax amidst mist-capped hills, spice gardens, and bamboo forests in South India's green paradise.",
    price: 11000,
    duration: "3 days / 2 nights",
    images: [
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Shimla Mall Road, Himachal",
    country: "India",
    category: "Relaxation",
    description: "Stroll along the vehicle-free colonial Mall Road, looking at snowy mountains and Gothic churches.",
    price: 13000,
    duration: "3 days / 2 nights",
    images: [
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Mussoorie Mall Road, Uttarakhand",
    country: "India",
    category: "Relaxation",
    description: "The 'Queen of the Hills', offering views of the Doon Valley and waterfalls.",
    price: 12000,
    duration: "3 days / 2 nights",
    images: [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Kumarakom Lagoon Resort, Kerala",
    country: "India",
    category: "Relaxation",
    description: "Set on Vembanad Lake, featuring luxury lake-side cottages, bird-watching, and backwater boat rides.",
    price: 22000,
    duration: "3 days / 2 nights",
    images: [
      "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Lonavala Hill Station, Maharashtra",
    country: "India",
    category: "Relaxation",
    description: "A popular hill escape famous for green valley viewpoints, lakes, and sweet chikki candy.",
    price: 8500,
    duration: "2 days / 1 night",
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Mahabaleshwar Strawberry Farm, Maharashtra",
    country: "India",
    category: "Relaxation",
    description: "Known for its cool climate, strawberry gardens, and views of deep cliffs.",
    price: 9500,
    duration: "3 days / 2 nights",
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Panchgani Table Land, Maharashtra",
    country: "India",
    category: "Relaxation",
    description: "Famous for Table Land, a massive volcanic flat plateau overlooking green coastal valleys.",
    price: 9000,
    duration: "2 days / 1 night",
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Mount Abu Hill Station, Rajasthan",
    country: "India",
    category: "Relaxation",
    description: "The only hill station in Rajasthan, featuring Dilwara Jain temples and boating on Nakki Lake.",
    price: 11500,
    duration: "3 days / 2 nights",
    images: [
      "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Shillong Pine Forest, Meghalaya",
    country: "India",
    category: "Relaxation",
    description: "The 'Scotland of the East', featuring rolling pine hills, waterfalls, and scenic lakes.",
    price: 16500,
    duration: "4 days / 3 nights",
    images: [
      "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Cherrapunji Double Decker Root Bridge",
    country: "India",
    category: "Relaxation",
    description: "Explore the wettest place on earth, featuring living root bridges and green waterfalls.",
    price: 18000,
    duration: "4 days / 3 nights",
    images: [
      "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Pondicherry French Quarter, Tamil Nadu",
    country: "India",
    category: "Relaxation",
    description: "Stroll along quiet streets lined with yellow colonial villas, French cafes, and rocky beaches.",
    price: 9000,
    duration: "3 days / 2 nights",
    images: [
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    name: "Araku Valley Coffee Garden, Andhra",
    country: "India",
    category: "Relaxation",
    description: "A peaceful valley station covered with coffee plantations, waterfalls, and tribal museums.",
    price: 10000,
    duration: "2 days / 1 night",
    images: [
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80"
    ]
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to database for seeding...');

    // Clear existing destinations
    await Destination.deleteMany({});
    console.log('Cleared existing destinations.');

    // Insert new destinations
    await Destination.insertMany(destinationsData);
    console.log(`Successfully seeded ${destinationsData.length} Indian destinations!`);

    mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
