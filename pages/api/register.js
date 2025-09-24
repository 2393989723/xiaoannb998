// pages/api/register.js（Next.js API路由）
export default async function handler(req, res) {
  // 仅允许POST请求
  if (req.method !== 'POST') {
    return res.status(405).json({ message: '仅支持POST请求' });
  }

  const { username, password } = req.body;

  // （可选）验证参数合法性（如用户名长度、密码强度）
  if (!username || !password) {
    return res.status(400).json({ message: '用户名或密码不能为空' });
  }

  try {
    // TODO: 保存用户信息到数据库（如MongoDB、MySQL）
    // 示例：假设保存成功
    res.status(200).json({ message: '注册成功' });
  } catch (error) {
    res.status(500).json({ message: '注册失败，请重试' });
  }
}
