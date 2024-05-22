import { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import { Link, useParams } from "react-router-dom";
import { AiOutlineEdit } from "react-icons/ai";

export default function ProfilePage() {
  const { userInfo, setUserInfo } = useContext(UserContext);
  const { id } = useParams();

  const currentUserId = userInfo.id;

  const [profileInfo, setProfileInfo] = useState(userInfo);

  useEffect(() => {
    fetch(`http://localhost:4000/profile/${id}`).then((response) => {
      response.json().then((profileInfo) => {
        setProfileInfo(profileInfo);
      });
    });
  }, []);

  return (
    <div className="profile">
      <div className="profile__avatar-container">
        <img
          src={`http://localhost:4000/${profileInfo.avatar}`}
          alt="Avatar"
          className="profile__avatar"
        />
      </div>
      <div className="profile__user-info">
        <h2 className="profile__username">{profileInfo.username}</h2>
        <h3 className="profile__about-me">About me:</h3>
        <p className="profile__about">{profileInfo.about}</p>
        {currentUserId === id && (
          <div className="post-page__edit-row">
            <Link className="edit-btn" to={`/edit-profile/${currentUserId}`}>
              Edit profile <AiOutlineEdit />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
