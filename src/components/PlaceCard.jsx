import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const PlaceCard = ({ place }) => {
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

        // 🔥 ML logic (most frequent)
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

  // 🔥 IMAGE LOGIC
  const imageUrl = preferredCategory
    ? `https://source.unsplash.com/400x300/?${preferredCategory}`
    : place.image;

  return (
    <Link
      to={`/place/${place.id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div className="place-card">
        <img
          src={imageUrl}
          alt={place.name}
          style={{
            width: "100%",
            height: "200px",
            objectFit: "cover",
            borderRadius: "10px"
          }}
        />

        <h3 style={{ marginTop: "10px" }}>{place.name}</h3>
      </div>
    </Link>
  );
};

export default PlaceCard;