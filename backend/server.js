const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB without deprecated options
mongoose.connect('mongodb://localhost/voting-app')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

const voteSchema = new mongoose.Schema({
    rollNumber: String,
    candidate: String
});

const Vote = mongoose.model('Vote', voteSchema);

app.post('/api/vote', async (req, res) => {
    const { rollNumber, candidate } = req.body;
    const existingVote = await Vote.findOne({ rollNumber });

    if (existingVote) {
        return res.status(400).send('You have already voted.');
    }

    const vote = new Vote({ rollNumber, candidate });
    await vote.save();
    res.send('Vote recorded.');
});

app.get('/api/vote-counts', async (req, res) => {
    const ajinkyaCount = await Vote.countDocuments({ candidate: 'Ajinkya' });
    const atharvaCount = await Vote.countDocuments({ candidate: 'Atharva' });
    res.json({ Ajinkya: ajinkyaCount, Atharva: atharvaCount });
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
