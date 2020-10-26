const express = require('express');
const bodyParser = require('body-parser');
const cors = require ('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()



const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_PASS}@cluster0.pnnmm.mongodb.net/${process.env.DB_Name}?retryWrites=true&w=majority`;

const app = express()

app.use(bodyParser.json());
app.use(cors());



const port = 5000;
 app.get('/', (req, res) =>{
   res.send("working")
 })


const client = new MongoClient(uri, { useNewUrlParser: true,  useUnifiedTopology: true });
client.connect(err => {
  const productCollection = client.db("ema-john-store").collection("products");
  const ordersCollection = client.db("ema-john-store").collection("orders");
  
app.post('/addProduct', (req, res) =>{
    const products =req.body;
    // console.log(product)
    productCollection.insertOne(products)
    .then(result => {
    console.log(result.insertedCount);
    res.send(result.insertedCount)
    })
})

app.get('/products', (req, res) =>{
    productCollection.find({})
    .toArray( (err, documents) =>{
      res.send(documents);

    })
})

app.get('/product/:key', (req, res) =>{
  productCollection.find({key: req.params.key})
  .toArray( (err, documents) =>{
    res.send(documents[0]);

  })
})

app.post('/productByKeys', (req, res) =>{
  const productKeys = req.body;
  productCollection.find({key: {$in: productKeys}})
  .toArray( (err, documents) =>{
  res.send(documents);

  })
})
 

app.post('/addOrder', (req, res) =>{
  const order =req.body;
 
  ordersCollection.insertOne(order)
  .then(result => {
   res.send(result.insertedCount > 0)
  })
})


});




app.listen(process.env.PORT || port)