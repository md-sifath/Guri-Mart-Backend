const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.f6ro4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const database = client.db("Guri-Mart");

    //Database collections
    const clothCollection = database.collection("cloths");
    const shoeCollection = database.collection("shoes");
    const foodCollection = database.collection("foods");
    const watchCollection = database.collection("watches");
    const furnitureCollection = database.collection("furnitures");
    const electronixCollection = database.collection("electronix");
    const allProductsCollection = database.collection("products");
    const cartCollection = database.collection("carts");

    //API FOR CLOTHS COLLECTION
    app.post("/cloths", async (req, res) => {
      const result = await clothCollection.insertOne(req.body);
      res.send(result);
    });

    app.get("/cloths", async (req, res) => {
      const cursor = clothCollection.find({});
      const cloths = await cursor.toArray();
      // console.log(cloths);
      res.send(cloths);
    });

    //API FOR FOOD COLLECTION
    app.get("/foods", async (req, res) => {
      const cursor = foodCollection.find({});
      const foods = await cursor.toArray();
      res.send(foods);
    });

    //API FOR CART COLLECTION
    app.post("/carts", async (req, res) => {
      const result = await cartCollection.insertOne(req.body);
      res.send(result);
    });

    app.get("/carts", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const result = await cartCollection.find(query).toArray();
      res.send(result);
    });

    app.delete("/carts/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      console.log(query);
      const result = await cartCollection.deleteOne(query);

      res.send(result);
    });

    //API FOR SHOES COLLECTION
    app.get("/shoes", async (req, res) => {
      const result = await shoeCollection.find({}).toArray();
      res.send(result);
    });

    //API FOR WATCHES COLLECTION
    app.get("/watches", async (req, res) => {
      const result = await watchCollection.find({}).toArray();
      res.send(result);
    });

    //API FOR FURNITURE COLLECTION
    app.get("/furnitures", async (req, res) => {
      const result = await furnitureCollection.find({}).toArray();
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    //await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => console.log(`server is running at port ${port}`));
