import { useEffect, useState, useContext } from "react";
import Button from "react-bootstrap/esm/Button";
import Card from "react-bootstrap/Card"; // Import the Card component
import { useNavigate } from "react-router";
import { Store } from "../../Store";
import Axios from "axios";

function BankHomeScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const [balance, setBalance] = useState(null);

  const logOutHandler = async () => {
    try {
      ctxDispatch({ type: "USER_SIGNOUT" });
      localStorage.removeItem("userInfo");
      navigate("/banksignin");
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    const userInfoFromStorage = JSON.parse(localStorage.getItem("userInfo"));

    if (!userInfoFromStorage) {
      navigate("/banksignin");
    } else {
      Axios.get("http://localhost:5000/bank/getBalanceByAccNo", {
        params: { acc_no: userInfoFromStorage.acc_no },
      })
        .then((response) => {
          setBalance(response.data.balance);
        })
        .catch((error) => {
          console.log("Error fetching balance:", error);
        });
    }
  }, [navigate]);

  return (
    <div className="admin-home-container">
      <h1>Welcome to Your Bank Dashboard</h1>

      {/* Use Card to display the balance */}
      {balance !== null && (
        <Card style={{ width: "18rem", margin: "0 auto" }}>
          <Card.Body>
            <Card.Title>Your Bank Balance</Card.Title>
            <Card.Text>{balance} Tk</Card.Text>
          </Card.Body>
        </Card>
      )}

      <div className="button-container">
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

export default BankHomeScreen;
