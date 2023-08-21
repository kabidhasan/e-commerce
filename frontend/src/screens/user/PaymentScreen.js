import React, { useContext, useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import { Store } from "../../Store";
import CheckoutSteps from "../../components/CheckoutSteps";
import { toast } from "react-toastify";
import axios from "axios";

export default function PaymentScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    userInfo,
    cart: { payment },
  } = state;
  const [BankAc, setBankAc] = useState(payment.BankAc || "");
  const [secretKey, setSecretKey] = useState(payment.secretKey || "");

  useEffect(() => {
    if (!userInfo) {
      navigate("/signin?redirect=/payment");
    }
  }, [userInfo, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const response = await axios.get(
      `http://localhost:5000/bank/verifyBankInfo?acc_no=${BankAc}&pin=${secretKey}`
    );
    // I want to use the BankAc value in other files too. How to do that?
    if (response.data.success) {
      console.log(userInfo);
      //toast.success("Payment Info Verified!");
      ///*** changing
      const bankAccLinkResponse = await axios.post("/ecom/setPaymentInfo", {
        acc_no: BankAc,
        email: userInfo.email,
      });
      if (bankAccLinkResponse.data.success) {
        toast.success(bankAccLinkResponse.data.msg);
      }
      else {
        console.log(bankAccLinkResponse.data);
      }
      //changing*/
      navigate("/placeorder");
    } else {
      toast.error("Payment Info Invalid");
    }
    // will handle authentication here

    ctxDispatch({
      type: "SAVE_PAYMENT",
      payload: {
        BankAc,
      },
    });
    localStorage.setItem(
      "payment",
      JSON.stringify({
        BankAc,
      })
    );
  };
  return (
    <div>
      <CheckoutSteps step1 step2 step3></CheckoutSteps>
      <div className="container small-container">
        <h1 className="my-3">Payment Information</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="BankAc">
            <Form.Label>Bank Account</Form.Label>
            <Form.Control
              value={BankAc}
              onChange={(e) => setBankAc(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="secretKey">
            <Form.Label>Secret Key</Form.Label>
            <Form.Control
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              required
            />
          </Form.Group>

          <div className="mb-3">
            <Button variant="primary" type="submit" style={{ width: "580px" }}>
              Continue
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
