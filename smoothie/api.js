import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL, 
  timeout: 2000,  
  headers: {
    'Content-Type': 'application/json',
  },
}); 

export default api