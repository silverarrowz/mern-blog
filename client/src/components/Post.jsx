import { format } from "date-fns";
import { Link } from "react-router-dom";

const Post = ({ _id, cover, title, summary, author, createdAt }) => {
  return (
    <div className="post">
      <Link className="post__img-container" to={`/post/${_id}`}>
        <img
          className="post__img"
          src={`http://localhost:4000/${cover}`}
          alt=""
        />
      </Link>
      <div className="texts">
        <Link to={`/post/${_id}`}>
          <h2 className="post__title">{title}</h2>
        </Link>
        <p className="info">
          <Link to={`/profile/${author._id}`} className="author">
            {author.username}
          </Link>
          <time>{format(new Date(createdAt), "MMM d, yyyy HH:mm")}</time>
        </p>
        <p className="summary">{summary}</p>
      </div>
    </div>
  );
};

export default Post;
