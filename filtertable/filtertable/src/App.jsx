
import React, { useState, useMemo, useCallback, useEffect } from "react";
import "./App.css";

const FilterableProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState("default");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]); // Cart state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://fakestoreapi.com/products");
        const data = await response.json();
        setProducts(data);
        const uniqueCategories = [
          "all",
          ...new Set(data.map((product) => product.category)),
        ];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    filtered = filtered.filter((product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortOrder === "lowToHigh") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "highToLow") {
      filtered.sort((a, b) => b.price - a.price);
    }

    return filtered;
  }, [products, searchTerm, selectedCategory, sortOrder]);

  const addToCart = useCallback((product) => {
    setCart((prevCart) => {
      const isAlreadyInCart = prevCart.find((item) => item.id === product.id);
      if (isAlreadyInCart) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCart((prevCart) => {
      const productInCart = prevCart.find((item) => item.id === productId);
      if (productInCart && productInCart.quantity > 1) {
        return prevCart.map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        );
      }
      return prevCart.filter((item) => item.id !== productId);
    });
  }, []);

  const clearSearch = useCallback(() => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSortOrder("default");
  }, []);

  if (loading) {
    return <p>Loading products...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="container">
      <h1>Product List</h1>
      <div className="filters">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search products..."
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="default">Sort by</option>
          <option value="lowToHigh">Price: Low to High</option>
          <option value="highToLow">Price: High to Low</option>
        </select>
        <button onClick={clearSearch}>Clear Filters</button>
      </div>
      <p>Count: {filteredAndSortedProducts.length}</p>
      <ul className="product-list">
        {filteredAndSortedProducts.map((product) => (
          <li key={product.id} className="product-item">
            <img
              src={product.image}
              alt={product.title}
              className="product-image"
            />
            <div>
              <h3>{product.title}</h3>
              <p>{product.description}</p>
              <p className="product-price">Price: ${product.price}</p>
              <p className="product-rating">
                Rating: {product.rating.rate} ({product.rating.count} reviews)
              </p>
              <button
                className="add-to-cart"
                onClick={() => addToCart(product)}
              >
                Add to Cart
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className="cart">
        <h2>Cart</h2>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <ul>
            {cart.map((item) => (
              <li key={item.id} className="cart-item">
                <span>
                  {item.title} - ${item.price} x {item.quantity}
                </span>
                <div>
                  <button
                    className="add-to-cart"
                    onClick={() => addToCart(item)}
                  >
                    +
                  </button>
                  <button
                    className="remove-from-cart"
                    onClick={() => removeFromCart(item.id)}
                  >
                    -
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FilterableProductList;


