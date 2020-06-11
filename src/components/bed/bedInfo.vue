<template>
<div>
  <!--搜索组件-->
<el-row>
      <el-col :span="8">
        <el-input placeholder="请输入床位ID" v-model="bedId" size="200px">
          <el-button slot="append" icon="el-icon-search" @click="findByExample()"></el-button>
        </el-input>
      </el-col>
    </el-row>
    <br/>
    <el-row>
      <el-col :span="8">
        <span>医院：</span>
        <el-select v-model="hospitalId" clearable  placeholder="---请选择医院" @change="getDepartment()">
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
        <el-select v-model="departmentId" clearable  placeholder="---请选择科室">
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
        <el-select v-model="status" clearable  placeholder="---请选择床位状态">
          <el-option label="所有状态" value="-1"></el-option>
          <el-option label="停用" value="停用"></el-option>
          <el-option label="空闲" value="空闲"></el-option>
          <el-option label="繁忙" value="繁忙"></el-option>
          <el-option label="异常" value="异常"></el-option>
          
        </el-select>
      </el-col>
      <el-col :span="8">
        <span>电量：</span>
        <el-select v-model="power" clearable  placeholder="---请选择电量">
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
          <el-button type="small"  @click="findByExample()">确认</el-button>
          <el-button type="small">清除</el-button>
        </div>
      </el-col>
    </el-row>
    <br/>


    <el-button type="danger"  @click="delChecked()">删除选中</el-button>
    <el-button type="primary" @click="delChecked()">导入床位</el-button>
    <el-button type="primary" @click="delChecked()">导出床位</el-button>
    <el-button type="primary" @click="add()">添加信息</el-button>
    共{{total}}条记录<hr>
    <el-table
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
            <el-button type="primary" icon="el-icon-edit" circle @click="update(scope.row.bedId)"></el-button>
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
    <el-form-item label="设备ID" :label-width="formWidth">
      <el-input v-model="bed.bedId" autocomplete="off"></el-input>
    </el-form-item>
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
                    v-for="item in manufacturerList"
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
    <el-form-item label="设备ID" :label-width="formWidth">
      <el-input v-model="bed.bedId" autocomplete="off" disabled="disabled"></el-input>
    </el-form-item>
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
            <el-option  label="请选择生产厂家" value="-1" disabled="disabled"></el-option>
            <el-option
                    v-for="item in manufacturerList"
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
            bedId:null,
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

            bed:{
                bedId:null,
                hospitalId:"-1",
                departmentId:"-1",
                number:null,
                departmentList:null,
                hospitalList:null
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
      //初始化数据
        init(){
            this.bed={bedId:null,hospitalId:"-1",departmentId:"-1",number:null,departmentList:null,hospitalList:this.hospitalList};
            this.manufacturer={manufacturerId:"-1",contactperson:null,phonenumber:null,contactphone:null};
        },
        //查询数据
        findByExample(){
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
                }
            })
            .then(res => {
                console.log(res);
                this.tableData=res.data.bedList;
                this.manufacturerList=res.data.manufacturerList;
                this.hospitalList=res.data.hospitalList;
                this.total=res.data.pageBean.total;
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
            this.init();
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
                      "hospitalId":this.hospitalId
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
                      "hospitalId":this.bed.hospitalId
                  }
              })
              .then(res => {
                  this.departmentId="-1"
                  this.bed.departmentList=res.data.departmentList;
                  this.bed.departmentId="-1"
              })
              .catch(err => {
                  console.error(err); 
              })
        },
        //生产商变换的时候调用
        manufacturerChange(event){
            this.manufacturer.manufacturerId = this.manufacturerList[event-1].manufacturerId;
            this.manufacturer.contactperson = this.manufacturerList[event-1].contactperson;
            this.manufacturer.phonenumber = this.manufacturerList[event-1].phonenumber;
            this.manufacturer.contactphone = this.manufacturerList[event-1].contactphone;    
        },
        //添加的保存按钮事件
        save(){
            this.checkOut();
            if(this.flag){
                this.bedInfoAdd = false;
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
          }
        },
        //校验输入的数据
        checkOut(){
          this.flag=false;
          if(this.bed.bedId==null||this.bed.bedId.length!=5){
              this.$notify({
                title: '床位ID输入有误',
                message: this.$createElement('b', { style: 'color: red'}, '请输入5位的床位ID')
              });
          }else if(this.bed.hospitalId=="-1"){
              this.$notify({
                title: '未选择医院',
                message: this.$createElement('b', { style: 'color: red'}, '请选择医院')
              });
          }else if(this.bed.departmentId=="-1"){
              this.$notify({
                title: '未选择科室',
                message: this.$createElement('b', { style: 'color: red'}, '请选择科室')
              });
          }else if(this.bed.number==null||this.bed.number.length!=8){
              this.$notify({
                title: '床位编号输入有误',
                message: this.$createElement('b', { style: 'color: red'}, '请输入8位的床位编号')
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
        update(bedId){
            this.axios({
                method:'get',
                url: "http://localhost:9000/bed/findOne",
                params: {
                    "bedId":bedId
                }
            })
            .then(res => {
                console.log(res.data)
                    this.bed={
                      bedId:res.data.bed.bedId,
                      hospitalId:res.data.bed.department.hospital.hospitalId,
                      number:res.data.bed.number,
                      hospitalList:this.hospitalList
                    };
                    this.getDepartmentDialog();
                    this.bed.departmentId=res.data.bed.departmentId;
                    this.manufacturer=res.data.bed.manufacturer;
                    this.bedInfoUpd = true;
                })
                .catch(err => {
                    console.error(err); 
                })
            
        }
    }
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


