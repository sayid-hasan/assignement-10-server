const express = require("express");
const app = express();
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const port = process.env.PORT || 5000;
const users = [
  { id: 1, name: "Sabana", email: "sabana@gmail.com" },
  { id: 2, name: "kahan", email: "sdf@gmail.com" },
  { id: 3, name: "ratab", email: "sabsdfana@gmail.com" },
  { id: 4, name: "Safghsbana", email: "asd@gmail.com" },
];
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

    app.get("/craftsitems", async (req, res) => {
      const cursor = craftsCollection.find();
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
