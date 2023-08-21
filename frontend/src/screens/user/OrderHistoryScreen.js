import { useState, useEffect, useContext } from "react";
import { Store } from "../../Store";
import axios from "axios";

export default function OrderHistoryScreen() {
  
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    userInfo,
    cart: { payment },
  } = state;
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
        const response = await axios.get(
          `/ecom/getAllOrdersByEmail?email=${userInfo.email}`
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
      <h1>Order History</h1>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Address</th>
            <th>Product</th>
            <th>Approval</th>
            <th>Shipment</th>
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
              <td>{order.approved ? "Approved" : "Waiting For Approval"}</td>
              <td>{order.shipped ? "Shipped" : "Pending"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
