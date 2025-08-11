import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

const groupSchema = new mongoose.Schema({
  name: String,
  members: [String], // wa_id array
  avatar: String
}, { collection: 'groups' });

const Group = mongoose.model('Group', groupSchema);

// Create group
router.post('/', async (req, res) => {
  try {
    const { name, members, avatar } = req.body;
    const group = await Group.create({ name, members, avatar });
    res.json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all groups
router.get('/', async (req, res) => {
  try {
    const groups = await Group.find();
    res.json(groups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get group by ID
router.get('/:id', async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ error: 'Group not found' });
    res.json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
