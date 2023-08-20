import { useEffect, useState, useContext } from "react";
import Button from "react-bootstrap/esm/Button";
import { useNavigate } from "react-router";
import { Store } from "../../Store";
import axios from "axios";
function SupplierHomeScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const [selectedTab, setSelectedTab] = useState("all"); // State to track the selected tab

  const shippedHandler = (e) => {
    navigate("/shippedorders");
  };
  const pendingHandler = (e) => {
    navigate("/pendingorderssupplier");
  };
  const allOrderHandler = () => {
    navigate("/allorderssupplier");
  };
  const logOutHandler = async () => {
    try {
      // Make an API call to log out the supplier
      //await axios.get("http://localhost:4000/supplier/logout");
      // Clear the local user info and navigate to the admin sign-in screen
      ctxDispatch({ type: "USER_SIGNOUT" });
      localStorage.removeItem("userInfo");
      navigate("/suppliersignin");
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    // Check if the user is logged in
    const userInfo = localStorage.getItem("userInfo");
    if (!userInfo) {
      // If not logged in, navigate to admin sign-in screen
      navigate("/suppliersignin");
    }
  }, []);

  return (
    <div className="supplier-home-container">
      <h1>Welcome to Supplier Dashboard</h1>
      <h5 className="subtitle">Here you can check various types of order</h5>
      {/* Buttons for selecting the order status */}
      <div className="button-container">
        <div className="mb-3">
          <Button
            type="submit"
            style={{ width: "580px" }}
            onClick={shippedHandler}
          >
            Shipped Orders
          </Button>
        </div>
        <div className="mb-3">
          <Button
            type="submit"
            style={{ width: "580px" }}
            onClick={pendingHandler}
          >
            Pending Orders
          </Button>
        </div>
        <div className="mb-3">
          <Button
            type="submit"
            style={{ width: "580px" }}
            onClick={allOrderHandler}
          >
            All Orders
          </Button>
        </div>

        <div className="mb-3">
          <Button
            type="submit"
            style={{ width: "580px" }}
            onClick={logOutHandler}
          >
            Log Out
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SupplierHomeScreen;
