const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;


// middlerae 

app.use(cors({
  origin:[
    'http://localhost:5173',
    'https://web-pro-matcher-client.web.app',
    'https://web-pro-matcher-client.firebaseapp.com',
  ]
}));

app.use(express.json());

const { ObjectId } = require('mongodb');







const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fwkvcsa.mongodb.net/?retryWrites=true&w=majority`;

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
    // await client.connect();


    // const jobsCollection = client.db('webpro').collection('jobs');
    const jobsCollection = client.db('webJobs').collection('addJobs');
    const bidCollection = client.db('webJobs').collection('bid');
    // const productCollection = client.db('productDB').collection('product');

    
    app.get('/addJobs', async(req, res)=>{
      const cursor = jobsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    
    app.get('/addJobs_own', async(req, res)=>{
      const cursor = jobsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })


    app.get('/addJobs/:id', async(req,res) =>{
      const id =req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await jobsCollection.findOne(query)
      res.send(result);
    })



    // app.get('/addJobs_brand/:category', async(req,res)=>{
    //   const category = req.params.category;
    //   // console.log(brandName)
    //   const query = {category: category};
    //   const cursor = jobsCollection.find(query);
    //   const result = await cursor.toArray();
    //   // const result = await productCollection.findOne(query);
    //   res.send(result);
    // })



    app.post('/addJobs', async(req,res)=>{
      const newJobs = req.body;
      console.log(newJobs);
      const result = await jobsCollection.insertOne(newJobs);
      res.send(result);
    })



    
    app.put('/addJobs/:id', async(req,res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const options = { upsert: true };
      const updateJobs = req.body;
      const job = {
        $set: {
          category: updateJobs.category,
          job_title: updateJobs.job_title,
          deadline: updateJobs.brand_name,
          price_range: updateJobs.price_range,
          short_description: updateJobs.short_description,
          
          
        }
      }

      const result = await jobsCollection.updateOne(filter,job,options);
      res.send(result);
    })



    
    



    // bid related 


    app.get('/bid', async(req, res)=>{
      const cursor = bidCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.post('/bid',async(req, res) =>{
      const userCart= req.body;
      console.log(userCart);
      const result = await bidCollection.insertOne(userCart);
      res.send(result);
    })

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
  res.send('web pro matcher server is running')
})

app.listen(port, () => {
  console.log(`web pro matcher server is running on port ${port}`)
})