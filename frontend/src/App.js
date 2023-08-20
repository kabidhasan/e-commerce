import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import HomeScreen from "./screens/user/HomeScreen";
import ProductScreen from "./screens/user/ProductScreen";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import { LinkContainer } from "react-router-bootstrap";
import Badge from "react-bootstrap/Badge";
import Nav from "react-bootstrap/Nav";
import { useContext, useEffect } from "react";
import { Store } from "./Store";
import CartScreen from "./screens/user/CartScreen";
import SigninScreen from "./screens/user/SignInScreen";
import SignupScreen from "./screens/user/SignupScreen";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavDropdown from "react-bootstrap/NavDropdown";
import ShippingAddressScreen from "./screens/user/ShippingAddressScreen";

import PaymentScreen from "./screens/user/PaymentScreen";
import PlaceOrderScreen from "./screens/user/PlaceOrderScreen";
import OrderHistoryScreen from "./screens/user/OrderHistoryScreen";
import AdminSigninScreen from "./screens/Admin/AdminSigninScreen";
import AdminHomeScreen from "./screens/Admin/AdminHomeScreen";
import AllOrdersScreen from "./screens/Admin/AllOrdersScreen";
import PendingOrdersScreen from "./screens/Admin/PendingOrders";
import ApprovedOrdersScreen from "./screens/Admin/ApprovedOrders";
import BankSignScreen from "./screens/Bank/BankSigninScreen";
import BankSigupScreen from "./screens/Bank/BankSignupScreen";
import BankHomeScreen from "./screens/Bank/BankHomeScreen";
import SupplierSigninScreen from "./screens/Supplier/SupplierSigninScreen";
import SupplierHomeScreen from "./screens/Supplier/SupplierHomeScreen";
import SupplierAllOrderScreen from "./screens/Supplier/SupplierAllOrderScreen";
import SupplierPendingOrderScreen from "./screens/Supplier/SupplierPendingOrderScreen";
import SupplierShippedOrderScreen from "./screens/Supplier/SupplierShippedOrderScreen";

function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);

  const { cart, userInfo } = state;

  const signoutHandler = () => {
    ctxDispatch({ type: "USER_SIGNOUT" });
    localStorage.removeItem("userInfo");
    localStorage.removeItem("shippingAddress");
    localStorage.removeItem("payment");
  };
 

  return (
    <BrowserRouter>
      <div className="d-flex flex-column site-container">
        <ToastContainer position="bottom-center" limit={1} />
        <header>
          <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
              <LinkContainer to="/">
                <Navbar.Brand>Ghorer Bazar</Navbar.Brand>
              </LinkContainer>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto  w-100  justify-content-end">
                  <Link to="/cart" className="nav-link">
                    Cart
                    {cart.cartItems.length > 0 && (
                      <Badge pill bg="danger">
                        {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                      </Badge>
                    )}
                  </Link>
                  {userInfo ? (
                    <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                      <LinkContainer to="/profile">
                        <NavDropdown.Item>User Profile</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/orderhistory">
                        <NavDropdown.Item>Order History</NavDropdown.Item>
                      </LinkContainer>
                      <NavDropdown.Divider />
                      <Link
                        className="dropdown-item"
                        to="#signout"
                        onClick={signoutHandler}
                      >
                        Sign Out
                      </Link>
                    </NavDropdown>
                  ) : (
                    // Displayed when user is not logged in
                    <>
                      {/* Admin Dropdown */}
                      <NavDropdown title="Admin" id="basic-nav-dropdown">
                        <LinkContainer to="/adminsignin">
                          <NavDropdown.Item>Login</NavDropdown.Item>
                        </LinkContainer>
                      </NavDropdown>
                      {/* Supplier Dropdown */}
                      <NavDropdown title="Supplier" id="basic-nav-dropdown">
                        <LinkContainer to="/suppliersignin">
                          <NavDropdown.Item>Login</NavDropdown.Item>
                        </LinkContainer>
                      </NavDropdown>
                      {/* User Link */}
                      <Link className="nav-link" to="/signin">
                        User
                      </Link>
                    </>
                  )}
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </header>
        <main>
          <Container>
            <Routes>
              <Route path="/product/:slug" element={<ProductScreen />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/signin" element={<SigninScreen />} />
              <Route path="/signup" element={<SignupScreen />} />
              <Route path="/orderhistory" element={<OrderHistoryScreen />} />
              <Route path="/placeorder" element={<PlaceOrderScreen />} />
              <Route path="/adminsignin" element={<AdminSigninScreen />} />
              <Route path="/adminhome" element={<AdminHomeScreen />} />
              <Route path="/allordersadmin" element={<AllOrdersScreen />} />
              <Route path="/pendingorders" element={<PendingOrdersScreen />} />
              <Route path="/banksignin" element={<BankSignScreen />} />
              <Route path="/banksignup" element={<BankSigupScreen />} />
              <Route path="/bankhome" element={<BankHomeScreen />} />
              <Route path="/bankhome" element={<BankHomeScreen />} />
              <Route path="/supplierhome" element={<SupplierHomeScreen />} />
              <Route
                path="/shippedorders"
                element={<SupplierShippedOrderScreen />}
              />
              <Route
                path="/suppliersignin"
                element={<SupplierSigninScreen />}
              />
              <Route
                path="/allorderssupplier"
                element={<SupplierAllOrderScreen />}
              />
              <Route
                path="/pendingorderssupplier"
                element={<SupplierPendingOrderScreen />}
              />
              <Route
                path="/approvedorders"
                element={<ApprovedOrdersScreen />}
              />

              <Route
                path="/shipping"
                element={<ShippingAddressScreen />}
              ></Route>
              <Route path="/payment" element={<PaymentScreen />}></Route>
              <Route path="/" element={<HomeScreen />} />
            </Routes>
          </Container>
        </main>
        <footer>
          <div className="text-center">All rights reserved</div>
        </footer>
      </div>
    </BrowserRouter>
  );
}
export default App;
