<template>
    <div>
        <!--搜索框模块-->
    <div>
        <el-row>
        <el-col :span="8">
            <el-input placeholder="请输入故障ID" v-model="faultCondition.faultId" size="200px">
            <el-button slot="append" icon="el-icon-search" @click="findAll()"></el-button>
            </el-input>
        </el-col>
        </el-row>
        <br/>
        <el-row>
        <el-col :span="8">
            <span>所属医院</span>
            <el-select v-model="faultCondition.hospitalId" placeholder="---请选择医院" @change="getDepartment()">
            <el-option label="所有医院" value="-1"></el-option>
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
            <el-select v-model="faultCondition.departmentId" placeholder="---请选择科室">
            <el-option  label="所有科室" value="-1"></el-option>
            <el-option
                    v-for="item in departmentList"
                    :key="item.departmentId"
                    :label="item.departmentname"
                    :value="item.departmentId">
            </el-option>
            </el-select>
        </el-col>
        <el-col :span="8">
            <span>故障类型</span>
            <el-select v-model="faultCondition.faultType"  placeholder="---请选择故障状态">
                <el-option label="所有故障" value="-1"></el-option>
                <el-option label="机器故障" value="机器故障"></el-option>
                <el-option label="电量不足" value="电量不足"></el-option>
                <el-option label="硬件缺失" value="硬件缺失"></el-option>
                <el-option label="其他" value="其他"></el-option>
            </el-select>
        </el-col>
        </el-row>
        <br/>

        <el-row>
        <el-col :span="8">
            <span>故障状态</span>
            <el-select v-model="faultCondition.faultStatus"  placeholder="---请选择故障状态">
                <el-option label="所有状态" value="-1"></el-option>
                <el-option label="已备案" value="已备案"></el-option>
                <el-option label="已修复" value="已修复"></el-option>
                <el-option label="未修复" value="未修复"></el-option>
            </el-select>
        </el-col>
        
        <el-col :span="8">
            <span>维修状态</span>
            <el-select v-model="faultCondition.repairStatus"  placeholder="---请选择故障状态">
                <el-option label="所有状态" value="-1"></el-option>
                <el-option label="待修复" value="待修复"></el-option>
                <el-option label="维修中" value="维修中"></el-option>
                <el-option label="已完成" value="已完成"></el-option>
            </el-select>
        </el-col>
        <el-col :span="8">
            <span>故障来源</span>
            <el-select v-model="faultCondition.faultStatus"  placeholder="---请选择故障状态">
                <el-option label="所有来源" value="-1"></el-option>
                <el-option label="维修人员" value="维修人员"></el-option>
                <el-option label="顾客" value="顾客"></el-option>
            </el-select>
        </el-col>
        </el-row>
        
        
        <br/>
        <el-row>
        <el-col :span="18">
            <div class="block">
            <span class="demonstration">出厂日期：</span>
            <el-date-picker
                v-model="timeSelect"
                type="daterange"
                align="right"
                unlink-panels
                :clearable="false"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="changeDate()">
            </el-date-picker>
            <el-button type="small"  @click="findAll()">确认</el-button>
            <el-button type="small">清除</el-button>
            </div>
        </el-col>
        </el-row>
        <br/>
    <button @click="show()">click</button>

    </div>
    </div>    
</template>
<script>
    export default {
        name:"faults",
        data(){
            return {
                //查询的字段
                faultCondition:{
                    faultId:null,
                    hospitalId:"-1",
                    departmentId:"-1",
                    faultType:"-1",
                    faultStatus:"-1",
                    repairStatus:"-1",
                    faultSource:"-1",
                    beginTime:null,
                    endTime:null,
                },

                timeSelect:[new Date("2019/01/01 00:00:00"),new Date()],
                hospitalList:null,
                departmentList:null,
                
            }
        },
        methods:{
            findAll(){
                this.axios({
                    method:'get',
                    url: "http://localhost:9000/bed/findAll",
                    params: {
                        faultId:this.faultCondition.faultId,
                        hospitalId:this.faultCondition.hospitalId,
                        departmentId:this.faultCondition.departmentId,
                        faultType:this.faultCondition.faultType,
                        faultStatus:this.faultCondition.faultStatus,
                        repairStatus:this.faultCondition.repairStatus,
                        faultSource:this.faultCondition.faultSource,
                        beginTime:this.dateFormatWithDiagonal(this.timeSelect[0]),
                        endTime:new Date(this.timeSelect[1]).toLocaleDateString(),
                        pageSize:5,
                        pageNum:1
                    }
                })
                .then(res => {
                    console.log(res)
                    this.hospitalList=res.data.hospitalList;

                })
                .catch(err => {
                    console.error(err); 
                })
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
                return y + "/" + m + "/" + d +" "+ hh + ":" + mm + ":" + ss
            },
            getDepartment(){
                this.axios({
                    method:'get',
                    url: "http://localhost:9000/faults/findDepartment",
                    params: {
                        hospitalId:this.faultCondition.hospitalId
                    }
                }).then(res => {
                        console.log(res)
                        this.departmentList=res.data.departmentList
                    })
                    .catch(err => {
                        console.error(err); 
                    })
            },
            show(){
                console.log(this.dateFormatWithDiagonal(this.timeSelect[0])+ " " +this.dateFormatWithDiagonal(this.timeSelect[1]))
            }
        },
        mounted() {
            this.findAll();
        },
    }
</script>
<style scoped>

</style>
