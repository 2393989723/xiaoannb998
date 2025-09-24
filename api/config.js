import mongoose from 'mongoose';

const connectDB = async () => {
    if (mongoose.connections[0].readyState) return; // 避免重复连接
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB Atlas 连接成功！');
    } catch (error) {
        console.error('MongoDB 连接失败:', error);
        process.exit(1);
    }
};

export default connectDB;
