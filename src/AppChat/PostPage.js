import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function PostPage() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      username: "john_doe",
      image: "https://via.placeholder.com/400x250",
      caption: "Beautiful day at the park!",
      likes: 0,
      dislikes: 0,
    },
    {
      id: 2,
      username: "jane_smith",
      image: "https://via.placeholder.com/400x250",
      caption: "Had an amazing dinner tonight 🍝",
      likes: 0,
      dislikes: 0,
    },
    {
      id: 3,
      username: "alex_89",
      image: "https://via.placeholder.com/400x250",
      caption: "Exploring new places 🌍",
      likes: 0,
      dislikes: 0,
    },
  ]);

  const handleLike = (id) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  const handleDislike = (id) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id ? { ...post, dislikes: post.dislikes + 1 } : post
      )
    );
  };

  return (
    <div className="container py-4" style={{ backgroundColor: "#121212", minHeight: "100vh", color: "#fff" }}>
      <h2 className="mb-4 text-center">Friends' Posts</h2>
      <div className="row">
        {posts.map((post) => (
          <div key={post.id} className="col-md-6 mb-4">
            <div className="card bg-dark text-light shadow-lg">
              <div className="card-body">
                <h5 className="card-title">@{post.username}</h5>
                <img
                  src={post.image}
                  alt="Post"
                  className="img-fluid rounded mb-3"
                />
                <p>{post.caption}</p>
                <div className="d-flex justify-content-between">
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => handleLike(post.id)}
                  >
                    👍 Like {post.likes}
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDislike(post.id)}
                  >
                    👎 Dislike {post.dislikes}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
