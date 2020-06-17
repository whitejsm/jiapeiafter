<template>
    <el-container>
        <el-header style="background-color: white">
            报表 / 报表概况
        </el-header>
        <el-main style="background-color: #E6E6E6; height: 150px">
            <el-row>
                <el-col :span="7" :offset="1">
                    <el-row>
                        <span>床位总数(张)</span>
                    </el-row>
                    <el-row>
                        <div class="countClass">{{bedCount}}</div>
                    </el-row>
                </el-col>
                <el-col :span="7" :offset="1">
                    <el-row>
                        <span>租用次数(次)</span>
                    </el-row>
                    <el-row>
                        <div class="countClass">{{leaseCount}}</div>
                    </el-row>
                </el-col>
                <el-col :span="7" :offset="1">
                    <el-row>
                        <span>总租金收益(元)</span>
                    </el-row>
                    <el-row>
                        <div class="countClass">{{rentCount}}</div>
                    </el-row>
                </el-col>
            </el-row>
        </el-main>
        <el-main>
            <el-row>
                <el-col :span="2">
                    <el-button size="small" @click="getFile">导出报表</el-button>
                </el-col>
                <el-col :span="dateWidth" style="float:right">
                    <!-- 日选择器，选择到月份 -->
                    <el-button size="small" v-show="!month.isClick" @click="pressDay">日</el-button>
                    <el-date-picker v-show="month.isClick" v-model="month.value" @change="getMonth"
                                    type="month"
                                    size="small"
                                    :clearable="false"
                                    value-format="yyyy/MM">
                    </el-date-picker>
                    <!-- 月选择器，选择到年 -->
                    <el-button size="small" v-show="!year.isClick" @click="pressMonth">月</el-button>
                    <el-date-picker v-show="year.isClick" v-model="year.value" @change="getYear"
                                    type="year"
                                    size="small"
                                    :clearable="false">
                    </el-date-picker>
                    <!-- 选择按年显示 -->
                    <el-button size="small" @click="pressYear">年</el-button>
                </el-col>
            </el-row>

            <el-table :data="tableData" border>
                <el-table-column prop="date" label="id" width="40">
                    <template slot-scope="scope">{{scope.$index + 1}}</template>
                </el-table-column>
                <el-table-column prop="orderDate" label="日期"></el-table-column>
                <el-table-column prop="bedCount" label="床位数（张）">
                    <template slot-scope="scope">{{ scope.row.bedCount == null ? 0 : scope.row.bedCount }}</template>
                </el-table-column>
                <el-table-column prop="leaseCount" label="租赁次数（张）">
                    <template slot-scope="scope">{{ scope.row.leaseCount == null ? 0 : scope.row.leaseCount }}</template>
                </el-table-column>
                <el-table-column prop="rentCount" label="租金收益（元）">
                    <template slot-scope="scope">{{ scope.row.rentCount == null ? 0 : scope.row.rentCount }}</template>
                </el-table-column>
            </el-table>
            <el-pagination
                    style="text-align: center"
                    background
                    layout="prev, pager, next"
                    :total="total"
                    :page-size="pageSize"
                    @current-change="changePage">
            </el-pagination>
        </el-main>
    </el-container>
</template>

<script>
    export default {
        name: "SimpleReport",
        data() {
            return {
                // 筛选条件标签列表
                bedCount: 0,
                leaseCount: 0,
                rentCount: 0,
                // 分页
                total: 1,
                pageSize: 1,
                pageNum: 1,
                // 表格数据
                tableData: null,
                // 年月日选择器相关
                dateWidth: 4,
                selectType: null,
                month: {
                    isClick: false,
                    value: ''
                },
                year: {
                    isClick: false,
                    value: ''
                }
            }
        },
        mounted() {
            this.getCountInfo();
            this.getSimpleReportList();
        },
        methods: {
            getCountInfo() {
                this.axios.get('http://localhost:9000/getCountInfo').then(res => {
                    if (res.data.result == 'success') {
                        this.rentCount = res.data.rentCount;
                        this.bedCount = res.data.bedCount;
                        this.leaseCount = res.data.leaseCount;
                    }
                }).catch(err => {
                    console.error(err);
                })
            },
            changePage(pageNum) {
                this.pageNum = pageNum;
                this.getSimpleReportList();
            },
            dateInit() {
                this.dateWidth = 4;
                this.month.isClick = false;
                this.month.value = '';
                this.year.isClick = false;
                this.year.value = '';
                this.selectType = null;
            },
            pressDay() {
                this.dateInit();
                this.month.isClick = true;
                this.dateWidth = 8;
            },
            pressMonth() {
                this.dateInit();
                this.year.isClick = true;
                this.dateWidth = 8;
            },
            pressYear() {
                this.dateInit();
                // 直接获取按年显示数据
                this.selectType = 'YEAR';
                this.getSimpleReportList();
            },
            getMonth() {
                this.month.isClick = false;
                this.dateWidth = 4;
                // 根据选择月显示每日数据
                this.selectType = 'DAY';
                this.getSimpleReportList();
            },
            getYear() {
                this.year.isClick = false;
                this.dateWidth = 4;
                // 根据选择年显示每月数据
                this.selectType = 'MONTH';
                this.getSimpleReportList();
            },
            getSimpleReportList() {
                this.axios({
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    method: 'get',
                    url: 'http://localhost:9000/getSimpleReport',
                    params: {
                        selectType: this.selectType,
                        year: this.year.value,
                        month: this.month.value,
                        pageSize: this.pageSize,
                        pageNum: this.pageNum,
                    }
                }).then(res => {
                    if (res.data.result == 'success') {
                        this.tableData = res.data.simpleReportList;
                        this.total = res.data.pageBean.total;
                        this.pageSize = res.data.pageBean.pageSize;
                        this.pageNum = res.data.pageBean.pageNum;
                    }
                }).catch(err => {
                    console.error(err);
                })
            },
            getFile() {
                let param = "?";
                param += "&selectType=" + (this.selectType == null ? '' : this.selectType);
                param += "&year=" + this.year.value;
                param += "&month=" + this.month.value;
                console.log(param);
                location.href="http://localhost:9000/downloadSimpleReportFile" + param;
            }
        },
        filters: {
            dateFormat(dataStr) {
                var dt = new Date(dataStr);
                // yyyy-mm-dd
                var y = dt.getFullYear();
                var m = dt.getMonth() + 1;
                var d = dt.getDate();
                return y + "-" + m + "-" + d
            }
        }
    }
</script>

<style scoped>
    .countClass {
        line-height: 100px;
        text-align: center;
        font-size: 50px;
        color: #545c64;
        margin-left: -50px;
    }
</style>