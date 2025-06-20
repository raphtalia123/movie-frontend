<template>
  <div class="app-layout min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
    <!-- 头部导航栏 -->
    <header class="navbar">
      <div class="navbar-background"></div>
      <nav class="container mx-auto px-4 flex items-center justify-between h-full relative z-10">
        <!-- Logo 和标题 -->
        <router-link to="/" class="logo-link">
          <div class="logo">
            <span class="logo-icon">🎬</span>
            <span class="logo-text">智能电影推荐系统</span>
          </div>
        </router-link>

        <!-- 导航链接 -->
        <div class="nav-links">
          <router-link to="/" class="nav-item" active-class="nav-active">
            <span class="nav-text">首页</span>
            <div class="nav-indicator"></div>
          </router-link>
          <router-link to="/movies" class="nav-item" active-class="nav-active">
            <span class="nav-text">全部电影</span>
            <div class="nav-indicator"></div>
          </router-link>
        </div>
      </nav>
    </header>

    <!-- 主要内容区域 -->
    <main class="main-content">
      <router-view />
    </main>

    <!-- 页脚 -->
    <footer class="app-footer">
      <div class="footer-background"></div>
      <div class="container mx-auto px-4 py-8 relative z-10">
        <div class="footer-content">
          <div class="footer-logo">
            <span class="text-2xl">🎬</span>
            <span class="footer-title">智能电影推荐系统</span>
          </div>
          <div class="footer-info">
            <p class="copyright">© 2025 数据库大作业 智能电影推荐系统</p>
            <p class="designers">Designed by 阮杭程 & 潘佳豪</p>
          </div>
          <div class="footer-links">
            <a href="#" class="footer-link">关于我们</a>
            <a href="#" class="footer-link">联系方式</a>
            <a href="#" class="footer-link">隐私政策</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
// 可以在这里添加全局状态管理或主题切换逻辑
</script>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* 导航栏样式 */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
  z-index: 1000;
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.navbar-background {
  position: absolute;
  inset: 0;
  background: rgba(17, 24, 39, 0.8);
  backdrop-filter: blur(20px);
}

/* Logo 样式 */
.logo-link {
  text-decoration: none;
  transition: transform 0.3s ease;
}

.logo-link:hover {
  transform: scale(1.02);
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-icon {
  font-size: 2rem;
  filter: drop-shadow(0 0 10px rgba(59, 130, 246, 0.3));
}

.logo-text {
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  background: linear-gradient(45deg, #ffffff, #3b82f6, #8b5cf6);
  background-size: 200% 200%;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: logoShine 3s ease-in-out infinite;
}

@keyframes logoShine {

  0%,
  100% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }
}

/* 导航链接 */
.nav-links {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  padding: 0.5rem 1rem;
  transition: all 0.3s ease;
  border-radius: 0.5rem;
}

.nav-text {
  color: #e5e7eb;
  font-weight: 500;
  font-size: 1rem;
  transition: color 0.3s ease;
}

.nav-item:hover .nav-text {
  color: #3b82f6;
}

.nav-indicator {
  position: absolute;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%) scaleX(0);
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  border-radius: 1px;
  transition: transform 0.3s ease;
}

.nav-item:hover .nav-indicator {
  transform: translateX(-50%) scaleX(1);
}

.nav-active .nav-text {
  color: #3b82f6;
  font-weight: 600;
}

.nav-active .nav-indicator {
  transform: translateX(-50%) scaleX(1);
}

/* 主内容区域 */
.main-content {
  flex: 1;
  margin-top: 80px;
  /* 为固定导航栏留出空间 */
}

/* 页脚样式 */
.app-footer {
  position: relative;
  margin-top: auto;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-background {
  position: absolute;
  inset: 0;
  background: rgba(17, 24, 39, 0.9);
  backdrop-filter: blur(20px);
}

.footer-content {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: 2rem;
  align-items: center;
  color: #9ca3af;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.footer-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: white;
}

.footer-info {
  text-align: center;
}

.copyright {
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.designers {
  font-size: 0.75rem;
  color: #6b7280;
}

.footer-links {
  display: flex;
  justify-content: flex-end;
  gap: 1.5rem;
}

.footer-link {
  color: #9ca3af;
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.3s ease;
}

.footer-link:hover {
  color: #3b82f6;
}

/* 容器样式 */
.container {
  max-width: 1400px;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .footer-content {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 1.5rem;
  }

  .footer-links {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .navbar {
    height: 70px;
  }

  .main-content {
    margin-top: 70px;
  }

  .logo-text {
    font-size: 1.25rem;
  }

  .nav-links {
    gap: 1rem;
  }

  .nav-item {
    padding: 0.375rem 0.75rem;
  }

  .nav-text {
    font-size: 0.875rem;
  }

  .footer-links {
    flex-direction: column;
    gap: 0.75rem;
  }
}

@media (max-width: 480px) {
  .navbar {
    height: 60px;
  }

  .main-content {
    margin-top: 60px;
  }

  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .logo-text {
    display: none;
  }

  .logo-icon {
    font-size: 1.75rem;
  }
}
</style>