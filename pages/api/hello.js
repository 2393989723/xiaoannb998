// 测试接口，对应访问路径：https://your-project.vercel.app/api/hello
export default function handler(req, res) {
  res.status(200).json({ message: 'API接口正常' });
}
