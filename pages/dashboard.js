import Head from 'next/head';

export default function Dashboard() {
  return (
    <>
      <Head>
        <title>仪表盘-游戏账号购买平台</title>
      </Head>
      <div>
        <h1>游戏账号购买平台</h1>
        <nav>
          <a href="/">首页</a>
          <a href="/login">登录</a>
          <a href="/register">注册</a>
          <a href="/dashboard" style={{ color: 'blue' }}>我的账户</a>
          <a href="/admin">管理员</a>
        </nav>
        <div style={{ maxWidth: '400px', margin: '20px auto' }}>
          <h2>用户仪表盘</h2>
          <p>这里是你的个人中心，可查看账号信息、订单记录等</p>
        </div>
      </div>
    </>
  );
}
