const express = require('express');
const pinyin = require('pinyin');
const cors = require('cors');
const app = express();

// Detailed logging middleware
app.use((req, res, next) => {
  console.log(`Request received: ${req.method} ${req.path}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

// Enable CORS with more permissive options
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse JSON request bodies
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Service is running' });
});

// Main Hanzi to Pinyin conversion endpoint
app.post('/convert', (req, res) => {
  try {
    console.log('Convert endpoint called');
    console.log('Request body:', req.body);
    const { text } = req.body;
    
    if (!text) {
      console.log('Missing text parameter');
      return res.status(400).json({ 
        error: 'Missing text parameter' 
      });
    }
    const result = pinyin(text, {
      style: pinyin.STYLE_TONE,
      heteronym: false
    });
    const pinyinArray = result.map(item => item[0]);
    console.log('Conversion result:', pinyinArray);
    res.json({
      original: text,
      pinyin: pinyinArray,
      pinyinString: pinyinArray.join(' ')
    });
  } catch (error) {
    console.error('Error in conversion:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

// Handle OPTIONS requests for CORS preflight
app.options('*', cors());

// Handle 404 errors
app.use((req, res) => {
  console.log('404 - Not Found:', req.method, req.path);
  res.status(404).json({ error: 'Not found' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
