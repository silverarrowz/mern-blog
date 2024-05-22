import { useEffect, useLayoutEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Editor from "../components/Editor";

export default function EditPost() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState("");
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    fetch("http://localhost:4000/post/" + id).then((response) => {
      response.json().then((postInfo) => {
        setTitle(postInfo.title);
        setSummary(postInfo.summary);
        setContent(postInfo.content);
      });
    });
  }, []);

  async function updatePost(evt) {
    evt.preventDefault();
    const data = new FormData();
    data.set("title", title);
    data.set("summary", summary);
    data.set("content", content);
    data.set("id", id);
    if (files?.[0]) {
      data.set("file", files?.[0]);
    }

    const response = await fetch("http://localhost:4000/post/", {
      method: "PUT",
      body: data,
      credentials: "include",
    });

    if (response.ok) {
      setRedirect(true);
    }
  }

  if (redirect) {
    return <Navigate to={"/post/" + id} />;
  }

  return (
    <form onSubmit={updatePost}>
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
      <button className="form__submit-btn">Update post</button>
    </form>
  );
}
