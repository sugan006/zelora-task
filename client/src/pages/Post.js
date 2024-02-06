import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import moment from "moment";

function Post() {
  let { id } = useParams();
  const [postObject, setPostObject] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const { authState } = useContext(AuthContext);
  let navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:3001/posts/byId/${id}`).then((response) => {
      setPostObject(response.data);
    });
    axios.get(`http://localhost:3001/comments/${id}`).then((response) => {
      setComments(response.data);
    });
  }, []);

  const addComment = () => {
    axios
      .post(
        "http://localhost:3001/comments",
        { commentBody: newComment, PostId: id },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      )
      .then((response) => {
        if (response.data.error) {
          alert(response.data.error);
        } else {
          const commentToAdd = {
            commentBody: newComment,
            username: response.data.username,
          };
          setComments([...comments, commentToAdd]);
          setNewComment("");
        }
      });
  };

  const deleteComment = (id) => {
    axios
      .delete(`http://localhost:3001/comments/${id}`, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then(() => {
        setComments(
          comments.filter((val) => {
            return val.id != id;
          })
        );
      });
  };

  const deletePost = (id) => {
    axios
      .delete(`http://localhost:3001/posts/${id}`, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then(() => {
        navigate("/");
      });
  };

  const editPost = (option) => {
    // if (option === "title") {
    //   let newTitle = prompt("Enter new Title");
    //   axios.put(
    //     "http://localhost:3001/posts/title",
    //     {
    //       newTitle: newTitle,
    //       id: id,
    //     },
    //     { headers: { accessToken: localStorage.getItem("accessToken") } }
    //   );
    //   setPostObject({ ...postObject, title: newTitle });
    // } else {
    //   let newPostText = prompt("Enter new PostText");
    //   axios.put(
    //     "http://localhost:3001/posts/postText",
    //     {
    //       newPostText: newPostText,
    //       id: id,
    //     },
    //     { headers: { accessToken: localStorage.getItem("accessToken") } }
    //   );
    //   setPostObject({ ...postObject, postText: newPostText });
    // }
  };

  const getText = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent;
  };

  // const onEdit = (id) => {
  //   axios
  //     .post(
  //       "http://localhost:3001/posts/updatepost",
  //       { title, postText: value, id: id },
  //       {
  //         headers: { accessToken: localStorage.getItem("accessToken") },
  //       }
  //     )
  //     .then((response) => {
  //       navigate("/");
  //     });
  // };

  return (
    <div className="postPage">
      <div className="leftSide">
        <div className="post" id="individual">
          <div className="head">
            <div className="title">{postObject.title}</div>
            {authState.username === postObject.username && (
              <>
                <EditIcon
                  className="edit-icon"
                  onClick={() => {
                    navigate(`/createpost?edit=${postObject.id}`, {
                      state: postObject,
                    });
                  }}
                />
                <DeleteIcon
                  className="delete-icon"
                  onClick={() => {
                    deletePost(postObject.id);
                  }}
                />
              </>
            )}
          </div>

          <div className="info">
            <h3>{postObject.username}</h3>
            <p>Posted {moment(postObject.createdAt).fromNow()}</p>
          </div>
          <div className="body">{getText(postObject.postText)}</div>
        </div>
      </div>
      <div className="rightSide">
        <div className="addCommentContainer">
          <input
            type="text"
            placeholder="Comment...."
            autoComplete="off"
            value={newComment}
            onChange={(event) => {
              setNewComment(event.target.value);
            }}
          />
          <button onClick={addComment}>Add Comment</button>
        </div>
        <div className="listOfComments">
          {comments.map((comment, key) => {
            return (
              <div key={key} className="comment">
                <div className="comment-body">
                  <p>{comment.commentBody}</p>
                  <label> Username: {comment.username} </label>
                </div>

                <div className="comment-delete">
                  {authState.username === comment.username && (
                    <DeleteIcon
                      className="comment-delete-icon"
                      onClick={() => {
                        deleteComment(comment.id);
                      }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Post;
