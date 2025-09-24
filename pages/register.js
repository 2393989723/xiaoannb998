// 1. 导入Next.js/React核心模块
import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
// 2. 导入样式与接口函数（需提前创建）
import '../styles.css';
import { registerUser } from '../script.js'; // 假设注册逻辑在script.js中

export default function Register() {
  // 3. 状态管理（替代直接DOM操作）
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('red');
  const router = useRouter(); // 4. 路由跳转（替代window.location）

  // 5. 注册提交处理函数（整合原script逻辑）
  const handleSubmit = async (e) => {
    e.preventDefault(); // 阻止表单默认提交
    const username = e.target.username.value;
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;

    // 6. 前端验证（保留原逻辑）
    if (password !== confirmPassword) {
      setMessage('密码确认不一致');
      setMessageColor('red');
      return;
    }

    try {
      // 7. 调用注册接口（需后端支持）
      await registerUser(username, password);
      setMessage('注册成功！即将跳转登录页...');
      setMessageColor('green');
      // 8. 延迟跳转（使用Next.js路由）
      setTimeout(() => router.push('/login'), 1500);
    } catch (error) {
      setMessage(error.message || '注册失败');
      setMessageColor('red');
    }
  };

  return (
    <>
      {/* 9. 页面头部（Next.js规范，设置标题/meta） */}
      <Head>
        <title>注册 - 游戏账号购买平台</title>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      {/* 10. 页面主体（保留原HTML结构，调整React语法） */}
      <div className="container"> {/* class → className（React要求） */}
        <header>
          <h1>游戏账号购买平台</h1>
          <nav>
            {/* 11. 导航链接（移除`.html`后缀，符合Next.js路由） */}
            <a href="/">首页</a>
            <a href="/login">登录</a>
            <a href="/register" className="active">注册</a> {/* 当前页高亮 */}
            <a href="/dashboard">我的账户</a>
            <a href="/admin">管理员</a>
          </nav>
        </header>

        <main>
          <div className="form-container">
            <h2>用户注册</h2>
            {/* 12. 表单提交（使用React的onSubmit事件） */}
            <form id="registerForm" onSubmit={handleSubmit}>
              <div className="form-group">
                {/* for → htmlFor（React要求，避免关键字冲突） */}
                <label htmlFor="username">用户名</label>
                <input type="text" id="username" name="username" required />
              </div>
              <div className="form-group">
                <label htmlFor="password">密码</label>
                <input type="password" id="password" name="password" required />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">确认密码</label>
                <input type="password" id="confirmPassword" name="confirmPassword" required />
              </div>
              <button type="submit" className="btn">注册</button>
            </form>
            <div className="form-footer">
              <p>已有账号？<a href="/login">立即登录</a></p>
            </div>
            {/* 13. 消息提示（使用state驱动，替代直接DOM操作） */}
            {message && (
              <div id="message" className="message" style={{ color: messageColor }}>
                {message}
              </div>
            )}
          </div>
        </main>

        <footer>
          <p>&copy; 2023 游戏账号购买平台. 所有权利保留.</p>
        </footer>
      </div>
    </>
  );
}
