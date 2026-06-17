const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

const Testimonial = require('../models/Testimonial');
const connectDB = require('../config/db');

const testimonialsData = [
  {
    name: "Arjun Mehta",
    location: "Mumbai, Maharashtra",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    text: "Our trip to Munnar and Alleppey backwaters was absolutely flawless. The itinerary was perfectly structured and the hotel recommendations were superb. Highly recommended!",
    rating: 5
  },
  {
    name: "Priya Sharma",
    location: "New Delhi",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    text: "The Ladakh adventure bike trip planned through this platform was a life-changing experience. Every detail from permits to stay was taken care of seamlessly.",
    rating: 5
  },
  {
    name: "Aditya Verma",
    location: "Bangalore, Karnataka",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    text: "Exploring the heritage ruins of Hampi with a customized day-by-day plan made our family vacation stress-free and rich with history.",
    rating: 4
  },
  {
    name: "Anjali Nair",
    location: "Kochi, Kerala",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    text: "Om Beach, Gokarna was stunning. The budget management feature kept our group's spend in check, and the recommendations were top notch.",
    rating: 5
  },
  {
    name: "Rohan Das",
    location: "Kolkata, West Bengal",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80",
    text: "A flawless weekend getaway to Mandarmani Beach. The booking options and dynamic search results saved us hours of planning.",
    rating: 4
  },
  {
    name: "Sneha Reddy",
    location: "Hyderabad, Telangana",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80",
    text: "The tiger safaris in Jim Corbett and Ranthambore were breathtaking. Having direct access to detailed guides and schedules was super helpful.",
    rating: 5
  },
  {
    name: "Vikram Singh",
    location: "Jaipur, Rajasthan",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80",
    text: "Excellent service. The guide for Jaipur Amer Fort and Udaipur Pichola Lake palace details were extremely precise and helpful.",
    rating: 5
  },
  {
    name: "Meera Joshi",
    location: "Pune, Maharashtra",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
    text: "From white water rafting in Rishikesh to snow skiing in Auli, this smart trip planner has become my absolute go-to for all holiday plans.",
    rating: 5
  },
  {
    name: "Kabir Malhotra",
    location: "Chandigarh",
    image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80",
    text: "We planned our Golden Temple and Amritsar food tour in minutes. The autocomplete destination suggestions are extremely helpful and fast.",
    rating: 4
  },
  {
    name: "Divya Patel",
    location: "Ahmedabad, Gujarat",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80",
    text: "The Gir Lion National Park and Diu Fort beach trip was perfectly customized. Highly impressed with the interactive features and clean interface.",
    rating: 5
  }
];

const seedDB = async () => {
  try {
    await connectDB();
    await Testimonial.deleteMany();
    console.log('Cleared existing testimonials collection.');

    await Testimonial.insertMany(testimonialsData);
    console.log('Successfully seeded 10 dynamic testimonials!');

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding testimonials:', error);
    process.exit(1);
  }
};

seedDB();
