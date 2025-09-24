import connectDB from './config.js';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

// 定义用户Schema
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    diamonds: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

// 密码哈希中间件
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// 验证密码方法
UserSchema.methods.comparePassword = async function(password) {
    return bcrypt.compare(password, this.password);
};

// 生成JWT令牌方法
UserSchema.methods.generateToken = function() {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// 初始化模型
const User = mongoose.models.User || mongoose.model('User', UserSchema);

// 注册接口（POST /api/auth/register）
export async function POST(req) {
    await connectDB();
    try {
        const { username, password } = await req.json();
        // 检查用户名是否存在
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return NextResponse.json({ message: '用户名已存在' }, { status: 400 });
        }
        // 创建新用户
        const user = await User.create({ username, password });
        // 生成令牌
        const token = user.generateToken();
        // 返回用户信息（隐藏密码）
        const userInfo = {
            _id: user._id,
            username: user.username,
            diamonds: user.diamonds,
            createdAt: user.createdAt
        };
        return NextResponse.json({ token, user: userInfo }, { status: 201 });
    } catch (error) {
        console.error('注册失败:', error);
        return NextResponse.json({ message: '注册失败' }, { status: 500 });
    }
}

// 登录接口（POST /api/auth/login）
export async function POST_LOGIN(req) {
    await connectDB();
    try {
        const { username, password } = await req.json();
        // 查找用户
        const user = await User.findOne({ username });
        if (!user) {
            return NextResponse.json({ message: '用户名或密码错误' }, { status: 401 });
        }
        // 验证密码
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return NextResponse.json({ message: '用户名或密码错误' }, { status: 401 });
        }
        // 生成令牌
        const token = user.generateToken();
        // 返回用户信息
        const userInfo = {
            _id: user._id,
            username: user.username,
            diamonds: user.diamonds
        };
        return NextResponse.json({ token, user: userInfo }, { status: 200 });
    } catch (error) {
        console.error('登录失败:', error);
        return NextResponse.json({ message: '登录失败' }, { status: 500 });
    }
}

// 注意：Next.js 13+ 的路由需要用 `export function POST` 对应请求方法，
// 若使用旧版本，可能需要调整为 `module.exports = (req, res) => {...}`。
