import connectDB from './config.js';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
    username: String,
    password: String,
    diamonds: Number,
    createdAt: Date
}));

// 验证令牌中间件（简化版）
const verifyToken = (req) => {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('未提供令牌');
    const token = authHeader.split(' ')[1];
    return jwt.verify(token, process.env.JWT_SECRET);
};

// 获取所有用户（GET /api/users）
export async function GET(req) {
    await connectDB();
    try {
        verifyToken(req); // 验证令牌
        const users = await User.find().select('-password'); // 隐藏密码
        return NextResponse.json(users, { status: 200 });
    } catch (error) {
        console.error('获取用户失败:', error);
        return NextResponse.json({ message: error.message }, { status: 401 });
    }
}

// 修改用户钻石（PUT /api/users/:id）
export async function PUT(req, { params }) {
    await connectDB();
    try {
        verifyToken(req); // 验证令牌
        const { diamonds } = await req.json();
        const user = await User.findByIdAndUpdate(
            params.id,
            { diamonds },
            { new: true } // 返回更新后的文档
        ).select('-password');
        if (!user) {
            return NextResponse.json({ message: '用户不存在' }, { status: 404 });
        }
        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        console.error('修改用户失败:', error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
