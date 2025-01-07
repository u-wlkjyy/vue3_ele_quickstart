import request from "@/utils/request.js";
import {ref} from "vue";


const baseUrl = "https://cloudapi.007idc.cn/api/v1/"
const urlMap = {
    login: "user/login",
    userInfo: "users/info/info",
    userCover: "tool/user_cover",
    downFile: "tool/file/down",

    vmList: "users/api/vm/list",  // 获取虚拟机列表
    vmInfo: "users/api/vm/info",  // 获取虚拟机详细信息
    vmState: "users/api/vm/state",// 获取虚拟机状态
    vmStart: "users/api/vm/start",// 启动虚拟机
    vmStop: "users/api/vm/stop",  // 关闭虚拟机
    vmPowerOff: "users/api/vm/poweroff", // 强制关闭虚拟机
    vmRestart: "users/api/vm/restart",  // 重启虚拟机
    vmForceRestart: "users/api/vm/force_restart",  // 强制重启虚拟机
}

let userData = null

const fileMap = {}

// 登陆
async function login(username, password) {
    return await request.post(baseUrl + urlMap.login, {
        username: username,
        password: password,
    })
}

// 获取用户信息
async function userInfo() {
    return await request.get(baseUrl + urlMap.userInfo);
}

// 获取用户信息并缓存
async function getUserInfo(){
    if(userData){
        return userData
    }else {
        const response = await userInfo(baseUrl + urlMap.userInfo);
        userData = response.data
        return userData;
    }
}

// 获取用户头像
async function getUserCover(user_id) {
    return await request.get(baseUrl + urlMap.userCover, {user_id: user_id});
}

// 下载文件
async function downFile(file_id) {
    return await request.get(baseUrl + urlMap.downFile, {file_id: file_id});
}

// 下载文件并缓存
async function downFileToBase64(file_id, is_image = true) {
    let file_content = ""
    if (fileMap[file_id]){
        file_content = fileMap[file_id]
    }else{
        const response = await downFile(file_id);
        file_content = response.data.content
        fileMap[file_id] = file_content;
    }
    return is_image? ("data:image/jpeg;base64," + file_content): file_content;
}

// 获取虚拟机列表
async function getVMList(page=1, count=10){
    return await request.get(baseUrl + urlMap.vmList, {page: page, count: count});
}

// 获取虚拟机详情
async function getVMInfo(vm_id){
    return await request.get(baseUrl + urlMap.vmInfo, {id: vm_id});
}

// 启动虚拟机
async function vmStart(vm_id){
    return await request.get(baseUrl + urlMap.vmStart, {id: vm_id});
}

// 关闭虚拟机
async function vmStop(vm_id){
    return await request.get(baseUrl + urlMap.vmStop, {id: vm_id});
}

// 强制关闭虚拟机
async function vmPowerOff(vm_id){
    return await request.get(baseUrl + urlMap.vmPowerOff, {id: vm_id});
}

// 重启虚拟机
async function vmRestart(vm_id){
    return await request.get(baseUrl + urlMap.vmRestart, {id: vm_id});
}


export default {
    login,
    userInfo,
    getUserCover,
    downFileToBase64,
    getUserInfo,
    getVMList,
    getVMInfo,
    vmStart,
    vmStop,
    vmPowerOff,
    vmRestart
}