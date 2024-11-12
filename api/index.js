const express = require('express');
const pinyin = require('pinyin');
const cors = require('cors');
const app = express();

// 增加详细日志中间件
app.use((req, res, next) => {
  console.log(`Request received: ${req.method} ${req.path}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

// 启用 CORS，并配置更宽松的选项
app.use(cors({
  origin: '*', // 允许所有域名
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 解析 JSON 和 URL-encoded 请求体
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 健康检查endpoint
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Service is running' });
});

// 汉字转拼音的主要endpoint
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

// 处理 OPTIONS 请求，支持跨域预检
app.options('*', cors());

// 处理 404
app.use((req, res) => {
  console.log('404 - Not Found:', req.method, req.path);
  res.status(404).json({ error: 'Not found' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
