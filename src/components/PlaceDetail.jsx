import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import places from "../data/places";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const PlaceDetail = () => {
  const { id } = useParams();
  const place = places.find(p => p.id === parseInt(id));

  const [preferredCategory, setPreferredCategory] = useState("");

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

  useEffect(() => {
    const fetchPreference = async () => {
      try {
        if (!userId) return;

        const res = await axios.get(
          `http://localhost:5000/getPreference/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const prefs = res.data;

        if (!prefs || prefs.length === 0) return;

        // 🔥 ML logic
        const freq = {};
        prefs.forEach((p) => {
          freq[p] = (freq[p] || 0) + 1;
        });

        const topCategory = Object.keys(freq).reduce((a, b) =>
          freq[a] > freq[b] ? a : b
        );

        setPreferredCategory(topCategory);

      } catch (err) {
        console.error(err);
      }
    };

    fetchPreference();
  }, [userId, token]);

  if (!place) return <p>Place not found.</p>;

  // 🔥 IMAGE LOGIC
  const imageUrl = preferredCategory
    ? `https://source.unsplash.com/800x400/?${preferredCategory}`
    : place.image;

  return (
    <div className="container my-5 place-detail">

      <Link to="/" className="btn btn-primary mb-4">
        ← Back to Home
      </Link>

      <h2 className="place-title">{place.name}</h2>

      <div className="place-image-container">
        <img
          src={imageUrl}
          alt={place.name}
          className="place-image"
          style={{
            width: "100%",
            height: "400px",
            objectFit: "cover",
            borderRadius: "15px"
          }}
        />
      </div>

      <div className="place-section">
        <h4>About</h4>
        <p>{place.description}</p>
      </div>

      <div className="place-section">
        <h4>History</h4>
        <p>{place.history}</p>
      </div>

    </div>
  );
};

export default PlaceDetail;