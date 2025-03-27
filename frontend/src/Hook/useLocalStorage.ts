// useLocalStorage.js
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export function useLocalStorage(key: string) {
  const token = useSelector((state) => state?.auth?.token);
  const [value, setValue] = useState(() => {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : null;
  });

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key) {
        setValue(e.newValue ? JSON.parse(e.newValue) : null);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key, token]);

  return value;
}
