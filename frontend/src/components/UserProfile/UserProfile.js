import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [file, setFile] = useState(null);
  const [editing, setEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the current user's profile data
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

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", profile.name);
    formData.append("bio", profile.bio);
    if (file) {
      formData.append("avatar", file);
    }

    try {
      const response = await fetch("http://localhost:2000/profile", {
        method: "PUT",
        credentials: "include",
        body: formData,
      });
      const data = await response.json();
      console.log("Server response:", data); // Log server response
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
    <div className="profile-container">
      <h2>User Profile</h2>

      {!editing ? (
        <div className="profile-info">
          <div>
            <img
              src={
                profile.avatar
                  ? `http://localhost:2000/uploads/${profile.avatar}`
                  : "https://via.placeholder.com/150"
              }
              alt="User Avatar"
              className="img-fluid rounded-circle"
              style={{ width: "150px", height: "150px" }}
            />
          </div>
          <h3>{profile.name}</h3>
          <p>{profile.bio}</p>
          <button
            className="btn btn-primary mt-3"
            onClick={() => setEditing(true)}
          >
            Edit Profile
          </button>
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
          <div className="mb-3">
            <label htmlFor="avatar" className="form-label">
              Avatar:
            </label>
            <input
              type="file"
              id="avatar"
              name="avatar"
              className="form-control"
              onChange={handleFileChange}
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
