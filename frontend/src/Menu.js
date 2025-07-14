// src/Menu.js
import React, { useState, useEffect } from 'react';
import './Menu.css';

const Menu = () => {
  const [items, setItems] = useState([]);
  const [groupedByRestaurant, setGroupedByRestaurant] = useState({});
  const [itemCounts, setItemCounts] = useState({});
  const [showSummary, setShowSummary] = useState(false);
  const token = localStorage.getItem('token'); // user JWT

  // Fetch all items on mount
  useEffect(() => {
    fetch('https://mern-backend-b5c1.onrender.com/search')
      .then(res => res.json())
      .then(data => {
        setItems(data);
        const grouped = data.reduce((acc, item) => {
          const rest = item.restaurantName || 'Unknown Restaurant';
          if (!acc[rest]) acc[rest] = [];
          acc[rest].push(item);
          return acc;
        }, {});
        setGroupedByRestaurant(grouped);
      })
      .catch(err => console.error('Failed to fetch items', err));
  }, []);

  const increment = (id) =>
    setItemCounts(c => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const decrement = (id) =>
    setItemCounts(c => ({ ...c, [id]: Math.max(0, (c[id] || 0) - 1) }));

  const calculateGrandTotal = () =>
    items.reduce((sum, i) => sum + (itemCounts[i._id] || 0) * i.cost, 0);

// inside Menu.js

const handlePlaceOrder = async () => {
  const orders = items
    .map(item => ({
      ...item,
      quantity: itemCounts[item._id] || 0
    }))
    .filter(item => item.quantity > 0);

  try {
    const token = localStorage.getItem('token');
    // send all orders in one batch or individually per restaurant—
    // here's sending individually per item with quantity:
    await Promise.all(orders.map(item =>
      fetch('https://mern-backend-b5c1.onrender.com/order-food', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          restaurantName: item.restaurantName,
          itemName: item.itemName,
          description: item.description,
          cost: item.cost,
          imageUrl: item.imageUrl,
          quantity: item.quantity        // <-- new field
        })
      })
    ));

    alert('Your order has been placed!');
    setItemCounts({});
    setShowSummary(false);
  } catch (err) {
    console.error('Error placing orders', err);
    alert('Some items failed to order. Please try again.');
  }
};

  return (
    <section id="menu">
      <h2>Our Menu</h2>
      
      {Object.entries(groupedByRestaurant).map(([restaurant, list]) => (
        <div key={restaurant} className="restaurant-section">
          <h3 className="restaurant-name">{restaurant}</h3>
          <div className="menu-grid">
            {list.map(item => (
              <div key={item._id} className="menu-card">
                <img src={item.imageUrl} alt={item.itemName} />
                <h4>{item.itemName}</h4>
                <p>{item.description}</p>
                <div className="counter-controls">
                  <button onClick={() => decrement(item._id)}>-</button>
                  <span>{itemCounts[item._id] || 0}</span>
                  <button onClick={() => increment(item._id)}>+</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="order-footer">
        <h3>Grand Total: ₹{calculateGrandTotal()}</h3>
        <button
          onClick={() => setShowSummary(true)}
          disabled={calculateGrandTotal() === 0}
        >
          Show Order Summary
        </button>
      </div>

      {showSummary && (
        <div className="order-summary">
          <h3>Order Summary</h3>
          <ul>
            {items.map(item => {
              const qty = itemCounts[item._id] || 0;
              return qty > 0 ? (
                <li key={item._id}>
                  {item.restaurantName} — {item.itemName} x {qty} = ₹{qty * item.cost}
                </li>
              ) : null;
            })}
          </ul>
          <h4>Grand Total: ₹{calculateGrandTotal()}</h4>
          <button onClick={handlePlaceOrder}>Place Order</button>
        </div>
      )}
    </section>
  );
};

export default Menu;
