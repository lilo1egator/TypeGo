const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 4000;

app.use(cors());

const phrasesRouter = require('./routes/phrases');
app.use('/api/phrases', phrasesRouter);

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
}); 