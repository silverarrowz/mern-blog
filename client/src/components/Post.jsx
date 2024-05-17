import picture from "../images/2.jpg";

const Post = () => {
  return (
    <div className="post">
      <img src={picture} alt="" />
      <div className="texts">
        <h2>Lorem ipsum dolor sit amet consectetur</h2>
        <p className="info">
          <a href="" className="author">
            Diana K.
          </a>
          <time>18-05-2024 15:31</time>
        </p>
        <p className="summary">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Expedita
          possimus ea cum, soluta at nulla eum obcaecati, minus eveniet optio
          aperiam, officiis adipisci vero fuga.
        </p>
      </div>
    </div>
  );
};

export default Post;
