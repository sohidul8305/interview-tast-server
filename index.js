const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = process.env.PORT || 5000;

// middleware
app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hz6ypdj.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();

    const db = client.db('interview_task_db');
    const teamCollection = db.collection('team');

    // 🔹 POST: Add team member
    app.post('/api/team', async (req, res) => {
      const teamMember = req.body;
      const result = await teamCollection.insertOne(teamMember);
      res.status(201).send(result);
    });

    // 🔹 GET: All team members
    app.get('/team', async (req, res) => {
      const result = await teamCollection.find().toArray();
      res.send(result);
    });

    // 🔹 GET: Single team member (for update)
    app.get('/team/:id', async (req, res) => {
      const id = req.params.id;
      const result = await teamCollection.findOne({
        _id: new ObjectId(id)
      });
      res.send(result);
    });

const { ObjectId } = require('mongodb');

app.put('/team/:id', async (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;

  console.log('UPDATE ID:', id);
  console.log('UPDATE DATA:', updatedData);

  const filter = { _id: new ObjectId(id) };

  const updateDoc = {
    $set: updatedData
  };

  const result = await teamCollection.updateOne(filter, updateDoc);

  res.send(result);
});


    // 🔹 DELETE: Team member
    app.delete('/team/:id', async (req, res) => {
      const id = req.params.id;
      const result = await teamCollection.deleteOne({
        _id: new ObjectId(id)
      });
      res.send(result);
    });

    console.log("MongoDB connected successfully!");
  } finally {
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Server is running 🚀');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
