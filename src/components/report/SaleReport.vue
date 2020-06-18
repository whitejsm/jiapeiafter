<template>
    <el-main>
        <el-row v-if="roleId == 1 || roleId == 3 || roleId == 7">
            <el-col :span="2">
                <span>分销商</span>
            </el-col>
            <el-col :span="6">
                <el-select v-model="distributorId" placeholder="--所有分销商--"
                           @change="getHospitalList">
                    <el-option :value="-1" label="所有分销商"></el-option>
                    <el-option
                            v-for="item in distributorList"
                            :key="item.userinfoId"
                            :label="item.name"
                            :value="item.userinfoId">
                    </el-option>
                </el-select>
            </el-col>
        </el-row>
        <br/>
        <el-row>
            <el-col :span="2" v-if="roleId == 1 || roleId == 3 || roleId == 7">
                <span>选择医院</span>
            </el-col>
            <el-col :span="6" v-if="roleId == 1 || roleId == 3 || roleId == 7">
                <el-select v-model="hospitalId" placeholder="--选择医院--"
                            @change="changeHospital">
                    <el-option :value="-1" label="选择医院"></el-option>
                    <el-option
                            v-for="item in hospitalList"
                            :key="item.hospitalId"
                            :label="item.hospitalname"
                            :value="item.hospitalId">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="2" v-if="roleId == 1 || roleId == 3 || roleId == 7 || roleId == 5">
                <span>选择科室</span>
            </el-col>
            <el-col :span="6" v-if="roleId == 1 || roleId == 3 || roleId == 7 || roleId == 5">
                <el-select v-model="departmentId" placeholder="--选择科室--">
                    <el-option :value="-1" label="选择科室"></el-option>
                    <el-option
                            v-for="item in departmentList"
                            :key="item.departmentId"
                            :label="item.departmentname"
                            :value="item.departmentId">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="2">
                <el-button @click="getReportList">查询</el-button>
            </el-col>
        </el-row>
        <br/>

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
        <br/>
        <el-row style="background-color: #e3f5ff; border-radius: 0px; padding: 15px 10px">
            <i class="el-icon-user-solid"></i>&nbsp;&nbsp;床位数（张）: {{bedCount}}
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            租赁次数（次）: {{leaseCount}}
        </el-row>

        <el-table :data="tableData" border>
            <el-table-column prop="date" label="id" width="40">
                <template slot-scope="scope">{{scope.$index + 1}}</template>
            </el-table-column>
            <el-table-column prop="orderDate" label="日期"></el-table-column>
            <el-table-column prop="distributorName" label="分销商" v-if="roleId != 5 && roleId != 6"></el-table-column>
            <el-table-column prop="hospitalName" label="医院名称" v-if="roleId != 6"></el-table-column>
            <el-table-column prop="departmentName" label="科室名称"></el-table-column>
            <el-table-column prop="bedCount" label="床位数（张）"></el-table-column>
            <el-table-column prop="leaseCount" label="租赁次数（张）"></el-table-column>
            <el-table-column prop="rentCount" label="总租金（元）" v-if="roleId == 1 || roleId == 3"></el-table-column>
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
</template>

<script>
    export default {
        name: "SaleReport",
        data() {
            return {
                // 筛选条件标签列表
                roleId: null,
                bedCount: 0,
                leaseCount: 0,
                departmentList: null,
                hospitalList: null,
                distributorList: null,
                // 分页
                total: 1,
                pageSize: 1,
                pageNum: 1,
                // 筛选条件
                departmentId: -1,
                hospitalId: -1,
                distributorId: -1,
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
        created() {
            // 2 系统管理员 4 维修人员 8 股东 无权限
            if (this.$store.state.roleId != 1 & this.$store.state.roleId != 3
                & this.$store.state.roleId != 5 & this.$store.state.roleId != 6
                & this.$store.state.roleId != 7) {
                this.$message({
                    message: '你没有相应的权限',
                    type: 'warning',
                });
                this.$router.push('/Main');
            }
        },
        mounted() {
            this.roleId = this.$store.state.roleId;
            this.getSaleInitData();
            this.getReportList();
        },
        methods: {
            getSaleInitData() {
                this.axios.get(
                    "http://localhost:9000/getSaleInitData"
                ).then(res => {
                    if(res.data.result == 'success') {
                        this.departmentList = res.data.departmentList;
                        this.hospitalList = res.data.hospitalList;
                        this.distributorList = res.data.distributorList;
                    }
                }).catch(err => {
                    console.error(err);
                })
            },
            changeHospital() {
                var obj = this.hospitalList.find(
                    item=>{
                        return item.hospitalId==this.hospitalId //筛选出对应数据
                    }
                );
                this.departmentList = (typeof obj !== 'undefined' ? obj.departmentList : null);
                this.departmentId = -1;
            },
            getHospitalList() {
                this.hospitalList = null;
                this.hospitalId = -1;
                this.departmentList = null;
                this.departmentId = -1;

                if (this.distributorId == -1) {
                    this.getSaleInitData();
                } else {
                    this.axios({
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                        method: 'get',
                        url: 'http://localhost:9000/getDistributorHospital',
                        params: {
                            distributorId: this.distributorId
                        }
                    }).then(res => {
                        if (res.data.result == 'success') {
                            this.hospitalList = res.data.hospitalList;
                        }
                    }).catch(err => {
                        console.error(err);
                    })
                }
            },
            changePage(pageNum) {
                this.pageNum = pageNum;
                this.getReportList();
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
                this.getReportList();
            },
            getMonth() {
                this.month.isClick = false;
                this.dateWidth = 4;
                // 根据选择月显示每日数据
                this.selectType = 'DAY';
                this.getReportList();
            },
            getYear() {
                this.year.isClick = false;
                this.dateWidth = 4;
                // 根据选择年显示每月数据
                this.selectType = 'MONTH';
                this.getReportList();
            },
            getReportList() {
                this.axios({
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    method: 'get',
                    url: 'http://localhost:9000/getSaleReport',
                    params: {
                        hospitalId: this.hospitalId,
                        departmentId: this.departmentId,
                        distributorId: this.distributorId,
                        selectType: this.selectType,
                        year: this.year.value,
                        month: this.month.value,
                        // pageSize: this.pageSize,
                        pageNum: this.pageNum,
                    }
                }).then(res => {
                    if (res.data.result == 'success') {
                        this.tableData = res.data.saleReportList;
                        this.total = res.data.pageBean.total;
                        this.pageSize = res.data.pageBean.pageSize;
                        this.pageNum = res.data.pageBean.pageNum;
                        this.bedCount = res.data.bedCount;
                        this.leaseCount = res.data.leaseCount;
                    }
                }).catch(err => {
                    console.error(err);
                })
            },
            getFile() {
                let param = "?";
                param += "hospitalId=" + this.hospitalId;
                param += "&departmentId=" + this.departmentId;
                param += "&distributorId=" + this.distributorId;
                param += "&selectType=" + (this.selectType == null ? '' : this.selectType);
                param += "&year=" + this.year.value;
                param += "&month=" + this.month.value;
                console.log(param);
                location.href="http://localhost:9000/downloadSaleReportFile" + param;
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

</style>