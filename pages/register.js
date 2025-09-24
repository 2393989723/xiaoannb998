// pages/register.js（Next.js注册页面，适配React语法）
import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import styles from '../../styles.css'; // 导入样式
import { registerUser } from '../../script.js'; // 导入注册函数

export default function Register() {
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('red');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;

    if (password !== confirmPassword) {
      setMessage('密码确认不一致');
      setMessageColor('red');
      return;
    }

    await registerUser(username, password);
  };

  return (
    <>
      <Head>
        <title>注册 - 游戏账号购买平台</title>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="container">
        <header>
          <h1>游戏账号购买平台</h1>
          <nav>
            <a href="/">首页</a>
            <a href="/login">登录</a>
            <a href="/register" className="active">注册</a>
            <a href="/dashboard">我的账户</a>
            <a href="/admin">管理员</a>
          </nav>
        </header>

        <main>
          <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
            <h2>注册</h2>
            <form onSubmit={handleSubmit}>
              <div>
                <label>用户名</label>
                <input type="text" name="username" style={{ width: '100%', padding: '8px', margin: '10px 0' }} required />
              </div>
              <div>
                <label>密码</label>
                <input type="password" name="password" style={{ width: '100%', padding: '8px', margin: '10px 0' }} required minLength={6} />
              </div>
              <div>
                <label>确认密码</label>
                <input type="password" name="confirmPassword" style={{ width: '100%', padding: '8px', margin: '10px 0' }} required minLength={6} />
              </div>
              <p style={{ color: messageColor, textAlign: 'center' }}>{message}</p>
              <button type="submit" style={{ width: '100%', padding: '10px', background: 'green', color: 'white', border: 'none', cursor: 'pointer' }}>
                注册
              </button>
            </form>
          </div>
        </main>
      </div>
    </>
  );
}
