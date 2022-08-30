const express = require("express");
const morgan = require("morgan");
const path = require("path");
const axios = require("axios");
const connectDB = require("./src/db");
require("ejs");

connectDB();

const app = express();

let products = [
  {
    id: 1,
    name: "Laptop Gaming DELL G15",
    price: 59.9,
  },
];

// settings
app.set("port", 3000);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src", "views"));

// middlewares
app.use(morgan());
app.use(express.json());

// routes
app.get("/", (req, res) => {
  const title = "Mi pagina creada desde Express Js";
  res.render("index", { title });
});

app.get("/products", (req, res) => {
  res.json(products);
});

app.post("/products", (req, res) => {
  const newProduct = { ...req.body, id: new Date().getTime() };
  products.push(newProduct);
  res.send(newProduct);
});

app.put("/products/:id", (req, res) => {
  const newData = req.body;
  const productFound = products.find((product) => {
    return product.id === Number(req.params.id);
  });

  if (!productFound)
    return res.status(404).json({ message: "Producto no encontrado..." });

  products = products.map((product) =>
    product.id === Number(req.params.id) ? { ...product, ...newData } : product
  );

  res.json({ message: "Product updated successfully" });
});

app.delete("/products/:id", (req, res) => {
  const productFound = products.find((product) => {
    return product.id === Number(req.params.id);
  });

  if (!productFound)
    return res.status(404).json({ message: "Producto no encontrado..." });

  products = products.filter((product) => {
    return product.id !== Number(req.params.id);
  });

  res.sendStatus(204);
});

app.get("/products/:id", (req, res) => {
  const productFound = products.find((product) => {
    return product.id === Number(req.params.id);
  });

  if (!productFound)
    return res.status(404).json({ message: "Producto no encontrado..." });

  res.json(productFound);
});

app.get("/posts", async (req, res) => {
  const response = await axios.get(
    "https://jsonplaceholder.typicode.com/posts"
  );

  res.render("posts", {
    posts: response.data,
  });
});

app.use("/public", express.static(path.join(__dirname, "src", "public")));

app.listen(app.get("port"));
console.log(`Server running on http://localhost:${app.get("port")}`);
