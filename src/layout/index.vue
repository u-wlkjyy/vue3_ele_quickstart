<template>
  <div class="layout-container">
    <!-- 侧边栏 -->
    <div 
      v-show="!isCollapse" 
      class="menu-overlay"
      :class="{ 'menu-overlay-visible': !isCollapse }"
      @click.self="toggleCollapse"
    >
      <div class="menu-container">
        <!-- 左侧导航 -->
        <div class="menu-left">
          <div class="menu-logo" @click="handleLogoClick">
            <img src="../assets/logo.png" alt="logo" class="logo-img">
          </div>
          <div class="menu-nav">
            <div 
              class="menu-nav-item" 
              :class="{ active: activeSection === 'recent' }"
              @click="activeSection = 'recent'"
            >
              <el-icon><Timer /></el-icon>
              <span>最近访问</span>
            </div>
            <div 
              class="menu-nav-item" 
              :class="{ active: activeSection === 'products' }"
              @click="activeSection = 'products'"
            >
              <el-icon><Box /></el-icon>
              <span>产品与服务</span>
            </div>
            <div 
              class="menu-nav-item" 
              :class="{ active: activeSection === 'resources' }"
              @click="activeSection = 'resources'"
            >
              <el-icon><Files /></el-icon>
              <span>我的资源</span>
            </div>
          </div>
        </div>

        <!-- 右侧内容 -->
        <div class="menu-right">
          <div class="menu-header">
            <el-input
              v-model="searchKeyword"
              placeholder="请输入关键字搜索产品"
              prefix-icon="Search"
              class="menu-search-input"
              clearable
            />
          </div>

          <!-- 最近访问 -->
          <div v-show="activeSection === 'recent'" class="menu-content">
            <div class="section-title">最近访问产品</div>
            <div class="recent-grid">
              <div class="recent-item" @click="handleMenuClick('/dashboard/compute/ecs')">
                <el-icon><Monitor /></el-icon>
                <span>云服务器</span>
              </div>
              <div class="recent-item">
                <el-icon><Connection /></el-icon>
                <span>云数据库</span>
              </div>
            </div>
          </div>

          <!-- 产品与服务 -->
          <div v-show="activeSection === 'products'" class="menu-content">
            <div class="menu-category">
              <div class="category-col">
                <div class="category-title">计算</div>
                <div class="category-list">
                  <div class="category-link" @click="handleMenuClick('/dashboard/compute/ecs')">
                    云服务器
                  </div>
                  <div class="category-link">
                    轻量应用服务器
                  </div>
                  <div class="category-link">
                    GPU 云服务器
                  </div>
                </div>
              </div>

              <div class="category-col">
                <div class="category-title">存储</div>
                <div class="category-list">
                  <div class="category-link">
                    对象存储
                  </div>
                  <div class="category-link">
                    文件存储
                  </div>
                  <div class="category-link">
                    云硬盘
                  </div>
                </div>
              </div>

              <div class="category-col">
                <div class="category-title">网络</div>
                <div class="category-list">
                  <div class="category-link">
                    负载均衡
                  </div>
                  <div class="category-link">
                    NAT 网关
                  </div>
                  <div class="category-link">
                    VPN 连接
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 我的资源 -->
          <div v-show="activeSection === 'resources'" class="menu-content">
            <div class="section-title">资源列表</div>
            <div class="recent-grid">
              <div class="recent-item" @click="handleMenuClick('/dashboard/compute/ecs')">
                <el-icon><Monitor /></el-icon>
                <span>云服务器（2台运行中）</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="main-wrapper">
      <!-- 顶部导航栏 -->
      <el-header class="header-container">
        <div class="header-left">
          <el-icon 
            class="collapse-btn"
            @click="toggleCollapse">
            <Fold v-if="isCollapse"/>
            <Expand v-else/>
          </el-icon>
          <el-breadcrumb separator="/" class="breadcrumb" v-show="!isMobile">
            <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
            <template v-for="(item, index) in breadcrumbData" :key="item.path">
              <el-breadcrumb-item v-if="index > 0">{{ item.title }}</el-breadcrumb-item>
            </template>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <el-input
            v-show="!isMobile"
            placeholder="搜索资源..."
            prefix-icon="Search"
            class="search-input"
          />
          <el-badge :value="3" :max="99" type="danger">
            <el-button class="notification-btn" :icon="Bell" circle />
          </el-badge>
          <el-dropdown trigger="click">
            <el-space>
              <Avatar :file-id="userData.cover" :size="32"></Avatar>
              <span class="username" v-show="!isMobile">{{userData.user_name}}</span>
              <el-icon class="el-icon--right"><CaretBottom /></el-icon>
            </el-space>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>
                  <el-icon><User /></el-icon>个人信息
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-icon><Setting /></el-icon>安全设置
                </el-dropdown-item>
                <el-dropdown-item divided @click="loginOut()">
                  <el-icon><SwitchButton /></el-icon>退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <!-- 主要内容区 -->
      <div class="main-container">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import {computed, onBeforeUnmount, onMounted, ref, watch} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {
  Bell,
  Box,
  CaretBottom,
  Close,
  Connection,
  Cpu,
  Expand,
  Files,
  Fold,
  Monitor,
  Search,
  Setting,
  SwitchButton,
  Timer,
  User,
  Wallet
} from '@element-plus/icons-vue'
import apiServer_client from "@/utils/apiServer_client.js";
import Avatar from '@/layout/components/Avatar.vue';

export default {
  name: 'Layout',
  computed: {
    apiServer_client() {
      return apiServer_client
    }
  },
  components: {
    Monitor,
    Box,
    Wallet,
    Fold,
    Expand,
    User,
    Setting,
    SwitchButton,
    CaretBottom,
    Connection,
    Cpu,
    Bell,
    Search,
    Close,
    Timer,
    Files,
    Avatar
  },
  setup() {
    const isCollapse = ref(true)
    const isMobile = ref(false)
    const route = useRoute()
    const router = useRouter()
    const userData = ref({})

    const activeMenu = computed(() => route.path)

    // 计算面包屑数据
    const breadcrumbData = computed(() => {
      const { path, matched } = route
      return matched.map(item => ({
        path: item.path,
        title: item.meta?.title || ''
      }))
    })

    const checkMobile = () => {
      isMobile.value = window.innerWidth <= 768
      if (isMobile.value) {
        isCollapse.value = true
      }
    }

    const toggleCollapse = () => {
      isCollapse.value = !isCollapse.value
    }

    const handleMenuClick = (path) => {
      if (path && path !== route.path) {
        router.push(path)
      }
      isCollapse.value = true
    }

    const handleLogoClick = () => {
      router.push('/dashboard')
      isCollapse.value = true
    }

    const getUserInfo = async () => {
      userData.value = await apiServer_client.getUserInfo()
      console.log(userData)
    }

    const loginOut = () => {
      localStorage.removeItem('token')
      router.push('/login')
    }

    // 监听路由变化，关闭侧边栏
    watch(route, () => {
      isCollapse.value = true
    })

    onMounted(() => {
      checkMobile()
      getUserInfo()
      window.addEventListener('resize', checkMobile)
    })

    onBeforeUnmount(() => {
      window.removeEventListener('resize', checkMobile)
    })

    const activeSection = ref('recent')
    const searchKeyword = ref('')

    return {
      isCollapse,
      isMobile,
      activeMenu,
      breadcrumbData,
      toggleCollapse,
      handleMenuClick,
      Bell,
      activeSection,
      searchKeyword,
      handleLogoClick,
      userData,
      loginOut
    }
  }
}
</script>

<style scoped>
.layout-container {
  height: 100vh;
  position: relative;
  background-color: var(--el-bg-color-page);
}

.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2000;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease-out;
  display: flex;
}

.menu-overlay-visible {
  opacity: 1;
  visibility: visible;
}

.menu-container {
  position: relative;
  display: flex;
  width: 70%;
  max-width: 1000px;
  height: 100%;
  background-color: #fff;
  margin-left: -1000px; /* 初始位置在屏幕左侧外 */
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.menu-overlay-visible .menu-container {
  margin-left: 0; /* 展开时移动到可见区域 */
}

.menu-left {
  width: 180px;
  min-width: 180px;
  background-color: #fff;
  border-right: 1px solid #f0f0f0;
}

.menu-right {
  flex: 1;
  height: 100%;
  padding: 20px;
  overflow-y: auto;
  background-color: var(--el-bg-color);
  min-width: 400px;
}

.menu-search {
  margin-bottom: 20px;
}

.menu-search-input {
  width: 100%;
  max-width: 500px;
}

.menu-content {
  padding: 0 20px;
  opacity: 0;
  transform: translateX(-20px);
  transition: all 0.3s ease-out;
  transition-delay: 0.1s;
}

.menu-overlay-visible .menu-content {
  opacity: 1;
  transform: translateX(0);
}

.menu-section {
  margin-bottom: 30px;
}

.menu-section h3 {
  font-size: 16px;
  color: var(--el-text-color-primary);
  margin-bottom: 16px;
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.menu-item:hover {
  background-color: var(--el-color-primary-light-9);
}

.menu-item .el-icon {
  font-size: 20px;
  color: var(--el-color-primary);
}

.menu-close {
  position: fixed;
  right: 24px;
  top: 24px;
  font-size: 20px;
  cursor: pointer;
  color: #909399;
  padding: 8px;
  border-radius: 4px;
  z-index: 2001;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
}

.menu-close:hover {
  color: #1d2129;
  background-color: #f2f3f5;
  transform: rotate(90deg);
}

.main-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header-container {
  background-color: var(--el-bg-color-overlay);
  border-bottom: 1px solid var(--el-border-color-light);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  height: 48px;
  box-sizing: border-box;
  flex-shrink: 0;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.breadcrumb {
  font-size: 14px;
  color: var(--el-text-color-regular);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.search-input {
  width: 240px;
  transition: all 0.3s;
}

.search-input :deep(.el-input__wrapper) {
  background-color: var(--el-bg-color-page);
  box-shadow: none;
  border: 1px solid var(--el-border-color);
}

.search-input:focus {
  width: 320px;
}

.notification-btn {
  padding: 6px 12px;
  height: 32px;
}

.collapse-btn {
  font-size: 18px;
  cursor: pointer;
  color: var(--el-text-color-regular);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  transition: all 0.3s;
}

.collapse-btn:hover {
  background-color: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}

/* 修改面包屑样式 */
:deep(.el-breadcrumb__item) {
  .el-breadcrumb__inner {
    color: var(--el-text-color-regular);
    font-weight: normal;
    &.is-link {
      color: var(--el-text-color-secondary);
      &:hover {
        color: var(--el-color-primary);
      }
    }
  }
  &:last-child .el-breadcrumb__inner {
    color: var(--el-text-color-primary);
    font-weight: 500;
  }
}

/* 修改头像样式 */
.el-avatar {
  background-color: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
  cursor: pointer;
  transition: all 0.3s;
  &:hover {
    transform: scale(1.05);
  }
}

.main-container {
  flex: 1;
  overflow: auto;
  padding: 20px;
  background-color: var(--el-bg-color-page);
}

.logo-container {
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  color: #fff;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.logo-img {
  height: 32px;
  margin-right: 12px;
}

.logo-text {
  font-size: 18px;
  font-weight: 600;
  white-space: nowrap;
  color: #fff;
  opacity: 0.95;
}

.el-menu {
  border-right: none !important;
}

.el-menu-item {
  height: 50px !important;
  line-height: 50px !important;
  padding: 0 20px !important;
}

.el-menu-item .el-icon {
  font-size: 18px;
  margin-right: 12px;
  color: rgba(255, 255, 255, 0.7);
}

.el-menu-item:hover {
  background-color: var(--aside-hover-bg) !important;
}

.el-menu-item.is-active {
  background-color: var(--aside-active-bg) !important;
  color: #fff !important;
}

.el-menu-item.is-active .el-icon {
  color: #fff !important;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .header-container {
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 1000;
  }

  .main-container {
    padding-top: 48px;
  }
}

@media screen and (min-width: 769px) {
  .main-container {
    padding-top: 20px;
  }
}

.username {
  font-size: 14px;
  color: var(--el-text-color-primary);
  margin-right: 4px;
}

.el-dropdown {
  cursor: pointer;
  display: flex;
  align-items: center;
  height: 48px;
  padding: 0 8px;
  transition: all 0.3s;

  &:hover {
    background: var(--el-color-primary-light-9);
  }
}

:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  
  .el-icon {
    font-size: 16px;
  }
}

.el-badge :deep(.el-badge__content) {
  box-shadow: 0 0 0 1px #fff;
}

.el-menu-vertical {
  border-right: none;
  width: 200px;
}

:deep(.el-menu-item), :deep(.el-sub-menu__title) {
  height: 50px;
  line-height: 50px;
}

:deep(.el-menu-item.is-active) {
  background-color: var(--el-color-primary) !important;
  color: #fff !important;
}

:deep(.el-sub-menu.is-active .el-sub-menu__title) {
  color: var(--el-color-primary);
}

:deep(.el-menu-item:hover), :deep(.el-sub-menu__title:hover) {
  background-color: var(--el-color-primary-light-9);
}

:deep(.el-sub-menu .el-menu-item) {
  min-width: unset;
  padding-left: 50px !important;
}

.menu-nav {
  padding: 20px 0;
}

.menu-nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  cursor: pointer;
  transition: all 0.2s;
  color: #4e5969;
}

.menu-overlay-visible .menu-nav-item {
  opacity: 1;
  transform: translateX(0);
}

.menu-nav-item:hover {
  background-color: #f7f8fa;
  color: #1d2129;
}

.menu-nav-item.active {
  background-color: #e8f3ff;
  color: var(--el-color-primary);
}

.menu-nav-item .el-icon {
  font-size: 18px;
}

.menu-header {
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
  background-color: #fff;
}

.search-wrapper {
  width: 100%;
  max-width: 640px;
}

.menu-search-input {
  width: 100%;
}

.menu-search-input :deep(.el-input__wrapper) {
  box-shadow: none;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding-right: 40px;
}

.menu-search-input :deep(.el-input__wrapper):hover {
  border-color: #c0c4cc;
}

.menu-search-input :deep(.el-input__wrapper):focus-within {
  border-color: var(--el-color-primary);
}

.menu-close {
  position: absolute;
  right: -40px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 18px;
  cursor: pointer;
  color: #909399;
  padding: 8px;
  border-radius: 4px;
  transition: all 0.2s;
}

.menu-close:hover {
  color: #606266;
}

.menu-content {
  padding: 24px 32px;
  height: calc(100% - 73px);
  overflow-y: auto;
  background-color: #fff;
}

.section-title {
  font-size: 14px;
  color: #1d2129;
  margin-bottom: 20px;
  font-weight: 500;
}

.recent-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}

.recent-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f7f8fa;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.recent-item:hover {
  background: white;
  border-color: #e4e7ed;
}

.recent-item .el-icon {
  font-size: 18px;
  color: #1d2129;
}

.recent-item span {
  font-size: 14px;
  color: #1d2129;
}

.menu-category {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 48px;
  padding: 0;
}

.category-col {
  min-width: 180px;
}

.category-title {
  font-size: 14px;
  color: #1d2129;
  margin-bottom: 20px;
  font-weight: 500;
  position: relative;
}

.category-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.category-link {
  font-size: 13px;
  color: #4e5969;
  cursor: pointer;
  transition: all 0.2s;
  line-height: 1.6;
  padding: 2px 0;
}

.category-link:hover {
  color: var(--el-color-primary);
}

.menu-left {
  width: 180px;
  min-width: 180px;
  background-color: #fff;
  border-right: 1px solid #f0f0f0;
}

.menu-container {
  width: 85%;
  max-width: 1280px;
  background-color: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.menu-close {
  font-size: 16px;
  cursor: pointer;
  color: #4e5969;
  padding: 8px;
  border-radius: 4px;
  margin-left: 16px;
}

.menu-close:hover {
  background-color: #f2f3f5;
  color: #1d2129;
}

.menu-logo {
  height: 56px;
  display: flex;
  align-items: center;
  padding: 0 24px;
  border-bottom: 1px solid #f0f0f0;
  background-color: #fff;
}

.logo-img {
  height: 28px;
  transition: all 0.3s;
}

.menu-logo:hover {
  background-color: #f7f8fa;
}
</style> 