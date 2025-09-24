// api/users.js（已存在的文件，添加注册功能）
import mongoose from 'mongoose';
import User from '../models/User'; // 导入用户模型（路径需根据项目结构调整，如`../models/User`）
import bcrypt from 'bcryptjs';
import { connectDB } from '../config'; // 导入数据库连接函数（若`config.js`不存在，需手动添加，见下文）

// 1. 连接数据库（若`config.js`不存在，可直接写在这里）
const connectDB = async () => {
  if (mongoose.connections[0].readyState) return; // 已连接，直接返回
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('MongoDB connected');
};

// 2. 注册接口（POST /api/users/register）
export async function register(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: '仅支持POST请求' });
  }

  const { username, password } = req.body;

  try {
    // 连接数据库
    await connectDB();

    // 3. 检查用户名是否已存在（避免重复注册）
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: '用户名已存在' });
    }

    // 4. 哈希密码（安全存储，避免明文）
    const hashedPassword = await bcrypt.hash(password, 10); // 10为哈希强度（推荐10-12）

    // 5. 创建新用户（保存到数据库）
    const newUser = await User.create({
      username,
      password: hashedPassword, // 存储哈希后的密码
      diamonds: 0, // 初始钻石数（可自定义）
    });

    // 6. 返回成功响应（不含敏感信息）
    res.status(201).json({
      message: '注册成功',
      user: {
        id: newUser._id,
        username: newUser.username,
        diamonds: newUser.diamonds,
      },
    });
  } catch (error) {
    console.error('注册失败:', error);
    res.status(500).json({ message: '注册失败，请重试' });
  }
}

// （可选）保留`users.js`原有的其他逻辑（如获取用户列表）
export async function getUsers(req, res) {
  // 原有的获取用户列表逻辑（若有）
}
