import { Product } from "../models/Product";

let productsData: Product[] = [
  {
    id: 1,
    name: "Product 1",
    price: 10.99,
    description: "This is product 1",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg",
    isAvailable: true,
    isPopular: true,
    category: "category 1"
  },
  {
    id: 2,
    name: "Product 2",
    price: 19.99,
    description: "This is product 2",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg",
    isAvailable: true,
    isPopular: false,
    category: "category 1"
  },
  {
    id: 3,
    name: "Product 3",
    price: 15.99,
    description: "This is product 3",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg",
    isAvailable: true,
    isPopular: false,
    category: "category 1"
  },
  {
    id: 4,
    name: "Product 4",
    price: 4.99,
    description: "This is product 4",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg",
    isAvailable: true,
    isPopular: false,
    category: "category 1"
  },
  {
    id: 5,
    name: "Product 5",
    price: 1.99,
    description: "This is product 5",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg",
    isAvailable: false,
    isPopular: false,
    category: "category 1"
  }
];

export default productsData;