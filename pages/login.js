// 登录页面，对应访问路径：https://your-project.vercel.app/login
export default function Login() {
  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h2>登录</h2>
      <form>
        <div>
          <label>用户名</label>
          <input type="text" style={{ width: '100%', padding: '8px', margin: '10px 0' }} />
        </div>
        <div>
          <label>密码</label>
          <input type="password" style={{ width: '100%', padding: '8px', margin: '10px 0' }} />
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px', background: 'green', color: 'white', border: 'none' }}>
          登录
        </button>
      </form>
    </div>
  );
}
