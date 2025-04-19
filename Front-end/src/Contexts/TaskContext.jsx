// import { createContext, useContext, useState, useEffect } from 'react';
// import axios from 'axios';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const login = async (credentials) => {
//     const { data } = await axios.post('http://localhost:8000/api/auth/login', credentials);
//     localStorage.setItem('token', data.token);
//     setUser(data.user);
//   };

//   const register = async (credentials) => {
//     const { data } = await axios.post('http://localhost:8000/api/auth/register', credentials);
//     localStorage.setItem('token', data.token);
//     setUser(data.user);
//   };

//   const logout = async () => {
//     await axios.post('http://localhost:8000/api/auth/logout', {}, {
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem('token') }`
//       }
//     });
//     localStorage.removeItem('token');
//     setUser(null);
//   };

//   useEffect(() => {
//     const loadUser = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         if (token) {
//           const { data } = await axios.get('http://localhost:8000/api/auth/user', {
//             headers: {
//               Authorization: `Bearer ${token}`
//             }
//           });
//           setUser(data);
//         }
//       } catch (error) {
//         localStorage.removeItem('token');
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadUser();
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user, login, register, logout, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);