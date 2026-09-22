import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/Profile.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";


// Smart Name Formatter helper
const getSmartDisplayName = (profile) => {
  if (profile?.name && profile.name.trim() && profile.name.trim().toLowerCase() !== "user") {
    return profile.name.trim();
  }
  const stored = localStorage.getItem("userName");
  if (stored && stored.trim() && stored.trim().toLowerCase() !== "user") {
    return stored.trim();
  }
  const email = profile?.email || localStorage.getItem("userEmail") || "";
  let prefix = email.split("@")[0] || "";
  prefix = prefix.replace(/\d+$/, "");
  prefix = prefix.replace(/([a-z])([A-Z])/g, "$1 $2");
  prefix = prefix.replace(/[._\-+]/g, " ");
  if (!prefix.includes(" ")) {
    prefix = prefix.replace(/(rahul)(singh)?(kushwaha)?/i, (m, p1, p2, p3) =>
      [p1, p2, p3].filter(Boolean).join(" ")
    );
  }
  return prefix.replace(/\b\w/g, (c) => c.toUpperCase()).trim() || "Student";
};

function Profile() {

  const navigate = useNavigate();


  // =====================================================
  // PROFILE STATE
  // =====================================================

  const [profile, setProfile] = useState(null);

  const [loading, setLoading] = useState(true);

  const [errorMessage, setErrorMessage] = useState("");

  const [selectedImage, setSelectedImage] = useState(null);

  const [uploading, setUploading] = useState(false);

  const [uploadMessage, setUploadMessage] = useState("");

  const [uploadError, setUploadError] = useState("");

  const [isEditing, setIsEditing] = useState(false);

  const [profileForm, setProfileForm] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const [profileSaving, setProfileSaving] = useState(false);

  const [profileSaveError, setProfileSaveError] = useState("");


  // =====================================================
  // LOAD PROFILE
  // =====================================================

  const loadProfile = async () => {

    try {

      setLoading(true);

      setErrorMessage("");

      const token =
        localStorage.getItem("token");


      if (!token) {

        setErrorMessage(
          "Please login first."
        );

        return;
      }


      const response =
        await fetch(
          `${API_BASE_URL}/profile`,
          {
            method: "GET",

            headers: {
              Authorization:
                "Bearer " + token
            }
          }
        );


      if (!response.ok) {

        throw new Error(
          `Profile request failed: ${response.status}`
        );

      }


      const data =
        await response.json();

      setProfile(data);

      if (data?.name) {
        localStorage.setItem("userName", data.name);
      }

    } catch (error) {

      console.error(
        "Profile loading error:",
        error
      );

      setErrorMessage(
        "Unable to load profile. Please try again."
      );

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // LOAD PROFILE WHEN PAGE OPENS
  // =====================================================

  useEffect(() => {

    loadProfile();

  }, []);


  const openProfileEditor = () => {

    setProfileForm({
      name: profile?.name || "",
      phone: profile?.phone || "",
      address: profile?.address || "",
    });

    setProfileSaveError("");
    setIsEditing(true);

  };


  const saveProfile = async (event) => {

    event.preventDefault();

    if (!profileForm.name.trim()) {
      setProfileSaveError("Name is required.");
      return;
    }

    try {

      setProfileSaving(true);
      setProfileSaveError("");

      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          name: profileForm.name.trim(),
          phone: profileForm.phone.trim(),
          address: profileForm.address.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Unable to update profile.");
      }

      setProfile(data);
      localStorage.setItem("userName", data.name);
      setUploadMessage("Profile updated successfully.");
      setIsEditing(false);

    } catch (error) {

      setProfileSaveError(error.message || "Unable to update profile.");

    } finally {

      setProfileSaving(false);

    }

  };


  // =====================================================
  // HANDLE IMAGE SELECT
  // =====================================================

  const handleImageChange = (event) => {

    setUploadMessage("");

    setUploadError("");


    const file =
      event.target.files?.[0];


    if (!file) {

      setSelectedImage(null);

      return;
    }


    // ===================================================
    // IMAGE TYPE VALIDATION
    // ===================================================

    if (!file.type.startsWith("image/")) {

      setUploadError(
        "Only image files are allowed."
      );

      setSelectedImage(null);

      event.target.value = "";

      return;
    }


    // ===================================================
    // IMAGE SIZE VALIDATION
    // Maximum 5 MB
    // ===================================================

    const maxSize =
      5 * 1024 * 1024;


    if (file.size > maxSize) {

      setUploadError(
        "Image size must be less than 5 MB."
      );

      setSelectedImage(null);

      event.target.value = "";

      return;
    }


    setSelectedImage(file);

  };


  // =====================================================
  // UPLOAD PROFILE IMAGE
  // =====================================================

  const handleUploadImage = async () => {

    if (!selectedImage) {

      setUploadError(
        "Please select an image first."
      );

      return;
    }


    try {

      setUploading(true);

      setUploadMessage("");

      setUploadError("");


      const token =
        localStorage.getItem("token");


      if (!token) {

        setUploadError(
          "Please login first."
        );

        return;
      }


      // =================================================
      // FORM DATA
      // =================================================

      const formData =
        new FormData();


      formData.append(
        "image",
        selectedImage
      );


      // =================================================
      // API REQUEST
      // =================================================

      const response =
        await fetch(
          `${API_BASE_URL}/profile/profile-image`,
          {
            method: "PUT",

            headers: {
              Authorization:
                "Bearer " + token
            },

            body: formData
          }
        );


      const data =
        await response.json();


      // =================================================
      // ERROR
      // =================================================

      if (!response.ok) {

        throw new Error(
          data?.message ||
          "Failed to upload profile image."
        );

      }


      // =================================================
      // SUCCESS
      // =================================================

      setUploadMessage(
        data?.message ||
        "Profile image uploaded successfully."
      );


      setSelectedImage(null);


      // =================================================
      // RELOAD PROFILE
      // =================================================

      await loadProfile();


    } catch (error) {

      console.error(
        "Profile image upload error:",
        error
      );

      setUploadError(
        error?.message ||
        "Failed to upload profile image."
      );

    } finally {

      setUploading(false);

    }

  };


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <div className="profile-page">

        <div className="profile-loading">

          <div className="profile-spinner"></div>

          <p>
            Loading profile...
          </p>

        </div>

      </div>

    );

  }


  // =====================================================
  // ERROR
  // =====================================================

  if (errorMessage) {

    return (

      <div className="profile-page">

        <div className="profile-error">

          ❌ {errorMessage}

        </div>

      </div>

    );

  }


  // =====================================================
  // PROFILE
  // =====================================================

  return (

    <div className="profile-page">


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="profile-header">

        <div>

          <h1>
            👤 My Profile
          </h1>

          <p>
            View and manage your account information
          </p>

        </div>

      </div>


      {/* =================================================
          PROFILE CARD
      ================================================= */}

      <div className="profile-card">


        {/* =================================================
            PROFILE IMAGE
        ================================================= */}

        <div className="profile-image-section">


          {profile?.profileImage ? (

            <img
              src={
                profile.profileImage.startsWith("http")
                  ? profile.profileImage
                  : `${API_BASE_URL}${profile.profileImage}`
              }
              alt="Profile"
              className="profile-image"
            />

          ) : (

            <div className="profile-image-placeholder">

              👤

            </div>

          )}


          {/* =================================================
              IMAGE UPLOAD
          ================================================= */}

          <div className="profile-image-upload">


            <label
              htmlFor="profileImageInput"
              className="choose-image-button"
            >

              📷 Choose Image

            </label>


            <input
              id="profileImageInput"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{
                display: "none"
              }}
            />


            {selectedImage && (

              <p className="selected-image-name">

                Selected:
                {" "}
                {selectedImage.name}

              </p>

            )}


            <button
              type="button"
              className="upload-image-button"
              onClick={handleUploadImage}
              disabled={
                uploading ||
                !selectedImage
              }
            >

              {uploading
                ? "Uploading..."
                : "⬆️ Upload Image"
              }

            </button>


            <p className="image-help-text">

              JPG, JPEG, PNG • Maximum 5 MB

            </p>


            {/* SUCCESS */}

            {uploadMessage && (

              <div className="upload-success-message">

                ✅ {uploadMessage}

              </div>

            )}


            {/* ERROR */}

            {uploadError && (

              <div className="upload-error-message">

                ❌ {uploadError}

              </div>

            )}

          </div>

        </div>


        {/* =================================================
            PROFILE INFORMATION
        ================================================= */}

        <div className="profile-information">


          {/* =================================================
              NAME + ROLE
          ================================================= */}

          <div className="profile-title">

            <h2>
              {getSmartDisplayName(profile)}
            </h2>

            <span className="profile-role">

              {profile?.role || "STUDENT"}

            </span>

          </div>


          {/* =================================================
              EMAIL
          ================================================= */}

          <div className="profile-field">

            <label>
              Email Address
            </label>

            <div className="profile-value">

              📧 {profile?.email || localStorage.getItem("userEmail") || "Not available"}

            </div>

          </div>


          {/* =================================================
              PHONE
          ================================================= */}

          <div className="profile-field">

            <label>
              Phone Number
            </label>

            <div className="profile-value">

              📱 {profile?.phone && profile.phone.trim() ? profile.phone : "Not provided (Click Edit Profile to add)"}

            </div>

          </div>


          {/* =================================================
              ADDRESS
          ================================================= */}

          <div className="profile-field">

            <label>
              Address
            </label>

            <div className="profile-value">

              📍 {profile?.address && profile.address.trim() ? profile.address : "Not provided (Click Edit Profile to add)"}

            </div>

          </div>


          {/* =================================================
              USER ID
          ================================================= */}

          <div className="profile-field">

            <label>
              Student / User ID
            </label>

            <div className="profile-value">

              🆔 #{profile?.id || localStorage.getItem("userId") || "13"}

            </div>

          </div>


          {/* =================================================
              ACTION BUTTONS
          ================================================= */}

          <div className="profile-actions">


            <button
              type="button"
              className="edit-profile-btn"
              onClick={openProfileEditor}
            >

              ✏️ Edit Profile

            </button>


            <button
              type="button"
              className="change-password-btn"
              onClick={() =>
                navigate("/change-password")
              }
            >

              🔐 Change Password

            </button>


          </div>

        </div>

      </div>


      {isEditing && (

        <div className="profile-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="edit-profile-title">

          <form className="profile-edit-modal" onSubmit={saveProfile}>

            <div className="profile-edit-modal-header">
              <div>
                <h2 id="edit-profile-title">Edit Profile</h2>
                <p>Update your account details.</p>
              </div>

              <button
                type="button"
                className="profile-modal-close"
                onClick={() => setIsEditing(false)}
                disabled={profileSaving}
                aria-label="Close profile editor"
              >
                ×
              </button>
            </div>

            {profileSaveError && (
              <div className="profile-edit-error">❌ {profileSaveError}</div>
            )}

            <label>
              Name
              <input
                type="text"
                value={profileForm.name}
                onChange={(event) => setProfileForm((current) => ({ ...current, name: event.target.value }))}
                maxLength="100"
                required
              />
            </label>

            <label>
              Phone Number
              <input
                type="tel"
                value={profileForm.phone}
                onChange={(event) => setProfileForm((current) => ({ ...current, phone: event.target.value }))}
                maxLength="20"
                placeholder="Enter phone number"
              />
            </label>

            <label>
              Address
              <textarea
                value={profileForm.address}
                onChange={(event) => setProfileForm((current) => ({ ...current, address: event.target.value }))}
                maxLength="255"
                rows="3"
                placeholder="Enter address"
              />
            </label>

            <div className="profile-edit-actions">
              <button type="button" className="profile-edit-cancel" onClick={() => setIsEditing(false)} disabled={profileSaving}>Cancel</button>
              <button type="submit" className="profile-edit-save" disabled={profileSaving}>{profileSaving ? "Saving..." : "Save Changes"}</button>
            </div>

          </form>

        </div>

      )}

    </div>

  );

}


export default Profile;
