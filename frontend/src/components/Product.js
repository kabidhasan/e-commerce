import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { Store } from "../Store";
import data from "../data";
import { userData } from "../screens/SignInScreen";
import axios from "axios";

function Product(props) {
  const { product } = props;

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;
  
  const addToCartHandler = async (item) => {
    const existItem = cartItems.find((x) => x.item_id === item.item_id);
    const quantity = existItem ? existItem.quantity + 1 : 1;

    try {
      // Prepare data for the POST request
      const emailResponse = await axios.get("/ecom/getCurrentUserEmail");
      console.log(emailResponse.data.email);
      const dataToSend = {
        email: emailResponse.data.email, // Replace with the user's email
        item_id: item.item_id, // Assuming your API expects item_id
        count: 1,
      };

      // Make the Axios POST request
      await axios.post("/ecom/addToCart", dataToSend);

      // Update the context or state as needed
      ctxDispatch({
        type: "CART_ADD_ITEM",
        payload: { ...item, quantity },
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  

  return (
    <Card>
      <Link to={`/product/${product.slug}`}>
        <img src={product.image} className="card-img-top" alt={product.name} />
      </Link>
      <Card.Body>
        <Link to={`/product/${product.slug}`}>
          <Card.Title>{product.item_name}</Card.Title>
        </Link>
        <Card.Text>${product.item_price}</Card.Text>
        
          <Button onClick={() => addToCartHandler(product)}>Add to cart</Button>
        
      </Card.Body>
    </Card>
  );
}
export default Product;
