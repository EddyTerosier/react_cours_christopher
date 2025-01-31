import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./Home.css";
import axios from "axios";

const Home = () => {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [users, setUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animation, setAnimation] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:4000/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Erreur:", err));
  }, []);

  const handleDislike = () => {
    setAnimation("slide-left");
    setTimeout(() => {
      setAnimation("");
      setCurrentIndex((prev) => prev + 1);
    }, 500);
  };

  const handleLike = () => {
    setAnimation("slide-right");
    setTimeout(() => {
      setAnimation("");
      setCurrentIndex((prev) => prev + 1);
    }, 500);
  };

  if (!users.length || currentIndex >= users.length) {
    return (
      <div className="home-container">
        <h2>Aucun profil à afficher</h2>
      </div>
    );
  }

  const user = users[currentIndex];

  return (
    <div className="home-container">
      <div className={`user-card ${animation}`}>
        <h3>{user.email}</h3>
      </div>
      <div className="buttons">
        <button className="dislike-button" onClick={handleDislike}>
          Dislike
        </button>
        <button className="like-button" onClick={handleLike}>
          Like
        </button>
      </div>
    </div>
  );
};

export default Home;
