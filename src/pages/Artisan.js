import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Artisan.css";

function Artisan() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filterOption, setFilterOption] = useState("none");
   
  const navigate = useNavigate();

  function searchOnChange(e) {
    setSearchTerm(e.target.value);
  }

  // Default placeholder image URL
  const defaultImageUrl =
    "https://static.vecteezy.com/system/resources/previews/020/765/399/large_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg";

  const handleViewProfile = (e, user) => {
    e.preventDefault(); // Prevent default link behavior
    sessionStorage.setItem("selectedTradesPerson", JSON.stringify(user));
    navigate(`/profile/${user.id || user._id}`); 
  };

  // Toggle filter modal
  const toggleFilterModal = () => {
    setIsFilterModalOpen(!isFilterModalOpen);
  };

  // Apply filter based on selected option
  const applyFilter = (option) => {
    setFilterOption(option);
    
    let sortedUsers = [...filteredUsers];
    
    switch(option) {
      case "ratings":
        sortedUsers.sort((a, b) => {
          const ratingA = parseFloat(a.ratings) || 0;
          const ratingB = parseFloat(b.ratings) || 0;
          return ratingB - ratingA; // Higher ratings first
        });
        break;
      case "name":
        sortedUsers.sort((a, b) => {
          const nameA = a.full_name ? a.full_name.toLowerCase() : "";
          const nameB = b.full_name ? b.full_name.toLowerCase() : "";
          return nameA.localeCompare(nameB);
        });
        break;
      case "skills":
        sortedUsers.sort((a, b) => {
          const skillA = a.skill ? a.skill.toLowerCase() : "";
          const skillB = b.skill ? b.skill.toLowerCase() : "";
          return skillA.localeCompare(skillB);
        });
        break;
      default:
        // No sorting, use default order
        break;
    }
    
    setFilteredUsers(sortedUsers);
    setIsFilterModalOpen(false);
  };

  // Fetch users data
  useEffect(() => {
    setLoading(true);
    axios
      .get("https://skillhub-api-y3gi.onrender.com/api/users/")
      .then((response) => {
        console.log("User data:", response.data);
        setUsers(response.data);
        setFilteredUsers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setError("Failed to load users");
        setLoading(false);
      });
  }, []); // Empty dependency array means this runs once on mount

  // Handle search filtering
  useEffect(() => {
    setIsSearching(true);
    // Simulate API call delay
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim() === "") {
        setFilteredUsers(users);
      } else {
        const filtered = users.filter(
          (user) =>
            (user.full_name &&
              user.full_name
                .toLowerCase()
                .includes(searchTerm.toLowerCase())) ||
            (user.profession &&
              user.profession
                .toLowerCase()
                .includes(searchTerm.toLowerCase())) ||
            (user.expertise &&
              user.expertise.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setFilteredUsers(filtered);
      }
      setIsSearching(false);
      
      // Re-apply current filter if one is selected
      if (filterOption !== "none") {
        applyFilter(filterOption);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, users]);

  if (loading)
    return <div className="loading-container">Loading Artisans...</div>;
  if (error) return <div className="error-container">Error: {error}</div>;

  return (
    <div className="artisan-container">
      {/* Search Bar */}
      <div className="artisan-page-search-container">
        <div className="artisan-page-search-bar">
          <input
            className="artisan-search-input-field"
            type="text"
            onChange={searchOnChange}
            value={searchTerm}
            placeholder="What skill are you looking for?"
          />

          {/* Search Button */}
          <button className="artisan-page-search-button">
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
        </div>

        {/* Filter Button */}
        <button className="artisan-page-filter-button" onClick={toggleFilterModal}>
          <div className="filter-icon-container">
            <svg
              className="filter-icon"
              width="24"
              height="16"
              viewBox="0 0 24 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.33997 15.5V13H14.34V15.5H9.33997ZM4.33997 9.25V6.75H19.34V9.25H4.33997ZM0.589966 3V0.5H23.09V3H0.589966Z"
                fill="#0575E6"
              />
            </svg>
          </div>
          FILTER
        </button>
      </div>

      {/* Filter Modal */}
      {isFilterModalOpen && (
        <div className="filter-modal-overlay">
          <div className="filter-modal">
            <div className="filter-modal-header">
              <h3>Filter By</h3>
              <button className="close-modal-btn" onClick={toggleFilterModal}>
                &times;
              </button>
            </div>
            <div className="filter-options">
              <button 
                className={`filter-option ${filterOption === "ratings" ? "active" : ""}`}
                onClick={() => applyFilter("ratings")}
              >
                <i className="fa-solid fa-star"></i> Highest Ratings
              </button>
              <button 
                className={`filter-option ${filterOption === "name" ? "active" : ""}`}
                onClick={() => applyFilter("name")}
              >
                <i className="fa-solid fa-sort-alpha-down"></i> Name (A-Z)
              </button>
              <button 
                className={`filter-option ${filterOption === "skills" ? "active" : ""}`}
                onClick={() => applyFilter("skills")}
              >
                <i className="fa-solid fa-tools"></i> Skills (A-Z)
              </button>
              {filterOption !== "none" && (
                <button 
                  className="filter-option clear-filter"
                  onClick={() => applyFilter("none")}
                >
                  <i className="fa-solid fa-times"></i> Clear Filter
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Lazy loading */}
      {isSearching ? (
        <div className="loading-container">Searching...</div>
      ) : filteredUsers.length === 0 ? (
        <p className="no-artisans">No artisans found</p>
      ) : (
        // Artisan scrollable grid
        <>
          {/* Display current filter if applied */}
          {filterOption !== "none" && (
            <div className="active-filter-indicator">
              <span>Filtered by: {filterOption === "ratings" ? "Highest Ratings" : 
                                  filterOption === "name" ? "Name (A-Z)" : 
                                  filterOption === "skills" ? "Skills (A-Z)" : ""}</span>
              <button onClick={() => applyFilter("none")} className="clear-filter-btn">
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
          )}
          
          <div className="scroll-section">
            {/* Profile Cards */}
            <div className="artisan-grid">
              {filteredUsers.map((user) => (
                <div
                  key={user.id || user._id || Math.random()}
                  className="artisan-page-trade-card"
                >
                  <div className="artisan-page-trade-image">
                    <img
                      className="img"
                      src={user.photoURL || defaultImageUrl}
                      alt={user.full_name || "Artisan"}
                    />
                    {user.verified && (
                      <span className="verified-badge">
                        <i className="fa-solid fa-circle-check verification-icon"></i>
                      </span>
                    )}
                  </div>

                  {/* Trade info */}
                  <div className="artisan-page-trade-info">
                    <h3 className="artisan-page-trade-name">
                      {user.full_name}
                    </h3>
                    <p className="artisan-page-ratings">
                      {user.ratings || "No ratings yet"}
                    </p>
                    <p className="artisan-page-personP">
                      {user.skill || "Not specified"}
                    </p>

                    {/* View profile button */}
                    <a
                      href={`/profile/${user.id || user._id}`}
                      className="artisan-page-view-profile-btn"
                      onClick={(e) => handleViewProfile(e, user)}
                    >
                      View Profile
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Artisan;