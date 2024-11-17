import React, { useState, useEffect } from "react";
import axios from "axios";

const UserProfile = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:2000/check-auth", {
          credentials: "include",
        });
        const data = await response.json();
        if (data.isAuthenticated) {
          const userProfileResponse = await axios.get("/profile");
          setUser(userProfileResponse.data);
          if (userProfileResponse.data.avatar) {
            setProfilePicture(`/uploads/${userProfileResponse.data.avatar}`);
          }
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const handleUpdateProfile = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("bio", bio);
    if (avatar) {
      formData.append("avatar", avatar);
    }

    try {
      const response = await axios.put("/profile", formData);
      if (response.status === 200) {
        setUser(response.data);
        if (response.data.avatar) {
          setProfilePicture(`/uploads/${response.data.avatar}`);
        }
        setError(null);
      } else {
        setError(`Error updating profile: ${response.status}`);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Error updating profile. Please try again.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h2 className="text-center mt-5 mb-5">Update Profile</h2>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <form onSubmit={handleUpdateProfile}>
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Bio:</label>
              <textarea
                value={bio}
                onChange={(event) => setBio(event.target.value)}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Avatar:</label>
              <input
                type="file"
                onChange={(event) => setAvatar(event.target.files[0])}
                className="form-control-file"
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Update Profile
            </button>
          </form>
          {error && <div className="alert alert-danger mt-3">{error}</div>}
        </div>
      </div>
      <h2 className="text-center mt-5 mb-5">Profile</h2>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Name: {user.name}</h5>
              <p className="card-text">Bio: {user.bio}</p>
              {profilePicture && (
                <img
                  src={profilePicture}
                  alt="Avatar"
                  className="img-fluid rounded-circle"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
