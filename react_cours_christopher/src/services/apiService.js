import myAxios from "../utils/interceptor";

export const getUsers = () => {
  return myAxios.get("/users");
};

export const swipeUser = (data) => {
  return myAxios.post("/swipe", data);
};

export const getMessagesBetween = (senderId, receiverId) => {
  return myAxios.get(`/messages/${senderId}/${receiverId}`);
};

export const sendMessage = (data) => {
  return myAxios.post("/sendMessage", data);
};

export const fetchMatchesApi = () => {
  return myAxios.get("/matches");
};

export const loginUser = (credentials) => {
  return myAxios.post("/login", credentials);
};

export const registerUser = (credentials) => {
  return myAxios.post("/register", credentials);
};

export const getMe = () => {
  return myAxios.get("/me");
};
