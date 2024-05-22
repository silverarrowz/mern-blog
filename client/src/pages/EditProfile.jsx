import { useContext, useState, useEffect } from "react";
import { UserContext } from "../UserContext";
import { Link, Navigate, useParams } from "react-router-dom";

export default function EditProfile() {
  const { userInfo, setUserInfo } = useContext(UserContext);
  const { id } = useParams();

  const [username, setUsername] = useState(userInfo.username || "");
  const [about, setAbout] = useState(userInfo.about || "");
  const [avatar, setAvatar] = useState(userInfo.avatar || "");
  const [avatarPreview, setAvatarPreview] = useState(userInfo.avatar);

  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    setUsername(userInfo.username);
    setAbout(userInfo.about);
    setAvatar(userInfo.avatar);
    setAvatarPreview(userInfo.avatar);
  }, [userInfo]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.set("username", username);
    formData.set("about", about);
    if (avatar) {
      formData.set("file", avatar);
    }
    formData.set("id", userInfo.id);

    const response = await fetch("http://localhost:4000/profile/", {
      method: "PUT",
      body: formData,
      credentials: "include",
    });

    if (response.ok) {
      const updatedUserInfo = await response.json();
      setUserInfo(updatedUserInfo);
      console.log(updatedUserInfo);
      console.log(id);
      setRedirect(true);
    } else {
      alert("Failed to update profile");
    }
  };

  if (redirect) return <Navigate to={"/profile/" + id} />;

  return (
    <div className="edit-profile">
      <form onSubmit={handleSave} className="edit-profile__form">
        <div className="edit-profile__avatar-container">
          <img
            src={avatarPreview}
            alt="Avatar Preview"
            className="edit-profile__avatar-preview"
          />
          <input
            type="file"
            onChange={handleAvatarChange}
            className="edit-profile__avatar-input"
          />
        </div>
        <div className="edit-profile__user-info">
          <label htmlFor="username" className="edit-profile__label">
            Username:
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="edit-profile__input"
          />
          <label htmlFor="about" className="edit-profile__label">
            About:
          </label>
          <textarea
            id="about"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            className="edit-profile__textarea"
          />
          <button type="submit" className="edit-profile__save-btn">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
