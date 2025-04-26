import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaBriefcase,
  FaMedal,
} from "react-icons/fa";
import "./ProfilePage.css"; // Make sure to create this CSS file
import "./search.css";

const ProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get the profile data from sessionStorage
    const storedProfile = sessionStorage.getItem("selectedProfile");

    if (storedProfile) {
      const parsedProfile = JSON.parse(storedProfile);

      // Verify that the ID in the URL matches the stored profile ID
      if (parsedProfile.id.toString() === id) {
        setProfileData(parsedProfile);
        setLoading(false);
      } else {
        // If IDs don't match, try to find the correct profile
        // This would normally be an API call in a real app
        console.log("Profile ID mismatch, would fetch from API in a real app");
        // For now, redirect back to trades
        navigate("/trades");
      }
    } else {
      // If no stored profile, would fetch from API in a real app
      console.log("No stored profile, would fetch from API in a real app");
      // For now, redirect back to trades
      navigate("/trades");
    }
  }, [id, navigate]);

  if (loading) {
    return <div className="loading-container">Loading profile...</div>;
  }

  if (!profileData) {
    return <div className="error-container">Profile not found</div>;
  }

  return (
    <>
      <div className="profile-container">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-image-container">
            <img
              src={profileData.image}
              alt={profileData.name}
              className="profile-image"
            />
            {profileData.verified && (
              <span className="verified-badge-large">
                <i className="fa-solid fa-circle-check verification-icon-large"></i>
              </span>
            )}
          </div>

          <div className="profile-header-info">
            <h1>{profileData.name}</h1>
            <p className="profession">{profileData.profession}</p>
            <p className="ratings">{profileData.ratings}</p>
            <p className="location">
              <FaMapMarkerAlt className="icon" /> {profileData.location}
            </p>
          </div>
        </div>

        {/* Main Profile Body */}
        <div className="profile-body">
          <div className="profile-section">
            <h2>About</h2>
            <p>{profileData.biography}</p>
          </div>

          <div className="profile-section">
            <h2>Expertise</h2>
            <p>{profileData.expertise}</p>
          </div>

          <div className="profile-section">
            <h2>Contact Information</h2>
            <p>
              <FaPhone className="icon" /> {profileData.phone}
            </p>
            <p>
              <FaEnvelope className="icon" /> {profileData.email}
            </p>
          </div>

          <div className="profile-section">
            <h2>Experience</h2>
            <p>
              <FaBriefcase className="icon" /> Completed Jobs:{" "}
              {profileData.completedJobs}
            </p>
          </div>
        </div>

        <div className="profile-actions">
          <button className="contact-btn primary">Contact Now</button>
          <button className="contact-btn secondary">Book Service</button>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
