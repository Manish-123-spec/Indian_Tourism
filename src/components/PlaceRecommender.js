import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const PlaceRecommender = () => {
  const [temp, setTemp] = useState(25);
  const [humidity, setHumidity] = useState(50);
  const [category, setCategory] = useState("beach");
  const [recommendations, setRecommendations] = useState([]);

  const navigate = useNavigate();

  // 🔥 TOKEN + USER ID
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

  // 🔐 PROTECT PAGE
  useEffect(() => {
    if (!token) {
      alert("Please login first");
      window.location.href = "/login";
    }
  }, [token]);

  // 🔥 SAVE PREFERENCE
  const savePreference = async (selectedCategory) => {
  try {
    await axios.post("https://indian-tourism-1-go4d.onrender.com/savePreference", {
      userId,
      category: selectedCategory,
      time: Date.now() // 🔥 add this
    });
  } catch (err) {
    console.error(err);
  }
};

  // 🔥 GET RECOMMENDATIONS
  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        "https://indian-tourism-1-go4d.onrender.com/recommend",
        {
          temp: parseInt(temp),
          humidity: parseInt(humidity),
          category
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setRecommendations(res.data);

    } catch (err) {
      console.error(err);

      if (err.response?.status === 401 || err.response?.status === 403) {
        alert("Session expired, please login again");
        localStorage.removeItem("token");
        window.location.href = "/login";
      } else {
        alert("Something went wrong");
      }
    }
  };

  // 🔓 LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="container my-4">

      <button className="btn btn-danger mb-3" onClick={handleLogout}>
        Logout
      </button>

      <h2>Find Your Ideal Tourist Places in India</h2>

      {/* INPUTS */}
      <div className="mb-3">
        <label>Temperature:</label>
        <input
          type="number"
          className="form-control"
          value={temp}
          onChange={(e) => setTemp(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label>Humidity:</label>
        <input
          type="number"
          className="form-control"
          value={humidity}
          onChange={(e) => setHumidity(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label>Category:</label>
        <select
          className="form-control"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="beach">Beach</option>
          <option value="adventure">Adventure</option>
          <option value="hill station">Hill Station</option>
          <option value="urban">Urban</option>
          <option value="cultural">Cultural</option>
          <option value="historic">Historic</option>
        </select>
      </div>

      <button className="btn btn-primary" onClick={handleSubmit}>
        Get Recommendations
      </button>

      {/* RESULTS */}
      <h3 className="mt-4">Recommended Places:</h3>

      <ul className="list-group">
        {recommendations.length === 0 && (
          <li className="list-group-item">No data yet</li>
        )}

        {recommendations.map((place, idx) => (
          <li
            key={idx}
            className="list-group-item"
            style={{ cursor: "pointer" }}
           onClick={async () => {
  await savePreference(place.category);

  navigate("/hotels", {
    state: {
      city: place.city,
      lat: place.latitude,
      lng: place.longitude
    }
  });
}}
          >
            <b>{place.city}, {place.state}</b> - {place.category}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlaceRecommender;