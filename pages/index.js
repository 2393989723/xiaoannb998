// 简单的首页内容，对应访问路径：https://your-project.vercel.app
export default function Home() {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>游戏账号购买平台</h1>
      <p>请访问 <a href="/login">登录</a> 或 <a href="/register">注册</a></p>
    </div>
  );
}
