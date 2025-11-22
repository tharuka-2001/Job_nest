import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API } from "../constants/config.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);

  const saveToken = async (t) => {
    setToken(t);
    if (t) await AsyncStorage.setItem("token", t);
    else await AsyncStorage.removeItem("token");
  };

  const axiosAuth = axios.create({ baseURL: API });
  axiosAuth.interceptors.request.use((config) => {
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  const login = async (email, password) => {
    const { data } = await axios.post(`${API}/auth/login`, { email, password });
    console.log(data);

    await saveToken(data.data.token);
    await fetchMe();
  };

  const register = async (email, password, role) => {
    const { data } = await axios.post(`${API}/auth/register`, {
      email,
      password,
      role,
    });
    await saveToken(data.data.token);
    await fetchMe();
  };

  const logout = async () => {
    await saveToken(null);
    setMe(null);
  };

  const fetchMe = async () => {
    if (!token) {
      setMe(null);
      return;
    }
    const { data } = await axiosAuth.get(`/profile/me`);
    setMe(data.data);
  };

  useEffect(() => {
    (async () => {
      const t = await AsyncStorage.getItem("token");
      if (t) setToken(t);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (token) fetchMe();
  }, [token]);

  return (
    <AuthContext.Provider
      value={{ token, me, setMe, login, register, logout, axiosAuth, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
