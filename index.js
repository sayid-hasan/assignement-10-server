const express = require("express");
const app = express();
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());
console.log(process.env.DB_USER);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.grteoyu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });

    const craftsCollection = client.db("CraftsDB").collection("crafts");

    app.post("/craftsitem", async (req, res) => {
      const carftitem = req.body;
      const result = await craftsCollection.insertOne(carftitem);
      res.send(result);
    });
    // GET maximum 6 data for art and craft senctions
    app.get("/craftsitems", async (req, res) => {
      const cursor = craftsCollection.find().limit(6);
      const result = await cursor.toArray();
      res.send(result);
    });
    // getting single data for viewDetails Page
    app.get("/craftsitems/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await craftsCollection.findOne(query);
      res.send(result);
    });
    // getting all data for All art and craft Items Page
    app.get("/allartcraftitems", async (req, res) => {
      const cursor = craftsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // GET all  data of particular user  for my arts and crafts
    app.get("/mycraftitems/:email", async (req, res) => {
      const email = req.params.email;
      const query = { user_email: email };
      const cursor = craftsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    // getting single data for update a items
    app.get("/updateItem/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await craftsCollection.findOne(query);
      res.send(result);
    });
    // updating data for a item
    app.put("/updatingItem/:id", async (req, res) => {
      const id = req.params.id;
      const item = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateitem = {
        $set: {
          user_email: item.user_email,
          item_name: item.item_name,
          user_name: item.user_name,
          image: item.image,
          sub_category_name: item.sub_category_name,
          price: item.price,
          rating: item.rating,
          customization: item.customization,
          processing_time: item.processing_time,
          short_description: item.short_description,
          stock_status: item.stock_status,
        },
      };
      const result = await craftsCollection.updateOne(
        filter,
        updateitem,
        options
      );
      res.send(result);
    });
    // GET all  data of based on customization  for my arts and crafts
    app.get("/mycraftitems/:customization", async (req, res) => {
      const customization = req.body;
      console.log(customization);
    });

    app.delete("/updateItem/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await craftsCollection.deleteOne(query);
      res.send(result);
    });

    app.get("/", (req, res) => {
      res.send("users Management server is runnning");
    });

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.log);

app.listen(port, () => {
  console.log(`server is running on Port ${port}`);
});
