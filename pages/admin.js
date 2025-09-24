import Head from 'next/head';

export default function Admin() {
  return (
    <>
      <Head>
        <title>管理员页面-游戏账号购买平台</title>
      </Head>
      <div>
        <h1>游戏账号购买平台</h1>
        <nav>
          <a href="/">首页</a>
          <a href="/login">登录</a>
          <a href="/register">注册</a>
          <a href="/dashboard">我的账户</a>
          <a href="/admin" style={{ color: 'blue' }}>管理员</a>
        </nav>
        <div style={{ maxWidth: '400px', margin: '20px auto' }}>
          <h2>管理员控制台</h2>
          <p>这里是管理员功能区域，可进行用户管理、系统配置等操作</p>
        </div>
      </div>
    </>
  );
}
