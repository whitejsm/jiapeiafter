<template>
    <div>
        <!--搜索框模块-->
    <div>
        <el-row>
        <el-col :span="8">
            <el-input placeholder="请输入故障ID" v-model="faultCondition.faultId" size="200px">
            
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
                <el-option label="柜门未开" value="柜门未开"></el-option>
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
                <el-option label="待备案" value="待备案"></el-option>
                <el-option label="已备案" value="已备案"></el-option>
                <el-option label="修复中" value="修复中"></el-option>
                <el-option label="已修复" value="已修复"></el-option>
            </el-select>
        </el-col>
        
        <el-col :span="8">
            <span>维修状态</span>
            <el-select v-model="faultCondition.repairStatus"  placeholder="---请选择维修状态">
                <el-option label="所有状态" value="-1"></el-option>
                <el-option label="待备案" value="待备案"></el-option>
                <el-option label="待维修" value="待维修"></el-option>
                <el-option label="维修中" value="维修中"></el-option>
                <el-option label="已完成" value="已完成"></el-option>
            </el-select>
        </el-col>
        <el-col :span="8">
            <span>故障来源</span>
            <el-select v-model="faultCondition.faultSource"  placeholder="---请选择故障状态">
                <el-option label="所有来源" value="-1"></el-option>
                <el-option label="维修人员" value="维修人员"></el-option>
                <el-option label="医院对接人" value="医院对接人"></el-option>
                <el-option label="科室对接人" value="科室对接人"></el-option>
                <el-option label="顾客" value="顾客"></el-option>
            </el-select>
        </el-col>
        </el-row>
        
        
        <br/>
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
            <el-button type="middle">清除</el-button>
            </div>
        </el-col>
        </el-row>
        <br/>
</div>  

    <el-button type="danger"  @click="getChecked()">获得选中ID</el-button>
    <el-button type="primary" @click="exportFault()">导出故障</el-button>
    <el-button type="primary" @click="addFault()">添加信息</el-button>
    共{{total}}条记录<hr>
<!--信息展示模块-->
    <el-table
        :data="faultList"
        stripe
        style="width:100%"
        v-loading="loading"
        ref="multipleTable">
    <el-table-column
      type="selection"
      width="55">
    </el-table-column>

        <el-table-column
        prop="faultId"
        label="故障ID"
        width="80">
      </el-table-column>

      <el-table-column
        prop="faultTitle"
        label="故障标题"
        width="150">
      </el-table-column>

      <el-table-column
        prop="faultType"
        label="故障类型"
        width="150">
      </el-table-column>

      <el-table-column
        prop="bedId"
        label="床位ID"
        width="150">
      </el-table-column>

      <el-table-column
        prop="faultStatus"
        label="故障状态"
        width="150">
      </el-table-column>

      <el-table-column
        prop="createTime"
        label="备案时间"
        width="150">
        <template slot-scope="scope">{{scope.row.createTime | dateFormat}}</template>
      </el-table-column>

      <el-table-column
        prop=""
        label="远程操作"
        width="150">
        <template slot-scope="scope">
           <el-button type="danger" @click="openArk(scope.row)" v-if="scope.row.faultType=='柜门未开'&scope.row.faultStatus!='已修复'&$store.state.roleId!=5&$store.state.roleId!=6">开  柜</el-button>
        </template>
      </el-table-column>

      <el-table-column
        prop=""
        label="操作"
        width="180">
        <template slot-scope="scope">
            <el-button type="primary" size="small" icon="el-icon-tickets" circle @click="openDetails(scope.row)"></el-button>
            <el-button type="danger" size="small" icon="el-icon-delete" circle @click="delFaultById(scope.row.faultId)"></el-button>
            <el-button type="success" size="mini" @click="putOnRecord(scope.row)" v-if="$store.state.roleId==4&scope.row.faultStatus=='待备案'">备案</el-button>
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
<!--故障详情页-->
        <el-dialog title="故障详情" :visible.sync="openDetail" v-if="openDetail" width="1000px">
            <el-row>
                <el-col :span="24" style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); height: 270px">
                    <el-row style="margin: 30px">
                        <span style="font-size: larger"><span class="el-icon-star-on"></span>故障信息</span>
                    </el-row>
                    <el-row style="margin-top: 30px">
                        <el-col :span="3" :offset="1">故障ID:</el-col>
                        <el-col :span="4">{{currentFault.faultId}}</el-col>
                        <el-col :span="3" :offset="1">故障类型:</el-col>
                        <el-col :span="4">{{currentFault.faultType}}</el-col>
                        <el-col :span="3" :offset="1">故障标题:</el-col>
                        <el-col :span="4">{{currentFault.faultTitle}}</el-col>
                    </el-row>
                    <el-row style="margin-top: 30px">
                        <el-col :span="3" :offset="1">故障描述:</el-col>
                        <el-col :span="18">{{currentFault.faultDetails}}</el-col>
                    </el-row>
                    <el-row style="margin-top: 30px">
                        <el-col :span="3" :offset="1">故障来源:</el-col>
                        <el-col :span="4">{{currentFault.role!=null?currentFault.role.rolename:'顾客'}}</el-col>
                        <el-col :span="3" :offset="1">故障状态:</el-col>
                        <el-col :span="4">{{currentFault.faultStatus}}</el-col>
                        <el-col :span="3" :offset="1">申报人:</el-col>
                        <el-col :span="4">{{currentFault.customer!=null?currentFault.customer.name:currentFault.userInfo.name}}</el-col>
                    </el-row>
                    <el-row style="margin-top: 30px">
                        <el-col :span="3" :offset="1">申报人联系方式:</el-col>
                        <el-col :span="4">{{currentFault.customer!=null?currentFault.customer.phonenumber:currentFault.userInfo.phonenumber}}</el-col>
                        <el-col :span="3" :offset="1">备案时间:</el-col>
                        <el-col :span="4">{{currentFault.createTime | dateFormat}}</el-col>
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
                        <el-col :span="4">{{currentFault.bed.department.hospital.hospitalname}}</el-col>
                        <el-col :span="3" :offset="1">所在科室:</el-col>
                        <el-col :span="4">{{currentFault.bed.department.departmentname}}</el-col>
                        <el-col :span="3" :offset="1">床位ID:</el-col>
                        <el-col :span="4">{{currentFault.bedId}}</el-col>
                    </el-row>
                </el-col>
            </el-row><br/>
            <el-row v-if="currentFault.repair!=null&&currentFault.repair.repairmanId!=null">
                <el-col :span="24" style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); height: 270px">
                    <el-row style="margin: 30px">
                        <span style="font-size: larger"><span class="el-icon-star-on"></span>维修信息</span>
                    </el-row>
                    <el-row style="margin-top: 30px">
                        <el-col :span="3" :offset="1">维修ID:</el-col>
                        <el-col :span="4">{{currentFault.repair.repairId}}</el-col>
                        <el-col :span="3" :offset="1">维修状态:</el-col>
                        <el-col :span="4">{{currentFault.repair.repairStatus}}</el-col>
                        <el-col :span="3" :offset="1">维修时间:</el-col>
                        <el-col :span="4">{{currentFault.repair.createTime | dateFormat}}</el-col>
                    </el-row>
                    <el-row style="margin-top: 30px">
                        <el-col :span="3" :offset="1">维修描述:</el-col>
                        <el-col :span="18">{{currentFault.repair.repairInstructions}}</el-col>
                    </el-row>
                    <el-row style="margin-top: 30px">
                        <el-col :span="3" :offset="1">维修人员:</el-col>
                        <el-col :span="4">{{currentFault.repair.userInfo.name}}</el-col>
                        <el-col :span="3" :offset="1">联系方式:</el-col>
                        <el-col :span="4">{{currentFault.repair.userInfo.phonenumber}}</el-col>
                    </el-row>
                </el-col>
            </el-row><br/>

            <div slot="footer" class="dialog-footer">
                <el-button @click="openDetail = false">返  回</el-button>
                <el-button type="primary" @click="editFault(currentFault)" v-if="(currentFault.faultStatus=='已备案'|currentFault.faultStatus=='待备案')&(currentFault.repair.repairStatus=='待维修'|currentFault.repair.repairStatus=='待备案')&currentFault.customer==null">编  辑</el-button>
            </div>
<!--故障编辑页-->
            <el-dialog width="700px" title="故障编辑页" :visible.sync="editFaults" append-to-body :before-close="handleClose">
                <el-form>
                    <el-form-item label="故障ID" :label-width="formWidth">
                        <el-input v-model="faultAdd.faultId" autocomplete="off" disabled="disabled"></el-input>
                    </el-form-item>
                    <el-form-item label="故障标题" :label-width="formWidth">
                        <el-input v-model="faultAdd.faultTitle" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="故障类型" :label-width="formWidth">
                        <el-select v-model="faultAdd.faultType" placeholder="请选择故障类型">
                            <el-option label="机器故障" value="机器故障"></el-option>
                            <el-option label="电量不足" value="电量不足"></el-option>
                            <el-option label="硬件缺失" value="硬件缺失"></el-option>  
                            <el-option label="柜门未开" value="柜门未开"></el-option>  
                            <el-option label="其他" value="其他"></el-option>  
                        </el-select>
                    </el-form-item>
                    <el-form-item label="故障描述" :label-width="formWidth">
                    <el-input v-model="faultAdd.faultDetails" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="所在医院" :label-width="formWidth">
                    <el-select v-model="faultAdd.hospitalId" @change="changeAddHospital()" placeholder="请选择医院">
                        <el-option
                                v-for="item in faultAdd.hospitalList"
                                :key="item.hospitalId"
                                :label="item.hospitalname"
                                :value="item.hospitalId">
                        </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="所在科室" :label-width="formWidth">
                        <el-select v-model="faultAdd.departmentId" @change="changeAddDepartment()" placeholder="请选择科室">
                            <el-option
                                    v-for="item in faultAdd.departmentList"
                                    :key="item.departmentId"
                                    :label="item.departmentname"
                                    :value="item.departmentId">
                            </el-option>
                        </el-select> 
                    </el-form-item>
                    <el-form-item label="选择床位ID" :label-width="formWidth">
                    <el-select v-model="faultAdd.bedId" placeholder="请选择床位ID">
                        <el-option
                                v-for="item in faultAdd.bedList"
                                :key="item.bedId"
                                :label="item.bedId"
                                :value="item.bedId">
                        </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="故障来源" :label-width="formWidth">
                    <el-select v-model="faultAdd.faultSource" placeholder="请选择故障来源" @change="changeAddFaultSource()">
                            <el-option label="维修人员" value="维修人员"></el-option>
                            <el-option label="医院对接人" value="医院对接人"></el-option>
                            <el-option label="科室对接人" value="科室对接人"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="申报人" :label-width="formWidth">
                    <el-select v-model="faultAdd.userInfoId" placeholder="请选择故障申报人" @change="changeDeclarePerson($event)">
                            <el-option
                                v-for="item in faultAdd.userInfoList"
                                :key="item.userinfoId"
                                :label="item.name"
                                :value="item.userinfoId">
                        </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="联系方式" :label-width="formWidth">
                        <el-input v-model="faultAdd.phonenumber" autocomplete="off" disabled="disabled"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                     <el-button @click="editFaults = false">返  回</el-button>
                     <el-button type="primary" @click="saveFaultUpdate()">确  定</el-button>
                </div>
               
            </el-dialog>
        </el-dialog>



<!-- 添加的模态框 -->
<el-dialog title="添加" :visible.sync="addFaultForm" width="700px" :before-close="handleClose">
  <el-form>
    <el-form-item label="故障标题" :label-width="formWidth">
      <el-input v-model="faultAdd.faultTitle" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="故障类型" :label-width="formWidth">
        <el-select v-model="faultAdd.faultType" placeholder="请选择故障类型">
            <el-option label="机器故障" value="机器故障"></el-option>
            <el-option label="电量不足" value="电量不足"></el-option>
            <el-option label="硬件缺失" value="硬件缺失"></el-option>  
            <el-option label="柜门未开" value="柜门未开"></el-option>  
            <el-option label="其他" value="其他"></el-option>  
        </el-select>
    </el-form-item>
    <el-form-item label="故障描述" :label-width="formWidth">
      <el-input v-model="faultAdd.faultDetails" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="所在医院" :label-width="formWidth">
      <el-select v-model="faultAdd.hospitalId" @change="changeAddHospital()" placeholder="请选择医院">
          <el-option
                  v-for="item in faultAdd.hospitalList"
                  :key="item.hospitalId"
                  :label="item.hospitalname"
                  :value="item.hospitalId">
          </el-option>
        </el-select>
    </el-form-item>
    <el-form-item label="所在科室" :label-width="formWidth">
        <el-select v-model="faultAdd.departmentId" @change="changeAddDepartment()" placeholder="请选择科室">
            <el-option
                    v-for="item in faultAdd.departmentList"
                    :key="item.departmentId"
                    :label="item.departmentname"
                    :value="item.departmentId">
            </el-option>
        </el-select> 
    </el-form-item>
    <el-form-item label="选择床位ID" :label-width="formWidth">
      <el-select v-model="faultAdd.bedId" placeholder="请选择床位ID">
          <el-option
                  v-for="item in faultAdd.bedList"
                  :key="item.bedId"
                  :label="item.bedId"
                  :value="item.bedId">
          </el-option>
        </el-select>
    </el-form-item>
     <el-form-item label="故障来源" :label-width="formWidth">
      <el-select v-model="faultAdd.faultSource" placeholder="请选择故障来源" @change="changeAddFaultSource()">
            <el-option label="维修人员" value="维修人员"></el-option>
            <el-option label="医院对接人" value="医院对接人"></el-option>
            <el-option label="科室对接人" value="科室对接人"></el-option>
        </el-select>
    </el-form-item>
    <el-form-item label="申报人" :label-width="formWidth">
      <el-select v-model="faultAdd.userInfoId" placeholder="请选择故障申报人" @change="changeDeclarePerson($event)">
            <el-option
                  v-for="item in faultAdd.userInfoList"
                  :key="item.userinfoId"
                  :label="item.name"
                  :value="item.userinfoId">
          </el-option>
        </el-select>
    </el-form-item>
    <el-form-item label="联系方式" :label-width="formWidth">
      <el-input v-model="faultAdd.phonenumber" autocomplete="off" disabled="disabled"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="addFaultForm = false">取 消</el-button>
    <el-button type="primary" @click="saveFaultAdd()">确 定</el-button>
  </div>
</el-dialog>
    </div>    
</template>
<script>
    export default {
        name:"faults",
        data(){
            return {
                //查询的字段
                faultCondition:{
                    faultId:"",
                    hospitalId:"-1",
                    departmentId:"-1",
                    faultType:"-1",
                    faultStatus:"-1",
                    repairStatus:"-1",
                    faultSource:"-1",
                    beginTime:"",
                    endTime:"",
                },
                loading:"",
                timeSelect:[new Date("2019/01/01 00:00:00"),new Date()],
                hospitalList:null,
                departmentList:null,
                faultList:null,
                openDetail:false,//展示详情的弹出框
                editFaults:false,//展示故障编辑页
                currentFault:null,//故障详情页的故障信息
                
                selectedIDs:[],//选中的faultIDS
                
                total:0,
                pageNum:1,//分页有关信息
                pageSize:15,
                
                addFaultForm:false,//添加信息表单
                formWidth: '120px',
                addFlag:false,
                //添加故障的字段
                faultAdd:{
                    faultId:null,
                    hospitalList:null,
                    departmentList:null,
                    bedList:null,
                    userInfoList:null,
                    hospitalId:null,
                    departmentId:null,
                    bedId:null,
                    faultTitle:null,
                    faultType:null,
                    faultDetails:null,
                    faultSource:null,
                    userInfoId:null,
                    phonenumber:null,
                },
            }
        },
        methods:{
            findAll(){
                this.loading=true;
                this.axios({
                    method:'get',
                    url: "http://localhost:9000/faults/findAll",
                    params: {
                        faultId:this.faultCondition.faultId,
                        hospitalId:this.faultCondition.hospitalId,
                        departmentId:this.faultCondition.departmentId,
                        faultType:this.faultCondition.faultType,
                        faultStatus:this.faultCondition.faultStatus,
                        repairStatus:this.faultCondition.repairStatus,
                        faultSource:this.faultCondition.faultSource,
                        beginTime:this.dateFormatWithDiagonal(this.timeSelect[0]),
                        endTime:this.dateFormatWithDiagonal(this.timeSelect[1]),
                        roleId:this.$store.state.roleId,
                        userInfoId:this.$store.state.id,
                        pageSize:this.pageSize,
                        pageNum:this.pageNum,
                    }
                })
                .then(res => {
                    console.log(res.data)
                    this.hospitalList=res.data.hospitalList;
                    this.faultList=res.data.faultList;
                    this.total=res.data.pageBean.total;
                    this.loading=false;
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
                this.faultCondition.departmentId="-1";
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
            show(temp){
                console.log(temp)
            },
            //展示详情页
            openDetails(fault){
                this.currentFault=fault;
                this.openDetail=true;
                console.log(fault);
            },
            //关闭对话框调用
            handleClose(done) {
                this.$confirm('确认关闭当前页吗？')
                .then(_ => {
                    done();
                })
                .catch(_ => {});
            },
            //删除一个故障信息，在故障信息中将故障状态改为已删除
            delFaultById(faultId){
                this.$confirm('删除该故障信息?, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    this.axios({
                        method:'get',
                        url: "http://localhost:9000/faults/delFaultById",
                        params: {
                            faultId:faultId
                        }
                    })
                    .then(res => {
                        if(res.data.result){
                            this.$message({
                                type: 'success',
                                message: '故障删除成功!',
                            });
                            this.findAll();
                        }else{
                            this.$message({
                                type: 'warning',
                                message: '故障删除失败!',
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
            //打开柜门，执行一次开柜操作
            openArk(fault){
                this.$confirm('是否打开柜门?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    this.axios({
                        method:'get',
                        url: "http://localhost:9000/faults/openArk",
                        params: {
                            faultId:fault.faultId,
                            bedId:fault.bedId
                        }
                    }).then(res => {
                        if(res.data.result){
                            this.$message({
                                type: 'success',
                                message: '开启成功!',
                            });
                            this.findAll();
                        }else{
                            this.$message({
                                type: 'warning',
                                message: '开启失败!',
                            });
                            this.findAll();
                        }
                    }).catch(err => {
                        console.error(err); 
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消操作'
                    });
                });
            },

            changePageNum(pageNum){
                this.pageNum=pageNum;
                this.findAll();
            },
            //获取选中的复选框的ID
            getChecked(){
                for(let i=0;i<this.$refs.multipleTable.selection.length;i++){
                    this.selectedIDs.push(this.$refs.multipleTable.selection[i].faultId)
                }
                for(let i=0;i<this.selectedIDs.length;i++){
                    console.log(this.selectedIDs[i])
                }
                console.log(this.selectedIDs);
                this.axios.post("http://localhost:9000/faults/showCheckedFaultId",this.selectedIDs)
                .then(res => {
                    console.log(res.data.result+"  "+res.data.msg),
                    this.selectedIDs=[];
                })
                .catch(err => {
                    console.error(err); 
                    this.selectedIDs=[];
                })
            },
            //初始化添加的参数
            init(){
                this.faultAdd.faultId=null;
                this.faultAdd.hospitalList=null;
                this.faultAdd.departmentList=null;
                this.faultAdd.bedList=null;
                this.faultAdd.userInfoList=null;
                this.faultAdd.hospitalId=null;
                this.faultAdd.departmentId=null;
                this.faultAdd.bedId=null;
                this.faultAdd.faultTitle=null;
                this.faultAdd.faultType=null;
                this.faultAdd.faultDetails=null;
                this.faultAdd.faultSource=null;
                this.faultAdd.userInfoId=null;
                this.faultAdd.phonenumber=null;
            },
            //添加故障时调用
            addFault(){
                this.init();
                this.faultAdd.hospitalList=this.hospitalList;
                this.addFaultForm=true;
            },
            //医院变化时调用
            changeAddHospital(){
                this.faultAdd.departmentList=null;
                this.faultAdd.departmentId=null;
                this.faultAdd.bedId=null;
                this.faultAdd.bedList=null;
                this.axios({
                  method:'get',
                  url: "http://localhost:9000/faults/findDepartment",
                  params: {
                      "hospitalId":this.faultAdd.hospitalId,
                      roleId:this.$store.state.roleId,
                      userInfoId:this.$store.state.id,
                  }
                })
                .then(res => {
                    this.faultAdd.departmentList=res.data.departmentList;
                })
                .catch(err => {
                    console.error(err); 
                })
            },
            //科室变化时调用
            changeAddDepartment(){
                this.faultAdd.bedId=null;
                this.faultAdd.bedList=null;
                this.axios({
                  method:'get',
                  url: "http://localhost:9000/faults/findBed",
                  params: {
                      "departmentId":this.faultAdd.departmentId,
                  }
                })
                .then(res => {
                    console.log(res)
                    this.faultAdd.bedList=res.data;
                })
                .catch(err => {
                    console.error(err); 
                })
            },
            //故障来源变化时调用
            changeAddFaultSource(){
                this.faultAdd.userInfoList=null;
                this.faultAdd.userInfoId=null;
                this.axios({
                    method:'get',
                    url: "http://localhost:9000/faults/getAddFaultPerson",
                    params: {
                        faultSource:this.faultAdd.faultSource,
                    }
                })
                .then(res => {
                    console.log(res); 
                    this.faultAdd.userInfoList=res.data
                })
                .catch(err => {
                    console.error(err); 
                })
            },
            //申报人变化的时候调用
            changeDeclarePerson(userinfoId){
                this.faultAdd.phonenumber=null;
                this.axios({
                    method:'get',
                    url: "http://localhost:9000/faults/getUserInfo",
                    params: {
                        userinfoId:userinfoId
                    }
                })
                .then(res => {
                    console.log(res.data)
                    this.faultAdd.phonenumber=res.data.phonenumber
                })
                .catch(err => {
                    console.error(err); 
                })
            },
            //校验添加的数据是否合法
            checkOutAdd(){
                this.addFlag=false;
                let checkFaultTitle = /^[\u4e00-\u9fa5]{2,10}$/;
                let checkFaultDetails = /^[^\\x4e00-\\x9fa5]{2,200}$/;
                if(!checkFaultTitle.test(this.faultAdd.faultTitle)||this.faultAdd.faultTitle==null){
                    this.$notify({
                        title: '故障标题输入有误',
                        message: this.$createElement('b', { style: 'color: red'}, '请输入2-10位的中文字符')
                    });
                }else if(this.faultAdd.faultType==null){
                    this.$notify({
                        title: '未选择故障类型',
                        message: this.$createElement('b', { style: 'color: red'}, '请选择故障类型')
                    });
                }else if(!checkFaultDetails.test(this.faultAdd.faultDetails)||this.faultAdd.faultDetails==null){
                    this.$notify({
                        title: '故障描述输入有误',
                        message: this.$createElement('b', { style: 'color: red'}, '请输入2-200字的故障信息描述')
                    });
                }else if(this.faultAdd.hospitalId==null){
                    this.$notify({
                        title: '未选择医院',
                        message: this.$createElement('b', { style: 'color: red'}, '请选择医院')
                    });
                }else if(this.faultAdd.departmentId==null){
                    this.$notify({
                        title: '未选择科室',
                        message: this.$createElement('b', { style: 'color: red'}, '请选择科室')
                    });
                }else if(this.faultAdd.bedId==null){
                    this.$notify({
                        title: '未选择床位ID',
                        message: this.$createElement('b', { style: 'color: red'}, '请选择床位ID')
                    });
                }else if(this.faultAdd.faultSource==null){
                    this.$notify({
                        title: '未选择故障来源',
                        message: this.$createElement('b', { style: 'color: red'}, '请选择故障来源')
                    });
                }else if(this.faultAdd.userInfoId==null){
                    this.$notify({
                        title: '未选择申报人',
                        message: this.$createElement('b', { style: 'color: red'}, '请选择申报人')
                    });
                }else{
                    this.addFlag=true;
                }        
            },
            saveFaultAdd(){
                this.checkOutAdd();
                if(this.addFlag){
                    this.axios({
                        method:'post',
                        url: "http://localhost:9000/faults/saveFault",
                        params: {
                            bedId:this.faultAdd.bedId,
                            faultTitle:this.faultAdd.faultTitle,
                            faultType:this.faultAdd.faultType,
                            faultDetails:this.faultAdd.faultDetails,
                            contactorId:this.faultAdd.userInfoId,
                        }
                    })
                    .then(res => {
                        console.log(res.data)
                        if(res.data.result){
                            this.$message({
                                type: 'success',
                                message: res.data.msg,
                            });
                            this.addFaultForm = false;
                            this.findAll();
                        }else{
                            this.$message({
                                type: 'warning',
                                message: res.data.msg,
                            });
                            this.addFaultForm = false;
                            this.findAll();
                        }
                    })
                    .catch(err => {
                        console.error(err); 
                    })
                    
                }
            },
            //维修人员可进行备案  触发备案事件
            putOnRecord(fault){
                 this.$confirm('是否进行备案?', '备案信息提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    this.axios({
                        method:'post',
                        url: "http://localhost:9000/faults/putOnRecord",
                        params: {
                            faultId:fault.faultId,
                            repairId:fault.repair.repairId,
                            repairmanId:this.$store.state.id
                        }
                    }).then(res => {
                            console.log(res)
                            if(res.data.result){
                                this.$message({
                                    type: 'success',
                                    message: res.data.msg,
                                });
                                this.findAll();
                            }else{
                                this.$message({
                                    type: 'warning',
                                    message: res.data.msg,
                                });
                                this.findAll();
                            }
                        }) .catch(err => {
                            console.error(err); 
                        })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消备案'
                    });
                });
            },
            editFault(fault){
                this.faultAdd.hospitalList=this.hospitalList;
                this.faultAdd.hospitalId=fault.bed.department.hospital.hospitalId;  //根据医院---->>>
                this.changeAddHospital();               //获得departmentList
                this.faultAdd.departmentId=fault.bed.department.departmentId;       //根据部门号---->>>
                this.changeAddDepartment();             //获得bedList
                this.faultAdd.faultSource=fault.role.rolename;                      //根据来源---->>>
                this.changeAddFaultSource();            //获得UserInfoList
                this.faultAdd.faultId=fault.faultId;
                this.faultAdd.hospitalId=fault.bed.department.hospital.hospitalId;
                this.faultAdd.bedId=fault.bedId;
                this.faultAdd.faultTitle=fault.faultTitle;
                this.faultAdd.faultType=fault.faultType;
                this.faultAdd.faultDetails=fault.faultDetails;
                this.faultAdd.userInfoId=fault.userInfo.userinfoId;
                this.changeDeclarePerson(fault.userInfo.userinfoId)  //获得电话号码
                this.editFaults = true;
            },
            saveFaultUpdate(){
                this.axios({
                    method:'post',
                    url: "http://localhost:9000/faults/saveFaultUpdate",
                    params: {
                        faultId:this.faultAdd.faultId,
                        faultType:this.faultAdd.faultType,
                        contactorId:this.faultAdd.userInfoId,
                        bedId:this.faultAdd.bedId,
                        faultTitle:this.faultAdd.faultTitle,
                        faultDetails:this.faultAdd.faultDetails,
                    }
                }).then(res => {
                            console.log(res)
                            if(res.data.result){
                                this.$message({
                                    type: 'success',
                                    message: res.data.msg,
                                });
                                this.editFaults = false;
                                this.openDetail = false;
                                this.findAll();
                                this.init();
                            }else{
                                this.$message({
                                    type: 'warning',
                                    message: res.data.msg,
                                });
                                this.editFaults = false;
                                this.findAll();
                                this.init();
                            }
                        }) .catch(err => {
                            console.error(err); 
                        })
                
            },
            //导出故障信息
            exportFault(){
                let params="?";
                params+="faultId="+this.faultCondition.faultId+"&";
                params+="hospitalId="+this.faultCondition.hospitalId+"&";
                params+="departmentId="+this.faultCondition.departmentId+"&";
                params+="faultType="+this.faultCondition.faultType+"&";
                params+="faultStatus="+this.faultCondition.faultStatus+"&";
                params+="repairStatus="+this.faultCondition.repairStatus+"&";
                params+="faultSource="+this.faultCondition.faultSource+"&";
                params+="beginTime="+this.dateFormatWithDiagonal(this.timeSelect[0])+"&";
                params+="endTime="+this.dateFormatWithDiagonal(this.timeSelect[1])+"&";
                params+="roleId="+this.$store.state.roleId+"&";
                params+="userInfoId="+this.$store.state.id;
                console.log(params);
                window.location.href="http://localhost:9000/faults/downloadFaultFile"+params;
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
        mounted() {
            this.findAll();
        },
    }
</script>
<style scoped>

</style>



