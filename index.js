const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

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

    const db = client.db("interview_task_db");
    const teamCollection = db.collection("team");
    const projectCollection = db.collection("projects");

    /* ================= TEAM API ================= */

    app.post('/api/team', async (req, res) => {
      const result = await teamCollection.insertOne(req.body);
      res.send(result);
    });

    app.get('/team', async (req, res) => {
      const result = await teamCollection.find().toArray();
      res.send(result);
    });

    app.get('/team/:id', async (req, res) => {
      const result = await teamCollection.findOne({
        _id: new ObjectId(req.params.id)
      });
      res.send(result);
    });

    app.put('/team/:id', async (req, res) => {
      const result = await teamCollection.updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: req.body }
      );
      res.send(result);
    });

    app.delete('/team/:id', async (req, res) => {
      const result = await teamCollection.deleteOne({
        _id: new ObjectId(req.params.id)
      });
      res.send(result);
    });

    /* ================= PROJECT API ================= */

    // ➕ Add project
    app.post('/api/projects', async (req, res) => {
      const result = await projectCollection.insertOne(req.body);
      res.send(result);
    });

    // 📥 Get all projects
    app.get('/api/projects', async (req, res) => {
      const result = await projectCollection.find().toArray();
      res.send(result);
    });

    // 📥 Single project
    app.get('/api/projects/:id', async (req, res) => {
      const result = await projectCollection.findOne({
        _id: new ObjectId(req.params.id)
      });
      res.send(result);
    });

    // ✏️ Update project
    app.put('/api/projects/:id', async (req, res) => {
      const result = await projectCollection.updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: req.body }
      );
      res.send(result);
    });

    // ❌ Delete project
    app.delete('/api/projects/:id', async (req, res) => {
      const result = await projectCollection.deleteOne({
        _id: new ObjectId(req.params.id)
      });
      res.send(result);
    });

    console.log("✅ MongoDB Connected");
  } finally {}
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Server running 🚀');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
