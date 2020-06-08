<template>
        <el-container style="height: 1000px; ">
            <el-container style="background-color: #545c64">
                <el-header width="250px" height="50px" background-color="#545c64">
                    <span style="line-height: 50px; text-align: center; font-size: large"><i class="el-icon-star-off"></i>佳佳陪护床</span>
                </el-header>
                <el-aside style="height: 950px; width: 250px" background-color="#545c64">
                    <el-menu router class="el-menu-vertical-demo" background-color="#545c64" text-color="#fff"
                             active-text-color="#ffd04b">
                        <div v-for="permission in permissionList" index="">
                            <el-submenu v-for="(childOne, childOneIndex) in permission.children" :key="childOneIndex"
                                        :index="childOneIndex + ''">
                                <template slot="title"><i class="el-icon-message"></i>{{childOne.name}}</template>
                                <el-menu-item-group v-for="(childTwo, childTwoIndex) in childOne.children"
                                                    :key="childTwoIndex" :index="url">
                                    <el-menu-item><span :href="childTwo.url"> {{childTwo.name}}</span></el-menu-item>
                                </el-menu-item-group>
                            </el-submenu>
                        </div>
                    </el-menu>
                </el-aside>
            </el-container>
            <el-container>
                <el-header style="text-align: right; font-size: 12px">
                    <el-dropdown>
                        <i class="el-icon-setting" style="margin-right: 15px"></i>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>查看</el-dropdown-item>
                            <el-dropdown-item>新增</el-dropdown-item>
                            <el-dropdown-item>删除</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <span>王小虎</span>
                    <hr/>
                    <span>
                        <el-breadcrumb separator="/">
                          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                          <el-breadcrumb-item><a href="/">活动管理</a></el-breadcrumb-item>
                          <el-breadcrumb-item>活动列表</el-breadcrumb-item>
                          <el-breadcrumb-item>活动详情</el-breadcrumb-item>
                        </el-breadcrumb>
                    </span>
                </el-header>
                <el-main>
                    <el-row>
                        <el-col :span="8">
                            <el-input placeholder="请输入订单号" v-model="searchInput" size="200px">
                                <el-button slot="append" icon="el-icon-search"></el-button>
                            </el-input>
                        </el-col>
                    </el-row>
                    <br/>
                    <el-row>
                        <el-col :span="8">
                            <span>所属医院</span>
                            <el-select v-model="value" placeholder="--全部医院--">
                                <!--                                <el-option-->
                                <!--                                        v-for="item in options"-->
                                <!--                                        :key="item.value"-->
                                <!--                                        :label="item.label"-->
                                <!--                                        :value="item.value">-->
                                <!--                                </el-option>-->
                            </el-select>
                        </el-col>
                        <el-col :span="8">
                            <span>所属科室</span>
                            <el-select v-model="value" placeholder="--全部科室--">
                                <!--                                <el-option-->
                                <!--                                        v-for="item in options"-->
                                <!--                                        :key="item.value"-->
                                <!--                                        :label="item.label"-->
                                <!--                                        :value="item.value">-->
                                <!--                                </el-option>-->
                            </el-select>
                        </el-col>
                    </el-row>
                    <br/>
                    <el-row>
                        <el-col :span="8">
                            <span>订单状态</span>
                            <el-select v-model="value" placeholder="--订单状态--">
                                <!--                                <el-option-->
                                <!--                                        v-for="item in options"-->
                                <!--                                        :key="item.value"-->
                                <!--                                        :label="item.label"-->
                                <!--                                        :value="item.value">-->
                                <!--                                </el-option>-->
                            </el-select>
                        </el-col>
                    </el-row>
                    <br/>
                    <el-row>
                        <el-col :span="18">
                            <span>下单日期</span>
                            <el-date-picker
                                    v-model="value1"
                                    type="daterange"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期">
                            </el-date-picker>
                            <el-button type="small">确认</el-button>
                            <el-button type="small">清除</el-button>
                        </el-col>
                    </el-row>
                    <br/>
                    <el-table :data="tableData" border>
                        <el-table-column prop="date" label="日期" width="140">
                        </el-table-column>
                        <el-table-column prop="name" label="姓名" width="120">
                        </el-table-column>
                        <el-table-column prop="address" label="地址">
                        </el-table-column>
                    </el-table>
                    <el-pagination
                            background
                            layout="prev, pager, next"
                            :total="1000">
                    </el-pagination>
                </el-main>
            </el-container>
        </el-container>
</template>

<script>
    export default {
        data() {
            return {
                tableData: [],
                searchInput: '',
                value1: '',
                value: '',
                permissionList: [{
                    "pid": 1,
                    "name": "系统权限菜单",
                    "parentid": 0,
                    "url": "/",
                    "roles": null,
                    "open": true,
                    children: [{
                        "pid": 6,
                        "name": "个人信息管理",
                        "parentid": 1,
                        "url": "/",
                        "roles": null,
                        "open": true,
                        children: [{
                            "pid": 7,
                            "name": "个人信息查看",
                            "parentid": 6,
                            "url": "/tm_system/userInfo/jumpUserInfoShowPage",
                            "roles": null,
                            "open": true,
                            "children": []
                        }, {
                            "pid": 8,
                            "name": "密码修改",
                            "parentid": 6,
                            "url": "http://www.baidu.com",
                            "roles": null,
                            "open": true,
                            "children": []
                        }]
                    }, {
                        "pid": 9,
                        "name": "人员管理",
                        "parentid": 1,
                        "url": "/",
                        "roles": null,
                        "open": true,
                        children: [{
                            "pid": 10,
                            "name": "学生信息查看",
                            "parentid": 9,
                            "url": "/tm_system/student/jumpStudentPage",
                            "roles": null,
                            "open": true,
                            "children": []
                        }, {
                            "pid": 28,
                            "name": "教师信息查看",
                            "parentid": 9,
                            "url": "/tm_system/teacher/jumpTeacherPage",
                            "roles": null,
                            "open": true,
                            "children": []
                        }, {
                            "pid": 30,
                            "name": "班主任信息查看",
                            "parentid": 9,
                            "url": "/tm_system/headmaster/jumpHeadmasterPage",
                            "roles": null,
                            "open": true,
                            "children": []
                        }]
                    }, {
                        "pid": 11,
                        "name": "班级管理",
                        "parentid": 1,
                        "url": "/",
                        "roles": null,
                        "open": true,
                        children: [{
                            "pid": 12,
                            "name": "班级查看",
                            "parentid": 11,
                            "url": "/tm_system/class/jumpClassPage",
                            "roles": null,
                            "open": true,
                            "children": []
                        }]
                    }]
                }]
            }
        },
        methods: {
            handleOpen(key, keyPath) {
                console.log(key, keyPath);
            },
            handleClose(key, keyPath) {
                console.log(key, keyPath);
            }
        }
    }
</script>

<style>

</style>