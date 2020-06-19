<template>
    <el-main>
        <el-row>
            首页 / 订单管理 / 订单信息
        </el-row>
        <br />
        <el-row>
            <el-col :span="8">
                <el-input placeholder="请输入订单号" v-model="ordersId" size="200px">
                    <el-button slot="append" icon="el-icon-search"></el-button>
                </el-input>
            </el-col>
        </el-row>
        <br/>
        <el-row>
            <el-col :span="8">
                <span>所属医院</span>
                <el-select v-model="hospitalId" placeholder="--全部医院--"
                           @change="changeHospital($event)">
                    <el-option :value="-1" label="全部医院"></el-option>
                    <el-option
                            v-for="item in hospitalList"
                            :key="item.hospitalId"
                            :label="item.hospitalname"
                            :value="item.hospitalId">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="8">
                <span>所属科室</span>
                <el-select v-model="departmentId" placeholder="--全部科室--">
                    <el-option :value="-1" label="全部科室"></el-option>
                    <el-option
                            v-for="item in departmentList"
                            :key="item.departmentId"
                            :label="item.departmentname"
                            :value="item.departmentId">
                    </el-option>
                </el-select>
            </el-col>
        </el-row>
        <br/>
        <el-row>
            <el-col :span="8">
                <span>订单状态</span>
                <el-select v-model="ordersStatus" placeholder="--订单状态--">
                    <el-option value="所有状态"></el-option>
                    <el-option value="已完成"></el-option>
                    <el-option value="未支付"></el-option>
                    <el-option value="已退回"></el-option>
                </el-select>
            </el-col>
        </el-row>
        <br/>
        <el-row>
            <el-col :span="18">
                <span>下单日期</span>
                <el-date-picker
                        v-model="dateRange"
                        type="daterange"
                        align="right"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :clearable="false">
                </el-date-picker>
                <el-button @click="getOrderList" type="small">确认</el-button>
                <el-button @click="clearCondition" type="small">清除</el-button>
            </el-col>
        </el-row>
        <br/>

        <el-row>
            <el-button size="small" @click="getFile">导出</el-button>
        </el-row>
        <br />
        <el-row style="background-color: #e3f5ff; border-radius: 0px; padding: 15px 10px">
            <i class="el-icon-user-solid"></i>&nbsp;&nbsp;总订单数: {{total}}
        </el-row>

        <el-table :data="tableData" border v-loading="loadStatus">
            <el-table-column prop="date" label="id" width="40">
                <template slot-scope="scope">{{scope.$index + 1}}</template>
            </el-table-column>
            <el-table-column prop="ordersId" label="订单号" width="120"></el-table-column>
            <el-table-column prop="bed.department.hospital.hospitalname" label="所属医院"></el-table-column>
            <el-table-column prop="bed.department.departmentname" label="所属科室"></el-table-column>
            <el-table-column prop="bedId" label="床位id"></el-table-column>
            <el-table-column prop="totalpay" label="实际支付"></el-table-column>
            <el-table-column prop="customer.phonenumber" label="手机号"></el-table-column>
            <el-table-column prop="ordersStatus" label="订单状态"></el-table-column>
            <el-table-column prop="createTime" label="下单时间" width="150">
                <template slot-scope="scope">{{ scope.row.createTime | dateFormat }}</template>
            </el-table-column>
            <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                    <el-button type="small info" @click="getDetail(scope.row)">详情</el-button>
                </template>
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
<!--        上传测试-->
<!--        <el-upload-->
<!--                class="upload-demo"-->
<!--                action="http://localhost:9000/uploadOrderFile/"-->
<!--                accept="xlsx"-->
<!--                :on-success="uploadSuccess"-->
<!--                :on-error="uploadFailed"-->
<!--                >-->
<!--            <el-button size="small" type="primary">点击上传</el-button>-->
<!--            <div slot="tip" class="el-upload__tip">请上传xlsx文件</div>-->
<!--        </el-upload>-->

        <el-dialog  :visible.sync="dialogTableVisible" width="70%">
            <el-row>
                <el-col :span="24"
                        style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
                               height: 220px">
                    <el-row style="margin: 30px">
                        <span style="font-size: larger">订单信息</span>
                    </el-row>
                    <el-row style="margin-top: 30px">
                        <el-col :span="3" :offset="1">订单号:</el-col>
                        <el-col :span="4">{{currentOrder.ordersId}}</el-col>
                        <el-col :span="3" :offset="1">订单状态:</el-col>
                        <el-col :span="4">{{currentOrder.ordersStatus}}</el-col>
                        <el-col :span="3" :offset="1">租用时长:</el-col>
                        <el-col :span="4">{{timeLength}}</el-col>
                    </el-row>
                    <el-row style="margin-top: 30px">
                        <el-col :span="3" :offset="1">下单时间:</el-col>
                        <el-col :span="4">{{currentOrder.createTime | dateFormat}}</el-col>
                        <el-col :span="3" :offset="1">归还时间:</el-col>
                        <el-col :span="4">{{currentOrder.endTime | dateFormat}}</el-col>
                        <el-col :span="3" :offset="1">是否异常:</el-col>
                        <el-col :span="4">{{currentOrder.faultId != null ? '是' : '否'}}</el-col>
                    </el-row>
                    <el-row style="margin-top: 30px">
                        <el-col :span="3" :offset="1">异常类型:</el-col>
                        <el-col :span="4">{{currentOrder.faultId != null ? currentOrder.fault.faultType : ''}}</el-col>
<!--                        <el-col :span="3" :offset="1">退还租金:</el-col>-->
<!--                        <el-col :span="4">已退回</el-col>-->
                    </el-row>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24"
                        style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
                                height: 450px; margin-top: 30px">
                    <el-row style="margin: 30px">
                        <span style="font-size: larger">床位信息</span>
                    </el-row>
                    <el-row style="margin-top: 30px">
                        <el-col :span="3" :offset="1">所属医院:</el-col>
                        <el-col :span="4">{{currentOrder.ordersId}}</el-col>
                        <el-col :span="3" :offset="1">所属科室:</el-col>
                        <el-col :span="4">{{currentOrder.ordersStatus}}</el-col>
                        <el-col :span="3" :offset="1">床位编号:</el-col>
                        <el-col :span="4">{{currentBed.number}}</el-col>
                    </el-row>
                    <el-row style="margin-top: 30px">
                        <el-col :span="3" :offset="1">设备ID:</el-col>
                        <el-col :span="4">{{currentOrder.bedId}}</el-col>
                        <el-col :span="3" :offset="1">租金金额:</el-col>
                        <el-col :span="4">{{currentOrder.rent}}</el-col>
                    </el-row>
                    <el-divider></el-divider>
                    <el-row style="margin: 30px">
                        <span style="font-size: larger">用户信息</span>
                    </el-row>
                    <el-row style="margin-top: 30px">
                        <el-col :span="3" :offset="1">手机号:</el-col>
                        <el-col :span="4">{{currentCustomer.phonenumber}}</el-col>
                        <el-col :span="3" :offset="1">微信昵称:</el-col>
                        <el-col :span="4">{{currentCustomer.wechat}}</el-col>
                    </el-row>
                    <el-divider></el-divider>
                    <el-row style="margin: 30px">
                        <span style="font-size: larger">支付信息</span>
                    </el-row>
                    <el-row style="margin-top: 30px">
                        <el-col :span="3" :offset="1">实际支付:</el-col>
                        <el-col :span="4">{{currentOrder.totalpay}}</el-col>
                        <el-col :span="3" :offset="1">支付状态:</el-col>
                        <el-col :span="4">{{currentOrder.ordersStatus}}</el-col>
                        <el-col :span="3" :offset="1">支付时间:</el-col>
                        <el-col :span="4">{{currentOrder.payTime | dateFormat}}</el-col>
                    </el-row>
                </el-col>
            </el-row>
        </el-dialog>
    </el-main>
</template>

<script>
    export default {
        name: "Order.vue",
        data() {
            return {
                loadStatus: true,
                tableData: null,
                hospitalList: null,
                departmentList: null,
                ordersId: null,
                hospitalId: -1,
                departmentId: -1,
                ordersStatus: '所有状态',
                dateRange: [new Date(0), new Date()],
                total: 1,
                pageSize: 1,
                pageNum: 1,
                dialogTableVisible: false,
                currentOrder: '',
                currentBed: '',
                currentCustomer: '',
                timeLength: '',
            }
        },
        created() {
            // 3 会计 4 维修人员 8 股东 无权限
            if (this.$store.state.roleId != 1 & this.$store.state.roleId != 2
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
            this.axios.get(
                "http://localhost:9000/hospital/getAllHospital"
            ).then(res => {
                if(res.data.result == 'ok') {
                    this.hospitalList = res.data.hospitalList;
                }
                //this.changeHospital(0);
            }).catch(err => {
                console.error(err);
            })
            this.getOrderList();
        },
        methods: {
            changeHospital() {
                var obj = this.hospitalList.find(
                    item=>{
                        return item.hospitalId==this.hospitalId //筛选出对应数据
                    }
                );
                this.departmentList = (typeof obj !== 'undefined' ? obj.departmentList : null);
                this.departmentId = -1;
            },
            clearCondition() {
                this.ordersId = '';
                this.hospitalId = '-1';
                this.departmentId = '-1';
                this.ordersStatus = '所有状态';
                this.dateRange = [new Date(0), new Date()];
            },
            getOrderList() {
                this.loadStatus = true;
                this.axios({
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    method: 'get',
                    url: 'http://localhost:9000/getOrdersByCondition',
                    params: {
                        ordersId: this.ordersId,
                        hospitalId: this.hospitalId,
                        departmentId: this.departmentId,
                        ordersStatus: this.ordersStatus,
                        //createTime: new Date(this.dateRange[0]).toLocaleDateString(),
                        //endTime: new Date(this.dateRange[1]).toLocaleDateString(),
                        createTime: this.dateFormatWithDiagonal(this.dateRange[0]),
                        endTime: this.dateFormatWithDiagonal(this.dateRange[1]),

                        // pageSize: this.pageSize,
                        pageNum: this.pageNum,
                    }
                }).then(res => {
                    if (res.data.result == 'ok') {
                        this.tableData = res.data.ordersList;
                        console.log(res.data);
                        this.total = res.data.pageBean.total;
                        this.pageSize = res.data.pageBean.pageSize;
                        this.pageNum = res.data.pageBean.pageNum;
                    }
                    this.loadStatus = false;
                }).catch(err => {
                    console.error(err);
                })
            },
            getDetail(row) {
                this.dialogTableVisible = true;
                this.currentOrder = row;
                this.currentBed = row.bed;
                this.currentCustomer = row.customer;

                if(this.currentOrder.endTime != null) {
                    var date2 = new Date(this.currentOrder.endTime);
                    var date1 = new Date(this.currentOrder.createTime);
                    var date3 = date2.getTime() - new Date(date1).getTime();   //时间差的毫秒数
                    //计算出相差天数
                    var days=Math.floor(date3/(24*3600*1000))

                    //计算出小时数
                    var leave1=date3%(24*3600*1000)    //计算天数后剩余的毫秒数
                    var hours=Math.floor(leave1/(3600*1000))
                    //计算相差分钟数
                    var leave2=leave1%(3600*1000)        //计算小时数后剩余的毫秒数
                    var minutes=Math.floor(leave2/(60*1000))
                    //计算相差秒数
                    var leave3=leave2%(60*1000)      //计算分钟数后剩余的毫秒数
                    var seconds=Math.round(leave3/1000)

                    this.timeLength = days+"天"+hours+"小时 "+minutes+"分钟"+seconds+"秒";
                } else {
                    this.timeLength = null;
                }

            },
            changePage(pageNum) {
                this.pageNum = pageNum;
                this.getOrderList();
            },
            dateFormatWithDiagonal(dataStr) {
                var dt = new Date(dataStr);
                // yyyy-mm-dd
                var y = dt.getFullYear();
                var m = dt.getMonth() + 1;
                var d = dt.getDate();
                var hh = dt.getHours();
                var mm = dt.getMinutes();
                var ss = dt.getSeconds();
                return y + "/" + m + "/" + d + "  " + hh + ":" + mm + ":" + ss
            },
            getFile() {
                let param = "?";
                param += "ordersId=" + (this.ordersId == null ? '' : this.ordersId);
                param += "&departmentId=" + this.departmentId;
                param += "&hospitalId=" + this.hospitalId;
                param += "&ordersStatus=" + this.ordersStatus;
                param += "&createTime=" + this.dateFormatWithDiagonal(this.dateRange[0]);
                param += "&endTime=" + this.dateFormatWithDiagonal(this.dateRange[1]);
                console.log(param);
                location.href="http://localhost:9000/downloadOrdersFile" + param;
            },
            uploadSuccess(response, file, fileList) {
                console.log("success");
            },
            uploadFailed(err, file, fileList) {
                console.log("error");
            }
        },
        filters: {
            dateFormat(dataStr) {
                var dt = new Date(dataStr);
                // yyyy/mm/dd
                var y = dt.getFullYear();
                var m = dt.getMonth() + 1;
                var d = dt.getDate();
                var hh = dt.getHours();
                var mm = dt.getMinutes();
                var ss = dt.getSeconds();
                return y + "-" + m + "-" + d + "  " + hh + ":" + mm + ":" + ss
            }
        }
    }
</script>

<style scoped>

</style>