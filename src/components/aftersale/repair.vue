<template>
    <div>
<!--搜索框模块-->
        <div>
            <el-row>
                <el-col :span="8">
                    <el-input placeholder="请输入维修记录ID" v-model="repairCondition.repairId" size="200px"></el-input>
                </el-col>
            </el-row><br/>
            <el-row>
                <el-col :span="8">
                    <span>所属医院</span>
                    <el-select v-model="repairCondition.hospitalId"  placeholder="---请选择医院" @change="changeHospital()">
                        <el-option label="所有医院" value="-1"></el-option>
                        <el-option v-for="item in hospitalList" :key="item.hospitalId" :label="item.hospitalname" :value="item.hospitalId"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="8">
                <span>所属科室</span>
                    <el-select v-model="repairCondition.departmentId" placeholder="---请选择科室" @change="changeDepartment()">
                        <el-option  label="所有科室" value="-1"></el-option>
                        <el-option v-for="item in departmentList" :key="item.departmentId" :label="item.departmentname" :value="item.departmentId"></el-option>
                    </el-select>
                </el-col>
            </el-row>
            <br/>

            <el-row>
                <el-col :span="8">
                    <span>维修人员</span>
                    <el-select v-model="repairCondition.repairmanId"  placeholder="---请选择维修人员">
                        <el-option label="所有人员" value="-1"></el-option>
                        <el-option v-for="item in repairmanList" :key="item.userinfoId" :label="item.name" :value="item.userinfoId"></el-option>
                    </el-select>
                </el-col>

                <el-col :span="8">
                    <span>维修状态</span>
                    <el-select v-model="repairCondition.repairStatus"  placeholder="---请选择维修状态">
                        <el-option label="所有状态" value="-1"></el-option>
                        <el-option label="待维修" value="待维修"></el-option>
                        <el-option label="维修中" value="维修中"></el-option>
                        <el-option label="已完成" value="已完成"></el-option>
                    </el-select>
                </el-col>
            </el-row><br/>
            
            <el-row>
                <el-col :span="18">
                    <div class="block">
                    <span class="demonstration">创建日期：</span>
                    <el-date-picker
                        v-model="timeSelect"
                        type="daterange"
                        align="right"
                        unlink-panels
                        :clearable="false"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                    <el-button type="middle"  @click="findAll()">搜索</el-button>
                    <el-button type="middle" @click="clearCondition()">清除</el-button>
                    </div>
                </el-col>
            </el-row>
            <br/>
        </div>


        <el-row>
            
        </el-row>
       
        <el-row style="background-color: #e3f5ff; border-radius: 0px; padding: 15px 10px">
            <el-button type="danger"  @click="getChecked()">获得选中ID</el-button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <el-button type="primary" @click="exportRepair()">导出记录</el-button> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;共{{total}}条记录
        </el-row>
    
<!--信息展示模块-->
    <el-table :data="repairList" stripe style="width:100%" ref="multipleTable" v-loading="loading">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="repairId" label="维修ID" width="180"></el-table-column>
        <el-table-column prop="fault.faultId" label="故障ID" width="100"></el-table-column>
        <el-table-column prop="fault.faultType" label="故障类型" width="170"></el-table-column>
        <el-table-column prop="userInfo.name" label="维修人" width="170"></el-table-column>
        <el-table-column prop="repairStatus" label="维修状态" width="170"></el-table-column>
        <el-table-column prop="createTime" label="维修时间" width="170">
            <template slot-scope="scope">{{scope.row.createTime | dateFormat}}</template>
        </el-table-column>

        <el-table-column prop="" label="操作" width="180">
            <template slot-scope="scope">
                <el-button type="primary" size="small" icon="el-icon-tickets" circle @click="openDetails(scope.row)"></el-button>
                <el-button type="danger" size="small" icon="el-icon-delete" circle @click="delRepairById(scope.row.repairId)" v-if="scope.row.repairStatus=='已完成'"></el-button>
            </template>
        </el-table-column>
    </el-table>

      <!--分页-->
        <center>
            <div style="text-align：center">
                <el-pagination
                    background
                    layout="prev, pager, next"
                    @current-change="changePageNum"
                    :page-size="pageSize"
                    :total="total">
                </el-pagination>
            </div>
        </center>

<!--维修详情页-->
        <el-dialog title="维修信息详情" :visible.sync="openDetail" v-if="openDetail" width="1000px">
             <el-row>
                <el-col :span="24" style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); height: 270px">
                    <el-row style="margin: 30px">
                        <span style="font-size: larger"><span class="el-icon-star-on"></span>维修信息</span>
                    </el-row>
                    <el-row style="margin-top: 30px">
                        <el-col :span="3" :offset="1">维修ID:</el-col>
                        <el-col :span="4">{{currentRepair.repairId}}</el-col>
                        <el-col :span="3" :offset="1">维修状态:</el-col>
                        <el-col :span="4">{{currentRepair.repairStatus}}</el-col>
                        <el-col :span="3" :offset="1">维修结果:</el-col>
                        <el-col :span="4">{{currentRepair.repairResult}}</el-col>
                    </el-row>
                    <el-row style="margin-top: 30px">
                        <el-col :span="3" :offset="1">维修描述:</el-col>
                        <el-col :span="18">{{currentRepair.repairInstructions}}</el-col>
                    </el-row>
                    <el-row style="margin-top: 30px">
                        <el-col :span="3" :offset="1">维修时间:</el-col>
                        <el-col :span="4">{{currentRepair.createTime | dateFormat}}</el-col>
                        <el-col :span="3" :offset="1">维修人员:</el-col>
                        <el-col :span="4">{{currentRepair.userInfo.name}}</el-col>
                        <el-col :span="3" :offset="1">联系方式:</el-col>
                        <el-col :span="4">{{currentRepair.userInfo.phonenumber}}</el-col>
                    </el-row>
                </el-col>
            </el-row><br/>
            <el-row>
                <el-col :span="24" style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); height: 270px">
                    <el-row style="margin: 30px">
                        <span style="font-size: larger"><span class="el-icon-star-on"></span>故障信息</span>
                    </el-row>
                    <el-row style="margin-top: 30px">
                        <el-col :span="3" :offset="1">故障ID:</el-col>
                        <el-col :span="4">{{currentRepair.fault.faultId}}</el-col>
                        <el-col :span="3" :offset="1">故障类型:</el-col>
                        <el-col :span="4">{{currentRepair.fault.faultType}}</el-col>
                        <el-col :span="3" :offset="1">故障标题:</el-col>
                        <el-col :span="4">{{currentRepair.fault.faultTitle}}</el-col>
                    </el-row>
                    <el-row style="margin-top: 30px">
                        <el-col :span="3" :offset="1">故障描述:</el-col>
                        <el-col :span="18">{{currentRepair.fault.faultDetails}}</el-col>
                    </el-row>
                    <el-row style="margin-top: 30px">
                        <el-col :span="3" :offset="1">故障来源:</el-col>
                        <el-col :span="4">{{currentRepair.fault.role!=null?currentRepair.fault.role.rolename:'顾客'}}</el-col>
                        <el-col :span="3" :offset="1">故障状态:</el-col>
                        <el-col :span="4">{{currentRepair.fault.faultStatus}}</el-col>
                        <el-col :span="3" :offset="1">申报人:</el-col>
                        <el-col :span="4">{{currentRepair.fault.customer!=null?currentRepair.fault.customer.name:currentRepair.fault.userInfo.name}}</el-col>
                    </el-row>
                    <el-row style="margin-top: 30px">
                        <el-col :span="3" :offset="1">申报人联系方式:</el-col>
                        <el-col :span="4">{{currentRepair.fault.customer!=null?currentRepair.fault.customer.phonenumber:currentRepair.fault.userInfo.phonenumber}}</el-col>
                        <el-col :span="3" :offset="1">备案时间:</el-col>
                        <el-col :span="4">{{currentRepair.fault.createTime | dateFormat}}</el-col>
                    </el-row>
                </el-col>
            </el-row><br/>
            <el-row>
                <el-col :span="24" style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); height: 130px">
                    <el-row style="margin: 30px">
                        <span style="font-size: larger"><span class="el-icon-star-on"></span>床位信息</span>
                    </el-row>
                    <el-row style="margin-top: 30px">
                        <el-col :span="3" :offset="1">所在医院:</el-col>
                        <el-col :span="4">{{currentRepair.fault.bed.department.hospital.hospitalname}}</el-col>
                        <el-col :span="3" :offset="1">所在科室:</el-col>
                        <el-col :span="4">{{currentRepair.fault.bed.department.departmentname}}</el-col>
                        <el-col :span="3" :offset="1">床位ID:</el-col>
                        <el-col :span="4">{{currentRepair.fault.bedId}}</el-col>
                    </el-row>
                </el-col>
            </el-row>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="editCurrentRepair(currentRepair)" v-if="currentRepair.repairStatus!='已完成'&$store.state.roleId==4">编  辑</el-button>
                <el-button @click="openDetail = false">返  回</el-button>
            </div>
<!--编辑维修信息-->
        <el-dialog width="700px" title="故障编辑页" :visible.sync="editRepair" append-to-body :before-close="handleClose">
                <el-form>
                    <el-form-item label="维修ID" :label-width="formWidth">
                        <el-input v-model="repairUpdate.repairId" autocomplete="off" disabled="disabled"></el-input>
                    </el-form-item>
                    <el-form-item label="维修描述" type="textarea" :label-width="formWidth">
                        <el-input v-model="repairUpdate.repairInstructions" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="维修结果" :label-width="formWidth">
                        <el-select v-model="repairUpdate.repairResult" placeholder="请选择维修结果" @change="repairResultChange()">
                            <el-option label="维修中" value="维修中"></el-option>
                            <el-option label="已完成" value="已修复"></el-option>
                            <el-option label="无法修复" value="无法修复"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="维修状态" :label-width="formWidth">
                        <el-input v-model="repairUpdate.repairStatus" autocomplete="off" disabled="disabled"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                     <el-button @click="editRepair = false">返  回</el-button>
                     <el-button type="primary" @click="saveRepairUpdate()">确  定</el-button>
                </div>
            </el-dialog>
        </el-dialog>
    </div>    
</template>

<script>
export default {
    name:"repairInfo",
    data(){
        return {
            timeSelect:[new Date("2019/01/01 00:00:00"),new Date()],
            repairCondition:{
                repairId:"",
                hospitalId:"-1",
                departmentId:"-1",
                repairmanId:"-1",
                repairStatus:"-1",
                beginTime:null,
                endTime:null,
            },
            loading:true,
            hospitalList:null,
            departmentList:null,
            repairmanList:null,
            repairList:null,
            pageSize:15,
            pageNum:1,
            total:0,
            openDetail:false,
            currentRepair:null,
            formWidth:'180px',
            editRepair:false,
            updateFlag:false,
            selectedIDs:[],
            repairUpdate:{
                repairId:"",
                repairStatus:"",
                repairInstructions:"",
                repairResult:"",
                faultId:"",
            }
        }
    },
    methods: {
        clearCondition(){
            this.repairCondition.repairId="";
            this.repairCondition.hospitalId="-1";
            this.repairCondition.departmentId="-1";
            this.repairCondition.repairmanId="-1";
            this.repairCondition.repairStatus="-1";
            this.timeSelect=[new Date("2019/01/01 00:00:00"),new Date()];
        },
        findAll(){
            this.loading=true;
            this.axios({
                method:'post',
                url: "http://localhost:9000/repair/findAll",
                params: {
                    repairId:this.repairCondition.repairId,
                    hospitalId:this.repairCondition.hospitalId,
                    departmentId:this.repairCondition.departmentId,
                    repairmanId:this.repairCondition.repairmanId,
                    repairStatus:this.repairCondition.repairStatus,
                    beginTime:this.dateFormatWithDiagonal(this.timeSelect[0]),
                    endTime:this.dateFormatWithDiagonal(this.timeSelect[1]),
                    pageSize:this.pageSize,
                    pageNum:this.pageNum
                }
            }).then(res => {
                console.log(res)
                this.repairList=res.data.repairList;
                this.hospitalList=res.data.hospitalList;
                this.total=res.data.pageBean.total;
                this.pageSize=res.data.pageBean.pageSize;
                this.loading=false;
            })
            .catch(err => {
                console.error(err); 
            })
           
        },
        //日期格式转换
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

        
    //获得查询条件的科室
        getDepartment(){
                
                this.axios({
                    method:'get',
                    url: "http://localhost:9000/repair/findDepartment",
                    params: {
                        hospitalId:this.repairCondition.hospitalId
                    }
                }).then(res => {
                        console.log(res)
                        this.departmentList=res.data.departmentList
                })
                .catch(err => {
                    console.error(err); 
                })
        },
    //获得维修人员List
        getRepairman(){
            this.axios({
                method:'get',
                url: "http://localhost:9000/repair/findRepairman",
                params: {
                    hospitalId:this.repairCondition.hospitalId,
                    departmentId:this.repairCondition.departmentId,
                }
            }).then(res => {
                console.log(res)
                    this.repairmanList=res.data;
            })
            .catch(err => {
                console.error(err); 
            })
        },
        //关闭对话框调用
            handleClose(done) {
                this.$confirm('确认关闭当前页吗？')
                .then(_ => {
                    done();
                })
                .catch(_ => {});
            },
    //医院变化的时候调用
        changeHospital(){
            this.repairCondition.repairmanId="-1";
            this.repairCondition.departmentId="-1";
            this.getDepartment();
            this.getRepairman();
            
        },
    //科室变化时候调用
        changeDepartment(){
            this.repairCondition.repairmanId="-1";
            this.getRepairman();
        },
    //展示维修信息详情页
        openDetails(repair){
            this.currentRepair = repair;
            this.openDetail=true;
        },
    //编辑维修信息
        editCurrentRepair(repair){
            this.repairUpdate.repairId=repair.repairId;
            this.repairUpdate.repairInstructions=repair.repairInstructions;
            this.repairUpdate.repairResult=repair.repairResult;
            this.repairUpdate.faultId=repair.faultId;
            this.repairResultChange();
            this.editRepair=true;
        },
    //保存维修信息修改
        saveRepairUpdate(){
            this.checkOutUpdate();
            if(this.updateFlag){
                this.axios({
                    method:'post',
                    url: "http://localhost:9000/repair/updateRepair",
                    params: {
                        repairId:this.repairUpdate.repairId,
                        faultId:this.repairUpdate.faultId,
                        repairStatus:this.repairUpdate.repairStatus,
                        repairInstructions:this.repairUpdate.repairInstructions,
                        repairResult:this.repairUpdate.repairResult,
                    }
                }).then(res => {
                    this.$message({
                        type: 'success',
                        message: '信息维护成功!',
                    });
                    this.editRepair=false;
                    this.openDetail=false;
                    this.repairUpdate.repairId="";
                    this.repairUpdate.faultId="";
                    this.repairUpdate.repairStatus="";
                    this.repairUpdate.repairInstructions="";
                    this.repairUpdate.repairResult="";
                    this.findAll();
                })
                .catch(err => {
                    this.$message({
                        type: 'warning',
                        message: '信息维护失败!',
                    });
                    console.error(err); 
                })
            }
        },
        repairResultChange(){
            if(this.repairUpdate.repairResult=='无法修复'||this.repairUpdate.repairResult=='已修复'){
                this.repairUpdate.repairStatus='已完成';
            }else{
                this.repairUpdate.repairStatus='维修中';
            }
        },
        changePageNum(pageNum){
            this.pageNum=pageNum;
            this.findAll();
        },
        //检验数据
         //校验添加的数据是否合法
            checkOutUpdate(){
                this.updateFlag=false;
                let checkRepairDetails = /^[^\\x4e00-\\x9fa5]{2,200}$/;
                if(!checkRepairDetails.test(this.repairUpdate.repairInstructions)||this.repairUpdate.repairInstructions==null){
                    this.$notify({
                        title: '故障标题输入有误',
                        message: this.$createElement('b', { style: 'color: red'}, '请输入2-10位的中文字符')
                    });
                }else{
                    this.updateFlag=true;
                }        
            },
        //删除一个维修记录，在维修记录中将状态改为已删除
        delRepairById(repairId){
            this.$confirm('删除该维修信息?, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    this.axios({
                        method:'get',
                        url: "http://localhost:9000/repair/delRepair",
                        params: {
                            repairId:repairId
                        }
                    })
                    .then(res => {
                        if(res.data.result){
                            this.$message({
                                type: 'success',
                                message: '记录删除成功!',
                            });
                            this.findAll();
                        }else{
                            this.$message({
                                type: 'warning',
                                message: '记录删除失败!',
                            });
                            this.findAll();
                        }
                    })
                    .catch(err => {
                        console.error(err); 
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消操作'
                    });
                });
            },
//获取选中的复选框的ID
        getChecked(){
            for(let i=0;i<this.$refs.multipleTable.selection.length;i++){
                this.selectedIDs.push(this.$refs.multipleTable.selection[i].repairId)
            }
            for(let i=0;i<this.selectedIDs.length;i++){
                console.log(this.selectedIDs[i])
            }
            console.log(this.selectedIDs);
            this.axios.post("http://localhost:9000/repair/showCheckedRepairId",this.selectedIDs)
            .then(res => {
                console.log(res.data.result+"  "+res.data.msg),
                this.selectedIDs=[];
            })
            .catch(err => {
                console.error(err); 
                this.selectedIDs=[];
            })
        },
    //导出故障信息
        exportRepair(){
            let params="?";
            params+="repairId="+this.repairCondition.repairId+"&";
            params+="hospitalId="+this.repairCondition.hospitalId+"&";
            params+="departmentId="+this.repairCondition.departmentId+"&";
            params+="repairmanId="+this.repairCondition.repairmanId+"&";
            params+="repairStatus="+this.repairCondition.repairStatus+"&";
            params+="beginTime="+this.dateFormatWithDiagonal(this.timeSelect[0])+"&";
            params+="endTime="+this.dateFormatWithDiagonal(this.timeSelect[1])+"&";
            params+="roleId="+this.$store.state.roleId+"&";
            params+="userInfoId="+this.$store.state.id;
            console.log(params);
            window.location.href="http://localhost:9000/repair/downloadRepairFile"+params;
        }
    },
    mounted(){
        this.findAll();
        this.getRepairman();
    },
    created() {
        //1.超级管理员
        //2.系统管理员
        //3.会计
        //4.维修
        //5.医院对接
        //6.科室对接
        //7.分销商
        //8.股东
        if (this.$store.state.roleId != 1 & this.$store.state.roleId != 2
                & this.$store.state.roleId != 5 & this.$store.state.roleId != 6 & this.$store.state.roleId != 4
                ) {
            this.$message({
                message: '你没有相应的权限',
                type: 'warning',
            });
            this.$router.push('/Main');
        }
    },
    filters:{//局部过滤器
            //时间过滤器
        "dateFormat":function(dataStr) {
            var dt = new Date(dataStr);
            // yyyy-mm-dd
            var y = dt.getFullYear();
            var m = dt.getMonth()+1<10?"0"+(dt.getMonth()+1):dt.getMonth()+1;
            var d = dt.getDate()<10?"0"+dt.getDate():dt.getDate();
            var hh = dt.getHours()<10?"0"+dt.getHours():dt.getHours();
            var mm = dt.getMinutes()<10?"0"+dt.getMinutes():dt.getMinutes();
            var ss = dt.getSeconds()<10?"0"+dt.getSeconds():dt.getSeconds();
            return y + "-" + m + "-" + d + "  " + hh + ":" + mm + ":" + ss
        }
    },
}
</script>

<style scoped>

</style>
