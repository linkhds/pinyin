const express = require('express');
const pinyin = require('pinyin');
const cors = require('cors');

const app = express();

// 启用 CORS
app.use(cors());

// 处理 JSON 请求
app.use(express.json());

// 健康检查endpoint
app.get('/api', (req, res) => {
  res.json({ status: 'ok' });
});

// 汉字转拼音的主要endpoint
app.post('/api/convert', (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ 
        error: 'Missing text parameter' 
      });
    }

    const result = pinyin(text, {
      style: pinyin.STYLE_TONE, // 启用声调
      heteronym: false // 禁用多音字
    });

    // 将二维数组转换为一维数组
    const pinyinArray = result.map(item => item[0]);

    res.json({
      original: text,
      pinyin: pinyinArray,
      pinyinString: pinyinArray.join(' ')
    });

  } catch (error) {
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

// 处理 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// 对于 Vercel，我们需要导出 app
module.exports = app;

// 如果直接运行文件，则启动服务器
if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}
