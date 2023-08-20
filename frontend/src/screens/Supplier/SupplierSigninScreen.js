import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { Store } from "../../Store";
import { toast } from "react-toastify";
//import { getError } from '../utils';
export default function SupplierSigninScreen() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      //  console.log("Sending request with data:", { email, password });
      const supplierData = await Axios.post("http://localhost:4000/supplier/login", {
        //getting this from backend
        email,
        password,
      });
      // console.log("Received response:", userData.data);
      // const { info } = await Axios.get("/ecom//getNameByEmail", {
      //   email,
      // });
      // console.log(info);

      ctxDispatch({ type: "USER_SIGNIN", payload: supplierData.data });

      localStorage.setItem("userInfo", JSON.stringify(supplierData.data));
      toast.success("Supplier signed in");
      navigate("/supplierhome");
    } catch (err) {
      console.log("Error:", err); // Log the entire error object
      console.log("Error response data:", err.response.data); // Log the response data from the error
      toast.error(`Invalid username or password`);
    }
  };

  return (
    <Container className="small-container">
      <h1 className="my-3">Supplier Sign In</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <div className="mb-3">
          <Button type="submit" style={{ width: "580px" }}>
            Sign In
          </Button>
        </div>
      </Form>
    </Container>
  );
}
