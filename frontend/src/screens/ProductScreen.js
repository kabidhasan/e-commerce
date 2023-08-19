import { useNavigate, useParams } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import { useContext } from "react";
import data from "../data";
import { Store } from "../Store";
import Axios from "axios";

function ProductScreen() {
  const navigate = useNavigate();
  const params = useParams();
  const { slug } = params;

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart } = state;

  const addToCartHandler = async () => {
    const existItem = cart.cartItems.find((x) => x.item_id === product.item_id);
    const quantity = existItem ? existItem.quantity + 1 : 1;

    const productToAdd = data.products.find((product) => product.slug === slug);

    // Prepare data for the POST request
    const dataToSend = {
      email: "user2@example.com", // Replace with the user's email
      item_id: productToAdd.item_id, // Assuming your API expects item_id
      count: 1,
    };

    try {
      // Make the Axios POST request
     // const response= await Axios.post("/ecom/addToCart", dataToSend);

      // Update the context or state as needed
      ctxDispatch({
        type: "CART_ADD_ITEM",
        payload: { ...productToAdd, quantity },
      });

      navigate("/cart"); // Navigate to the cart page
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };
  // Find the product that matches the provided slug
  const product = data.products.find((product) => product.slug === slug);

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div>
      <Row>
        <Col md={6}>
          <img
            className="img-fluid"
            src={product.image}
            alt={product.item_name}
          ></img>
        </Col>
        <Col md={6}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h1>{product.item_name}</h1>
            </ListGroup.Item>

            <ListGroup.Item>Price: ${product.item_price}</ListGroup.Item>
            <ListGroup.Item>
              Description:
              <p>{product.description}</p>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>Price:</Col>
                <Col>${product.item_price}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>Status:</Col>
                <Col>
                  {product.countInStock > 0 ? (
                    <Badge bg="success">In Stock</Badge>
                  ) : (
                    <Badge bg="danger">Unavailable</Badge>
                  )}
                </Col>
              </Row>
            </ListGroup.Item>
            {product.countInStock > 0 && (
              <ListGroup.Item>
                <div className="d-grid">
                  <Button onClick={addToCartHandler} variant="primary">
                    Add to Cart
                  </Button>
                </div>
              </ListGroup.Item>
            )}
          </ListGroup>
        </Col>
      </Row>
    </div>
  );
}

export default ProductScreen;
