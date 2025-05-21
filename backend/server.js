

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

let wishlist = []; 


app.get('/wishlist', (req, res) => {
  res.json(wishlist);
});


app.post('/wishlist', (req, res) => {
  const { userId, courseId } = req.body;
  if (!wishlist.some(item => item.courseId === courseId && item.userId === userId)) {
    wishlist.push({ userId, courseId });
  }
  res.status(201).json({ message: 'Added to wishlist' });
});


app.delete('/wishlist/:courseId', (req, res) => {
  const courseId = parseInt(req.params.courseId);
  wishlist = wishlist.filter(item => item.courseId !== courseId);
  res.json({ message: 'Removed from wishlist' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
