import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./UserProfile.css"; // Import your new CSS file

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("http://localhost:2000/profile", {
          credentials: "include",
        });
        const data = await response.json();
        if (response.ok) {
          setProfile(data);
        } else {
          alert("Failed to load profile");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({ ...prevProfile, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:2000/profile", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Profile updated successfully");
        setProfile(data);
        setEditing(false);
      } else {
        alert("Failed to update profile: " + (data.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container container">
      <h2 className="text-center mb-4 profile-title">User Profile</h2>

      {!editing ? (
        <div className="profile-info card">
          <div className="card-body text-center">
            <div className="avatar-placeholder mx-auto">
              {profile.name ? profile.name.charAt(0).toUpperCase() : "U"}
            </div>
            <h3 className="card-title mt-3 profile-name">{profile.name}</h3>
            <p className="card-text profile-bio">Bio: {profile.bio}</p>
            <button
              className="btn btn-primary mt-3"
              onClick={() => setEditing(true)}
            >
              Edit Profile
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-control"
              value={profile.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="bio" className="form-label">
              Bio:
            </label>
            <textarea
              id="bio"
              name="bio"
              className="form-control"
              value={profile.bio}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-secondary">
            Update Profile
          </button>
          <button
            type="button"
            className="btn btn-link"
            onClick={() => setEditing(false)}
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  );
};

export default UserProfile;
