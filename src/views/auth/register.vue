<template>
  <div class="register-container">
    <div class="register-header-bar">
      <img src="@/assets/logo.png" alt="logo" class="nav-logo">
      <span>注册</span>
    </div>
    <div class="register-content">
      <div class="register-box">
        <div class="register-header">
          <img src="@/assets/logo.png" alt="logo" class="logo">
          <h2>云服务平台</h2>
        </div>
        <div class="register-form">
          <el-form ref="registerForm" :model="registerForm" :rules="registerRules">
            <el-form-item prop="username">
              <el-input 
                v-model="registerForm.username" 
                placeholder="请输入用户名"
                :prefix-icon="User"
              />
            </el-form-item>
            <el-form-item prop="phone">
              <el-input 
                v-model="registerForm.phone" 
                placeholder="请输入手机号码"
                :prefix-icon="Iphone"
              >
                <template #prepend>
                  <el-select v-model="registerForm.area" style="width: 100px">
                    <el-option label="+86" value="+86" />
                    <el-option label="+852" value="+852" />
                  </el-select>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="captcha">
              <el-input 
                v-model="registerForm.captcha" 
                placeholder="请输入图形验证码"
                :prefix-icon="PictureFilled"
              >
                <template #append>
                  <img 
                    src="@/assets/captcha.jpg" 
                    alt="验证码" 
                    class="captcha-img"
                    @click="refreshCaptcha"
                  />
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="smsCode">
              <el-input 
                v-model="registerForm.smsCode" 
                placeholder="请输入短信验证码"
                :prefix-icon="Message"
              >
                <template #append>
                  <el-button 
                    type="primary" 
                    :disabled="isCountDown || !registerForm.phone || !registerForm.captcha" 
                    @click="sendSmsCode"
                  >
                    {{ countDownText }}
                  </el-button>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input 
                v-model="registerForm.password" 
                type="password" 
                placeholder="请输入密码"
                :prefix-icon="Lock"
                show-password
              />
            </el-form-item>
            <el-form-item prop="confirmPassword">
              <el-input 
                v-model="registerForm.confirmPassword" 
                type="password" 
                placeholder="请确认密码"
                :prefix-icon="Lock"
                show-password
              />
            </el-form-item>
            <div class="agreement-row">
              <el-checkbox v-model="registerForm.agreement">我已阅读并同意</el-checkbox>
              <div class="agreement-links">
                <el-link type="primary" :underline="false">《服务协议》</el-link>
                <span>和</span>
                <el-link type="primary" :underline="false">《隐私政策》</el-link>
              </div>
            </div>
            <el-button type="primary" class="register-button" @click="handleRegister">
              注册
            </el-button>
          </el-form>
          <div class="register-footer">
            <span>已有账号？</span>
            <el-link type="primary" :underline="false" @click="goToLogin">立即登录</el-link>
          </div>
        </div>
      </div>
    </div>
    <div class="register-footer-bar">
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
import { User, Lock, Message, Iphone, PictureFilled } from '@element-plus/icons-vue'

export default {
  name: 'Register',
  data() {
    // 密码验证规则
    const validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (value.length < 8) {
        callback(new Error('密码长度不能小于8位'))
      } else {
        if (this.registerForm.confirmPassword !== '') {
          this.$refs.registerForm.validateField('confirmPassword')
        }
        callback()
      }
    }
    // 确认密码验证规则
    const validateConfirmPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.registerForm.password) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }
    return {
      registerForm: {
        username: '',
        area: '+86',
        phone: '',
        captcha: '',
        smsCode: '',
        password: '',
        confirmPassword: '',
        agreement: false
      },
      isCountDown: false,
      countdown: 60,
      countDownText: '发送验证码',
      registerRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
        ],
        captcha: [
          { required: true, message: '请输入图形验证码', trigger: 'blur' },
          { min: 4, max: 4, message: '图形验证码长度为4位', trigger: 'blur' }
        ],
        smsCode: [
          { required: true, message: '请输入短信验证码', trigger: 'blur' },
          { min: 6, max: 6, message: '短信验证码长度为6位', trigger: 'blur' }
        ],
        password: [
          { required: true, validator: validatePassword, trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, validator: validateConfirmPassword, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 刷新图形验证码
    refreshCaptcha() {
      // TODO: 实现刷新图形验证码的逻辑
      console.log('刷新图形验证码')
    },
    // 发送短信验证码
    sendSmsCode() {
      if (this.isCountDown) return
      // TODO: 实现发送短信验证码的逻辑
      console.log('发送短信验证码')
      this.isCountDown = true
      this.countdown = 60
      this.countDownText = `${this.countdown}s后重新获取`
      const timer = setInterval(() => {
        this.countdown--
        this.countDownText = `${this.countdown}s后重新获取`
        if (this.countdown <= 0) {
          clearInterval(timer)
          this.isCountDown = false
          this.countDownText = '发送验证码'
        }
      }, 1000)
    },
    handleRegister() {
      if (!this.registerForm.agreement) {
        this.$message.warning('请先阅读并同意服务协议和隐私政策')
        return
      }
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          // TODO: 实现注册逻辑
          console.log('注册表单', this.registerForm)
          this.$message.success('注册成功，即将跳转到登录页')
          setTimeout(() => {
            this.$router.push('/login')
          }, 1500)
        }
      })
    },
    goToLogin() {
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-image: url('@/assets/login.jpg');
  background-size: cover;
  background-position: center;
  position: relative;
}

.register-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(1px);
}

.register-header-bar {
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

.register-header-bar span {
  color: #333;
  font-size: 16px;
}

.register-content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 1;
  padding: 40px 0;
}

.register-box {
  width: 400px;
  padding: 30px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.register-header {
  text-align: center;
  margin-bottom: 40px;
}

.logo {
  height: 48px;
  width: auto;
  margin-bottom: 16px;
  object-fit: contain;
}

.register-header h2 {
  font-size: 24px;
  color: #333;
  margin: 0;
  font-weight: normal;
}

.register-form {
  margin-top: 20px;
}

.register-form :deep(.el-input__wrapper) {
  background-color: #fff;
  border: 1px solid #dcdfe6;
  box-shadow: none !important;
  height: 40px;
  transition: all 0.3s;
  border-radius: 0;
}

.register-form :deep(.el-input__wrapper:hover) {
  border-color: #006eff;
}

.register-form :deep(.el-input__wrapper.is-focus) {
  border-color: #006eff;
}

.register-form :deep(.el-input-group__prepend) {
  padding: 0;
  background-color: #fff;
  border: 1px solid #dcdfe6;
  border-right: none;
  border-radius: 0;
}

.register-form :deep(.el-select .el-input__wrapper) {
  border: none;
  box-shadow: none !important;
  padding: 0 8px;
}

.register-form :deep(.el-select) {
  width: 70px;
}

.register-form :deep(.el-input-group__append) {
  padding: 0;
  border: 1px solid #dcdfe6;
  border-left: none;
  background-color: #fff;
  border-radius: 0;
}

.register-form :deep(.el-input-group__append .el-button) {
  border: none;
  border-radius: 0;
  margin: 0;
  height: 38px;
  padding: 0 15px;
  font-size: 14px;
}

.captcha-img {
  height: 38px;
  width: 100px;
  cursor: pointer;
  border-radius: 0;
  vertical-align: middle;
  border: none;
}

.register-button {
  width: 100%;
  height: 40px;
  font-size: 16px;
  border-radius: 0;
  margin-top: 10px;
  background-color: #006eff;
  border-color: #006eff;
}

.register-button:hover {
  background-color: #0062e6;
  border-color: #0062e6;
}

.agreement-row {
  margin: 15px 0;
  font-size: 14px;
}

.agreement-links {
  display: inline-block;
  margin-left: 4px;
}

.agreement-links span {
  margin: 0 4px;
  color: #606266;
}

.register-form :deep(.el-checkbox__label) {
  color: #606266;
  font-size: 14px;
}

.register-form :deep(.el-link) {
  font-size: 14px;
}

.register-footer {
  text-align: center;
  margin-top: 20px;
  color: #606266;
  font-size: 14px;
}

.register-form :deep(.el-form-item) {
  margin-bottom: 20px;
}

.register-form :deep(.el-form-item__error) {
  padding-top: 4px;
}

.register-footer-bar {
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
  color: #006eff;
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
  .register-header-bar {
    padding: 0 20px;
  }

  .register-box {
    width: 90%;
    padding: 30px 20px;
    margin: 0 20px;
  }
  
  .register-header h2 {
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