// 导入依赖
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// 创建服务器实例
const app = express();
const port = 3000; // 服务器端口号

// 连接 MongoDB 数据库
mongoose.connect('mongodb://localhost:27017/goodsdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('已成功连接到 MongoDB 数据库'))
.catch(err => console.error('连接数据库失败：', err));

// 定义商品数据模型（类似数据库表结构）
const goodsSchema = new mongoose.Schema({
  name: String,       // 商品名称
  price: Number,      // 商品价格
  description: String // 商品描述
});

// 创建数据模型
const Goods = mongoose.model('Goods', goodsSchema);

// 配置中间件
app.use(cors()); // 允许跨域请求
app.use(bodyParser.json()); // 解析 JSON 格式的请求体

// 编写 API 接口：获取所有商品
app.get('/api/goods', async (req, res) => {
  try {
    const goods = await Goods.find();
    res.json(goods); // 返回商品列表
  } catch (err) {
    res.status(500).json({ error: '获取商品失败' });
  }
});

// 编写 API 接口：添加新商品
app.post('/api/goods', async (req, res) => {
  try {
    const newGoods = new Goods(req.body); // 创建新商品
    await newGoods.save(); // 保存到数据库
    res.status(201).json(newGoods); // 返回新增的商品
  } catch (err) {
    res.status(400).json({ error: '添加商品失败' });
  }
});

// 启动服务器
app.listen(port, () => {
  console.log(`服务器已启动，地址：http://localhost:${port}`);
});