import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getUsers, swipeUser } from "../../services/apiService";
import "./Home.css";

const Home = () => {
  const { user } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animation, setAnimation] = useState("");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    getUsers()
      .then((res) => {
        const otherUsers = res.data.filter((u) => {
          if (u._id === user?._id) return false;
          return !(user?.likedUsers && user.likedUsers.includes(u._id));
        });
        setUsers(otherUsers);
      })
      .catch((err) => console.error("Erreur:", err));
  }, [user]);

  const handleDislike = () => {
    setAnimation("slide-left");
    setTimeout(() => {
      setAnimation("");
      setFeedback("");
      setCurrentIndex((prev) => prev + 1);
    }, 500);
  };

  const handleLike = () => {
    setAnimation("slide-right");
    swipeUser({
      swiperId: user?._id,
      targetId: users[currentIndex]._id,
      swipeType: "like",
    })
      .then((res) => {
        setFeedback(res.data.message);
      })
      .catch((err) => {
        console.error("Erreur lors du like:", err);
        setFeedback("Erreur lors du swipe");
      });
    setTimeout(() => {
      setAnimation("");
      setTimeout(() => setFeedback(""), 2000);
      setCurrentIndex((prev) => prev + 1);
    }, 500);
  };

  if (!users.length || currentIndex >= users.length) {
    return (
      <div className="home-container">
        <h2>No profile</h2>
      </div>
    );
  }

  const displayedUser = users[currentIndex];

  return (
    <div className="home-container">
      <div className={`user-card ${animation}`}>
        <h3>{displayedUser.email}</h3>
      </div>
      <div className="buttons">
        <button className="dislike-button" onClick={handleDislike}>
          Dislike
        </button>
        <button className="like-button" onClick={handleLike}>
          Like
        </button>
      </div>
      {feedback && <div className="feedback-message">{feedback}</div>}
    </div>
  );
};

export default Home;
