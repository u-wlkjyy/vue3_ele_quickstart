<template>
  <div class="login-container">
    <div class="login-header-bar">
      <img src="@/assets/logo.png" alt="logo" class="nav-logo">
      <span>登录</span>
    </div>
    <div class="login-content">
      <div class="login-box">
        <div class="login-header">
          <img src="@/assets/logo.png" alt="logo" class="logo">
          <h2>云服务平台</h2>
        </div>
        <div class="login-form">
          <el-form ref="loginForm" :model="loginForm" :rules="loginRules">
            <el-form-item prop="username">
              <el-input 
                v-model="loginForm.username" 
                placeholder="请输入用户名"
                :prefix-icon="User"
              />
            </el-form-item>
            <el-form-item prop="password">
              <el-input 
                v-model="loginForm.password" 
                type="password" 
                placeholder="请输入密码"
                :prefix-icon="Lock"
                show-password
              />
            </el-form-item>
            <div class="remember-row">
              <el-checkbox v-model="loginForm.remember">记住密码</el-checkbox>
              <el-link type="primary" :underline="false">忘记密码？</el-link>
            </div>
            <el-button type="primary" class="login-button" @click="handleLogin">
              登录
            </el-button>
          </el-form>
          <div class="login-footer">
            <span>还没有账号？</span>
            <el-link type="primary" :underline="false" @click="goToRegister">立即注册</el-link>
          </div>
        </div>
      </div>
    </div>
    <div class="login-footer-bar">
      <div class="footer-links">
        <a href="#" target="_blank">公司简介</a>
        <span class="divider">|</span>
        <a href="#" target="_blank">服务条款</a>
        <span class="divider">|</span>
        <a href="#" target="_blank">隐私政策</a>
      </div>
      <div class="copyright">
        Copyright © 2023-2024 Cloud Platform. All Rights Reserved.
      </div>
    </div>
  </div>
</template>

<script>
import { User, Lock } from '@element-plus/icons-vue'
import apiServer_client from "@/utils/apiServer_client.js";

export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
        remember: false
      },
      loginRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate(async valid => {
        if (valid) {
          // TODO: 实现登录逻辑
          console.log('登录表单', this.loginForm)
          const response = await apiServer_client.login(this.loginForm.username, this.loginForm.password)
          // 模拟登录成功
          localStorage.setItem('token', response.data.token)
          this.$router.push('/dashboard')
        }
      })
    },
    goToRegister() {
      this.$router.push('/register')
    }
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-image: url('@/assets/login.jpg');
  background-size: cover;
  background-position: center;
  position: relative;
}

.login-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(1px);
}

.login-header-bar {
  height: 60px;
  padding: 0 40px;
  display: flex;
  align-items: center;
  position: relative;
  z-index: 1;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.nav-logo {
  height: 32px;
  width: auto;
  margin-right: 12px;
  object-fit: contain;
}

.login-header-bar span {
  color: #333;
  font-size: 16px;
}

.login-content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 1;
  padding: 40px 0;
}

.login-box {
  width: 400px;
  padding: 40px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.logo {
  height: 48px;
  width: auto;
  margin-bottom: 16px;
  object-fit: contain;
}

.login-header h2 {
  font-size: 24px;
  color: #333;
  margin: 0;
  font-weight: normal;
}

.login-form {
  margin-top: 20px;
}

.login-form :deep(.el-input__wrapper) {
  background-color: #fff;
  border: 1px solid #dcdfe6;
  box-shadow: none;
  height: 40px;
  transition: all 0.3s;
}

.login-form :deep(.el-input__wrapper:hover) {
  border-color: #409eff;
}

.login-form :deep(.el-input__wrapper.is-focus) {
  border-color: #409eff;
  box-shadow: 0 0 0 1px #409eff;
}

.remember-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0;
}

.login-button {
  width: 100%;
  height: 40px;
  font-size: 16px;
  border-radius: 2px;
}

.login-footer {
  text-align: center;
  margin-top: 24px;
  color: #606266;
}

.login-footer-bar {
  padding: 20px 0;
  text-align: center;
  position: relative;
  z-index: 1;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.footer-links {
  margin-bottom: 12px;
}

.footer-links a {
  color: #666;
  text-decoration: none;
  font-size: 14px;
}

.footer-links a:hover {
  color: #409eff;
}

.divider {
  margin: 0 12px;
  color: #999;
}

.copyright {
  color: #999;
  font-size: 12px;
}

@media screen and (max-width: 768px) {
  .login-header-bar {
    padding: 0 20px;
  }

  .login-box {
    width: 90%;
    padding: 30px 20px;
    margin: 0 20px;
  }
  
  .login-header h2 {
    font-size: 20px;
  }
  
  .nav-logo {
    height: 28px;
  }

  .logo {
    height: 40px;
  }

  .footer-links {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .divider {
    display: none;
  }
}
</style> 