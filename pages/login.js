import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // 模拟登录逻辑（实际项目中需调用后端接口）
    setTimeout(() => {
      setMessage('登录成功，跳转仪表盘');
      router.push('/dashboard'); // 跳转到仪表盘页面
      setLoading(false);
    }, 1500);
  };

  return (
    <>
      <Head>
        <title>登录-游戏账号购买平台</title>
      </Head>
      <div>
        <h1>游戏账号购买平台</h1>
        <nav>
          <a href="/">首页</a>
          <a href="/login" style={{ color: 'blue' }}>登录</a>
          <a href="/register">注册</a>
          <a href="/dashboard">我的账户</a>
          <a href="/admin">管理员</a>
        </nav>
        <div style={{ maxWidth: '400px', margin: '20px auto' }}>
          <h2>登录</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '10px' }}>
              <label>用户名</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="请输入用户名"
                required
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label>密码</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入密码"
                required
                minLength={6}
              />
            </div>
            <p style={{ color: 'red' }}>{message}</p>
            <button
              type="submit"
              disabled={loading}
            >
              {loading ? '登录中...' : '登录'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
