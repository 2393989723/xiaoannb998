// models/User.js（MongoDB用户模型）
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, '用户名不能为空'],
    unique: true, // 数据库级用户名唯一约束
    trim: true, // 去除首尾空格
  },
  password: {
    type: String,
    required: [true, '密码不能为空'],
    minlength: [6, '密码至少6位'], // 密码长度约束
  },
  diamonds: {
    type: Number,
    default: 0, // 初始钻石数（可自定义）
  },
  createdAt: {
    type: Date,
    default: Date.now, // 自动记录创建时间
  },
});

// 导出用户模型（集合名称为'users'，自动复数化）
export default mongoose.models.User || mongoose.model('User', UserSchema);
