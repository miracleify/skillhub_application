import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./search.css";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      console.log("Searching for:", searchQuery);
      // Navigate to search results page with query parameter
      navigate(`/search-results?query=${encodeURIComponent(searchQuery)}`);
    } else {
      alert("Please enter a skill to search.");
    }
  };

  // Handle Enter key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
   <div></div>
  );
};
export default Search