<template>
  <div class="dashboard-container">
    <!-- 最近访问 -->
    <div class="recent-access">
      <div class="recent-list">
        <div v-for="item in recentResources" :key="item.id" class="recent-item" @click="handleResourceClick(item.type)">
          <el-icon class="recent-icon"><component :is="item.icon" /></el-icon>
          <span class="recent-name">{{ item.name }}</span>
        </div>
      </div>
    </div>

    <!-- 主要内容区 -->
    <div class="main-content">
      <div class="content-left">
        <!-- 产品与服务 -->
        <div class="service-header">
          <div class="header-title">
            <span class="title">产品与服务</span>
            <div class="view-switch">
              <el-radio-group v-model="viewType" size="small">
                <el-radio-button label="grid">
                  <el-icon><Grid /></el-icon>
                </el-radio-button>
                <el-radio-button label="list">
                  <el-icon><List /></el-icon>
                </el-radio-button>
              </el-radio-group>
            </div>
          </div>
          <div class="region-tabs">
            <span class="active">全部</span>
            <span v-for="region in regions" :key="region.code" class="region-item">
              {{ region.name }}
              <em v-if="region.count">({{ region.count }})</em>
            </span>
          </div>
        </div>

        <!-- 资源列表 -->
        <div class="resource-list">
          <!-- 计算资源 -->
          <div class="resource-group">
            <div class="group-title">
              <el-icon><Monitor /></el-icon>
              <span>计算</span>
            </div>
            <div class="resource-items">
              <div class="resource-item" @click="handleResourceClick('ecs')">
                <div class="item-header">
                  <div class="item-name">
                    <el-icon><Monitor /></el-icon>
                    云服务器 ECS
                  </div>
                  <span class="item-count">2台</span>
                </div>
                <div class="item-body">
                  <div class="status-item">
                    <span class="status-label">运行中</span>
                    <span class="status-value running">2</span>
                  </div>
                  <div class="status-item">
                    <span class="status-label">已停止</span>
                    <span class="status-value stopped">0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 存储资源 -->
          <div class="resource-group">
            <div class="group-title">
              <el-icon><Box /></el-icon>
              <span>存储</span>
            </div>
            <div class="resource-items">
              <div class="resource-item" @click="handleResourceClick('oss')">
                <div class="item-header">
                  <div class="item-name">
                    <el-icon><Box /></el-icon>
                    对象存储 OSS
                  </div>
                  <span class="item-count">1 Bucket</span>
                </div>
                <div class="item-body">
                  <div class="status-item">
                    <span class="status-label">存储用量</span>
                    <span class="status-value">2.1TB</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 网络资源 -->
          <div class="resource-group">
            <div class="group-title">
              <el-icon><Connection /></el-icon>
              <span>网络</span>
            </div>
            <div class="resource-items">
              <div class="resource-item" @click="handleResourceClick('vpc')">
                <div class="item-header">
                  <div class="item-name">
                    <el-icon><Connection /></el-icon>
                    专有网络 VPC
                  </div>
                  <span class="item-count">2个</span>
                </div>
                <div class="item-body">
                  <div class="status-item">
                    <span class="status-label">交换机</span>
                    <span class="status-value">2</span>
                  </div>
                  <div class="status-item">
                    <span class="status-label">路由表</span>
                    <span class="status-value">2</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧信息栏 -->
      <div class="content-right">
        <!-- 用户信息 -->
        <div class="user-info">
          <div class="user-header">
            <Avatar :file-id="userData.cover" :size="48"></Avatar>
            <div class="user-meta">
              <div class="user-name">{{userData.user_name}}</div>
              <div class="user-id">账号ID：{{userData.user_id}}</div>
            </div>
          </div>
          <div class="user-actions">
            <el-button type="primary">主账号</el-button>
            <el-button>个人认证</el-button>
          </div>
          <div class="balance-list">
            <div class="balance-item">
              <div class="balance-icon coin">
                <el-icon><Money /></el-icon>
              </div>
              <div class="balance-value">1000</div>
              <div class="balance-label">余额</div>
            </div>
            <div class="balance-item">
              <div class="balance-icon point">
                <el-icon><Ticket /></el-icon>
              </div>
              <div class="balance-value">1000</div>
              <div class="balance-label">积分</div>
            </div>
            <div class="balance-item">
              <div class="balance-icon diamond">
                <el-icon><Medal /></el-icon>
              </div>
              <div class="balance-value">1000</div>
              <div class="balance-label">钻石</div>
            </div>
          </div>
        </div>

        <!-- 运维监控 -->
        <div class="monitor-panel">
          <div class="panel-header">
            <span>运维监控</span>
            <el-button type="primary" text size="small">查看详情</el-button>
          </div>
          <div class="monitor-list">
            <div class="monitor-item">
              <div class="item-info">
                <el-icon><Warning /></el-icon>
                <span>正在告警</span>
              </div>
              <span class="item-value">0</span>
            </div>
            <div class="monitor-item">
              <div class="item-info">
                <el-icon><Bell /></el-icon>
                <span>产品运维事件</span>
              </div>
              <span class="item-value">0</span>
            </div>
          </div>
        </div>

        <!-- 费用信息 -->
        <div class="billing-panel">
          <div class="panel-header">
            <span>费用中心</span>
            <el-button type="primary" text size="small">查看详情</el-button>
          </div>
          <div class="billing-list">
            <div class="billing-item">
              <span class="item-name">资源包</span>
              <div class="item-action">
                <span class="amount">0</span>
                <el-button type="primary" text size="small">充值</el-button>
              </div>
            </div>
            <div class="billing-item">
              <span class="item-name">节省计划</span>
              <div class="item-action">
                <span class="amount">0</span>
                <el-button type="primary" text size="small">开通</el-button>
              </div>
            </div>
            <div class="billing-item">
              <span class="item-name">待支付订单</span>
              <div class="item-action">
                <span class="amount">0</span>
                <el-button type="primary" text size="small">查看</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { 
  Monitor, 
  Box, 
  Connection, 
  Grid, 
  List, 
  Warning, 
  Bell, 
  Money, 
  Ticket, 
  Medal 
} from '@element-plus/icons-vue'
import router from "@/router/index.js";
import {useRoute} from "vue-router";
import apiServer_client from "@/utils/apiServer_client.js";
import Avatar from '@/layout/components/Avatar.vue';

export default {
  name: 'Dashboard',
  components: {
    Monitor,
    Box,
    Connection,
    Grid,
    List,
    Warning,
    Bell,
    Money,
    Ticket,
    Medal,
    Avatar
  },
  setup() {
    const userData = ref({})
    const route = useRoute()
    const viewType = ref('grid')
    const recentResources = [
      { id: 1, name: '云服务器 ECS', icon: 'Monitor', type: "ecs" },
      { id: 2, name: '专有网络 VPC', icon: 'Connection' },
      { id: 3, name: '对象存储', icon: 'Box' },
      { id: 4, name: '轻量应用服务器', icon: 'Monitor' },
      { id: 5, name: 'CDN', icon: 'Connection' },
      { id: 6, name: 'API 网关', icon: 'Connection' }
    ]

    const regions = [
      { code: 'all', name: '全球', active: true },
      { code: 'cn-hangzhou', name: '华东1（杭州）', count: 2 },
      { code: 'cn-beijing', name: '华北2（北京）', count: 1 },
      { code: 'cn-guangzhou', name: '华南1（广州）', count: 1 }
    ]

    const typeRoutes = {
      "ecs": "/dashboard/compute/ecs",
    }

    const handleResourceClick = (type) => {
      let path = typeRoutes[type];
      if(path){
        if (path && path !== route.path) {
          router.push(path)
        }
      }
      console.log('clicked resource:', type)
    }

    const getUserInfo = async () => {
      userData.value = await apiServer_client.getUserInfo()
      console.log(userData)
    }

    onMounted(() => {
      getUserInfo();
    })

    return {
      viewType,
      recentResources,
      regions,
      handleResourceClick,
      userData
    }
  }
}
</script>

<style scoped>
.dashboard-container {
  min-height: 100%;
  background-color: #f0f2f5;
  padding: 16px 20px;
}

/* 最近访问 */
.recent-access {
  margin-bottom: 16px;
  background-color: #fff;
  border-radius: 4px;
  padding: 16px 24px;
}

.recent-list {
  display: flex;
  gap: 32px;
}

.recent-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.recent-item:hover {
  background-color: #f5f7fa;
}

.recent-icon {
  font-size: 16px;
  color: #1890ff;
}

.recent-name {
  font-size: 13px;
  color: #1f2329;
}

/* 主要内容区 */
.main-content {
  display: flex;
  gap: 16px;
}

.content-left {
  flex: 1;
  min-width: 0;
}

.content-right {
  width: 320px;
  flex-shrink: 0;
}

/* 服务头部 */
.service-header {
  background-color: #fff;
  border-radius: 4px;
  padding: 16px 24px;
  margin-bottom: 16px;
}

.header-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.title {
  font-size: 16px;
  font-weight: 500;
  color: #1f2329;
}

.region-tabs {
  display: flex;
  gap: 24px;
  font-size: 13px;
}

.region-tabs span {
  color: #4e5969;
  cursor: pointer;
}

.region-tabs .active {
  color: #1890ff;
}

.region-tabs em {
  font-style: normal;
  color: #86909c;
}

/* 资源列表 */
.resource-list {
  background-color: #fff;
  border-radius: 4px;
  padding: 24px;
}

.resource-group {
  margin-bottom: 32px;
}

.group-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  padding-left: 8px;
  border-left: 2px solid #1890ff;
}

.group-title .el-icon {
  font-size: 16px;
  color: #1890ff;
}

.group-title span {
  font-size: 14px;
  color: #1f2329;
  font-weight: 500;
}

.resource-items {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 16px;
}

.resource-item {
  position: relative;
  border: 1px solid #e5e6eb;
  border-radius: 4px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background-color: #fff;
}

.resource-item:hover {
  border-color: #1890ff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-name {
  font-size: 14px;
  color: #1f2329;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
}

.item-name .el-icon {
  font-size: 16px;
  color: #1890ff;
}

.item-count {
  font-size: 12px;
  color: #4e5969;
  background-color: #f7f8fa;
  padding: 2px 8px;
  border-radius: 12px;
  border: 1px solid #e5e6eb;
}

.item-body {
  display: flex;
  gap: 40px;
}

.status-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.status-label {
  font-size: 12px;
  color: #86909c;
}

.status-value {
  font-size: 20px;
  color: #1f2329;
  font-weight: 500;
  line-height: 1.2;
}

.status-value.running {
  color: #00b42a;
}

.status-value.stopped {
  color: #86909c;
}

/* 右侧面板 */
.user-info,
.monitor-panel,
.billing-panel {
  background-color: #fff;
  border-radius: 4px;
  padding: 16px;
  margin-bottom: 16px;
}

.user-header {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.user-meta {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-size: 16px;
  font-weight: 500;
  color: #1f2329;
  margin-bottom: 4px;
}

.user-id {
  font-size: 12px;
  color: #86909c;
}

.user-actions {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  padding: 0 4px;
}

.user-actions .el-button {
  flex: 1;
  justify-content: center;
  height: 32px;
  font-size: 13px;
  border-radius: 4px;
}

.user-actions .el-button--primary {
  background-color: #e8f4ff;
  color: #1890ff;
  border: 1px solid #e8f4ff;
}

.user-actions .el-button--primary:hover {
  background-color: #1890ff;
  color: #fff;
  border-color: #1890ff;
}

.user-actions .el-button--default {
  background-color: #f7f8fa;
  color: #4e5969;
  border: 1px solid #f7f8fa;
}

.user-actions .el-button--default:hover {
  background-color: #f2f3f5;
  color: #1f2329;
  border-color: #e5e6eb;
}

.balance-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.balance-item {
  padding: 12px;
  background: linear-gradient(to bottom right, #f7f8fa, #f2f3f5);
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
}

.balance-item:hover {
  transform: translateY(-2px);
  background: linear-gradient(to bottom right, #f5f7fa, #e8f4ff);
}

.balance-icon {
  width: 24px;
  height: 24px;
  margin: 0 auto 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.balance-icon.coin {
  background: linear-gradient(135deg, #ffd666, #ffa940);
  color: #fff;
}

.balance-icon.point {
  background: linear-gradient(135deg, #69c0ff, #1890ff);
  color: #fff;
}

.balance-icon.diamond {
  background: linear-gradient(135deg, #b37feb, #722ed1);
  color: #fff;
}

.balance-value {
  font-size: 16px;
  font-weight: 500;
  color: #1f2329;
  margin-bottom: 2px;
}

.balance-label {
  font-size: 12px;
  color: #86909c;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  color: #1f2329;
  font-size: 14px;
  font-weight: 500;
}

.monitor-list,
.billing-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.monitor-item,
.billing-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-info {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #4e5969;
  font-size: 13px;
}

.item-value,
.amount {
  font-size: 14px;
  color: #1f2329;
  font-weight: 500;
}

.item-action {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 响应式设计 */
@media screen and (max-width: 1200px) {
  .content-right {
    width: 280px;
  }

  .resource-items {
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  }
}

@media screen and (max-width: 768px) {
  .dashboard-container {
    padding: 12px;
  }

  .main-content {
    flex-direction: column;
  }

  .content-right {
    width: 100%;
  }

  .resource-items {
    grid-template-columns: 1fr;
  }

  .recent-list {
    flex-wrap: wrap;
    gap: 16px;
  }
}
</style> 