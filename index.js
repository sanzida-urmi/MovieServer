const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express()
const cors = require('cors');
const port = 5000


app.use(cors())
app.use(express.json());



const uri = "mongodb+srv://movieMaster:Jivjce0EzFxWyewr@clustertest.2snhq4q.mongodb.net/?appName=ClusterTest";

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
    // Connect the client to the server	(optional starting in v4.7)

    const db = client.db('movie-db')
    const movieCollection = db.collection('moviesCollection')


    app.get('/movies', async(req,res)=>{
        const result = await movieCollection.find().toArray()
         res.send(result);
     })


    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})