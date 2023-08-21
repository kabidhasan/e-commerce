import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ApprovedOrdersScreen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:4000/supplier/getAllShippedOrders");
        setOrders(response.data.shippedOrders);
        setLoading(false);
      } catch (error) {
        setError("An error occurred while fetching orders.");
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div>
      <h1 className="centered-container">Shipped Orders</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Name</th>
              <th>Address</th>
              <th>Products</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.order_id}>
                <td>{order.order_id}</td>
                <td>{order.name}</td>
                <td style={{ whiteSpace: "pre-line" }}>{order.address}</td>
                <td>
                  <ul>
                    <li>Honey Nut (Count: {order.item1})</li>
                    <li>Gawa Ghee (Count: {order.item2})</li>
                    <li>Black Seed Honey (Count: {order.item3})</li>
                  </ul>
                </td>
                <td>{order.amount} Tk</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
