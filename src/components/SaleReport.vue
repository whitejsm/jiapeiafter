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
            <el-col :span="2"><el-button size="small">导出报表</el-button></el-col>
            <el-col :span="3" :offset="19">
                <el-button-group>
                    <el-popover
                            placement="bottom"
                            trigger="click">
                        <el-button size="small" type="primary" slot="reference">日</el-button>
                    </el-popover><el-popover
                            placement="bottom"
                            width="200"
                            trigger="click">
                        <el-date-picker
                            v-model="value2"
                            type="month"
                            placeholder="选择月"
                            size="mini"
                            @change="selectMonth()">
                        </el-date-picker>
                        <el-button size="small" slot="reference">月</el-button>
                    </el-popover><el-popover
                            placement="bottom"
                            width="200"
                            trigger="click">
                        <el-date-picker
                            v-model="value3"
                            type="year"
                            placeholder="选择年"
                            size="mini"
                            @change="selectYear()">
                        </el-date-picker>
                        <el-button size="small" slot="reference">年</el-button>
                    </el-popover>
                </el-button-group>
            </el-col>
        </el-row>
        <br />
        <el-row style="background-color: #e3f5ff; border-radius: 0px; padding: 15px 10px">
            <i class="el-icon-user-solid"></i>&nbsp;&nbsp;床位数（张）: {{total}}
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            租赁次数（次）: {{total}}
        </el-row>

        <el-table :data="tableData" border>
<!--            <el-table-column prop="date" label="id" width="40">-->
<!--                <template slot-scope="scope">{{scope.$index + 1}}</template>-->
<!--            </el-table-column>-->
<!--            <el-table-column prop="ordersId" label="订单号" width="120"></el-table-column>-->
<!--            <el-table-column prop="bed.department.hospital.hospitalname" label="所属医院"></el-table-column>-->
<!--            <el-table-column prop="bed.department.departmentname" label="所属科室"></el-table-column>-->
<!--            <el-table-column prop="bedId" label="床位id"></el-table-column>-->
<!--            <el-table-column prop="totalpay" label="实际支付"></el-table-column>-->
<!--            <el-table-column prop="customer.phonenumber" label="手机号"></el-table-column>-->
<!--            <el-table-column prop="ordersStatus" label="订单状态"></el-table-column>-->
<!--            <el-table-column prop="createTime" label="下单时间" width="150">-->
<!--                <template slot-scope="scope">{{ scope.row.createTime | dateFormat }}</template>-->
<!--            </el-table-column>-->
<!--            <el-table-column label="操作" width="150">-->
<!--                <template slot-scope="scope">-->
<!--                    <el-button type="small info" @click="getDetail(scope.row)">详情</el-button>-->
<!--                    <el-button type="small danger">删除</el-button>-->
<!--                </template>-->
<!--            </el-table-column>-->
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
                total: '',
                pageSize: '',
                departmentId: '',
                ordersStatus: '',
                hospitalId: '',
                tableData: '',
                value: '',
                value2: '',
                value3: '',
            }
        },
        methods: {
            changePage() {

            },
            selectMonth() {
                var a = new Date(this.value2).getFullYear();
                var b = new Date(this.value2).getMonth();
                console.log(a);
                console.log(b);
            },
            selectYear() {

            }
        }
    }
</script>

<style scoped>

</style>