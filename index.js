const express = require('express')
const app = express()
require('dotenv').config()
const cors = require('cors');
const port = process.env.PORT||5000
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World!')
})
// emajohnsimple
// OGJfmsQBDYwQr9xq
console.log(process.env.APP_DB_USER);
console.log(process.env.APP_DB_PASSWORD);


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.APP_DB_USER}:${process.env.APP_DB_PASSWORD}@cluster0.w8zzyxt.mongodb.net/?retryWrites=true&w=majority`;

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
        // emaJohnProducts
        // ema-john-simple
        // await client.connect();
        const productCollection = client.db("ema-john-simple").collection("emaJohnProducts")

        app.get("/products",async (req,res)=>{
            // console.log(req.query);
            const page = parseInt(req.query.page) ||0
            const limit = parseInt(req.query.limit) ||10
            const skip=page * limit
            const cursor=productCollection.find().skip(skip).limit(limit)
            const result= await cursor.toArray()
            res.send(result)
        })

        app.get("/totalproducts", async (req,res)=>{
            const result =await productCollection.estimatedDocumentCount()
            res.send({totalProduct:result})
        })
        app.post("/productsbyids",async (req,res)=>{
            const productIds=req.body
            const objectids = productIds.map(id=> new ObjectId(id))
            console.log(productIds);
            const query = { _id: { $in: objectids }}
            const result=await productCollection.find(query).toArray()
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




app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})