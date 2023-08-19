import Axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useContext, useEffect, useState } from "react";
import { Store } from "../../Store";
import { toast } from "react-toastify";

export default function BankSigupScreen() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [pin, setPin] = useState("");
  //const [confirmPassword, setConfirmPassword] = useState("");

  // const { state } = useContext(Store);
  //const { userInfo } = state;

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const bankData = await Axios.post("http://localhost:5000/bank/register", {
        email,
        pin,
        address,
        name,
      });

      navigate("/banksignin");
      window.alert(
        "Your Bank Acc-No is: " +
          bankData.data.bank_acc +
          " Save this for later sign in."
      );
      toast.done("Thanks for sign in up");
    } catch (err) {
      toast.error("Something error occured");
    }
  };

  return (
    <Container className="small-container">
      <h1 className="my-3">Sign Up</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control onChange={(e) => setName(e.target.value)} required />
        </Form.Group>

        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="address">
          <Form.Label>Address</Form.Label>
          <Form.Control required onChange={(e) => setAddress(e.target.value)} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Pin</Form.Label>
          <Form.Control
            type="password"
            required
            onChange={(e) => setPin(e.target.value)}
          />
        </Form.Group>
        <div className="mb-3">
          <Button type="submit" style={{ width: "580px" }}>
            Sign Up
          </Button>
        </div>
        <div className="mb-3">
          Already have an account? <Link to={`/banksignin`}>Sign-In</Link>
        </div>
      </Form>
    </Container>
  );
}
