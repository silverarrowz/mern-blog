import { format } from "date-fns";
import { useContext, useEffect, useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import { AiOutlineEdit } from "react-icons/ai";
import { RiDeleteBin5Line } from "react-icons/ri";

export default function PostPage() {
  const [redirect, setRedirect] = useState(false);
  const [postInfo, setPostInfo] = useState(null);
  const { userInfo } = useContext(UserContext);
  const { id } = useParams();
  useEffect(() => {
    fetch(`http://localhost:4000/post/${id}`).then((response) => {
      response.json().then((postInfo) => {
        setPostInfo(postInfo);
      });
    });
  }, []);

  const handleDelete = () => {
    fetch(`http://localhost:4000/post/${id}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          console.log("Post deleted successfully");
          setRedirect(true);
        } else {
          console.error("Failed to delete post");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  if (!postInfo) return "";

  if (redirect) return <Navigate to={"/"} />;

  return (
    <div className="post-page">
      <h1 className="post-page__title">{postInfo.title}</h1>
      <time>{format(new Date(postInfo.createdAt), "MMM d, yyyy HH:mm")}</time>
      <Link to={`/profile/${postInfo.author._id}`}>
        <img
          className="post-page__avatar"
          src={`http://localhost:4000/${postInfo.author.avatar}`}
          alt="Post Author Avatar"
        />
        <div className="post-page__author">by {postInfo.author.username}</div>
      </Link>
      {userInfo.id === postInfo.author._id && (
        <div className="post-page__edit-row">
          <Link className="edit-btn" to={`/edit/${postInfo._id}`}>
            Edit this post <AiOutlineEdit />
          </Link>
          <button className="delete-btn" onClick={handleDelete}>
            <RiDeleteBin5Line />
          </button>
        </div>
      )}
      <div className="post-page__image-container">
        <img
          className="post-page__image"
          src={`http://localhost:4000/${postInfo.cover}`}
        ></img>
      </div>
      <div
        className="post-page__text"
        dangerouslySetInnerHTML={{ __html: postInfo.content }}
      />
    </div>
  );
}
