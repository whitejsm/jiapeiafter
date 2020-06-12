<template>
    <el-main>
        <el-row>
            <el-col :span="2">
                <span>分销商</span>
            </el-col>
            <el-col :span="6">
                <el-select v-model="hospitalId" placeholder="--所有分销商--"
                           @change="">
                    <el-option value="-1" label="所有分销商"></el-option>
                    <!--                    <el-option-->
                    <!--                            v-for="item in hospitalList"-->
                    <!--                            :key="item.hospitalId"-->
                    <!--                            :label="item.hospitalname"-->
                    <!--                            :value="item.hospitalId">-->
                    <!--                    </el-option>-->
                </el-select>
            </el-col>
        </el-row>
        <br/>
        <el-row>
            <el-col :span="2">
                <span>选择医院</span>
            </el-col>
            <el-col :span="6">
                <el-select v-model="ordersStatus" placeholder="--选择医院--">
                    <el-option value="-1" label="选择医院"></el-option>
                    <!--                    <el-option-->
                    <!--                            v-for="item in departmentList"-->
                    <!--                            :key="item.departmentId"-->
                    <!--                            :label="item.departmentname"-->
                    <!--                            :value="item.departmentId">-->
                    <!--                    </el-option>-->
                </el-select>
            </el-col>
            <el-col :span="2">
                <span>选择科室</span>
            </el-col>
            <el-col :span="6">
                <el-select v-model="departmentId" placeholder="--选择科室--">
                    <el-option value="-1" label="选择科室"></el-option>
                    <!--                    <el-option-->
                    <!--                            v-for="item in departmentList"-->
                    <!--                            :key="item.departmentId"-->
                    <!--                            :label="item.departmentname"-->
                    <!--                            :value="item.departmentId">-->
                    <!--                    </el-option>-->
                </el-select>
            </el-col>
        </el-row>
        <br/>

        <el-row>
            <el-col :span="2">
                <el-button size="small">导出报表</el-button>
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
            <i class="el-icon-user-solid"></i>&nbsp;&nbsp;床位数（张）: {{total}}
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            租赁次数（次）: {{total}}
        </el-row>

        <el-table :data="tableData" border>
            <el-table-column prop="date" label="id" width="40">
                <template slot-scope="scope">{{scope.$index + 1}}</template>
            </el-table-column>
            <el-table-column prop="date" label="日期"></el-table-column>
            <el-table-column prop="" label="分销商"></el-table-column>
            <el-table-column prop="" label="医院名称"></el-table-column>
            <el-table-column prop="" label="可是名称"></el-table-column>
            <el-table-column prop="" label="床位数（张）"></el-table-column>
            <el-table-column prop="" label="租赁次数（张）"></el-table-column>
            <el-table-column prop="" label="总租金（元）"></el-table-column>
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
                // 分页
                total: '',
                pageSize: '',
                // 筛选条件
                departmentId: '',
                hospitalId: '',
                userinfoId: '',
                tableData: '',
                // 年月日选择器相关
                dateWidth: 4,
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
        methods: {
            changePage() {

            },
            dateInit() {
                this.dateWidth = 4;
                this.month.isClick = false;
                this.month.value = '';
                this.year.isClick = false;
                this.year.value = '';
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
                // 直接获取按年显示数据
            },
            getMonth() {
                this.month.isClick = false;
                this.dateWidth = 4;
                // 根据选择月显示每日数据
            },
            getYear() {
                this.year.isClick = false;
                this.dateWidth = 4;
                // 根据选择年显示每月数据
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