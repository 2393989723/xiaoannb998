const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const auth = require('../middleware/auth');

// 创建订单
router.post('/', auth, async (req, res) => {
  try {
    const { productId, paymentMethod, contactInfo } = req.body;
    
    // 查找商品
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: '商品未找到' });
    }
    
    // 创建订单
    const order = new Order({
      user: req.user.id,
      product: productId,
      paymentMethod,
      contactInfo
    });
    
    await order.save();
    
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
});

// 获取用户订单
router.get('/my-orders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('product', 'name price diamonds')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
});

// 获取所有订单 (管理员)
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: '无权执行此操作' });
    }
    
    const orders = await Order.find()
      .populate('user', 'username email')
      .populate('product', 'name price diamonds')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
});

// 更新订单状态 (管理员)
router.put('/:id/status', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: '无权执行此操作' });
    }
    
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('user', 'username email')
     .populate('product', 'name price diamonds');
    
    if (!order) {
      return res.status(404).json({ message: '订单未找到' });
    }
    
    // 如果订单完成，为用户添加钻石
    if (status === 'completed' && order.product) {
      await User.findByIdAndUpdate(order.user._id, {
        $inc: { diamonds: order.product.diamonds }
      });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
});

module.exports = router;
