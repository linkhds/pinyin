const express = require('express');
const pinyin = require('pinyin');

const app = express();
app.use(express.urlencoded({ extended: true }));

app.post('/convert_to_pinyin', (req, res) => {
  const text = req.body.text;
  const result = text.split('').map(char => pinyin(char, { style: pinyin.TONE3 }).join(''));
  res.json({ pinyin: result.join('') });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
