const mongoose = require('mongoose');  

const connectDB = async () => { 
    await mongoose.connect(
        "mongodb+srv://saurabyadav0485_db_user:xCr7KwNIaOQBKVgv@devtinder.vlocohf.mongodb.net/?appName=DevTinder"
    );
};

module.exports = connectDB;







    
// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://saurabyadav0485_db_user:xCr7KwNIaOQBKVgv@devtinder.vlocohf.mongodb.net/?appName=DevTinder";

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);
