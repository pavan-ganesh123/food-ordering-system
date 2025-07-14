// src/MyOrders.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://mern-backend-b5c1.onrender.com/orders', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data.orders || []);
      } catch (error) {
        setError('Failed to fetch orders');
      }
    };
    fetchOrders();
  }, []);

  const handleDismiss = (orderId) => {
    setOrders(prev => prev.filter(order => order._id !== orderId));
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>My Orders</h2>
      {error && <p style={styles.error}>{error}</p>}
      {orders.length === 0 ? (
        <p style={styles.noOrders}>No orders found.</p>
      ) : (
        <ul style={styles.orderList}>
          {orders.map((order) => (
            <li key={order._id} style={styles.orderItem}>
              <p style={styles.orderId}>Order ID: {order._id}</p>
              <p style={styles.status}>Status: {order.status || 'pending'}</p>
              <p style={styles.items}>
                Item: {order.itemName} — Quantity: {order.quantity}
              </p>
              {order.status === 'completed' && (
                <button
                  style={styles.dismissButton}
                  onClick={() => handleDismiss(order._id)}
                >
                  Dismiss
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#f9f9f9',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    textAlign: 'center',
    color: '#333',
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  error: {
    color: 'red',
    textAlign: 'center',
  },
  noOrders: {
    textAlign: 'center',
    color: '#555',
    fontSize: '18px',
  },
  orderList: {
    listStyleType: 'none',
    padding: 0,
  },
  orderItem: {
    backgroundColor: '#ffffff',
    padding: '15px',
    borderRadius: '5px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    marginBottom: '15px',
    transition: 'transform 0.2s',
    position: 'relative',
  },
  orderId: {
    color: '#555',
    fontSize: '16px',
    fontWeight: 'bold',
  },
  status: {
    color: '#4CAF50',
    fontSize: '15px',
    fontStyle: 'italic',
  },
  items: {
    color: '#777',
    fontSize: '14px',
  },
  dismissButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    backgroundColor: '#f44336',
    color: '#fff',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '3px',
    cursor: 'pointer',
  }
};

export default MyOrders;
