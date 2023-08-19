import { useState, useEffect } from "react";
import axios from "axios";

export default function OrderHistoryScreen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleApproveClick = (orderId) => {
    // Implement your logic here to handle the approve action for the order
    console.log(`Approve clicked for order ID: ${orderId}`);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/admin/getAllOrders");
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
      <h1>Order History</h1>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Address</th>
            <th>Product</th>
            <th>Delivered</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{order.name}</td>
              <td>{order.address}</td>
              <td>
                <ul>
                  {order.products.map((product, index) => (
                    <li key={index}>
                      {product.name} (Count: {product.count})
                    </li>
                  ))}
                </ul>
              </td>
              <td>{order.delivered ? "Yes" : "No"}</td>
              <td>
                <button
                  className="btn btn-primary"
                  onClick={() => handleApproveClick(order._id)}
                >
                  Approve
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
