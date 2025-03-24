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
  const [clickedProduct,setClickedProduct] = useState(null);

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

  // Handle clicked Product
  const handleClick = (id) =>{
    fetch(`https://boolean-spec-frontend.vercel.app/freetestapi/products/${id}`)
    .then(res => res.json())
    .then(data => {
      setClickedProduct(data);
      setSearchTerm('');
      setSuggestions([]);
    })
    .catch(error => console.error(error))
  }

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
            <p key={i} onClick={()=>handleClick(s.id)}>{s.name}</p>
          ))}
        </div>
      )}
     {clickedProduct && (
        <div>
          <h1>{clickedProduct.name}</h1>
          <img src={clickedProduct.image} alt={clickedProduct.name} />
          <p>{clickedProduct.description}</p>
          <p><strong>Price:</strong> {clickedProduct.price}€</p>
        </div>
      )}
    </div>
  );
};

export default App;




