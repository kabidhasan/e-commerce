import { useEffect, useState, useContext } from "react";
import Button from "react-bootstrap/esm/Button";
import { useNavigate } from "react-router";
import { Store } from "../../Store";
import Axios from "axios";
function AdminHomeScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const [selectedTab, setSelectedTab] = useState("all"); // State to track the selected tab

  const approvedHandler = (e) => {
    navigate("/approvedorders");
  };
  const pendingHandler = (e) => {
    navigate("/pendingorders");
  };
  const allOrderHandler = () => {
    navigate("/allordersadmin");
  };
  const logOutHandler = async () => {
    try {
      // Make an API call to log out the admin
      await Axios.get("/admin/logout");
      // Clear the local user info and navigate to the admin sign-in screen
      ctxDispatch({ type: "USER_SIGNOUT" });
      localStorage.removeItem("userInfo");
      navigate("/adminsignin");
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    // Check if the user is logged in
    const userInfo = localStorage.getItem("userInfo");
    if (!userInfo) {
      // If not logged in, navigate to admin sign-in screen
      navigate("/adminsignin");
    }
  }, []);

  return (
    <div className="admin-home-container">
      <h1>Welcome to Admin Dashboard</h1>
      <h5 className="subtitle">Here you can check various types of order</h5>
      {/* Buttons for selecting the order status */}
      <div className="button-container">
        <div className="mb-3">
          <Button
            type="submit"
            style={{ width: "580px" }}
            onClick={approvedHandler}
          >
            Approved Orders
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

export default AdminHomeScreen;
