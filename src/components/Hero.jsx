import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import '../App.css';

// 🔥 DEFAULT IMAGES (AS IT IS)
const defaultImages = [
  "https://picsum.photos/id/1018/1200/600",
  "https://picsum.photos/id/1020/1200/600",
  "https://picsum.photos/id/1043/1200/600",
  "https://picsum.photos/id/1056/1200/600",
  "https://picsum.photos/id/1069/1200/600",
  "https://picsum.photos/id/1025/1200/600",
  "https://picsum.photos/id/1031/1200/600",
  "https://picsum.photos/id/1040/1200/600",
  "https://picsum.photos/id/1016/1200/600",
  "https://picsum.photos/id/1015/1200/600",
  "https://picsum.photos/id/1003/1200/600",
  "https://picsum.photos/id/1024/1200/600",
  "https://picsum.photos/id/1035/1200/600",
  "https://picsum.photos/id/1039/1200/600",
  "https://picsum.photos/id/1050/1200/600"
];

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [heroImages, setHeroImages] = useState(defaultImages);

  const token = localStorage.getItem("token");

  let userId = "";
  if (token) {
    try {
      const decoded = jwtDecode(token);
      userId = decoded.id || decoded._id;
    } catch (err) {
      console.error("Invalid token");
    }
  }

  // 🔥 SLIDER (UNCHANGED)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [heroImages]);

  // 🔥 ML LOGIC (3 MIN DELAY)
  useEffect(() => {
    const fetchPreference = async () => {
      try {
        if (!userId) return;

        const res = await axios.get(
          `http://localhost:5000/getPreference/${userId}`
        );

        const prefs = res.data;

        if (!prefs || prefs.length === 0) return;

        const latest = prefs[prefs.length - 1];

        const currentTime = Date.now();

        // ⏳ 3 min = 180000 ms
        if (currentTime - latest.time >= 180000) {

          // 🔥 CHANGE IMAGES BASED ON CATEGORY
          const newImages = Array(10).fill(
            `https://source.unsplash.com/1200x600/?${latest.category}`
          );

          setHeroImages(newImages);
        }

      } catch (err) {
        console.error("Error fetching preference:", err);
      }
    };

    fetchPreference();

    // 🔥 AUTO CHECK EVERY 10 sec
    const interval = setInterval(fetchPreference, 10000);

    return () => clearInterval(interval);

  }, [userId]);

  return (
    <div className="hero-container">
      {heroImages.map((img, index) => (
        <img
          key={index}
          src={img}
          alt={`Slide ${index}`}
          className={`hero-slide ${index === currentIndex ? "active" : ""}`}
        />
      ))}

      <div className="hero-overlay">
        <h1 className="hero-title">Explore Incredible India 🇮🇳</h1>
        <p className="hero-subtitle">
          Discover amazing destinations across India.
        </p>
      </div>
    </div>
  );
};

export default Hero;