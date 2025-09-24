// 用于调用注册接口，处理前后端通信
export const registerUser = async (username, password) => {
  const res = await fetch('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || '注册失败，请检查输入或网络');
  }

  return res.json();
};


