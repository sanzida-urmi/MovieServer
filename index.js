require("dotenv").config()
const express = require('express')
const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');

const app = express()
const cors = require('cors');
const port = 4000


app.use(cors())
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@clustertest.2snhq4q.mongodb.net/?appName=ClusterTest`;

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

    // await client.connect();

    const db = client.db('movie-db')
    const movieCollection = db.collection('movie')
    const usersCollection = db.collection('users')
    const watchCollection = db.collection('watchlist')



app.get("/movies/my-collection", async(req,res)=>{
  
      const email = req.query.email;
      const result = await movieCollection.find({addedBy: email}).toArray()
      res.send(result);
    })

    app.get('/movies', async(req,res)=>{



        const result = await movieCollection.find().toArray()
         res.send(result);
     })


    //  genre 

 
  app.get("/genre", async(req,res)=>{
    const {genres} = req.query;

    if(genres){
      const genary = genres.split(',');
      const filter = {genre: {$in: genary }};

      const movies = await movieCollection.find(filter).toArray();
      res.send(movies);
    }
  })

  // rating 
  app.get("/rating", async(req,res)=>{
    try{
      const min = parseFloat(req.query.min);
      const max = parseFloat(req.query.max);

      let query ={};

      if(!isNaN(min) && !isNaN(max)){
        query.rating={$gte: min, $lte: max};
      }
      const result = await movieCollection.find(query).toArray();
      res.send(result);
    } catch(err) {
      console.error(err);
      res.status(500).send({message: "server error"});
    }
  });
  
    app.get('/movies/:id', async(req,res) =>{
      const {id} = req.params
      console.log(id);

      const result = await movieCollection.findOne({_id: new ObjectId(id)})

      res.send({
        success: true,
        result
      })
    })


    app.get('/movies/update/:id', async(req,res) =>{
      const {id} = req.params
      console.log(id);

      const result = await movieCollection.findOne({_id: new ObjectId(id)})

      res.send({
        success: true,
        result
      })
    })


     app.get('/rate', async (req, res) => {
			const cursor = movieCollection.find().sort({ rating: -1 }).limit(5)
			const result = await cursor.toArray()
			res.send(result)
		})


        app.get('/recent', async (req, res) => {
			const cursor = movieCollection.find().sort({ addedAt: -1 }).limit(6)
			const result = await cursor.toArray()
			res.send(result)
		})

    // user 
    app.post('/users', async (req, res) => {
			const newUser = req.body

			const email = req.body.email
			const query = { email: email }
			const existinguser = await usersCollection.findOne(query)
			if (existinguser) {
				res.send('already exits')
			} else {
				const result = await usersCollection.insertOne(newUser)
				res.send(result)
			}
		})

    app.get('/users/count', async(req,res)=>{
      const count = await usersCollection.countDocuments();
      res.send({totalUsers: count});
    });



    // watchlist 
app.post('/watch', async(req,res)=>{
      const data = req.body
      // console.log(data);
      const result = await watchCollection.insertOne(data);

      res.send({
        success: true,
        result
      })
    })


    app.get("/watch", async(req,res)=>{
      const email = req.query.email;
      const result = await watchCollection.find({addedBy: email}).toArray()
      res.send(result);
    })



    // add movie 

    app.post('/movies', async(req,res)=>{
      const data = req.body
      // console.log(data);
      const result = await movieCollection.insertOne(data);

      res.send({
        success: true,
        result
      })
    })


    // put 
    app.put('/movies/update/:id', async(req,res)=>{
      const {id} = req.params
      const data = req.body;
      console.log(data);
      console.log(id);

      const newId = new ObjectId(id);
      const filter = {_id: newId}
      const update = {
        $set: data
      }

      const result = await movieCollection.updateOne(filter,update)

      res.send({
        success: true
      })
    })

  
     // delete 

    app.delete('/movies/:id', async(req,res)=>{
      const {id} = req.params
      const result = await movieCollection.deleteOne({_id: new ObjectId(id)})

      res.send({
        success: true
      })
    })

    
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
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