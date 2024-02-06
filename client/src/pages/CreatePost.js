import React, { useContext, useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";

function CreatePost() {
  let navigate = useNavigate();

  const state = useLocation().state;
  const [value, setValue] = useState(state?.postText || "");
  const [title, setTitle] = useState(state?.title || "");
  console.log(state);

  const { authState } = useContext(AuthContext);

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
    }
  }, []);

  const onSubmit = async () => {
    if (state) {
      await axios
        .put(
          "http://localhost:3001/posts/updatepost",
          { title: title, postText: value, id: state.id },
          {
            headers: { accessToken: localStorage.getItem("accessToken") },
          }
        )
        .then((response) => {
          navigate("/");
        });
    } else {
      axios
        .post(
          "http://localhost:3001/posts",
          { title, postText: value },
          {
            headers: { accessToken: localStorage.getItem("accessToken") },
          }
        )
        .then((response) => {
          navigate("/");
        });
    }
  };

  return (
    <div className="add">
      <div className="content">
        <input
          type="text"
          placeholder="Title"
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="editorContainer">
          <ReactQuill
            className="editor"
            theme="snow"
            value={value}
            onChange={setValue}
          />
        </div>
        <button onClick={onSubmit}>Publish</button>
      </div>
    </div>
  );
}

export default CreatePost;
