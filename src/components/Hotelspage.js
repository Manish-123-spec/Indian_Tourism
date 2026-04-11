import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const HotelsPage = () => {
  const location = useLocation();
  const { lat, lng, city } = location.state || {};

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await axios.get(
          `https://indian-tourism-1-go4d.onrender.com/hotels?lat=${lat}&lng=${lng}`
        );
        setData(res.data);
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    if (lat && lng) fetchHotels();
  }, [lat, lng]);

  return (
    <div
      className="container-fluid d-flex align-items-center justify-content-center"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1e6c72, #33b9a3)",
        color: "white",
      }}
    >
      <div
        className="text-center p-5"
        style={{
          background: "rgba(255,255,255,0.1)",
          backdropFilter: "blur(10px)",
          borderRadius: "20px",
          width: "100%",
          maxWidth: "500px",
          boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
        }}
      >
        <h2 className="mb-3">🏨 Hotels in {city}</h2>

        {loading && <p>Loading...</p>}

        {!loading && data && (
          <>
            <p style={{ opacity: 0.8 }}>
              Discover best hotels near your location
            </p>

            <div className="d-grid gap-3 mt-4">

              {/* 🔍 Search Button */}
              <a
                href={data.searchLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-lg"
                style={{
                  background: "#00c6ff",
                  color: "white",
                  borderRadius: "10px",
                  transition: "0.3s",
                }}
                onMouseOver={(e) =>
                  (e.target.style.background = "#0072ff")
                }
                onMouseOut={(e) =>
                  (e.target.style.background = "#00c6ff")
                }
              >
                🔍 Search Hotels
              </a>

              {/* 🗺️ Map Button */}
              <a
                href={data.mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-lg"
                style={{
                  background: "#ff7e5f",
                  color: "white",
                  borderRadius: "10px",
                  transition: "0.3s",
                }}
                onMouseOver={(e) =>
                  (e.target.style.background = "#eb5757")
                }
                onMouseOut={(e) =>
                  (e.target.style.background = "#ff7e5f")
                }
              >
                🗺️ View on Map
              </a>
            </div>
          </>
        )}

        {!loading && !data && (
          <p style={{ color: "#ffb3b3" }}>
            ❌ Unable to fetch hotel links
          </p>
        )}
      </div>
    </div>
  );
};

export default HotelsPage;