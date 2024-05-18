import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Navigate } from "react-router-dom";

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
];

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
      <ReactQuill
        className="form__textarea"
        value={content}
        onChange={setContent}
        modules={modules}
        formats={formats}
      />
      <button className="form__submit-btn">Create post</button>
    </form>
  );
}
