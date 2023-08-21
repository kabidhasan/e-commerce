import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { Store } from "../../Store";
import { toast } from "react-toastify";
//import { getError } from '../utils';
export default function BankSignScreen() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [acc_no, setAcc_no] = useState("");

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      //  console.log("Sending request with data:", { email, password });
      const BankData = await Axios.post("http://localhost:5000/bank/login", {
        //getting this from backend
        email,
        pin,
        acc_no,
      });

      ctxDispatch({ type: "USER_SIGNIN", payload: BankData.data });

      localStorage.setItem("userInfo", JSON.stringify(BankData.data));
      toast.success("Bank User signed in");
      navigate("/bankhome");
    } catch (err) {
      toast.error(`Invalid username or password`);
    }
  };

  return (
    <Container className="small-container">
      <h1 className="my-3">Bank User Sign In</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="acc_no">
          <Form.Label>Account Number</Form.Label>
          <Form.Control required onChange={(e) => setAcc_no(e.target.value)} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="pin">
          <Form.Label>Secret Key</Form.Label>
          <Form.Control
            type="password"
            required
            onChange={(e) => setPin(e.target.value)}
          />
        </Form.Group>
        <div className="mb-3">
          <Button type="submit" style={{ width: "580px" }}>
            Sign In
          </Button>
        </div>
        <div className="mb-3">
          New client? <Link to={`/banksignup`}>Create your account</Link>
        </div>
      </Form>
    </Container>
  );
}
