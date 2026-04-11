import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import PlaceCard from "./components/PlaceCard";
import PlaceDetail from "./components/PlaceDetail";
import Login from "./components/Login";
import PlaceRecommender from "./components/PlaceRecommender";
import Signup from "./components/Signup";
import Chatbot from "./components/Chatbot";
import Hotelspage from "./components/Hotelspage";
import places from "./data/places";

function Home() {
  return (
    <div>
      <Hero />

      <div className="container my-5">
        <h2 className="text-center mb-4">Popular Tourist Places in India 🇮🇳</h2>
        <div className="place-card-container">
          {places.map(place => <PlaceCard key={place.id} place={place} />)}
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/recommend" element={<PlaceRecommender />} />
          <Route path="/hotels" element={<Hotelspage />} />
        <Route path="/place/:id" element={<PlaceDetail />} />
      </Routes>
    </Router>
  );
}

export default App;