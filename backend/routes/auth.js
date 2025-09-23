const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcrypt');

// 注册
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // 检查用户是否已存在
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: '用户名或邮箱已被使用' });
    }
    
    // 创建新用户
    const user = new User({ username, email, password });
    await user.save();
    
    // 生成JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    res.status(201).json({ token, user: { id: user._id, username: user.username, email: user.email, diamonds: user.diamonds } });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
});

// 登录
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // 查找用户
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }
    
    // 验证密码
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }
    
    // 生成JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    res.json({ token, user: { id: user._id, username: user.username, email: user.email, diamonds: user.diamonds } });
  } catch (error) {
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
});

// 获取当前用户信息
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: '未提供认证令牌' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(401).json({ message: '无效的认证令牌', error: error.message });
  }
});

module.exports = router;
