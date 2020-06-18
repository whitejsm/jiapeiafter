<template>

<div style="backgroundColor:#7D7DFF ">
  <div>
    医院管理/医院
  </div>
  <div style="border:1px solid blue ;margin-bottom:20px; margin-top:20px; backgroundColor:white" >
<el-form ref="form" :model="DepartmentSearch" label-width="80px" >

  <el-form-item label="科室名称" style="width:500px" >
    <el-input v-model="DepartmentSearch.name" placeholder="请输入科室名称"></el-input>
  </el-form-item>

    <el-form-item label="医院">
    <el-select v-model="DepartmentSearch.hospitalId" placeholder="请选择医院">
      <el-option value="">全选</el-option>
      <el-option v-for="hospitalsearch in DepartmentSearch.hospitals" :key="hospitalsearch.hospitalId" :value="hospitalsearch.hospitalId" :label="hospitalsearch.hospitalname"></el-option>
      
    </el-select>
  </el-form-item>

  

  

  <el-form-item label="创建时间">


    <div class="block">
    <span class="demonstration">开始时间</span>
    <el-date-picker
      v-model="DepartmentSearch.value1"
      type="datetime"
      placeholder="选择日期时间"
      format="yyyy 年 MM 月 dd 日"
      value-format="timestamp">
    </el-date-picker>
    <span class="demonstration">截止时间</span>
    <el-date-picker
      v-model="DepartmentSearch.value2"
      type="datetime"
      placeholder="选择日期时间"
      format="yyyy 年 MM 月 dd 日"
      value-format="timestamp">
    </el-date-picker>
  </div>

  </el-form-item>


  <el-form-item>
    <el-button type="primary" @click="onSearchbtn()">搜索</el-button>
  </el-form-item>
</el-form>
</div>

<div style="border:1px solid blue ;margin-bottom:20px; margin-top:20px; backgroundColor:white">
<el-button type="primary" @click="insertReady()">新增</el-button>

<el-dialog
  
  title=""
  :visible.sync="centerDialogVisible"
  width="70%"
  @close="resetForm()"
  left>
  <div v-if="flag=='0'" style="text-align:center;margin-bottom:20px;font-size:x-large;"><b>新增</b></div>
  <div v-if="flag=='1'" style="text-align:center;margin-bottom:20px;font-size:x-large;"><b>修改</b></div>
  
<el-form  ref="insertForm" :inline="true" class="demo-form-inline">

  <div>
  
<el-form-item label="科室名称"  >
    <el-input v-model="insert.name" placeholder="请输入科室名称" style="width:400px"></el-input>
  </el-form-item>
  </div>
  <div>
  <!-- {{insert.connector}} -->
  <el-form-item label="科室联系人"  >
  <el-select v-model="insert.connector"  placeholder="请选择联系人" >
      <el-option v-for="user in insert.connectors" :key="user.userinfoId" :value="user.userinfoId" :label="user.name" ></el-option>
    </el-select>
      </el-form-item>
</div>


<div>
      <!-- {{insert.share}} -->
      <el-form-item label="收益分成"  >
  <el-input v-model="insert.share" placeholder="请输入收益分成" style="width:400px" ></el-input>
      </el-form-item>
      </div>
<!-- <div>
      {{insert.stockholder}}
      <el-form-item label="股东"  >
  <el-select v-model="insert.stockholder"  placeholder="请选择股东" >
      <el-option v-for="user in insert.stockholders" :key="user.userinfoId" :value="user.userinfoId" :label="user.name" ></el-option>
    </el-select>
      </el-form-item>
      </div> -->
<div> 
      {{insert.distributor1}}
     <el-form-item label="医院"  >
  <el-select v-model="insert.distributor1"  placeholder="医院" >
      <el-option v-for="user in insert.distributor1s" :key="user.hospitalId" :value="user.hospitalId" :label="user.hospitalname" ></el-option>
    </el-select>
      </el-form-item>
      </div>
<!-- <div>
      {{insert.distributor2}}
      <el-form-item label="二级分销商"  >
  <el-select v-model="insert.distributor2"  placeholder="二级分销商" >
      <el-option v-for="user in insert.distributor2s" :key="user.userinfoId" :value="user.userinfoId" :label="user.name" ></el-option>
    </el-select>
      </el-form-item>
      </div> -->
</el-form>









  <span slot="footer" class="dialog-footer">
    <el-button @click="centerDialogVisible = false">取 消</el-button>
    <el-button v-if="flag=='0'" type="primary" @click="insertsave()">确 定</el-button>
    <el-button v-if="flag=='1'" type="primary" @click="updatetsave()">修改</el-button>
  </span>
</el-dialog>

</div>


<div style="border:1px solid blue ;margin-bottom:20px;  margin-top:20px; backgroundColor:white">
<el-table
    :data="list"
    stripe
    style="width: 100%">
    <el-table-column
      prop="departmentname"
      label="科室名称"
      >
    </el-table-column>
    <el-table-column
      prop="hospital.hospitalname"
      label="所属医院"
      >
    </el-table-column>
    <el-table-column
      prop="departor.username"
      label="科室对接人"
      >
    </el-table-column>
    <el-table-column
      prop="departor.phonenumber"
      label="科室对接人电话"
      >
    </el-table-column>
    <el-table-column
      prop="hospital.bankcard"
      label="银行卡号">
    </el-table-column>
    
    <el-table-column
      prop="revenueshare"
      label="收益分成(%)">
    </el-table-column>
        <el-table-column
      prop="value1"
      :formatter="dateFormat"
      label="创建日期"
      >
    </el-table-column>

    
    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button
          size="mini"
          type="info"
          @click="handleCheck(scope.$index, scope.row)">详情</el-button>
        <el-button
          size="mini"
          type="danger"
          @click="delete1(scope.$index, scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>

</div>

  <el-pagination
  background
  layout="prev, pager, next"
  :current-page="currentPage"
  :page-size="pageSize"
  :total="totalcount"
   @current-change="handleCurrentChange"
  
  >
  
</el-pagination>

<el-dialog
  title="科室信息"
  :visible.sync="centerDialogVisible1"
  class="abow_dialog"
  width="1300px"
  height="3000px"
  center>
  <div>
  <div>科室信息</div>
                 <!-- this.findOne.departmentId=res.data.departmentId;
                        // this.findOne.province=res.data.province;
                        // this.findOne.city=res.data.city;
                        // this.findOne.zone=res.data.zone;
                        // this.findOne.province=res.data.province;
                        // this.findOne.pcz=res.data.province.provinceName + res.data.city.cityName+ res.data.zone.zoneName;
                        this.findOne.name=res.data.hospital.hospitalname;
                        this.findOne.connector=res.data.departor.username;
                        this.findOne.connectorid=res.data.departor.userinfoId;
                        this.findOne.phone=res.data.departor.phonenumber;
                        // this.findOne.rent=res.data.rent;
                        // this.findOne.card=res.data.bankcard;
                        this.findOne.share=res.data.revenueshare;
                        
                        this.findOne.distributor1=res.data.repairman.man.username;
                        this.findOne.distributor1num=res.data.repairman.man.userinfoId;
                        this.findOne.depcount=res.data.bedList.length;
                        this.findOne.dept=res.data.bedList;
                        var timetemp = res.data.value1;                                    -->
    <div style="border:1px solid blue ;width: 1250px;height:330px;margin-bottom:20px; margin-top:20px; backgroundColor:white">
  <div style="width: 400px; height:30px; font-size: 20px ; float:left;margin-left:30px;margin-bottom:30px;" > <span>医院名称:{{findOne.name}}</span> </div>
  <div style="width: 400px; height:30px; font-size: 20px ; float:left;margin-bottom:30px;"><span>科室名称:{{findOne.departmentname}}</span></div>
  <div style="width: 400px; height:30px; font-size: 20px ; float:left;margin-bottom:30px;"><span>科室对接人:{{findOne.connector}}</span></div>

  <div style="width: 400px; height:30px; font-size: 20px ; float:left;margin-left:30px;margin-bottom:30px;" ><span>对接人电话:{{findOne.phone}}</span></div>
  <div style="width: 400px; height:30px; font-size: 20px ; float:left;margin-bottom:30px;"><span>收益分成:{{findOne.share}}</span></div>
  <div style="width: 400px; height:30px; font-size: 20px ; float:left;margin-bottom:30px;"><span>医院对接人:{{findOne.hospitalmanname}}</span></div>

   <div style="width: 400px; height:30px; font-size: 20px ; float:left;margin-left:30px;margin-bottom:30px;" ><span>维修人:{{findOne.distributor1}}</span></div>


   <div style="width: 400px; height:30px; font-size: 20px ; float:left;margin-left:30px;margin-bottom:30px;" ><span>创建时间:{{findOne.time}}</span></div>
    </div>
    
 <el-table
      :data="findOne.dept"
      style="width: 100%">
      <el-table-column
        prop="bedId"
        label="床位编号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="manufacturerId"
        label="设备ID"
        width="180">
      </el-table-column>
      <el-table-column
        prop="value1"
        :formatter="dateFormat"
        label="录入时间">
      </el-table-column>

    </el-table>


    
<div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="centerDialogVisible1 = false">取 消</el-button>
    <el-button type="primary" @click="update()">编辑</el-button>

  </span>
  </div>
  </div>
</el-dialog>
  </div>
</template>

<script>
  export default {
    name:"hospital",
    data() {
      return {
        insert:{
          name:'',
            province:'',//省
          city:'',//市
          zone:'',//区
          connector:'',//医院联系人
          connectors:'',//遍历出的集合
          phone:'1',//联系人电话
          rent:'',//租金
          share:'50',//收益分成
          bank:'',//银行卡号
          rent:'',//租金
          stockholder:'',//股东
          stockholders:'',//遍历出来的股东
          distributor1:'',//一级经销商
          distributor1s:'',//遍历出的一级经销商
          distributor2:'',//二级经销商
          distributor2s:''//遍历出的二级经销商
          
        },
        flag:"0",
        list: null,
        distributors:null,
        province:null,
        city:null,
        zone:null,
        province1:null,
        city1:null,
        zone1:null,
        currentPage:1,
        totalcount:1,
        pageSize:1,
        centerDialogVisible: false,
        centerDialogVisible1: false,
        DepartmentSearch: {
          name: '',//医院名称
          hospitalname: '',//医院名称
          value1: '',//开始时间
          value2: '',//结束时间
          hospitalId: '',//医院id
          hospitals:'',//医院集合
        },
        findOne:{
          hospitalId:'',
          departorId:'',
          distributor1num:'',
          province:'',//省
          city:'',//市
          zone:'',//区
          pcz:'',
          name:'',
          departmentname:'',
          hospitalmanname:'',
          connector:'',
          phone:'',
          rent:'',
          card:'',
          share:'',
          dept:null,
          distributor1:'',
          connectorid:'',
          depcount:'',
          time:'',
          

        }
      }
    },
    methods:{
      updatetsave(){
        var myInsert = this.insert;
        var myDistributor = myInsert.distributor1;

            this.$confirm('是否修改?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log("修改");
            this.axios({
                    headers:  {'Content-Type': 'application/x-www-form-urlencoded'},

                    method:'post',
                    url: 'http://localhost:9000/department/updateSave',
                    params: {
                        departmentId:this.findOne.departmentId,
                        hospitalId:myInsert.distributor1,
                        departmentname:myInsert.name,
                        // bankcard:myInsert.bank,
                        // rent:myInsert.rent,
                        revenueshare:myInsert.share,
                        // create_time
                        departorId:myInsert.connector
                        // contactorId:myInsert.connector,
                        // provinceId:myInsert.province,
                        // cityId:myInsert.city,
                        // zoneId:myInsert.zone
                        // isdelete

          
        }

                        
                    
                })
                    .then(res => {
                        console.log("静静");
                        this.$message({
                          type: 'success',
                          message: '修改成功!'
                        });
                        this.onSearch();
                        
                    })
                    .catch(err => {
                        console.error(err);
                    })

          
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消保存'
          });          
        });

          this.centerDialogVisible=false;
          
      },
      update() {
        this.insertReady();
        this.centerDialogVisible1 = false;
        this.flag='1';
        
        
        
        this.insert.name = this.findOne.departmentname;
        this.insert.connector = this.findOne.connectorid;
       
        this.insert.share = this.findOne.share;
        this.insert.distributor1 = this.findOne.distributor1num;
        







        this.centerDialogVisible=true;
        
        

      },
      resetForm() {
        
this.insert = this.$options.data().insert;
        // console.log(this.$refs)
    //  this.$refs.insertForm.resetFields();
 },
      findAll(){
        this.axios({
                    headers:  {'Content-Type': 'application/x-www-form-urlencoded'},
                    method:'get',
                    url: 'http://localhost:9000/department/findAll'
                   
                })
                .then(res => {
                   this.list=res.data;
                   console.log(this.list);
                   
                })
               .catch(err => {
                   console.error(err); 
               })
      },
      handleCheck(index, row) {
        
        var departmentId = row.departmentId;
        this.centerDialogVisible1 = true;
        this.axios({
                    headers:  {'Content-Type': 'application/x-www-form-urlencoded'},
                    method:'get',
                    url: 'http://localhost:9000/department/'+departmentId,
                    
                })
                
                .then(res => {
                        this.findOne.departmentId=res.data.departmentId;
                        // this.findOne.province=res.data.province;
                        // this.findOne.city=res.data.city;
                        // this.findOne.zone=res.data.zone;
                        // this.findOne.province=res.data.province;
                        // this.findOne.pcz=res.data.province.provinceName + res.data.city.cityName+ res.data.zone.zoneName;
                        this.findOne.name=res.data.hospital.hospitalname;
                        this.findOne.departmentname=res.data.departmentname;
                        this.findOne.connector=res.data.departor.username;
                        this.findOne.connectorid=res.data.departor.userinfoId;
                        this.findOne.phone=res.data.departor.phonenumber;
                        // this.findOne.rent=res.data.rent;
                        // this.findOne.card=res.data.bankcard;
                        this.findOne.share=res.data.revenueshare;
                        this.findOne.hospitalmanname=res.data.hospital.contactor.username;
                        this.findOne.distributor1=res.data.repairman.man.username;
                        this.findOne.distributor1num=res.data.hospital.hospitalId;
                        this.findOne.depcount=res.data.bedList.length;
                        this.findOne.departmentId=res.data.departmentId;
                        this.findOne.dept=res.data.bedList;
                        var timetemp = res.data.value1;
                        console.log(timetemp);
                        if(timetemp!=null){
                       const dateMat= new Date(parseInt(timetemp));
                          console.log(dateMat);
                      const year = dateMat.getFullYear();
                    const month = dateMat.getMonth() + 1;
                    const day = dateMat.getDate();
                    const hh = dateMat.getHours();
                    const mm = dateMat.getMinutes();
                    const ss = dateMat.getSeconds();
                    const timeFormat= year + "/" + month + "/" + day + " " + hh + ":" + mm + ":" + ss;
                    this.findOne.time=timeFormat;
                }
                }
                    )
                    .catch(err => {
                        console.error(err);
                    })


        // this.centerDialogVisible=true;
      }, 
      onSearchbtn(){
        this.currentPage=1;
        this.onSearch();
        
      },
      onSubmit() {
        console.log('submit!');
      },
      delete1(index, row) {
        
        var departmentId = row.departmentId;
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            this.axios({
                    headers:  {'Content-Type': 'application/x-www-form-urlencoded'},
                    method:'delete',
                    url: 'http://localhost:9000/department/'+departmentId,
                    
                })
                    .then(res => {
                        console.log("aaaaaaa");
                        this.$message({
                          type: 'success',
                          message: '删除成功!'
                        });
                        this.onSearch();
                    })
                    .catch(err => {
                        console.error(err);
                    })

          
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
      findProvince(){
        
        this.axios.get("http://localhost:9000/hospital/findProvinces")
        .then(res => {
          
          this.province=res.data;
          this.province1 = res.data;
          
          
        })
        .catch(err => {
          console.error(err); 
        })
      },
       fillCity(pindex){
         console.log(pindex);
         this.axios({
                     headers:  {'Content-Type': 'application/x-www-form-urlencoded'},
                    method:'get',
                    url: "http://localhost:9000/hospital/findCities",
                    params: {
                        provinceId:pindex
                        
                    }
         })
        .then(res => {
          
          this.city=res.data;
          this.DepartmentSearch.city=null;
          this.DepartmentSearch.zone=null;
          
        })
        .catch(err => {
          console.error(err); 
        })
            
        },
        insertfillCity(pindex){
         console.log(pindex);
         this.axios({
                     headers:  {'Content-Type': 'application/x-www-form-urlencoded'},
                    method:'get',
                    url: "http://localhost:9000/hospital/findCities",
                    params: {
                        provinceId:pindex
                        
                    }
         })
        .then(res => {
          
          this.city1=res.data;
          this.insert.city=null;
          this.insert.zone=null;
          
        })
        .catch(err => {
          console.error(err); 
        })
            
        },
        updatefillCity(pindex){
         console.log(pindex);
         this.axios({
                     headers:  {'Content-Type': 'application/x-www-form-urlencoded'},
                    method:'get',
                    url: "http://localhost:9000/hospital/findCities",
                    params: {
                        provinceId:pindex
                        
                    }
         })
        .then(res => {
          
          this.city1=res.data;
          
          
        })
        .catch(err => {
          console.error(err); 
        })
            
        },
        handleCurrentChange(val) {
           // 改变默认的页数
           this.currentPage=val;
           this.onSearch();

       },
        insertfillZone(cindex){
             this.axios({
                     headers:  {'Content-Type': 'application/x-www-form-urlencoded'},
                    method:'get',
                    url: "http://localhost:9000/hospital/findZones",
                    params: {
                        cityId:cindex
                        
                    }
         })
        .then(res => {
          
          this.zone1=res.data;
          this.insert.zone=null;
          
        })
        .catch(err => {
          console.error(err); 
        })
        },
        updatefillZone(cindex){
             this.axios({
                     headers:  {'Content-Type': 'application/x-www-form-urlencoded'},
                    method:'get',
                    url: "http://localhost:9000/hospital/findZones",
                    params: {
                        cityId:cindex
                        
                    }
         })
        .then(res => {
          
          this.zone1=res.data;
          
          
        })
        .catch(err => {
          console.error(err); 
        })
        },
        fillZone(cindex){
             this.axios({
                     headers:  {'Content-Type': 'application/x-www-form-urlencoded'},
                    method:'get',
                    url: "http://localhost:9000/hospital/findZones",
                    params: {
                        cityId:cindex
                        
                    }
         })
        .then(res => {
          
          this.zone=res.data;
          this.DepartmentSearch.zone=null;
          
        })
        .catch(err => {
          console.error(err); 
        })
        },
      findHospitals(){
        this.axios({
                    headers:  {'Content-Type': 'application/x-www-form-urlencoded'},
                    method:'get',
                    url: 'http://localhost:9000/department/findHospitals'
                   
                })
                .then(res => {
                   this.DepartmentSearch.hospitals=res.data;
                  //  console.log(this);
                   
                })
               .catch(err => {
                   console.error(err); 
               })
      },
      onSearch(){
        var currentPage = this.currentPage;
        var DepartmentSearch1 = this.DepartmentSearch;
        console.log(DepartmentSearch1);
        this.axios({
                    headers:  {'Content-Type': 'application/x-www-form-urlencoded'},
                    method:'post',
                    url: 'http://localhost:9000/department/search',
                   params: {
                      
                        name:DepartmentSearch1.name,
                        hospitalname:DepartmentSearch1.hospitalname,
                        hospitalId:DepartmentSearch1.hospitalId,
                        value1:DepartmentSearch1.value1,
                        value2:DepartmentSearch1.value2,
                        currentPage:currentPage

                        
                    }
                })
                .then(res => {
                   console.log(11111111);
                   this.list=res.data.list;
                   this.pageSize = res.data.pb.pageSize;
                   this.totalcount = res.data.pb.totalCount;
                   console.log(this.pageSize);
                   console.log(this.totalcount);
                   
                })
               .catch(err => {
                   console.error(err); 
               })
              this.DepartmentSearch = this.$options.data().DepartmentSearch; 
              this.findHospitals();
      },
      insertsave(){
        var myInsert = this.insert;
        var myDistributor = myInsert.distributor1;
        

        this.$confirm('是否保存?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            this.axios({
                    headers:  {'Content-Type': 'application/x-www-form-urlencoded'},
                    method:'post',
                    url: 'http://localhost:9000/department/insertSave',
                    params: {
                      
                        
                        departmentname:myInsert.name,
                       
                        
                        revenueshare:myInsert.share,
                        // create_time
                        hospitalId:myDistributor,
                        departorId:myInsert.connector
                        
                        // isdelete
// insert:{
//             province:'',//省
//           city:'',//市
//           zone:'',//区
//           connector:'',//医院联系人
//           connectors:'',//遍历出的集合
//           phone:'1',//联系人电话
//           rent:'',//租金
//           share:'50',//收益分成
//           bank:'',//银行卡号
//           rent:'',//租金
//           stockholder:'',//股东
//           stockholders:'',//遍历出来的股东
//           distributor1:'',//一级经销商
//           distributor1s:'',//遍历出的一级经销商
//           distributor2:'',//二级经销商
//           distributor2s:''//遍历出的二级经销商
          
        },

                        
                    
                })
                    .then(res => {
                        
                        this.$message({
                          type: 'success',
                          message: '保存成功!'
                        });
                        this.onSearch();
                    })
                    .catch(err => {
                        console.error(err);
                    })

          
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消保存'
          });          
        });



        this.centerDialogVisible = false
      },
      insertReady(){
        this.axios.get("http://localhost:9000/department/findInsert")
        .then(res => {
          
          this.insert.connectors=res.data.connectors;
          
          
         
          this.insert.distributor1s=res.data.distributor1s;
          
          
          
          
          
        })
        .catch(err => {
          console.error(err); 
        })
        this.flag='0';
        this.centerDialogVisible = true
      },
       dateFormat(row, column, cellValue, index){
         console.log(row);
         console.log(row[column.property]);

                   const daterc = row[column.property]
                   if(daterc!=null){
                       const dateMat= new Date(parseInt(daterc));
                      const year = dateMat.getFullYear();
                    const month = dateMat.getMonth() + 1;
                    const day = dateMat.getDate();
                    const hh = dateMat.getHours();
                    const mm = dateMat.getMinutes();
                    const ss = dateMat.getSeconds();
                    const timeFormat= year + "/" + month + "/" + day + " " + hh + ":" + mm + ":" + ss;
                    return timeFormat;
                   }
                   
            }



    },
    mounted() {
      this.onSearch();
         this.findHospitals();
         this.findProvince();
         
      },
      watch:{
     
      'insert.rent'(newValue,oldValue){
        console.log(newValue+ "   "+oldValue+"  ");
        if(isNaN(newValue)||(parseInt(newValue)>20))  {
          this.insert.rent = oldValue;
          
        }
      },
      'insert.bank'(newValue,oldValue){
        console.log(newValue+ "   "+oldValue+"  ");
        if(isNaN(newValue))  {
          this.insert.bank = oldValue;
          
        }
      }
    }
  }
</script>

<style scoped>
.el-dialog__body {
    position: absolute;
    left: 0;
    top: 54px;
    bottom: 70px;
    right: 0;
    padding: 0;
    z-index: 1;
    overflow: hidden;
    overflow-y: auto;
}
.el-dialog__footer{
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
}
/* .el-dialog__body{
    overflow-y: auto;
  } */

</style>