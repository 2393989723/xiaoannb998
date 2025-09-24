import connectDB from './config.js';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

// 定义商品Schema
const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

// 获取所有商品（GET /api/products）
export async function GET(req) {
    await connectDB();
    try {
        const products = await Product.find();
        return NextResponse.json(products, { status: 200 });
    } catch (error) {
        console.error('获取商品失败:', error);
        return NextResponse.json({ message: '获取商品失败' }, { status: 500 });
    }
}
