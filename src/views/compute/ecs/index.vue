<template>
  <div class="ecs-container">
    <!-- 系统提示信息 -->
    <div class="notice-section">
      <el-alert
        type="warning"
        :closable="false"
        show-icon
      >
        <template #title>
          <div class="notice-content">
            当前地域下的快照存放在本地OSS，当OSS剩余可用容量不足时可能，会导致相关数据不可访问，如您需要业务更重要的可用性建议，建议您开启跨地域复制复制。
          </div>
        </template>
      </el-alert>
      <el-alert
        type="info"
        :closable="false"
        show-icon
        class="mt-8"
      >
        <template #title>
          <div class="notice-content">
            自北京时间2024年10月21日起，普通快照名称更换为标准快照。详情请见<el-link type="primary" class="notice-link">公告</el-link>。
          </div>
        </template>
      </el-alert>
    </div>

    <!-- 统计信息 -->
    <div class="stats-section">
      <div class="stats-item">
        <div class="stats-label">实例总量</div>
        <div class="stats-value">{{ statistics.total }}</div>
      </div>
      <div class="stats-item">
        <div class="stats-label">运行中</div>
        <div class="stats-value success">{{ statistics.running }}</div>
      </div>
      <div class="stats-item">
        <div class="stats-label">已停止</div>
        <div class="stats-value danger">{{ statistics.stopped }}</div>
      </div>
    </div>

    <!-- 实例列表 -->
    <div class="table-section">
      <div class="table-toolbar">
        <div class="left">
          <el-button type="primary" class="create-btn">
            <el-icon><Plus /></el-icon>创建实例
          </el-button>
          <el-button @click="refreshList">
            <el-icon><Refresh /></el-icon>刷新
          </el-button>
        </div>
        <div class="right">
          <el-input
            v-model="searchQuery"
            placeholder="搜索实例ID、实例名称"
            class="search-input"
            clearable
          >
            <template #prefix>
              <el-icon class="search-icon"><Search /></el-icon>
            </template>
          </el-input>
        </div>
      </div>

      <el-table 
        :data="pagedInstances" 
        style="width: 100%" 
        v-loading="loading"
      >
        <el-table-column type="selection" width="40" />
        <el-table-column label="实例ID/名称" min-width="200">
          <template #default="{ row }">
            <div class="instance-info">
              <div class="instance-id">{{ row.instanceId }}</div>
              <div class="instance-name">
                <el-link 
                  type="primary" 
                  :underline="false"
                  @click="$router.push(`/dashboard/compute/ecs/${row.instanceId}`)"
                >
                  {{ row.instanceName }}
                </el-link>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="image" label="镜像" min-width="140">
          <template #default="{ row }">
            <el-link type="primary" :underline="false">{{ row.image }}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="实例规格" min-width="230">
          <template #default="{ row }">
            <div class="instance-spec">
              <div class="spec-name">{{ row.instanceType }}</div>
              <div class="spec-detail">
                {{ row.instanceSpec.cpu }}核(vCPU)
                {{ row.instanceSpec.memory }} GiB
                {{ row.instanceSpec.bandwidth }} Mbps
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="ip" label="IP地址" min-width="140">
          <template #default="{ row }">
            <el-link type="primary" :underline="false">{{ row.ip }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="zone" label="可用区" min-width="120" />
        <el-table-column prop="expireDate" label="到期时间" min-width="120">
          <template #default="{ row }">
            <el-tooltip 
              :content="'将于 ' + row.expireDate + ' 到期'" 
              placement="top"
            >
              <span>{{ row.expireDate }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="运行状态" width="100">
          <template #default="{ row }">
            <div class="status-tag" :class="row.status === '运行中' ? 'running' : 'stopped'">
              <div class="status-dot"></div>
              {{ row.status }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <div class="action-buttons">
              <el-button 
                link
                type="primary" 
                @click="handlePower(row)"
              >
                {{ row.status === '运行中' ? '关机' : '开机' }}
              </el-button>
              <el-divider direction="vertical" />
              <el-button
                link
                type="primary"
              >
                远程连接
              </el-button>
              <el-divider direction="vertical" />
              <el-dropdown trigger="click" @command="(command) => handleCommand(command, row)">
                <el-button link type="primary">
                  更多<el-icon class="el-icon--right"><ArrowDown /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item :disabled="row.status !== '已停止'" command="start">开机</el-dropdown-item>
                    <el-dropdown-item :disabled="row.status !== '运行中'" command="stop">关机</el-dropdown-item>
                    <el-dropdown-item :disabled="row.status !== '运行中'" command="restart">重启</el-dropdown-item>
                    <el-dropdown-item divided :disabled="row.status !== '已停止'" command="reinstall">重装系统</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div class="table-footer">
        <div class="batch-actions">
          <el-checkbox v-model="isAllSelected" @change="handleSelectAll">全选</el-checkbox>
          <el-button link type="primary" :disabled="!hasSelected">批量操作</el-button>
        </div>
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="filteredInstances.length"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <!-- 关机/重启确认框 -->
    <el-dialog
      v-model="powerDialog.visible"
      :title="powerDialog.title"
      width="400px"
      destroy-on-close
      :modal-class="'custom-dialog'"
      align-center
    >
      <div class="power-dialog-content">
        <div class="confirm-message">
          <el-icon :class="powerDialog.action === 'start' ? 'success' : 'warning'">
            <Warning />
          </el-icon>
          <span>{{ powerDialog.message }}</span>
        </div>
        <div v-if="['stop', 'restart'].includes(powerDialog.action)" class="force-option">
          <el-checkbox v-model="powerDialog.force">
            强制{{ powerDialog.action === 'stop' ? '关机' : '重启' }}
          </el-checkbox>
          <el-tooltip content="强制操作可能导致数据丢失，请谨慎使用" placement="right">
            <el-icon class="warning-icon"><Warning /></el-icon>
          </el-tooltip>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="powerDialog.visible = false">取消</el-button>
          <el-button type="primary" @click="confirmPowerAction">确定</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 重装系统模态框 -->
    <el-dialog
      v-model="reinstallDialog.visible"
      title="重装系统"
      width="480px"
      destroy-on-close
      :modal-class="'custom-dialog'"
    >
      <div class="reinstall-dialog-content">
        <el-form :model="reinstallDialog.form" label-width="80px">
          <el-form-item label="操作系统">
            <el-select v-model="reinstallDialog.form.os" placeholder="请选择操作系统" style="width: 100%">
              <el-option-group label="Linux">
                <el-option label="CentOS 7.9" value="centos7.9">
                  <template #default="{ label }">
                    <el-icon><Platform /></el-icon>
                    <span style="margin-left: 8px">{{ label }}</span>
                  </template>
                </el-option>
                <el-option label="Ubuntu 20.04" value="ubuntu20.04">
                  <template #default="{ label }">
                    <el-icon><Platform /></el-icon>
                    <span style="margin-left: 8px">{{ label }}</span>
                  </template>
                </el-option>
              </el-option-group>
              <el-option-group label="Windows">
                <el-option label="Windows Server 2019" value="win2019">
                  <template #default="{ label }">
                    <el-icon><Platform /></el-icon>
                    <span style="margin-left: 8px">{{ label }}</span>
                  </template>
                </el-option>
              </el-option-group>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="reinstallDialog.visible = false">取消</el-button>
          <el-button type="primary" @click="confirmReinstall">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {ref, computed, onMounted} from 'vue'
import { ElMessage } from 'element-plus'
import { 
  Search, 
  Refresh, 
  Switch, 
  Monitor, 
  More, 
  Plus,
  VideoPlay,
  VideoPause,
  RefreshRight,
  SetUp,
  Platform,
  Warning,
  CircleCheck,
  CircleClose,
  ArrowDown
} from '@element-plus/icons-vue'
import apiServer_client from "@/utils/apiServer_client.js";

// 模拟数据 - 扩充更多数据用于分页演示
// const mockInstances = Array.from({ length: 25 }, (_, index) => ({
//   instanceId: `i-2ze4m3vl${String(index + 1).padStart(4, '0')}`,
//   instanceName: `测试服务器${String(index + 1).padStart(2, '0')}`,
//   image: index % 2 === 0 ? 'CentOS 7.9' : 'Ubuntu 20.04',
//   instanceType: index % 2 === 0 ? 'ecs.g6.large' : 'ecs.g6.xlarge',
//   instanceSpec: index % 2 === 0 ? {
//     cpu: 2,
//     memory: 2,
//     bandwidth: 3
//   } : {
//     cpu: 4,
//     memory: 4,
//     bandwidth: 5
//   },
//   ip: `192.168.1.${100 + index}`,
//   status: index % 3 === 0 ? '运行中' : '已停止',
//   zone: index % 2 === 0 ? '华北2可用区H' : '华北2可用区G',
//   expireDate: `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`
// }))
const mockInstances = ref([])

export default {
  name: 'ECSList',
  components: {
    Search,
    Refresh,
    Switch,
    Monitor,
    More,
    Plus,
    VideoPlay,
    VideoPause,
    RefreshRight,
    SetUp,
    Platform,
    Warning,
    CircleCheck,
    CircleClose,
    ArrowDown
  },
  setup() {
    const loading = ref(false)
    const searchQuery = ref('')
    const instances = ref(mockInstances)
    const currentPage = ref(1)
    const pageSize = ref(10)

    const getVMList = async () => {
      const response = await apiServer_client.getVMList()
      mockInstances.value = [];
      for (let i = 0; i < response.data.data.length; i++) {
        let vm = response.data.data[i];
        const data = {
          instanceId: vm.Id,
          instanceName: vm.Name,
          image: "...",
          instanceType: "未知",
          instanceSpec: {
            cpu: "..",
            memory: "..",
            bandwidth: ".."
          },
          ip: "..",
          status: "未知",
          zone: "未知",
          expireDate: "暂无"
        }
        mockInstances.value.push(data)
      }
      for (let i = 0; i < mockInstances.value.length; i++){
        await getVmInfo(mockInstances.value[i])
      }
    }

    const getVmInfo = async (vmData) => {
      console.log(vmData)
      const vmInfoResponse = await apiServer_client.getVMInfo(vmData.instanceId)
      console.log(vmInfoResponse)
      vmData.instanceName = vmInfoResponse.data.data.name
      vmData.image = vmInfoResponse.data.data.image_name
      vmData.instanceSpec = {
        cpu: vmInfoResponse.data.data.vcpu,
        memory: vmInfoResponse.data.data.memory_kib / 1024 / 1024,
        bandwidth: vmInfoResponse.data.data.tx_bandwidth
      }
      vmData.ip = vmInfoResponse.data.data.net_ip
      vmData.status = vmInfoResponse.data.data.state === "running" ? '运行中' : '已停止'
      mockInstances.value.reverse()
    }

    onMounted(() => {
      getVMList()
    })

    // 统计信息
    const statistics = computed(() => {
      const total = instances.value.length
      const running = instances.value.filter(i => i.status === '运行中').length
      const stopped = instances.value.filter(i => i.status === '已停止').length
      return { total, running, stopped }
    })

    // 根据搜索条件过滤实例
    const filteredInstances = computed(() => {
      if (!searchQuery.value) return instances.value
      const query = searchQuery.value.toLowerCase()
      return instances.value.filter(instance => 
        instance.instanceId.toLowerCase().includes(query) ||
        instance.instanceName.toLowerCase().includes(query)
      )
    })

    // 分页后的实例列表
    const pagedInstances = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value
      const end = start + pageSize.value
      return filteredInstances.value.slice(start, end)
    })

    // 处理分页大小变化
    const handleSizeChange = (val) => {
      pageSize.value = val
      currentPage.value = 1
    }

    // 处理页码变化
    const handleCurrentChange = (val) => {
      currentPage.value = val
    }

    // 电源操作对话框
    const powerDialog = ref({
      visible: false,
      title: '',
      message: '',
      action: '',
      force: false,
      instance: null
    })

    // 重装系统对话框
    const reinstallDialog = ref({
      visible: false,
      form: {
        os: ''
      },
      instance: null
    })

    // 获取状态标签类型
    const getStatusType = (status) => {
      switch (status) {
        case '运行中':
          return 'success'
        case '已停止':
          return 'danger'
        default:
          return 'info'
      }
    }

    // 刷新列表
    const refreshList = () => {
      loading.value = true
      setTimeout(() => {
        loading.value = false
      }, 1000)
    }

    // 处理电源操作
    const handlePower = (instance) => {
      const action = instance.status === '运行中' ? 'stop' : 'start'
      showPowerDialog(action, instance)
    }

    // 显示电源操作对话框
    const showPowerDialog = (action, instance) => {
      const actionMap = {
        start: '开机',
        stop: '关机',
        restart: '重启'
      }
      powerDialog.value = {
        visible: true,
        title: `${actionMap[action]}实例`,
        message: `确定要${actionMap[action]}实例 ${instance.instanceName} 吗？`,
        action,
        force: false,
        instance
      }
    }

    // 确认电源操作
    const confirmPowerAction = () => {
      const { action, instance, force } = powerDialog.value
      // 这里模拟操作成功
      setTimeout(() => {
        if (action === 'start') {
          instance.status = '运行中'
        } else if (action === 'stop') {
          instance.status = '已停止'
        }
        ElMessage.success('操作成功')
        powerDialog.value.visible = false
      }, 1000)
    }

    // 处理下拉菜单命令
    const handleCommand = (command, instance) => {
      switch (command) {
        case 'start':
        case 'stop':
        case 'restart':
          showPowerDialog(command, instance)
          break
        case 'reinstall':
          reinstallDialog.value = {
            visible: true,
            form: {
              os: ''
            },
            instance
          }
          break
      }
    }

    // 确认重装系统
    const confirmReinstall = () => {
      const { instance, form } = reinstallDialog.value
      if (!form.os) {
        ElMessage.warning('请选择操作系统')
        return
      }
      // 这里模拟重装系统
      ElMessage.success('开始重装系统')
      instance.image = form.os
      reinstallDialog.value.visible = false
    }

    const isAllSelected = ref(false)
    const hasSelected = ref(false)

    const handleSelectAll = (val) => {
      isAllSelected.value = val
      // 实现全选逻辑
    }

    return {
      loading,
      searchQuery,
      filteredInstances,
      pagedInstances,
      currentPage,
      pageSize,
      statistics,
      powerDialog,
      reinstallDialog,
      getStatusType,
      refreshList,
      handlePower,
      handleCommand,
      confirmPowerAction,
      confirmReinstall,
      handleSizeChange,
      handleCurrentChange,
      isAllSelected,
      hasSelected,
      handleSelectAll
    }
  }
}
</script>

<style scoped>
.ecs-container {
  padding: 16px 20px;
  background-color: #fff;
}

.notice-section {
  margin-bottom: 16px;
}

.notice-content {
  font-size: 12px;
  line-height: 1.5;
}

.notice-link {
  font-size: 12px;
}

.mt-8 {
  margin-top: 8px;
}

.stats-section {
  display: flex;
  margin-bottom: 16px;
  background: #fff;
  padding: 20px 0;
  border-radius: 4px;
}

.stats-item {
  padding: 0 40px;
  position: relative;
}

.stats-item:not(:last-child)::after {
  content: '';
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 1px;
  height: 40%;
  background-color: #f0f0f0;
}

.stats-label {
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
}

.stats-value {
  font-size: 24px;
  color: #262626;
  font-weight: 600;
}

.stats-value.success {
  color: #52c41a;
}

.stats-value.danger {
  color: #ff4d4f;
}

.table-section {
  background: #fff;
  border: 1px solid #f0f0f0;
}

.table-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
}

.table-toolbar .left {
  display: flex;
  gap: 8px;
}

.create-btn {
  font-weight: 400;
}

.search-input {
  width: 240px;
}

.search-input :deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px #d9d9d9 inset;
}

.search-input :deep(.el-input__wrapper):hover {
  box-shadow: 0 0 0 1px #40a9ff inset;
}

:deep(.el-table) {
  --el-table-border-color: #e8e8e8;
  --el-table-header-bg-color: #fafafa;
  --el-table-row-hover-bg-color: #fafafa;
  border: none !important;
}

:deep(.el-table::before),
:deep(.el-table__inner-wrapper::before) {
  display: none;
}

:deep(.el-table th) {
  background-color: #fafafa;
  border-bottom: 1px solid #e8e8e8;
  font-weight: 500;
  color: #595959;
  padding: 12px 0;
  font-size: 13px;
}

:deep(.el-table td) {
  border-bottom: 1px solid #e8e8e8;
  padding: 12px 0;
  color: #595959;
}

:deep(.el-table--enable-row-hover .el-table__body tr:hover > td) {
  background-color: #fafafa;
}

:deep(.el-table .el-table__row) {
  background-color: #fff;
}

:deep(.el-table .el-table__row:nth-child(even)) {
  background-color: #fafcff;
}

.instance-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.instance-id {
  color: #8c8c8c;
  font-size: 12px;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Helvetica Neue, Helvetica, Arial, sans-serif;
}

.instance-name {
  color: #262626;
  font-size: 13px;
}

.status-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.status-tag.running {
  color: #52c41a;
}

.status-tag.running .status-dot {
  background-color: #52c41a;
  box-shadow: 0 0 0 1px rgba(82, 196, 26, 0.3);
}

.status-tag.stopped {
  color: #ff4d4f;
}

.status-tag.stopped .status-dot {
  background-color: #ff4d4f;
  box-shadow: 0 0 0 1px rgba(255, 77, 79, 0.3);
}

.action-buttons {
  display: flex;
  align-items: center;
  white-space: nowrap;
}

:deep(.el-divider--vertical) {
  height: 1em;
  margin: 0 8px;
}

:deep(.el-button.is-link) {
  padding: 0;
  height: auto;
  font-weight: normal;
  font-size: 13px;
}

:deep(.el-button.is-link:not(.el-dropdown-selfdefine)) {
  padding: 0;
}

:deep(.el-dropdown) {
  font-size: 13px;
}

:deep(.el-dropdown-menu) {
  padding: 4px 0;
  border-radius: 2px;
  box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
}

:deep(.el-dropdown-menu__item) {
  padding: 8px 20px;
  font-size: 13px;
  line-height: 20px;
  color: #000000d9;
}

:deep(.el-dropdown-menu__item:not(.is-disabled):hover) {
  background-color: #f5f5f5;
  color: #000000d9;
}

:deep(.el-dropdown-menu__item.is-disabled) {
  color: rgba(0, 0, 0, 0.25);
  cursor: not-allowed;
}

:deep(.el-dropdown-menu__item--divided) {
  margin-top: 4px;
  border-top: 1px solid #f0f0f0;
}

:deep(.el-dropdown-menu__item--divided::before) {
  height: 4px;
  margin-top: -4px;
}

:deep(.el-icon.el-icon--right) {
  margin-left: 4px;
}

.table-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #fff;
  border-top: 1px solid #e8e8e8;
}

.batch-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

:deep(.el-checkbox__label) {
  color: #595959;
  font-size: 13px;
}

:deep(.el-pagination) {
  justify-content: flex-end;
  font-size: 13px;
}

:deep(.el-pagination .el-pagination__total) {
  color: #8c8c8c;
}

:deep(.el-pagination .el-pagination__sizes .el-input) {
  font-size: 13px;
}

:deep(.el-pagination .el-select .el-input) {
  width: 100px;
}

:deep(.el-pagination button) {
  background: transparent;
}

:deep(.el-pagination .el-pagination__jump) {
  color: #8c8c8c;
}

:deep(.el-button.is-link) {
  color: #1890ff;
  font-size: 13px;
  padding: 0;
  height: auto;
  font-weight: normal;
}

:deep(.el-button.is-link:hover) {
  color: #40a9ff;
}

:deep(.el-button.is-link:active) {
  color: #096dd9;
}

:deep(.el-button.is-link.is-disabled) {
  color: rgba(0, 0, 0, 0.25);
}

:deep(.el-link) {
  font-size: 13px;
  font-weight: normal;
}

:deep(.el-link:hover) {
  color: #40a9ff;
}

/* 对话框样式 */
:deep(.el-dialog) {
  --el-dialog-padding-primary: 0;
  border-radius: 4px;
  box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

:deep(.el-dialog__header) {
  margin: 0;
  padding: 16px 24px;
  border-bottom: 1px solid var(--el-border-color-lighter);
  background: #fff;
}

:deep(.el-dialog__title) {
  font-size: 14px;
  font-weight: 500;
  color: #000000d9;
  line-height: 22px;
}

:deep(.el-dialog__headerbtn) {
  top: 16px;
  right: 16px;
}

:deep(.el-dialog__headerbtn .el-dialog__close) {
  font-size: 16px;
  color: #00000073;
}

:deep(.el-dialog__headerbtn:hover .el-dialog__close) {
  color: #1890ff;
}

:deep(.el-dialog__body) {
  padding: 24px;
  background: #fff;
  color: #000000d9;
  font-size: 14px;
  line-height: 1.5715;
}

:deep(.el-dialog__footer) {
  padding: 10px 16px;
  border-top: 1px solid var(--el-border-color-lighter);
  background: #fff;
  text-align: right;
}

.power-dialog-content {
  padding: 0;
}

.confirm-message {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 16px;
  font-size: 14px;
  color: #000000d9;
}

.confirm-message .el-icon {
  font-size: 22px;
  color: #faad14;
  margin-top: 1px;
}

.confirm-message .success {
  color: #52c41a;
}

.force-option {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 34px;
  color: #000000d9;
}

.warning-icon {
  color: #faad14;
  font-size: 14px;
  cursor: help;
}

.reinstall-dialog-content {
  padding: 0;
}

:deep(.el-select-dropdown__item) {
  padding: 5px 12px;
  min-height: 32px;
  line-height: 22px;
  font-size: 14px;
  color: #000000d9;
}

:deep(.el-select-group__title) {
  padding: 8px 12px;
  font-size: 12px;
  color: #00000073;
  font-weight: normal;
  background-color: #fafafa;
  line-height: 1.5715;
}

.dialog-footer {
  text-align: right;
}

.dialog-footer :deep(.el-button) {
  height: 32px;
  padding: 4px 15px;
  font-size: 14px;
  border-radius: 2px;
  margin-left: 8px;
}

.dialog-footer :deep(.el-button--default) {
  border-color: #d9d9d9;
  color: #000000d9;
}

.dialog-footer :deep(.el-button--default:hover) {
  color: #40a9ff;
  border-color: #40a9ff;
}

.dialog-footer :deep(.el-button--primary) {
  --el-button-bg-color: #1890ff;
  --el-button-border-color: #1890ff;
  --el-button-hover-bg-color: #40a9ff;
  --el-button-hover-border-color: #40a9ff;
  --el-button-active-bg-color: #096dd9;
  --el-button-active-border-color: #096dd9;
  --el-button-text-color: #fff;
  font-weight: 400;
}

:deep(.el-checkbox__inner) {
  border-radius: 2px;
  border-color: #d9d9d9;
}

:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: #1890ff;
  border-color: #1890ff;
}

:deep(.el-checkbox__label) {
  font-size: 14px;
  color: #000000d9;
}

:deep(.el-form-item__label) {
  color: #000000d9;
  font-size: 14px;
  padding-right: 12px;
  line-height: 32px;
  font-weight: normal;
}

:deep(.el-select .el-input__wrapper) {
  border-radius: 2px;
  box-shadow: 0 0 0 1px #d9d9d9 inset;
}

:deep(.el-select .el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #40a9ff inset;
}

:deep(.el-select .el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #1890ff inset;
}

/* 添加实例规格样式 */
.instance-spec {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.spec-name {
  color: #262626;
  font-size: 13px;
}

.spec-detail {
  color: #8c8c8c;
  font-size: 12px;
  line-height: 1.5;
}
</style> 