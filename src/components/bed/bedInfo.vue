<template>
<div>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item :to="{ path: '/bed/bedInfo' }">床位管理</el-breadcrumb-item>
    <el-breadcrumb-item>床位信息</el-breadcrumb-item>
  </el-breadcrumb>
  <!--搜索组件-->
<el-row>
      <el-col :span="8">
        <el-input placeholder="请输入床位ID" v-model="bedId" size="200px"></el-input>
      </el-col>
    </el-row>
    <br/>
    <el-row>
      <el-col :span="8">
        <span>医院：</span>
        <el-select v-model="hospitalId" placeholder="---请选择医院" @change="getDepartment()">
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
      <span>科室：</span>
        <el-select v-model="departmentId"  placeholder="---请选择科室">
          <el-option  label="所有科室" value="-1"></el-option>
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
        <span>状态：</span>
        <el-select v-model="status"  placeholder="---请选择床位状态">
          <el-option label="所有状态" value="-1"></el-option>
          <el-option label="停用" value="停用"></el-option>
          <el-option label="空闲" value="空闲"></el-option>
          <el-option label="繁忙" value="繁忙"></el-option>
          <el-option label="异常" value="异常"></el-option>
          
        </el-select>
      </el-col>
      <el-col :span="8">
        <span>电量：</span>
        <el-select v-model="power"  placeholder="---请选择电量">
          <el-option label="所有" value="-1"></el-option>
          <el-option label="低于20%" value="20"></el-option>
          <el-option label="低于40%" value="40"></el-option>
          <el-option label="低于60%" value="60"></el-option>
          <el-option label="低于80%" value="80"></el-option>
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
          <el-button   @click="findByExample()">搜  索</el-button>
          <el-button  @click="clearCondition()">清  除</el-button>
        </div>
      </el-col>
    </el-row>
    <br/>


    <el-button type="danger"  @click="delChecked()">获得选中ID</el-button>
    <el-button type="primary" @click="exportBed()">导出床位</el-button>
    <el-button type="primary" @click="add()">添加信息</el-button>
    <el-button type="primary" @click="downTemplate()">下载模板</el-button>共{{total}}条记录
<!--上传测试-->
       <hr/><el-upload
               class="upload-demo"
               action="http://localhost:9000/bed/uploadBedFile/"
               accept="xlsx"
               :on-success="uploadSuccess"
               :on-error="uploadFailed"
               >
           <el-button type="primary">点击上传</el-button>
           <div slot="tip" class="el-upload__tip" style="width:100px;height:">请上传xlsx文件</div>
       </el-upload>
    
    <el-table
        v-loading="loading"
        :data="tableData"
        stripe
        style="width:100%"
        ref="multipleTable">
    
    <!--可展开的行-->
    <el-table-column type="expand">
      <template slot-scope="props">
        <el-form label-position="left" inline class="demo-table-expand">
          <el-form-item label="床位id:">
            <span>{{ props.row.bedId }}</span>
          </el-form-item>
          <el-form-item label="生产商:">
            <span>{{ props.row.manufacturer.name }}</span>
          </el-form-item>
           <el-form-item label="所属医院:">
            <span>{{ props.row.department.hospital.hospitalname }}</span>
          </el-form-item>
          <el-form-item label="所属科室:">
            <span>{{ props.row.department.departmentname }}</span>
          </el-form-item>
          <el-form-item label="床位编号:">
            <span>{{ props.row.number }}</span>
          </el-form-item>
          <el-form-item label="床位状态:">
            <span>{{ props.row.status }}</span>
          </el-form-item>
          <el-form-item label="厂家联系人:">
            <span>{{ props.row.manufacturer.contactperson }}</span>
          </el-form-item>
          <el-form-item label="厂家联系方式:">
            <span>{{ props.row.manufacturer.contactphone }}</span>
          </el-form-item>
          <el-form-item label="录入时间:">
            <span>{{ props.row.createTime | dateFormat}}</span>
          </el-form-item>
        </el-form>
      </template>
    </el-table-column>


    <el-table-column
      type="selection"
      width="55">
    </el-table-column>

        <el-table-column
        prop="bedId"
        label="床位ID"
        width="180">
      </el-table-column>
      
      

      <el-table-column
        prop="number"
        sortable
        label="床位编号"
        width="180">
      </el-table-column>

      <el-table-column
        prop="status"
        sortable
        label="床位状态"
        width="180">
      </el-table-column>

      <el-table-column
        prop="power"
        sortable
        label="剩余电量"
        width="180">
        
      </el-table-column>

      <el-table-column
        prop="bedId"
        label="远程操作"
        width="180">
        <template slot-scope="scope">
           <el-button type="danger" @click="show(scope.row.bedId)">关机</el-button>
        </template>
        
      </el-table-column>

      <el-table-column
        prop="bedId"
        label="操作"
        width="180">
        <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" circle @click="update(scope.row)"></el-button>
            <el-button type="danger" icon="el-icon-delete" circle @click="disable(scope.row.bedId)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <center>
    <div style="text-align：center">
          <el-pagination
            background
            layout="prev, pager, next"
            @current-change="changePageNum"
            :page-size="pageSize"
            :total="total">
        </el-pagination>
    </div></center>
    
<!-- 添加的模态框 -->
<el-dialog title="添加" :visible.sync="bedInfoAdd" width="700px">
  <el-form>
    <!-- <el-form-item label="设备ID" :label-width="formWidth">
      <el-input v-model="bed.bedId" autocomplete="off"></el-input>
    </el-form-item> -->
    <el-form-item label="所属医院" :label-width="formWidth">
      <el-select v-model="bed.hospitalId" @change="getDepartmentDialog()">
          <el-option label="请选择医院" value="-1"></el-option>
          <el-option
                  v-for="item in bed.hospitalList"
                  :key="item.hospitalId"
                  :label="item.hospitalname"
                  :value="item.hospitalId">
          </el-option>
        </el-select>
    </el-form-item>
    <el-form-item label="所属科室" :label-width="formWidth">
        <el-select v-model="bed.departmentId">
            <el-option  label="请选择科室" value="-1"></el-option>
            <el-option
                    v-for="item in bed.departmentList"
                    :key="item.departmentId"
                    :label="item.departmentname"
                    :value="item.departmentId">
            </el-option>
        </el-select>
    </el-form-item>
    <el-form-item label="床位编号" :label-width="formWidth">
      <el-input v-model="bed.number" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="生产厂家" :label-width="formWidth">
        <el-select v-model="manufacturer.manufacturerId" @change="manufacturerChange($event)">
            <el-option  label="请选择生产厂家" value="-1" ></el-option>
            <el-option
                    v-for="item in bed.manufacturerList"
                    :key="item.manufacturerId"
                    :label="item.name"
                    :value="item.manufacturerId">
            </el-option>
        </el-select>
    </el-form-item>
    <el-form-item label="厂家联系人" :label-width="formWidth">
      <el-input v-model="manufacturer.contactperson" disabled="disabled" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="厂家联系人电话" :label-width="formWidth">
      <el-input v-model="manufacturer.contactphone" disabled="disabled" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="厂家联系电话" :label-width="formWidth">
      <el-input v-model="manufacturer.phonenumber" disabled="disabled" autocomplete="off"></el-input>
    </el-form-item>

  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="bedInfoAdd = false">取 消</el-button>
    <el-button type="primary" @click="save()">确 定</el-button>
  </div>
</el-dialog>

<!-- 修改的模态框 -->
<el-dialog title="修改" :visible.sync="bedInfoUpd" width="700px">
  <el-form>
    <!-- <el-form-item label="设备ID" :label-width="formWidth">
      <el-input v-model="bed.bedId" autocomplete="off" disabled="disabled"></el-input>
    </el-form-item> -->
    <el-form-item label="所属医院" :label-width="formWidth">
      <el-select v-model="bed.hospitalId" @change="getDepartmentDialog()">
          <el-option label="请选择医院" value="-1"></el-option>
          <el-option
                  v-for="item in bed.hospitalList"
                  :key="item.hospitalId"
                  :label="item.hospitalname"
                  :value="item.hospitalId">
          </el-option>
        </el-select>
    </el-form-item>
    <el-form-item label="所属科室" :label-width="formWidth">
        <el-select v-model="bed.departmentId">
            <el-option  label="请选择科室" value="-1"></el-option>
            <el-option
                    v-for="item in bed.departmentList"
                    :key="item.departmentId"
                    :label="item.departmentname"
                    :value="item.departmentId">
            </el-option>
        </el-select>
    </el-form-item>
    <el-form-item label="床位编号" :label-width="formWidth">
      <el-input v-model="bed.number" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="生产厂家" :label-width="formWidth">
        <el-select v-model="manufacturer.manufacturerId" @change="manufacturerChange($event)" disabled="disabled">
            <el-option  label="请选择生产厂家" value="-1"></el-option>
            <el-option
                    v-for="item in bed.manufacturerList"
                    :key="item.manufacturerId"
                    :label="item.name"
                    :value="item.manufacturerId">
            </el-option>
        </el-select>
    </el-form-item>
    <el-form-item label="厂家联系人" :label-width="formWidth">
      <el-input v-model="manufacturer.contactperson" disabled="disabled" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="厂家联系人电话" :label-width="formWidth">
      <el-input v-model="manufacturer.contactphone" disabled="disabled" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="厂家联系电话" :label-width="formWidth">
      <el-input v-model="manufacturer.phonenumber" disabled="disabled" autocomplete="off"></el-input>
    </el-form-item>
  </el-form>
  
  <div slot="footer" class="dialog-footer">
    <el-button @click="bedInfoUpd = false">取 消</el-button>
    <el-button type="primary" @click="saveUpd()">确 定</el-button>
  </div>
</el-dialog>

</div>
</template>



<script>
export default {
    name:"bedInfo",
    data(){
       return {
            flag:false, //校验新增和修改的数据
            bedId:"",
            hospitalId:"-1",
            departmentId:"-1",
            status:"-1",
            power:"-1",
            tableData:null,
            selectedIDs: [],
            pageNum:1,
            pageSize:15,
            total:0,
            timeSelect:[new Date("2019/01/01 00:00:00"),new Date()],
            hospitalList:null,
            departmentList:null,
            manufacturerList:null,
            flag:false,
            number:null,
            loading:"",
            bed:{
                bedId:"",
                hospitalId:"-1",
                departmentId:"-1",
                number:null,
                departmentList:null,
                hospitalList:null,
                manufacturerList:null,
            },
            manufacturer:{
                manufacturerId:"-1",
                contactperson:null,
                phonenumber:null,
                contactphone:null
            },
            bedInfoAdd: false,
            bedInfoUpd: false,
            formWidth: '120px',
        }
    },
    
    mounted() {
        this.findByExample();
        console.log("this.$store.state.count-------------"+this.$store.state.count)
        console.log("this.$store.state.id-------------"+this.$store.state.id)
        console.log("this.$store.state.userName----------"+this.$store.state.userName)
        console.log("this.$store.state.roleId----------"+this.$store.state.roleId)
        console.log("this.$store.state.roleName----------"+this.$store.state.roleName)
    },
    filters:{//局部过滤器
    //时间过滤器
      "dateFormat":function(dataStr) {
        var dt = new Date(dataStr);
        // yyyy-mm-dd
        var y = dt.getFullYear();
        var m = dt.getMonth() + 1;
        var d = dt.getDate();
        var hh = dt.getHours();
        var mm = dt.getMinutes();
        var ss = dt.getSeconds();
        return y + "-" + m + "-" + d + "  " + hh + ":" + mm + ":" + ss
      }
    },
    methods:{
      //清除搜索条件
      clearCondition(){
        this.bedId="";
        this.hospitalId="-1";
        this.departmentId="-1";
        this.status="-1";
        this.power="-1";
        this.timeSelect=[new Date("2019/01/01 00:00:00"),new Date()];
      },
      //初始化添加时的数据
        init(){
            this.bed={
              bedId:"",
              hospitalId:"-1",
              departmentId:"-1",
              number:null,
              departmentList:null,
              hospitalList:this.hospitalList,
              manufacturerList:this.manufacturerList
            };
            this.manufacturer={
              manufacturerId:"-1",
              contactperson:null,
              phonenumber:null,
              contactphone:null
            };
        },
        //查询数据
        findByExample(){
            this.loading=true;
            this.axios({
                method:'get',
                url: "http://localhost:9000/bed/findByExample",
                params: {
                    bedId:this.bedId,
                    hospitalId:this.hospitalId,
                    departmentId:this.departmentId,
                    status:this.status,
                    power:this.power,
                    beginTime:new Date(this.timeSelect[0]).toLocaleDateString(),
                    endTime:new Date(this.timeSelect[1]).toLocaleDateString(),

                    "pageNum":this.pageNum,
                    "pageSize":this.pageSize,
                    roleId:this.$store.state.roleId,
                    userInfoId:this.$store.state.id,
                }
            })
            .then(res => {
                console.log(res);
                this.tableData=res.data.bedList;
                this.manufacturerList=res.data.manufacturerList;
                this.bed.manufacturerList=res.data.manufacturerList;
                this.bed.hospitalList=res.data.hospitalList;
                this.hospitalList=res.data.hospitalList;
                this.total=res.data.pageBean.total;
                this.loading=false;
            })
            .catch(err => {
                console.error(err); 
            })
        },
        //测试用
        show(id){
            console.log(id)
        },
        //获取一个床位的详情信息（故障信息）
        details(bedId){
            this.axios({
                method:'get',
                url: "http://localhost:9000/bed/findOne",
                params: {
                    "bedId":bedId
                }
            })
            .then(res => {
                console.log(res.data)
            })
            .catch(err => {
                console.error(err); 
            })
        },
        //禁用一个床位
        disable(bedId){
            this.$confirm('此操作将停用该床位, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$message({
                    type: 'success',
                    message: '停用成功!',
                });
                this.axios({
                    method:'get',
                    url: "http://localhost:9000/bed/disable",
                    params: {
                        "bedId":bedId
                    }
                })
                .then(res => {
                    console.log(res.data.result+"  "+res.data.msg)
                    this.findByExample();
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
        //获取选中的床位id  复选框
        delChecked(){
            for(let i=0;i<this.$refs.multipleTable.selection.length;i++){
                this.selectedIDs.push(this.$refs.multipleTable.selection[i].bedId)
            }
            for(let i=0;i<this.selectedIDs.length;i++){
                console.log(this.selectedIDs[i])
            }
            console.log(this.selectedIDs);
            this.axios.post("http://localhost:9000/bed/showCheckedBedId",this.selectedIDs)
            .then(res => {
                console.log(res.data.result+"  "+res.data.msg),
                this.selectedIDs=[];
            })
            .catch(err => {
                console.error(err); 
            })
        },
        //页码改变时调用
        changePageNum(pageNum){
            this.pageNum=pageNum;
            this.findByExample();
        },
        //日期变换时调用
        changeDate(){
          console.log(this.timeSelect[0]);
          console.log(this.timeSelect[1]);
        },
        //获取科室
        getDepartment(){
            this.axios({
                  method:'get',
                  url: "http://localhost:9000/bed/findDepartment",
                  params: {
                      "hospitalId":this.hospitalId,
                      roleId:this.$store.state.roleId,
                      userInfoId:this.$store.state.id,
                  }
              })
              .then(res => {
                  this.departmentId="-1"
                  this.departmentList=res.data.departmentList;
              })
              .catch(err => {
                  console.error(err); 
              })
        },
        //弹窗获取科室
        getDepartmentDialog(){
            this.axios({
                  method:'get',
                  url: "http://localhost:9000/bed/findDepartment",
                  params: {
                      "hospitalId":this.bed.hospitalId,
                       roleId:this.$store.state.roleId,
                      userInfoId:this.$store.state.id,
                  }
              })
              .then(res => {
                  this.bed.departmentList=res.data.departmentList;
                  this.bed.departmentId="-1"
              })
              .catch(err => {
                  console.error(err); 
              })
        },
        //修改时默认的显示科室
        getDepartmentWhenUpdate(hospitalId){
            this.axios({
                  method:'get',
                  url: "http://localhost:9000/bed/findDepartment",
                  params: {
                      "hospitalId":hospitalId,
                      roleId:this.$store.state.roleId,
                      userInfoId:this.$store.state.id,
                  }
              })
              .then(res => {
                  this.bed.departmentList=res.data.departmentList;
              })
              .catch(err => {
                  console.error(err); 
              })
        },
        //生产商变换的时候调用
        manufacturerChange(manufacturerId){
            console.log(manufacturerId);
            this.axios({
              method:'get',
              url: "http://localhost:9000/bed/findManufacturerById",
              params: {
                manufacturerId:manufacturerId
              }
            }).then(res => {
                        console.log(res);
                        this.manufacturer.manufacturerId = res.data.manufacturerId;
                        this.manufacturer.contactperson = res.data.contactperson;
                        this.manufacturer.phonenumber = res.data.phonenumber;
                        this.manufacturer.contactphone = res.data.contactphone;
                    })
                    .catch(err => {
                        console.error(err); 
                    })
        },
        //添加的保存按钮事件
        save(){
            this.checkOut();
            if(this.flag){
                this.axios({
                  method:'post',
                  url: 'http://localhost:9000/bed/save',
                  params: {
                      bedId:this.bed.bedId,
                      manufacturerId:this.manufacturer.manufacturerId,
                      departmentId:this.bed.departmentId,
                      number:this.bed.number,
                  }
                })
                .then(res => {
                    this.bedInfoAdd = false;
                    this.findByExample();
                  })
                  .catch(err => {
                      console.error(err); 
                  })
              }
        },
        //保存修改
        saveUpd(){
          this.checkOut();
          if(this.flag){
              this.axios({
                  method:'post',
                  url: 'http://localhost:9000/bed/update',
                  params: {
                      bedId:this.bed.bedId,
                      departmentId:this.bed.departmentId,
                      number:this.bed.number,
                  }
                })
                .then(res => {
                    this.findByExample();
                })
                .catch(err => {
                      console.error(err); 
                })
          }
        },
        //校验输入的数据
        checkOut(){
          let checkNumber = /^[a-zA-Z]{1}[0-9]{7}$/
          this.flag=false;
          if(this.bed.hospitalId=="-1"){
              this.$notify({
                title: '未选择医院',
                message: this.$createElement('b', { style: 'color: red'}, '请选择医院')
              });
          }else if(this.bed.departmentId=="-1"){
              this.$notify({
                title: '未选择科室',
                message: this.$createElement('b', { style: 'color: red'}, '请选择科室')
              });
          }else if(!checkNumber.test(this.bed.number)){
              this.$notify({
                title: '床位编号输入有误',
                message: this.$createElement('b', { style: 'color: red'}, '请输入8位的床位编号---例：c1234567')
              });
          }else if(this.manufacturer.manufacturerId=="-1"){
              this.$notify({
                title: '未选择生产商',
                message: this.$createElement('b', { style: 'color: red'}, '请选择生产商')
              });
          }else{
                this.flag=true;
          }          
        },
        //点击添加按钮
        add(){
            this.init();
            this.bedInfoAdd = true;
        },
        //点击更新按钮
        update(bed){
          console.log(bed)
          this.bed.bedId=bed.bedId;

          this.bed.hospitalId=bed.department.hospital.hospitalId;
          this.bed.departmentId=bed.departmentId;
          this.bed.number=bed.number;
          this.manufacturer=bed.manufacturer;
          this.bedInfoUpd = true;
          this.getDepartmentWhenUpdate(this.bed.hospitalId);
        },
        exportBed(){
            
            let params = "?";
            params+="bedId="+this.bedId+"&";
            params+="hospitalId="+this.hospitalId+"&";
            params+="departmentId="+this.departmentId+"&";
            params+="power="+this.power+"&";
            params+="status="+this.status+"&";
            params+="beginTime="+new Date(this.timeSelect[0]).toLocaleDateString()+"&";
            params+="endTime="+new Date(this.timeSelect[1]).toLocaleDateString()+"&";
            params+="roleId="+this.$store.state.roleId+"&";
            params+="userInfoId="+this.$store.state.id;
            console.log(params);
            window.location.href="http://localhost:9000/bed/downloadBedFile"+params;
            
        },
        uploadSuccess(response, file, fileList) {
            console.log("success");
        },
        uploadFailed(err, file, fileList) {
            console.log("error");
        },
        downTemplate(){
            window.location.href="http://localhost:9000/bed/downBedTemplate";
        }
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
                & this.$store.state.roleId != 5 & this.$store.state.roleId != 6
                ) {
            this.$message({
                message: '你没有相应的权限',
                type: 'warning',
            });
            this.$router.push('/Main');
        }
    },

}
</script>
<style scoped>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 120px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 30%;
  }
</style>


