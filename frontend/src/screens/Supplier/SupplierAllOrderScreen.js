import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function AllOrdersScreen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleApproveClick = async (orderId) => {
    try {
      // Send an API request to update the order's approval status in the database
      console.log("req will be sent");
      const response = await axios.post("http://localhost:4000/supplier/shipOrder", {
        order_id: orderId,
      });
      console.log("req sent");
        if (response.data.success) {
            console.log("hey");
        // Update the order's approved status in the local state
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.order_id === orderId ? { ...order, shipped: true } : order
          )
        );
      }
    } catch (error) {
        toast.error("Internal error occured");
      console.error("Error approving order:", error);
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        
        const response = await axios.get(
          "http://localhost:4000/supplier/getAllOrders"
        );
        
        setOrders(response.data.orders);
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
      <h1 className="centered-container">Order History</h1>
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

              <th>Actions</th>
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

                <td>
                  {order.shipped ? (
                    <span>Shipped</span>
                  ) : (
                    <button
                      className="btn btn-primary"
                      onClick={() => handleApproveClick(order.order_id)}
                    >
                      Ship
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
