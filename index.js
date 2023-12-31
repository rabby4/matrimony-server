const express = require('express')
const app = express()
const cors = require('cors')
const jwt = require('jsonwebtoken');
require('dotenv').config()
const strip = require('stripe')(process.env.STIPE_PAYMENT_KEY)
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.v07t2jx.mongodb.net/?retryWrites=true&w=majority`;

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

    const userCollections = client.db('matrimonyDB').collection('users')
    const favoritesCollections = client.db('matrimonyDB').collection('favorites')
    const paymentsCollections = client.db('matrimonyDB').collection('payments')

    // post json web token
    app.post('/jwt', async(req, res)=>{
        const user = req.body;
        const token = jwt.sign(user, process.env.ACCESS_TOKEN, {expiresIn: '1hr'});
        res.send({token})
      })

    app.post('/users', async(req, res)=>{
        const user = req.body;
        const query = {email: user.email}
        const existUser = await userCollections.findOne(query)
        if(existUser){
          return res.send({message: 'user already exist', insertedId: null})
        }
        const result = await userCollections.insertOne(user)
        res.send(result)
      })

      app.get('/users', async(req, res)=>{
        const result = await userCollections.find().toArray()
        res.send(result)
      })

    app.get('/users/:email', async(req, res)=>{
        const email = req.params.email;
        const query = {email: email}
        const result = await userCollections.findOne(query)
        res.send(result)
    })

    app.get('/users/:id', async(req, res)=>{
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await userCollections.findOne(query)
      res.send(result)
    })

    app.put('/users/:id', async(req, res)=>{
        const id = req.params.id;
        const filter = {_id: new ObjectId(id)};
        const options = { upsert: true };
        const updateUser = req.body;
        const user = {
            $set:{
                age: updateUser.age,
                dof: updateUser.dof,
                email: updateUser.email,
                fatherName: updateUser.fatherName,
                gender: updateUser.gender,
                height: updateUser.height,
                motherName: updateUser.motherName,
                name: updateUser.name,
                occupation: updateUser.occupation,
                partnerAge: updateUser.partnerAge,
                partnerHeight: updateUser.partnerHeight,
                partnerWeight: updateUser.partnerWeight,
                permanentDivision: updateUser.permanentDivision,
                phone: updateUser.phone,
                photo: updateUser.photo,
                presentDivision: updateUser.presentDivision,
                race: updateUser.race,
                weight: updateUser.weight,
            }
        }
        const result = await userCollections.updateOne(filter, user, options)
        res.send(result)
    })

    app.patch('/users/:id', async(req, res)=>{
      const id = req.params.id
      const filter = {_id: new ObjectId(id)}
      const makePremium = req.body;
      const premium = {
         $set: { 
          premium: makePremium.premium 
        } 
      }
      const result = await userCollections.updateOne(filter, premium)
      res.send(result)
    })

    app.patch('/users/admin/:id', async(req, res)=>{
      const id = req.params.id
      const filter = {_id: new ObjectId(id)}
      const makeAdmin ={ $set: { role: 'admin' }}
      const result = await userCollections.updateOne(filter, makeAdmin)
      res.send(result)
    })

    app.get('/users/admin/:email', async(req, res)=>{
      const email = req.params.email
      // if(email !== req.decoded.email){
      //   return res.status(403).send({message: 'forbidden access'})
      // }
      const query = {email: email}
      const user = await userCollections.findOne(query)
      let admin = false;
      if(user){
        admin = user?.role === 'admin'
      }
      res.send({admin})
    })

    app.post('/favorites', async(req, res)=>{
      const favoriteUser = req.body
      delete favoriteUser._id
      const result = await favoritesCollections.insertOne(favoriteUser)
      res.send(result)
    })

    app.get('/favorites/:email', async(req, res)=>{
      const email = req.params.email
      const query = {userEmail: email}
      const result = await favoritesCollections.find(query).toArray()
      res.send(result)
    })

    app.delete('/favorites/:id', async(req, res)=>{
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await favoritesCollections.deleteOne(query)
      res.send(result)
    })

    // Payment intent
    app.post('/create-payment-intent', async(req, res)=>{
      const {price} = req.body;
      const amount = parseInt(price * 100)
      const paymentIntent = await strip.paymentIntents.create({
        amount: amount,
        currency: 'usd',
        payment_method_types: ['card']
      })
      res.send({
        clientSecret: paymentIntent.client_secret,
      })
    })

    app.post('/payments', async(req, res)=>{
      const payment = req.body;
      const result = await paymentsCollections.insertOne(payment)
      res.send(result)
    })

    app.get('/payments', async(req, res)=>{
      const result = await paymentsCollections.find().toArray()
      res.send(result)
    })

    app.get('/payments/:email', async(req, res) =>{
      const email = req.params.email
      const query = {requesterEmail: email}
      const result = await paymentsCollections.find(query).toArray()
      res.send(result)
    })

    app.delete('/payments/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await paymentsCollections.deleteOne(query)
      res.send(result)
    })

    app.patch('/payment/:id', async(req, res)=>{
      const id = req.params.id
      const filter = {_id: new ObjectId(id)};
      const options = { upsert: true };
      const updateStatus = req.body;
      const status = {
        $set:{
          status: updateStatus.status
        }
      }
      const result = await paymentsCollections.updateOne(filter, status, options)
      res.send(result)
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
  res.send('Matrimony server is running!')
})

app.listen(port, () => {
  console.log(`Matrimony app listening on port ${port}`)
})