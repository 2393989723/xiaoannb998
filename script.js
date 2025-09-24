// script.js（调整注册接口路径，适配`users.js`）
async function registerUser(username, password) {
  try {
    const response = await fetch('/api/users/register', { // 正确路径：/api/users/register（对应`users.js`中的`register`函数）
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || '注册失败');
    }

    // 注册成功处理（如自动登录、跳转登录页）
    alert('注册成功！即将跳转登录页...');
    setTimeout(() => {
      window.location.href = '/login.html'; // 跳转登录页（根据你的项目路径调整）
    }, 1000);

    return data;
  } catch (error) {
    console.error('注册失败:', error);
    alert(error.message || '注册失败，请重试');
  }
}
