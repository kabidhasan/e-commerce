import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Axios from "axios";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { Store } from "../Store";
import { toast } from "react-toastify";
//import { getError } from '../utils';
export default function SigninScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      //  console.log("Sending request with data:", { email, password });
      const userData = await Axios.post("/ecom/login", {
        //getting this from backend
        email,
        password,
      });
      // console.log("Received response:", userData.data);
      // const { info } = await Axios.get("/ecom//getNameByEmail", {
      //   email,
      // });
      // console.log(info);
      

      //   console.log(userData);
      console.log(userData.data.email)
      
      ctxDispatch({ type: "USER_SIGNIN", payload: userData.data });

      

      localStorage.setItem("userInfo", JSON.stringify(userData.data));

      navigate(redirect || "/");
    } catch (err) {
      console.log("Error:", err); // Log the entire error object
      console.log("Error response data:", err.response.data); // Log the response data from the error
      toast.error(`Invalid username or password`);
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  return (
    <Container className="small-container">
      <h1 className="my-3">Sign In</h1>
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
        <div className="mb-3">
          New customer? <Link to={`/signup`}>Create your account</Link>
        </div>
      </Form>
    </Container>
  );
}
