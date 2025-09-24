// 处理注册的后端逻辑（可根据需求集成数据库）
export default function handler(req, res) {
  if (req.method === 'POST') {
    const { username, password } = req.body;

    // 这里可添加真实的数据库操作（如Mongoose连接、用户查重、数据入库）
    // 示例：模拟注册成功
    res.status(200).json({ success: true, message: '注册成功' });
  } else {
    res.status(405).json({ error: '仅支持POST请求' });
  }
}

