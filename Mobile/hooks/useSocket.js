import { useEffect, useRef } from "react";
import io from "socket.io-client";
import { SOCKET_URL } from "../constants/config";

export default function useSocket(token) {
  const ref = useRef(null);
  useEffect(() => {
    if (!token) return;
    const s = io(SOCKET_URL, { auth: { token: `Bearer ${token}` } });
    ref.current = s;
    return () => s.disconnect();
  }, [token]);
  return ref;
}
