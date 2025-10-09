const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.umppp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

    const database = client.db("libraryDB")
    const addBook = database.collection("addBook")
    const borrowBook = database.collection("borrowBook")


    app.post('/all-books', async (req, res) => {
      const newBook = req.body;
      const result = await addBook.insertOne(newBook);
      res.send(result);
    })

    app.get('/all-books', async (req, res) => {
      const allBooks = addBook.find();
      const result = await allBooks.toArray();
      res.send(result);
    })

    app.get('/all-books/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await addBook.findOne(query);
      res.send(result)
    })

    app.patch('/all-books/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: false };
      const updatedBook = req.body
      const updateDoc = {
        $set: { title: updatedBook.title, author: updatedBook.author, genre: updatedBook.genre, isbn: updatedBook.isbn, copies: updatedBook.copies, description: updatedBook.description, bookCover: updatedBook.bookCover}
      };
      const result = await addBook.updateOne(filter, updateDoc, options)
      res.send(result);
    })

    app.post('/borrows', async (req, res) => {
      const borrowedBook = req.body;
      const result = await borrowBook.insertOne(borrowedBook);
      res.send(result);
    })

    app.get('/borrows', async (req, res) => {
      const borrowed = borrowBook.find();
      const result = await borrowed.toArray();
      res.send(result);
    })


    // Connect the client to the server	(optional starting in v4.7)
    //await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}

run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Server is running')
})

app.listen(port, () => {
  console.log(`server is running on port ${port}`)
})

