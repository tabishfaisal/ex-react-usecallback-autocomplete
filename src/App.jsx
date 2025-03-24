import React, { useState, useCallback } from "react";

// Debounce function
function debounce(callback, delay) {
  let timer;
  return (value) => {
    clearTimeout(timer);
    timer = setTimeout(() => callback(value), delay);
  };
}

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // Memoized debounced search function
  const debouncedSearch = useCallback(
    debounce((searchTerm) => {
      fetch(`https://boolean-spec-frontend.vercel.app/freetestapi/products?search=${searchTerm}`)
        .then((res) => res.json())
        .then((data) => setSuggestions(searchTerm ? data : []))
        .catch(console.error);
    }, 300),
    []
  );

  // Handle input change and apply debounce
  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Insert Product Name"
        value={searchTerm}
        onChange={handleChange}
      />
      {suggestions.length > 0 && (
        <div>
          {suggestions.map((s, i) => (
            <p key={i}>{s.name}</p>
          ))}
        </div>
      )}
    </div>
  );
};

export default App;




