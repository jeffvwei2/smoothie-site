import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000', 
  timeout: 2000,  
  headers: {
    'Content-Type': 'application/json',
  },
}); 

export default api