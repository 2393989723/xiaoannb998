// API基础URL - 部署时需要更新为实际的API地址
const API_BASE_URL = 'https://your-vercel-app.vercel.app/api';

// 模拟数据库 - 实际部署时会使用MongoDB Atlas
let mockDatabase = {
    users: JSON.parse(localStorage.getItem('users')) || [],
    products: JSON.parse(localStorage.getItem('products')) || [
        { id: 1, name: '高级游戏账号 A', description: '包含大量游戏角色和皮肤', price: 500, stock: 10 },
        { id: 2, name: '豪华游戏账号 B', description: '满级账号，稀有装备齐全', price: 800, stock: 5 },
        { id: 3, name: '至尊游戏账号 C', description: '全英雄全皮肤，VIP等级最高', price: 1200, stock: 3 }
    ],
    orders: JSON.parse(localStorage.getItem('orders')) || []
};

// 保存数据到localStorage
function saveDataToLocalStorage() {
    localStorage.setItem('users', JSON.stringify(mockDatabase.users));
    localStorage.setItem('products', JSON.stringify(mockDatabase.products));
    localStorage.setItem('orders', JSON.stringify(mockDatabase.orders));
}

// 初始化函数
function initializeApp() {
    // 检查用户是否已登录
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        updateUIForLoggedInUser(user);
    }
    
    // 保存初始数据
    saveDataToLocalStorage();
}

// 更新UI显示已登录用户
function updateUIForLoggedInUser(user) {
    const userElements = document.querySelectorAll('.user-info');
    userElements.forEach(element => {
        element.innerHTML = `
            <p>用户名: ${user.username}</p>
            <p>钻石: ${user.diamonds}</p>
        `;
    });
    
    const authLinks = document.querySelectorAll('nav a');
    authLinks.forEach(link => {
        if (link.textContent === '登录' || link.textContent === '注册') {
            link.style.display = 'none';
        }
    });
}

// 注册功能
async function registerUser(username, password) {
    // 检查用户名是否已存在
    const existingUser = mockDatabase.users.find(user => user.username === username);
    if (existingUser) {
        throw new Error('用户名已存在');
    }
    
    // 创建新用户
    const newUser = {
        id: Date.now(),
        username,
        password, // 注意：实际应用中应该加密密码
        diamonds: 0,
        createdAt: new Date().toISOString()
    };
    
    mockDatabase.users.push(newUser);
    saveDataToLocalStorage();
    
    return { message: '注册成功' };
}

// 登录功能
async function loginUser(username, password) {
    const user = mockDatabase.users.find(u => u.username === username && u.password === password);
    if (!user) {
        throw new Error('用户名或密码错误');
    }
    
    // 创建认证令牌
    const authToken = generateAuthToken();
    localStorage.setItem('authToken', authToken);
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    return { 
        token: authToken, 
        user: {
            id: user.id,
            username: user.username,
            diamonds: user.diamonds
        }
    };
}

// 生成简单的认证令牌
function generateAuthToken() {
    return 'token_' + Math.random().toString(36).substr(2) + Date.now().toString(36);
}

// 获取用户信息
function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
}

// 获取商品列表
async function getProducts() {
    return mockDatabase.products;
}

// 创建订单
async function createOrder(productId, quantity) {
    const user = getCurrentUser();
    if (!user) {
        throw new Error('请先登录');
    }
    
    const product = mockDatabase.products.find(p => p.id === productId);
    if (!product) {
        throw new Error('商品不存在');
    }
    
    if (user.diamonds < product.price * quantity) {
        throw new Error('钻石不足');
    }
    
    // 扣除钻石
    user.diamonds -= product.price * quantity;
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    // 更新用户数据
    const userIndex = mockDatabase.users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
        mockDatabase.users[userIndex].diamonds = user.diamonds;
    }
    
    // 创建订单
    const newOrder = {
        id: Date.now(),
        userId: user.id,
        productId,
        quantity,
        totalPrice: product.price * quantity,
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    
    mockDatabase.orders.push(newOrder);
    saveDataToLocalStorage();
    
    return newOrder;
}

// 获取用户订单
async function getUserOrders() {
    const user = getCurrentUser();
    if (!user) {
        return [];
    }
    
    return mockDatabase.orders.filter(order => order.userId === user.id);
}

// 管理员功能 - 获取所有用户
async function adminGetUsers() {
    // 在实际应用中，这里应该检查管理员权限
    return mockDatabase.users.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    });
}

// 管理员功能 - 更新用户钻石
async function adminUpdateUserDiamonds(userId, diamonds) {
    // 在实际应用中，这里应该检查管理员权限
    const userIndex = mockDatabase.users.findIndex(user => user.id === userId);
    if (userIndex === -1) {
        throw new Error('用户不存在');
    }
    
    mockDatabase.users[userIndex].diamonds = diamonds;
    saveDataToLocalStorage();
    
    // 如果更新的是当前登录用户，更新localStorage
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.id === userId) {
        currentUser.diamonds = diamonds;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
    
    return mockDatabase.users[userIndex];
}

// 管理员功能 - 获取所有订单
async function adminGetOrders() {
    // 在实际应用中，这里应该检查管理员权限
    return mockDatabase.orders;
}

// 管理员功能 - 更新订单状态
async function adminUpdateOrderStatus(orderId, status) {
    // 在实际应用中，这里应该检查管理员权限
    const orderIndex = mockDatabase.orders.findIndex(order => order.id === orderId);
    if (orderIndex === -1) {
        throw new Error('订单不存在');
    }
    
    mockDatabase.orders[orderIndex].status = status;
    saveDataToLocalStorage();
    
    return mockDatabase.orders[orderIndex];
}

// 初始化应用
document.addEventListener('DOMContentLoaded', initializeApp);
