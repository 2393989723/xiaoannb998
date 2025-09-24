// api/config.js（数据库连接配置）
import mongoose from 'mongoose';

export async function connectDB() {
  if (mongoose.connections[0].readyState) {
    return; // 已连接，直接返回
  }
  // 使用环境变量中的MONGODB_URI（Vercel上配置）
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('MongoDB connected successfully');
}
