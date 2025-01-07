<template>
      <div class="page-header">
      <div class="header-left">

        <div class="instance-info">
            <el-button 
            link 
            type="primary" 
            @click="$router.back()" 
            class="back-button"
          >
            <el-icon><ArrowLeft /></el-icon>返回
          </el-button>
          <h2 class="instance-name">{{ instanceData.instanceName }}</h2>
          <div class="instance-meta">
            <span class="instance-id">{{ instanceData.instanceId }}</span>
          </div>
        </div>
      </div>
      <div class="header-actions">
        <el-button type="primary" class="action-button" size="default">
          远程连接
        </el-button>
        <el-button 
          type="danger"
          class="action-button"
          size="default"
          plain
          v-if="instanceData.status === '运行中'"
          @click="stopVM()"
        >
          关机
        </el-button>
        <el-button 
          type="primary"
          class="action-button"
          size="default"
          plain
          v-else
          @click="startVM()"
        >
          开机
        </el-button>
        <el-dropdown trigger="click">
          <el-button size="default" plain>
            更多<el-icon class="el-icon--right"><ArrowDown /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item :disabled="instanceData.status !== '已停止'">开机</el-dropdown-item>
              <el-dropdown-item :disabled="instanceData.status !== '运行中'">关机</el-dropdown-item>
              <el-dropdown-item :disabled="instanceData.status !== '运行中'">重启</el-dropdown-item>
              <el-dropdown-item divided :disabled="instanceData.status !== '已停止'">重装系统</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

  <div class="ecs-detail">
    <!-- 顶部导航 -->
  

    <!-- 实例状态卡片 -->
    <div class="overview-card">
      <div class="overview-item">
        <div class="overview-label">实例状态</div>
        <div class="overview-value">
          <div class="status-tag" :class="instanceData.status === '运行中' ? 'running' : 'stopped'">
            <div class="status-dot"></div>
            {{ instanceData.status }}
          </div>
        </div>
      </div>
      <el-divider direction="vertical" class="divider" />
      <div class="overview-item">
        <div class="overview-label">到期时间</div>
        <div class="overview-value">{{ instanceData.expireDate }}</div>
      </div>
      <el-divider direction="vertical" class="divider" />
      <div class="overview-item">
        <div class="overview-label">创建时间</div>
        <div class="overview-value">{{ instanceData.createTime }}</div>
      </div>
    </div>

    <!-- 实例详情标签页 -->
    <div class="detail-content">
      <el-tabs v-model="activeTab" class="detail-tabs">
        <el-tab-pane label="实例详情" name="details">
          <div class="info-section">
            <div class="section-header">
              <h3 class="section-title">配置信息</h3>
            </div>
            <div class="info-table">
              <div class="info-row">
                <div class="info-item">
                  <div class="info-label">实例规格</div>
                  <div class="info-value">
                    <div class="spec-info">
                      <div class="spec-name">{{ instanceData.instanceType }}</div>
                      <div class="spec-detail">
                        {{ instanceData.instanceSpec.cpu }}核(vCPU) | 
                        {{ instanceData.instanceSpec.memory }} GiB | 
                        {{ instanceData.instanceSpec.bandwidth }} Mbps
                      </div>
                    </div>
                  </div>
                </div>
                <div class="info-item">
                  <div class="info-label">操作系统</div>
                  <div class="info-value">{{ instanceData.image }}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">可用区</div>
                  <div class="info-value">{{ instanceData.zone }}</div>
                </div>
              </div>
              <div class="info-row">
                <div class="info-item">
                  <div class="info-label">公网IP</div>
                  <div class="info-value">
                    <el-link type="primary">{{ instanceData.ip }}</el-link>
                  </div>
                </div>
                <div class="info-item">
                  <div class="info-label">内网IP</div>
                  <div class="info-value">
                    <el-link type="primary">{{ instanceData.privateIp }}</el-link>
                  </div>
                </div>
                <div class="info-item">
                  <div class="info-label">安全组</div>
                  <div class="info-value">
                    <el-link type="primary">{{ instanceData.securityGroup }}</el-link>
                  </div>
                </div>
              </div>
              <div class="info-row">
                <div class="info-item">
                  <div class="info-label">用户名</div>
                  <div class="info-value">root</div>
                </div>
                <div class="info-item">
                  <div class="info-label">ssh端口</div>
                  <div class="info-value">22</div>
                </div>
                <div class="info-item">
                  <div class="info-label">密码</div>
                  <div class="info-value">
                    <el-link type="primary">{{ instanceData.password }}</el-link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="info-section">
            <div class="section-header">
              <h3 class="section-title">付费信息</h3>
            </div>
            <div class="info-table">
              <div class="info-row">
                <div class="info-item">
                  <div class="info-label">计费方式</div>
                  <div class="info-value">包年包月</div>
                </div>
                <div class="info-item">
                  <div class="info-label">到期时间</div>
                  <div class="info-value">{{ instanceData.expireDate }}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">自动续费</div>
                  <div class="info-value">已开启</div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="监控" name="monitoring">
          <div class="monitoring-grid">
            <div class="chart-card">
              <div class="chart-body">
                <div id="cpuChart" style="width: 100%; height: 100%;"></div>
              </div>
            </div>
            <div class="chart-card">
              <div class="chart-body">
                <div id="memoryChart" style="width: 100%; height: 100%;"></div>
              </div>
            </div>
            <div class="chart-card">
              <div class="chart-body">
                <div id="networkChart" style="width: 100%; height: 100%;"></div>
              </div>
            </div>
            <div class="chart-card">
              <div class="chart-body">
                <div id="diskChart" style="width: 100%; height: 100%;"></div>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="操作日志" name="logs">
          <div class="logs-container">
            <div class="logs-header">
              <div class="header-left">
                <el-button type="primary" plain @click="refreshLogs" :loading="logsLoading">
                  <el-icon><Refresh /></el-icon>刷新
                </el-button>
              </div>
              <div class="header-right">
                <el-date-picker
                  v-model="logDateRange"
                  type="daterange"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :shortcuts="dateShortcuts"
                  size="default"
                  class="date-picker"
                />
              </div>
            </div>
            <div style="padding: 20px;">
                
            <el-table
              :data="logsList"
              style="width: 100%"
              v-loading="logsLoading"
            >
              <el-table-column prop="time" label="操作时间" min-width="180">
                <template #default="{ row }">
                  <span class="time-text">{{ row.time }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="type" label="操作类型" min-width="120">
                <template #default="{ row }">
                  <span :class="['type-text', getLogTypeClass(row.type)]">{{ row.type }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="operator" label="操作人" min-width="180">
                <template #default="{ row }">
                  <div class="operator-cell">
                    <el-avatar :size="24" :src="row.avatar" />
                    <span class="operator-name">{{ row.operator }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="detail" label="操作详情" min-width="300">
                <template #default="{ row }">
                  <div class="detail-cell">
                    <span class="detail-text">{{ row.detail }}</span>
                    <span 
                      v-if="row.status" 
                      :class="['status-text', row.status === '成功' ? 'success' : 'error']"
                    >
                      {{ row.status }}
                    </span>
                  </div>
                </template>
              </el-table-column>
              
            </el-table>
            </div>
            <div class="pagination-container">
              <div class="total-info">
                Total {{ total }}
              </div>
              <el-select v-model="pageSize" class="page-size-select">
                <el-option
                  v-for="size in [10, 20, 50, 100]"
                  :key="size"
                  :label="`${size}/page`"
                  :value="size"
                />
              </el-select>
              <el-pagination
                v-model:current-page="currentPage"
                :page-size="pageSize"
                :total="total"
                layout="prev, pager, next, jumper"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              />
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowDown, Refresh, ArrowLeft } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import apiServer_client from "@/utils/apiServer_client.js";

export default {
  name: 'ECSDetail',
  components: {
    ArrowDown,
    Refresh,
    ArrowLeft
  },
  setup() {
    const route = useRoute()
    const activeTab = ref('details')
    const charts = ref({
      cpu: null,
      memory: null,
      network: null,
      disk: null
    })
    
    // 模拟实例详情数据
    const instanceData = ref({
      instanceId: 'i-2ze4m3vl0001',
      instanceName: '测试服务器01',
      status: '运行中',
      instanceType: 'ecs.g6.large',
      instanceSpec: {
        cpu: 2,
        memory: 2,
        bandwidth: 3
      },
      image: 'CentOS 7.9',
      zone: '未知',
      ip: '192.168.1.100',
      privateIp: '暂无',
      securityGroup: 'default',
      expireDate: '未知',
      createTime: '2024-01-01 12:00:00',
      password: ""
    })

    const getVmInfo = async (instanceId) => {
      console.log(instanceData)
      const vmInfoResponse = await apiServer_client.getVMInfo(instanceId)
      console.log(vmInfoResponse)
      instanceData.value.instanceId = instanceId
      instanceData.value.instanceName = vmInfoResponse.data.data.name
      instanceData.value.image = vmInfoResponse.data.data.image_name
      instanceData.value.instanceSpec = {
        cpu: vmInfoResponse.data.data.vcpu,
        memory: vmInfoResponse.data.data.memory_kib / 1024 / 1024,
        bandwidth: vmInfoResponse.data.data.tx_bandwidth
      }
      instanceData.value.ip = vmInfoResponse.data.data.net_ip
      instanceData.value.status = vmInfoResponse.data.data.state === "running" ? '运行中' : '已停止'
      instanceData.value.createTime = vmInfoResponse.data.data.create_time
      instanceData.value.password = vmInfoResponse.data.data.passwd
    }

    const stopVM = async () => {
      await apiServer_client.vmStop(instanceData.value.instanceId)
      instanceData.value.status = '已停止'
    }

    const startVM = async () => {
      await apiServer_client.vmStart(instanceData.value.instanceId)
      instanceData.value.status = '运行中'
    }

    // 生成模拟数据
    const generateMockData = (min, max, count = 24) => {
      return Array.from({ length: count }, (_, i) => {
        const hour = String(i).padStart(2, '0') + ':00'
        const value = +(Math.random() * (max - min) + min).toFixed(2)
        return [hour, value]
      })
    }

    // 基础图表配置
    const getBaseChartOption = (title, data, unit = '%', min = 0, max = 100) => {
      return {
        title: {
          text: title,
          left: 'center',
          top: 0,
          textStyle: {
            color: '#262626',
            fontSize: 14,
            fontWeight: 500
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            lineStyle: {
              color: '#e8e8e8'
            }
          },
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderColor: '#ebeef5',
          borderWidth: 1,
          padding: [10, 16],
          textStyle: {
            color: '#595959',
            fontSize: 13
          },
          extraCssText: 'box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1)',
          formatter: (params) => {
            const [param] = params
            return `<div style="font-weight:500;margin-bottom:4px">${param.name}</div>${param.value[1]}${unit}`
          }
        },
        grid: {
          top: 50,
          left: 40,
          right: 20,
          bottom: 30,
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: '#ebeef5'
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#909399',
            fontSize: 12,
            margin: 12
          },
          data: data.map(item => item[0])
        },
        yAxis: {
          type: 'value',
          min,
          max,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            lineStyle: {
              color: '#ebeef5',
              type: 'dashed'
            }
          },
          axisLabel: {
            color: '#909399',
            fontSize: 12,
            margin: 12,
            formatter: `{value}${unit}`
          }
        },
        series: [
          {
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 6,
            showSymbol: false,
            itemStyle: {
              color: '#409eff',
              borderWidth: 2,
              borderColor: '#fff'
            },
            emphasis: {
              itemStyle: {
                color: '#409eff',
                borderWidth: 2,
                borderColor: '#fff',
                shadowColor: 'rgba(0,0,0,0.1)',
                shadowBlur: 10
              }
            },
            lineStyle: {
              color: '#409eff',
              width: 2
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgba(64, 158, 255, 0.2)'
                },
                {
                  offset: 1,
                  color: 'rgba(64, 158, 255, 0.02)'
                }
              ])
            },
            data: data
          }
        ]
      }
    }

    // 初始化图表
    const initCharts = () => {
      const cpuChart = echarts.init(document.getElementById('cpuChart'))
      const memoryChart = echarts.init(document.getElementById('memoryChart'))
      const networkChart = echarts.init(document.getElementById('networkChart'))
      const diskChart = echarts.init(document.getElementById('diskChart'))

      const cpuData = generateMockData(0, 100)
      const memoryData = generateMockData(20, 80)
      const networkData = generateMockData(0, 100, 24)
      const diskData = generateMockData(0, 1000, 24)

      const cpuOption = getBaseChartOption('CPU使用率', cpuData)
      cpuOption.series[0].itemStyle.color = '#409eff'
      cpuOption.series[0].lineStyle.color = '#409eff'
      cpuOption.series[0].areaStyle.color = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: 'rgba(64, 158, 255, 0.2)' },
        { offset: 1, color: 'rgba(64, 158, 255, 0.02)' }
      ])

      const memoryOption = getBaseChartOption('内存使用率', memoryData)
      memoryOption.series[0].itemStyle.color = '#67c23a'
      memoryOption.series[0].lineStyle.color = '#67c23a'
      memoryOption.series[0].areaStyle.color = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: 'rgba(103, 194, 58, 0.2)' },
        { offset: 1, color: 'rgba(103, 194, 58, 0.02)' }
      ])

      const networkOption = getBaseChartOption('网络流量', networkData, 'Mbps', 0, 100)
      networkOption.series[0].itemStyle.color = '#e6a23c'
      networkOption.series[0].lineStyle.color = '#e6a23c'
      networkOption.series[0].areaStyle.color = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: 'rgba(230, 162, 60, 0.2)' },
        { offset: 1, color: 'rgba(230, 162, 60, 0.02)' }
      ])

      const diskOption = getBaseChartOption('系统磁盘IOPS', diskData, 'IOPS', 0, 1000)
      diskOption.series[0].itemStyle.color = '#9c27b0'
      diskOption.series[0].lineStyle.color = '#9c27b0'
      diskOption.series[0].areaStyle.color = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: 'rgba(156, 39, 176, 0.2)' },
        { offset: 1, color: 'rgba(156, 39, 176, 0.02)' }
      ])

      cpuChart.setOption(cpuOption)
      memoryChart.setOption(memoryOption)
      networkChart.setOption(networkOption)
      diskChart.setOption(diskOption)

      charts.value = {
        cpu: cpuChart,
        memory: memoryChart,
        network: networkChart,
        disk: diskChart
      }

      // 监听窗口大小变化
      const handleResize = () => {
        Object.values(charts.value).forEach(chart => chart?.resize())
      }
      window.addEventListener('resize', handleResize)

      // 组件卸载时清理
      onUnmounted(() => {
        window.removeEventListener('resize', handleResize)
        Object.values(charts.value).forEach(chart => chart?.dispose())
      })
    }

    // 日志相关数据
    const logDateRange = ref([])
    const logsLoading = ref(false)
    const currentPage = ref(1)
    const pageSize = ref(10)
    const total = ref(100)

    // 日期快捷选项
    const dateShortcuts = [
      {
        text: '最近一周',
        value: () => {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
          return [start, end]
        },
      },
      {
        text: '最近一个月',
        value: () => {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
          return [start, end]
        },
      },
      {
        text: '最近三个月',
        value: () => {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
          return [start, end]
        },
      },
    ]

    // 模拟日志数据
    const logsList = ref([
      {
        time: '2024-01-20 10:30:45',
        type: '开机',
        operator: 'wlkjyy',
        avatar: '../assets/avatar.jpg',
        detail: '实例开机操作',
        status: '成功'
      },
      {
        time: '2024-01-19 15:20:30',
        type: '关机',
        operator: 'admin',
        avatar: '../assets/avatar.jpg',
        detail: '实例关机操作',
        status: '成功'
      },
      {
        time: '2024-01-18 09:15:22',
        type: '重启',
        operator: 'wlkjyy',
        avatar: '../assets/avatar.jpg',
        detail: '实例重启操作',
        status: '成功'
      },
      {
        time: '2024-01-17 14:45:10',
        type: '配置变更',
        operator: 'system',
        avatar: '../assets/avatar.jpg',
        detail: '实例规格变更：ecs.g6.large -> ecs.g6.xlarge',
        status: '成功'
      },
      {
        time: '2024-01-16 11:30:00',
        type: '重装系统',
        operator: 'wlkjyy',
        avatar: '../assets/avatar.jpg',
        detail: '重装操作系统：CentOS 7.9 -> Ubuntu 20.04',
        status: '失败'
      }
    ])

    // 获取日志类型样式
    const getLogTypeClass = (type) => {
      const classMap = {
        '开机': 'type-success',
        '关机': 'type-info',
        '重启': 'type-warning',
        '配置变更': 'type-primary',
        '重装系统': 'type-danger'
      }
      return classMap[type] || ''
    }

    // 刷新日志
    const refreshLogs = () => {
      logsLoading.value = true
      setTimeout(() => {
        logsLoading.value = false
      }, 1000)
    }

    // 处理分页
    const handleSizeChange = (val) => {
      pageSize.value = val
      refreshLogs()
    }

    const handleCurrentChange = (val) => {
      currentPage.value = val
      refreshLogs()
    }

    onMounted(() => {
      // 这里可以根据路由参数获取实例详情
      console.log('Instance ID:', route.params.id)
      getVmInfo(route.params.id)
      
      // 监听标签页切换，切换到监控标签时初始化图表
      const unwatch = watch(() => activeTab.value, (newVal) => {
        if (newVal === 'monitoring') {
          // 使用 nextTick 确保 DOM 已更新
          nextTick(() => {
            initCharts()
          })
        }
      })

      // 如果默认就是监控标签，直接初始化
      if (activeTab.value === 'monitoring') {
        nextTick(() => {
          initCharts()
        })
      }

      // 组件卸载时清理
      onUnmounted(() => {
        unwatch()
      })
    })

    return {
      activeTab,
      instanceData,
      logDateRange,
      logsLoading,
      logsList,
      currentPage,
      pageSize,
      total,
      dateShortcuts,
      getLogTypeClass,
      refreshLogs,
      handleSizeChange,
      handleCurrentChange,
      stopVM,
      startVM
    }
  }
}
</script>

<style scoped>
.ecs-detail {
  min-height: 100vh;
  background-color: #f0f2f5;
  padding-bottom: 24px;
}

.page-header {
  padding: 16px 24px;
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 16px;
  margin: -20px -20px 0;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.breadcrumb {
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.instance-info {
  display: flex;
  align-items: baseline;
  gap: 12px;
  flex-wrap: wrap;
}

.instance-name {
  margin: 0;
  font-size: 20px;
  font-weight: 500;
  color: #262626;
  line-height: 28px;
}

.instance-meta {
  display: flex;
  align-items: center;
  gap: 16px;
}

.instance-id {
  color: #8c8c8c;
  font-size: 14px;
}

.header-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.action-button {
  font-weight: 400;
}

.overview-card {
  margin: 16px 24px;
  padding: 24px;
  background: #fff;
  border-radius: 2px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03);
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 24px;
}

.overview-item {
  padding: 0 24px;
  flex: 1;
  min-width: 200px;
}

.overview-label {
  font-size: 14px;
  color: #8c8c8c;
  margin-bottom: 8px;
}

.overview-value {
  font-size: 14px;
  color: #262626;
  line-height: 1.5715;
}

.divider {
  display: none;
}

@media (min-width: 768px) {
  .divider {
    display: block;
    height: 40px;
    margin: 0 24px;
  }
}

.status-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
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

.detail-content {
  margin: 0 24px;
  background: #fff;
  border-radius: 2px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03);
}

.detail-tabs {
  min-height: 400px;
}

.info-section {
  padding: 24px 24px 0;
}

.info-section:last-child {
  padding-bottom: 24px;
}

.section-header {
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-title {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  color: #262626;
  line-height: 1.5715;
}

.info-table {
  border: 1px solid #f0f0f0;
  border-radius: 2px;
}

.info-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

.info-row:not(:last-child) {
  border-bottom: 1px solid #f0f0f0;
}

.info-item {
  padding: 16px 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-item:not(:last-child) {
  border-right: 1px solid #f0f0f0;
}

.info-label {
  font-size: 14px;
  color: #8c8c8c;
}

.info-value {
  font-size: 14px;
  color: #262626;
  line-height: 1.5715;
}

.spec-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.spec-name {
  color: #262626;
  font-size: 14px;
}

.spec-detail {
  color: #8c8c8c;
  font-size: 12px;
}

.monitoring-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
  padding: 24px;
}

.chart-card {
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 2px;
  padding: 24px;
}

.chart-body {
  height: 280px;
  width: 100%;
}

:deep(.el-tabs__nav-wrap::after) {
  height: 1px;
  background-color: #f0f0f0;
}

:deep(.el-tabs__header) {
  margin: 0;
  padding: 0 16px;
  background-color: #fafafa;
  border-bottom: 1px solid #f0f0f0;
}

:deep(.el-tabs__item) {
  height: 48px;
  line-height: 48px;
  font-size: 14px;
  color: #595959;
  padding: 0 32px;
}

:deep(.el-tabs__item.is-active) {
  color: #1890ff;
  font-weight: 500;
}

:deep(.el-tabs__active-bar) {
  background-color: #1890ff;
  height: 2px;
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

:deep(.el-breadcrumb) {
  font-size: 14px;
  line-height: 1.5715;
}

:deep(.el-breadcrumb__item) {
  .el-breadcrumb__inner {
    color: #8c8c8c;
    &.is-link {
      color: #1890ff;
      font-weight: 400;
      &:hover {
        color: #40a9ff;
      }
    }
  }
  &:last-child {
    .el-breadcrumb__inner {
      color: #595959;
      font-weight: 400;
    }
  }
}

:deep(.el-breadcrumb__separator) {
  color: #8c8c8c;
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  padding: 0;
  height: 32px;
  color: #1890ff !important;

  &:hover {
    color: #40a9ff !important;
  }

  :deep(.el-icon) {
    font-size: 16px;
  }
}

/* 移动端适配 */
@media screen and (max-width: 768px) {
  .page-header {
    padding: 12px 16px;
  }

  .instance-name {
    font-size: 18px;
  }

  .header-actions {
    width: 100%;
    justify-content: flex-start;
  }

  .overview-card {
    margin: 12px 16px;
    padding: 16px;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .overview-item {
    width: 100%;
    padding: 0;
  }

  .detail-content {
    margin: 0 16px;
  }

  .info-section {
    padding: 16px 16px 0;
  }

  .info-row {
    grid-template-columns: 1fr;
  }

  .info-item {
    padding: 12px 16px;
  }

  .info-item:not(:last-child) {
    border-right: none;
    border-bottom: 1px solid #f0f0f0;
  }

  .monitoring-grid {
    grid-template-columns: 1fr;
    padding: 16px;
    gap: 16px;
  }

  .chart-body {
    height: 240px;
  }
}

/* 日志相关样式 */
.logs-container {
  padding: 0;
}

.logs-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 16px 20px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.header-left {
  display: flex;
  gap: 12px;
}

.header-right {
  display: flex;
  gap: 12px;
}

.date-picker {
  width: 240px;
}

/* 表格样式 */
:deep(.el-table) {
  --el-table-border-color: #ebeef5;
  --el-table-header-bg-color: var(--el-fill-color-light);
  font-size: 14px;
  border: none;
}

:deep(.el-table::before) {
  display: none;
}

:deep(.el-table th) {
  background-color: var(--el-fill-color-light);
  color: var(--el-text-color-regular);
  font-weight: 400;
  height: 40px;
  padding: 8px 16px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

:deep(.el-table td) {
  padding: 12px 16px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

/* 单元格样式 */
.time-text {
  color: var(--el-text-color-regular);
}

.type-text {
  font-weight: normal;
}

.type-success {
  color: #52c41a;
}

.type-info {
  color: var(--el-text-color-secondary);
}

.type-warning {
  color: #faad14;
}

.type-primary {
  color: #1890ff;
}

.type-danger {
  color: #ff4d4f;
}

.operator-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.operator-name {
  color: var(--el-text-color-regular);
}

.detail-cell {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.detail-text {
  color: var(--el-text-color-regular);
  flex: 1;
}

.status-text {
  font-size: 13px;
}

.status-text.success {
  color: #52c41a;
}

.status-text.error {
  color: #ff4d4f;
}

/* 分页样式 */
.pagination-container {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
  padding: 16px 20px;
  border-top: 1px solid var(--el-border-color-lighter);
}

.total-info {
  color: var(--el-text-color-secondary);
  font-size: 14px;
}

.page-size-select {
  width: 100px;
}

:deep(.el-pagination) {
  justify-content: flex-end;
  padding: 0;
}

:deep(.el-pagination .el-pagination__total) {
  margin-right: 16px;
}

:deep(.el-pagination button) {
  background-color: transparent;
}

:deep(.el-pagination .el-pager li) {
  background-color: transparent;
  border: 1px solid var(--el-border-color);
  margin: 0 4px;
  min-width: 32px;
  height: 32px;
  line-height: 30px;
}

:deep(.el-pagination .el-pager li.is-active) {
  background-color: var(--el-color-primary);
  border-color: var(--el-color-primary);
  color: #fff;
}

/* 移动端适配 */
@media screen and (max-width: 768px) {
  .logs-container {
    padding: 0;
  }

  .logs-header {
    flex-direction: column;
    gap: 16px;
    padding: 12px 16px;
  }

  .header-right {
    width: 100%;
  }

  .date-picker {
    width: 100%;
  }

  .pagination-container {
    flex-wrap: wrap;
    gap: 12px;
    padding: 12px 16px;
  }

  .page-size-select {
    width: 100px;
  }
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  padding: 0;
  height: 32px;
  color: #1890ff !important;

  &:hover {
    color: #40a9ff !important;
  }

  :deep(.el-icon) {
    font-size: 16px;
  }
}
</style> 