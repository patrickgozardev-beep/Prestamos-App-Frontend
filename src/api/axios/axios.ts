import axios from "axios";

const api = axios.create({
  //baseURL: "http://localhost:8080/api",
  baseURL: "http://192.168.18.6:8080/api",  
  withCredentials: true,
});

export default api;