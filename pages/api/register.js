// pages/api/register.js（Next.js API路由，处理注册逻辑）
import User from '../../models/User'; // 导入用户模型

export default async function handler(req, res) {
  // 仅允许POST请求
  if (req.method !== 'POST') {
    return res.status(405).json({ message: '仅支持POST请求' });
  }

  const { username, password } = req.body;

  // 参数合法性验证
  if (!username || !password) {
    return res.status(400).json({ message: '用户名或密码不能为空' });
  }

  try {
    // 检查用户名是否已存在
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: '用户名已存在' });
    }

    // 创建新用户（密码需加密，此处示例用明文，实际需用bcrypt等加密）
    const newUser = new User({
      username,
      password, // 实际项目中需替换为加密后的密码，如 await bcrypt.hash(password, 10)
      diamonds: 0, // 初始钻石数
    });

    await newUser.save();

    res.status(200).json({ message: '注册成功' });
  } catch (error) {
    res.status(500).json({ message: '注册失败，请重试', error: error.message });
  }
}
