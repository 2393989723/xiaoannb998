// script.js（注册功能修正版）
async function registerUser(username, password) {
  try {
    // 1. 发送POST请求到后端注册API（相对路径，适配Vercel部署）
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // 告知后端请求体为JSON格式
      },
      body: JSON.stringify({ username, password }), // 将用户名和密码转为JSON字符串
    });

    // 2. 解析后端响应（无论成功或失败）
    const data = await response.json();

    // 3. 处理错误（后端返回非200状态码）
    if (!response.ok) {
      throw new Error(data.message || '注册失败，请重试');
    }

    // 4. 注册成功：自动登录（可选，提升用户体验）
    await loginUser(username, password);

    // 5. 返回成功信息（供前端显示）
    return data;
  } catch (error) {
    // 6. 捕获并抛出错误（前端可显示）
    throw new Error(error.message || '注册失败，请重试');
  }
}

// 登录函数（修正版，配合注册成功后自动登录）
async function loginUser(username, password) {
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || '登录失败，请重试');
    }

    // 保存令牌和用户信息到本地存储（用于身份验证）
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('currentUser', JSON.stringify(data.user));

    // 更新UI（显示用户信息）
    updateUIForLoggedInUser(data.user);

    return data;
  } catch (error) {
    throw new Error(error.message || '登录失败，请重试');
  }
}
