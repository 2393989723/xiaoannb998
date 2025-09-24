// script.js（调整注册接口路径，适配 /api/register）
async function registerUser(username, password) {
  try {
    const response = await fetch('/api/register', { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || '注册失败');
    }

    alert('注册成功！即将跳转登录页...');
    setTimeout(() => {
      window.location.href = '/login'; // 跳转登录页
    }, 1000);

    return data;
  } catch (error) {
    console.error('注册失败：', error);
    alert(error.message || '注册失败，请重试');
  }
}

