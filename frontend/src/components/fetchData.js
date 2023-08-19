import axios from "axios";
import data from "../data"; // Import the data object from the data.js file

const fetchData = async () => {
  try {
    const response = await axios.get("http://localhost:6000/ecom/getAllItems");
    const items = response.data.items;

    data.products = items.map((item) => ({
      item_id: item.item_id.toString(),
      item_name: item.item_name,
      slug: item.slug,
      quantity: item.quantity,
      image: item.image,
      item_price: item.item_price,
      description: item.description,
    }));

    // Use the `data` object as needed
    console.log(data);
    // ... other code that uses `data`
  } catch (error) {
    console.error(error);
  }
};

fetchData();

export default data; // Export the data object to be used in other parts of your application
