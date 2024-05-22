import { useState } from "react";
import { Navigate } from "react-router-dom";
import Editor from "../components/Editor";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState("");
  const [redirect, setRedirect] = useState(false);

  async function createNewPost(evt) {
    const data = new FormData();
    data.set("title", title);
    data.set("summary", summary);
    data.set("content", content);
    data.set("file", files[0]);
    evt.preventDefault();
    const response = await fetch("http://localhost:4000/post", {
      method: "POST",
      body: data,
      credentials: "include",
    });
    if (response.ok) {
      setRedirect(true);
    }
  }

  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <form onSubmit={createNewPost}>
      <input
        className="form__input"
        type="title"
        placeholder="Title"
        value={title}
        onChange={(evt) => setTitle(evt.target.value)}
      />
      <input
        className="form__input"
        type="summary"
        placeholder="Summary"
        value={summary}
        onChange={(evt) => setSummary(evt.target.value)}
      />
      <input
        className="form__input"
        type="file"
        onChange={(evt) => setFiles(evt.target.files)}
      />
      <Editor onChange={setContent} value={content} />
      <button className="form__submit-btn">Create post</button>
    </form>
  );
}
