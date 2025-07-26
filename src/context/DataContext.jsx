import React, { createContext, useContext, useState, useEffect } from "react";
import { apiGet } from "../utils/api";

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [sops, setSops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [notesData, sopsData] = await Promise.all([
        apiGet("/notes"),
        apiGet("/sops"),
      ]);

      setNotes(notesData);
      setSops(sopsData);
    } catch (err) {
      setError(err.message);
      console.error("Failed to load data:", err);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    loadData();
  };

  const addNote = (newNote) => {
    setNotes((prev) => [newNote, ...prev]);
  };

  const addSop = (newSop) => {
    setSops((prev) => [newSop, ...prev]);
  };

  useEffect(() => {
    loadData();
  }, []);

  const value = {
    notes,
    sops,
    loading,
    error,
    refreshData,
    addNote,
    addSop,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
