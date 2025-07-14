// src/OwnerDashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './OwnerDashboard.css';

function OwnerDashboard() {
  const [restaurantName, setRestaurantName] = useState('');
  const [foodItems, setFoodItems] = useState([]);
  const [newItem, setNewItem] = useState({
    itemName: '',
    description: '',
    price: '',
    imageUrl: ''
  });
  const [message, setMessage] = useState('');
  const [orders, setOrders] = useState([]);

  // get restaurantName from localStorage
  useEffect(() => {
    const name = localStorage.getItem('restaurantName');
    setRestaurantName(name || 'Your Restaurant');
  }, []);

  // fetch food items and orders when restaurantName is set
  useEffect(() => {
    if (!restaurantName) return;

    const fetchFoodItems = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/food-items/${restaurantName}`
        );
        setFoodItems(response.data);
      } catch (error) {
        console.error('Error fetching food items:', error);
      }
    };

    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/owner/orders/${restaurantName}`
        );
        setOrders(response.data || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchFoodItems();
    fetchOrders();
  }, [restaurantName]);

  // add new food item
  const handleAddFoodItem = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:5000/owner/add-food',
        {
          restaurantName,
          itemName: newItem.itemName,
          description: newItem.description,
          cost: newItem.price,
          imageUrl: newItem.imageUrl
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      setMessage(response.data.message);
      setFoodItems([...foodItems, response.data.foodItem]);
      setNewItem({ itemName: '', description: '', price: '', imageUrl: '' });
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error adding food item');
      console.error('Error adding food item:', error.response?.data || error.message);
    }
  };

  // delete food item
  const handleDeleteFoodItem = async (itemId) => {
    try {
      await axios.delete(
        `http://localhost:5000/owner/delete-food/${itemId}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setFoodItems(foodItems.filter(item => item._id !== itemId));
      setMessage('Food item deleted successfully');
    } catch (error) {
      setMessage('Error deleting food item');
      console.error('Error deleting food item:', error.response?.data || error.message);
    }
  };

  // delete owner account
  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account?')) return;
    try {
      await axios.delete('http://localhost:5000/owner/delete-account', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      localStorage.removeItem('restaurantName');
      localStorage.removeItem('token');
      window.location.href = '/login';
    } catch (error) {
      setMessage('Error deleting account');
      console.error('Error deleting account:', error.response?.data || error.message);
    }
  };

  // complete order
  const handleCompleteOrder = async (orderId) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/owner/complete-order/${orderId}`
      );
      setOrders(prev => prev.filter(o => o._id !== orderId));
      alert(response.data.message);
    } catch (error) {
      console.error('Error completing order:', error);
      alert('Error completing order');
    }
  };

  return (
    <div className="owner-dashboard-container">
      <h1>{restaurantName}</h1>
      <h2>Add Food Item</h2>

      <form onSubmit={handleAddFoodItem} className="owner-dashboard-form">
        <label>
          Item Name:
          <input
            type="text"
            value={newItem.itemName}
            onChange={e => setNewItem({...newItem, itemName: e.target.value})}
            required
          />
        </label>
        <label>
          Description:
          <input
            type="text"
            value={newItem.description}
            onChange={e => setNewItem({...newItem, description: e.target.value})}
            required
          />
        </label>
        <label>
          Price:
          <input
            type="number"
            value={newItem.price}
            onChange={e => setNewItem({...newItem, price: e.target.value})}
            required
          />
        </label>
        <label>
          Image URL:
          <input
            type="text"
            value={newItem.imageUrl}
            onChange={e => setNewItem({...newItem, imageUrl: e.target.value})}
          />
        </label>
        <button type="submit">Add Item</button>
      </form>
      {message && <p className="message">{message}</p>}

      <h3>Current Food Items</h3>
      <ul className="food-item-list">
        {foodItems.map(item => (
          <li key={item._id}>
            {item.imageUrl && <img src={item.imageUrl} alt={item.itemName} />}
            <span>{item.itemName} - ₹{item.cost}</span>
            <button onClick={() => handleDeleteFoodItem(item._id)}>Delete</button>
          </li>
        ))}
      </ul>

      <h3>Orders</h3>
      {orders.length > 0 ? (
        <ul className="order-list">
          {orders.map(order => (
            <li key={order._id}>
              <h4>Order ID: {order._id}</h4>
              <p>User: {order.userEmail.split('@')[0]}</p>
              <p>Item: {order.itemName}</p>
              <p>Quantity: {order.quantity}</p>
              <button onClick={() => handleCompleteOrder(order._id)}>
                Complete Order
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No current orders.</p>
      )}

      <button onClick={handleDeleteAccount} className="delete-account-button">
        Delete Account
      </button>
    </div>
  );
}

export default OwnerDashboard;
