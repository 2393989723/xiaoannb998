import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { registerUser } from '../script.js';

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
                <input type="text" name="username" className="form-input" required />
              </div>
              <div>
                <label>密码</label>
                <input type="password" name="password" className="form-input" required minLength={6} />
              </div>
              <div>
                <label>确认密码</label>
                <input type="password" name="confirmPassword" className="form-input" required minLength={6} />
              </div>
              <p className={`message ${messageColor}`}>{message}</p>
              <button type="submit" className="btn">注册</button>
            </form>
          </div>
        </main>
      </div>
    </>
  );
}
