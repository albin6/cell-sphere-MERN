import { createContext, useState } from "react";

export const searchContext = createContext("");

export const SearchContextProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchTermChange = (newTerm) => {
    setSearchTerm(newTerm);
  };

  return (
    <searchContext.Provider value={{ searchTerm, handleSearchTermChange }}>
      {children}
    </searchContext.Provider>
  );
};
