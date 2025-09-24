import connectDB from './config.js';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

// 定义订单Schema
const OrderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, default: 1 },
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);
const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({ username: String }));
const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({ price: Number }));

// 验证令牌
const verifyToken = (req) => {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('未提供令牌');
    const token = authHeader.split(' ')[1];
    return jwt.verify(token, process.env.JWT_SECRET);
};

// 创建订单（POST /api/orders）
export async function POST(req) {
    await connectDB();
    try {
        const decoded = verifyToken(req); // 获取当前用户ID
        const { productId, quantity } = await req.json();
        // 查找商品
        const product = await Product.findById(productId);
        if (!product) return NextResponse.json({ message: '商品不存在' }, { status: 404 });
        // 计算总价
        const totalPrice = product.price * quantity;
        // 检查用户钻石是否足够
        const user = await User.findById(decoded.id);
        if (user.diamonds < totalPrice) {
            return NextResponse.json({ message: '钻石不足' }, { status: 400 });
        }
        // 扣除钻石
        user.diamonds -= totalPrice;
        await user.save();
        // 创建订单
        const order = await Order.create({
            userId: decoded.id,
            productId,
            quantity,
            totalPrice,
            status: 'pending'
        });
        return NextResponse.json(order, { status: 201 });
    } catch (error) {
        console.error('创建订单失败:', error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

// 获取所有订单（GET /api/orders）
export async function GET(req) {
    await connectDB();
    try {
        verifyToken(req);
        const orders = await Order.find().populate('userId', 'username').populate('productId', 'name');
        return NextResponse.json(orders, { status: 200 });
    } catch (error) {
        console.error('获取订单失败:', error);
        return NextResponse.json({ message: error.message }, { status: 401 });
    }
}

// 修改订单状态（PUT /api/orders/:id）
export async function PUT(req, { params }) {
    await connectDB();
    try {
        verifyToken(req);
        const { status } = await req.json();
        const order = await Order.findByIdAndUpdate(
            params.id,
            { status },
            { new: true }
        );
        if (!order) return NextResponse.json({ message: '订单不存在' }, { status: 404 });
        return NextResponse.json(order, { status: 200 });
    } catch (error) {
        console.error('修改订单失败:', error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
