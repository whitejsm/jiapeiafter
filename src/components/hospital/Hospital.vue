<template>

<div style="backgroundColor:#7D7DFF ">
  <div>
    医院管理/医院
  </div>
  <div style="border:1px solid blue ;margin-bottom:20px; margin-top:20px; backgroundColor:white" >
<el-form ref="form" :model="HospitalSearch" label-width="80px" >

  <el-form-item label="医院名称" style="width:500px" >
    <el-input v-model="HospitalSearch.name" placeholder="请输入医院名称"></el-input>
  </el-form-item>

    <el-form-item label="分销商">
    <el-select v-model="HospitalSearch.distributor" placeholder="请选择分销商">
      <el-option value="">全选</el-option>
      <el-option v-for="userinfo in distributors" :key="userinfo.userinfoId" :value="userinfo.userinfoId" :label="userinfo.name"></el-option>
      
    </el-select>
  </el-form-item>

  

  <el-form-item label="收益(%)">
    <el-select v-model="HospitalSearch.share" placeholder="请选择收益分成">
      <el-option label="0-10" value="0-10"></el-option>
      <el-option label="10-20" value="10-20"></el-option>
      <el-option label="20-30" value="20-30"></el-option>
      <el-option label="30-40" value="30-40"></el-option>
      <el-option label="40-50" value="40-50"></el-option>
    </el-select>
  </el-form-item>

  <el-form-item label="创建时间">


    <div class="block">
    <span class="demonstration">开始时间</span>
    <el-date-picker
      v-model="HospitalSearch.value1"
      type="datetime"
      placeholder="选择日期时间"
      format="yyyy 年 MM 月 dd 日"
      value-format="timestamp">
    </el-date-picker>
    <span class="demonstration">截止时间</span>
    <el-date-picker
      v-model="HospitalSearch.value2"
      type="datetime"
      placeholder="选择日期时间"
      format="yyyy 年 MM 月 dd 日"
      value-format="timestamp">
    </el-date-picker>
  </div>

  </el-form-item>



 <div>
<el-form  :inline="true" class="demo-form-inline">

  <el-form-item label="按地区查询">
    <el-select v-model="HospitalSearch.province" placeholder="省" @change="fillCity($event)">
      
      <el-option v-for="provinces in province" :key="provinces.provinceId" :value="provinces.provinceId" :label="provinces.provinceName" ></el-option>

      
    </el-select>
  </el-form-item>

  <el-form-item >
    <el-select v-model="HospitalSearch.city" placeholder="市" @change="fillZone($event)">
      <el-option v-for="cities in city" :key="cities.cityId" :value="cities.cityId" :label="cities.cityName" ></el-option>

      
    </el-select>
  </el-form-item>

    <el-form-item >
    <el-select v-model="HospitalSearch.zone" placeholder="区">
      <el-option v-for="zones in zone" :key="zones.zoneId" :value="zones.zoneId" :label="zones.zoneName" ></el-option>

      
    </el-select>
  </el-form-item>
  

</el-form>

</div>

  <el-form-item>
    <el-button type="primary" @click="onSearchbtn()">搜索</el-button>
  </el-form-item>
</el-form>
</div>

<div style="border:1px solid blue ;margin-bottom:20px; margin-top:20px; backgroundColor:white">
<el-button type="primary" @click="insertReady()">新增</el-button>
<el-button type="primary">主要按钮</el-button>

<el-dialog
  
  title=""
  :visible.sync="centerDialogVisible"
  width="70%"
  @close="resetForm()"
  left>
  <div v-if="flag=='0'" style="text-align:center;margin-bottom:20px;font-size:x-large;"><b>新增</b></div>
  <div v-if="flag=='1'" style="text-align:center;margin-bottom:20px;font-size:x-large;"><b>修改</b></div>
  
<el-form  ref="insertForm" :inline="true" class="demo-form-inline">

    <el-form-item  label="按地区查询">
     <el-select  v-model="insert.province" placeholder="省" @change="insertfillCity($event)">
   <el-option v-for="provinces in province1" :key="provinces.provinceId" :value="provinces.provinceId" :label="provinces.provinceName" ></el-option>
    </el-select>
  </el-form-item>

  <el-form-item >
    <el-select v-model="insert.city" placeholder="市" @change="insertfillZone($event)">
      <el-option v-for="cities in city1" :key="cities.cityId" :value="cities.cityId" :label="cities.cityName" ></el-option>
    </el-select>
  </el-form-item>

    <el-form-item >
    <el-select v-model="insert.zone" placeholder="区">
      <el-option v-for="zones in zone1" :key="zones.zoneId" :value="zones.zoneId" :label="zones.zoneName" ></el-option>

      
    </el-select>
  </el-form-item>
 
  <div>
  
<el-form-item label="医院名称"  >
    <el-input v-model="insert.name" placeholder="请输入医院名称" style="width:400px"></el-input>
  </el-form-item>
  </div>
  <div>

  <el-form-item label="医院联系人"  >
  <el-select v-model="insert.connector"  placeholder="请选择联系人" >
      <el-option v-for="user in insert.connectors" :key="user.userinfoId" :value="user.userinfoId" :label="user.name" ></el-option>
    </el-select>
      </el-form-item>
</div>
<div>
      
      <el-form-item label="租金"  >
  <el-input v-model="insert.rent" placeholder="请输入租金(元)" style="width:400px" ></el-input>

      </el-form-item>
      </div>
<div>
     
    <el-form-item label="银行卡号"  >
  <el-input v-model="insert.bank" placeholder="请输入银行卡号" style="width:400px" ></el-input>
      </el-form-item>
      </div>
<div>
      
      <el-form-item label="收益分成"  >
  <el-input v-model="insert.share" placeholder="请输入收益分成" style="width:400px" :disabled="true"></el-input>
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
      
      <el-form-item label="分销商"  >
  <el-select v-model="insert.distributor1"  placeholder="分销商" >
      <el-option v-for="user in insert.distributor1s" :key="user.userinfoId" :value="user.userinfoId" :label="user.name" ></el-option>
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
v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
    :data="list"
    stripe
    style="width: 100%">
    <el-table-column
      prop="hospitalname"
      label="医院名称"
      >
    </el-table-column>
    <el-table-column
      prop="contactor.name"
      label="医院对接人姓名"
      >
    </el-table-column>
    <el-table-column
      prop="contactor.phonenumber"
      label="医院对接人电话"
      >
    </el-table-column>
    <el-table-column
      prop="bankcard"
      label="银行卡号">
    </el-table-column>
    <el-table-column
      prop="rent"
      label="租金(元)">
    </el-table-column>
    <el-table-column
      prop="revenueshare"
      label="收益分成(%)">
    </el-table-column>
        <el-table-column
      prop="value1"
      :formatter="dateFormat"
      label="创建日期">
    </el-table-column>

    <el-table-column
      prop="distributor.name"
      label="经销商">
    </el-table-column>
    <el-table-column label="操作" width="200">
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
  title="医院信息"
  :visible.sync="centerDialogVisible1"
  width="1300px"
  center>
  <div>
  <div>医院信息</div>
                                                    
    <div style="border:1px solid blue ;width: 1250px;height:330px;margin-bottom:20px; margin-top:20px; backgroundColor:white">
  <div style="width: 400px; height:30px; font-size: 20px ; float:left;margin-left:30px;margin-bottom:30px;" > <span>省市县区:{{findOne.pcz}}</span> </div>
  <div style="width: 400px; height:30px; font-size: 20px ; float:left;margin-bottom:30px;"><span>医院名称:{{findOne.name}}</span></div>
  <div style="width: 400px; height:30px; font-size: 20px ; float:left;margin-bottom:30px;"><span>医院对接人:{{findOne.connector}}</span></div>

  <div style="width: 400px; height:30px; font-size: 20px ; float:left;margin-left:30px;margin-bottom:30px;" ><span>对接人电话:{{findOne.phone}}</span></div>
  <div style="width: 400px; height:30px; font-size: 20px ; float:left;margin-bottom:30px;"><span>租金:{{findOne.rent}}</span></div>
  <div style="width: 400px; height:30px; font-size: 20px ; float:left;margin-bottom:30px;"><span>银行卡号:{{findOne.card}}</span></div>

   <div style="width: 400px; height:30px; font-size: 20px ; float:left;margin-left:30px;margin-bottom:30px;" ><span>收益分成:{{findOne.share}}</span></div>
  <div style="width: 400px; height:30px; font-size: 20px ; float:left;margin-bottom:30px;"><span>分销商:{{findOne.distributor1}}</span></div>
  <div style="width: 400px; height:30px; font-size: 20px ; float:left;margin-bottom:30px;"><span>科室数:{{findOne.depcount}}</span></div>

   <div style="width: 400px; height:30px; font-size: 20px ; float:left;margin-left:30px;margin-bottom:30px;" ><span>创建时间:{{findOne.time}}</span></div>
    </div>
    
 <el-table
      :data="findOne.dept"
      style="width: 100%">
      <el-table-column
        prop="departmentname"
        label="科室名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="departor.username"
        label="科室对接人"
        width="180">
      </el-table-column>
      <el-table-column
        prop="bedList.length"
        label="床位总数">
      </el-table-column>
      <el-table-column
        prop="repairman.man.username"
        label="维修人">
      </el-table-column>
    </el-table>


    

  <span slot="footer" class="dialog-footer">
    <el-button @click="centerDialogVisible1 = false">取 消</el-button>
    <el-button type="primary" @click="update()">编辑</el-button>

  </span>
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
        loading:true,
        centerDialogVisible: false,
        centerDialogVisible1: false,
        HospitalSearch: {
          name: '',//医院名称
          distributor: '',//经销商名称
          value1: '',//开始时间
          value2: '',//结束时间
          share: '',//收益分成
          province:'',//省
          city:'',//市
          zone:''//区
        },
        findOne:{
          hospitalId:'',
          distributor1num:'',
          province:'',//省
          city:'',//市
          zone:'',//区
          pcz:'',
          name:'',
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
          
            this.axios({
                    headers:  {'Content-Type': 'application/x-www-form-urlencoded'},

                    method:'post',
                    url: 'http://localhost:9000/hospital/updateSave',
                    params: {
                      
                        hospitalId:this.findOne.hospitalId,
                        hospitalname:myInsert.name,
                        bankcard:myInsert.bank,
                        rent:myInsert.rent,
                        revenueshare:myInsert.share,
                        // create_time
                        distributorId:myDistributor,
                        contactorId:myInsert.connector,
                        provinceId:myInsert.province,
                        cityId:myInsert.city,
                        zoneId:myInsert.zone
                        // isdelete

          
        }

                        
                    
                })
                    .then(res => {
                        
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
        
        this.updatefillCity(this.findOne.province.provinceId);
        this.updatefillZone(this.findOne.city.cityId);
        this.insert.province = this.findOne.province.provinceId;
        
        this.insert.city = this.findOne.city.cityId;
        
        this.insert.zone = this.findOne.zone.zoneId;
        this.insert.name = this.findOne.name;
        this.insert.connector = this.findOne.connectorid;
        this.insert.rent = this.findOne.rent;
        this.insert.bank = this.findOne.card;
        this.insert.share = this.findOne.share;
        this.insert.distributor1 = this.findOne.distributor1num;
        







        this.centerDialogVisible=true;
        
        // findOne:{
          //  province:'',//省
          // city:'',//市
          // zone:'',//区
        //   pcz:'',
        //   name:'',
        //   connector:'',
        //   phone:'',
        //   rent:'',
        //   card:'',
        //   share:'',
        //   dept:null,
        //   distributor1:'',
          
        //   depcount:'',
        //   time:'',
          

        // }insert:{
        //     province:'',//省
        //   city:'',//市
        //   zone:'',//区
        //   connector:'',//医院联系人
        //   connectors:'',//遍历出的集合
        //   phone:'1',//联系人电话
        //   rent:'',//租金
        //   share:'50',//收益分成
        //   bank:'',//银行卡号
        //   rent:'',//租金
        //   stockholder:'',//股东
        //   stockholders:'',//遍历出来的股东
        //   distributor1:'',//一级经销商
        //   distributor1s:'',//遍历出的一级经销商
        //   distributor2:'',//二级经销商
        //   distributor2s:''//遍历出的二级经销商
          
        // },

      },
      resetForm() {
        
this.insert = this.$options.data().insert;
        // ////console.log(this.$refs)
    //  this.$refs.insertForm.resetFields();
 },
      findAll(){
        this.axios({
                    headers:  {'Content-Type': 'application/x-www-form-urlencoded'},
                    method:'get',
                    url: 'http://localhost:9000/hospital/findAll'
                   
                })
                .then(res => {
                   this.list=res.data;
                   
                })
               .catch(err => {
                   console.error(err); 
               })
      },
      handleCheck(index, row) {
        
        var hospitalId = row.hospitalId;
        this.centerDialogVisible1 = true;
        this.axios({
                    headers:  {'Content-Type': 'application/x-www-form-urlencoded'},
                    method:'get',
                    url: 'http://localhost:9000/hospital/'+hospitalId,
                    
                })
                .then(res => {
                        this.findOne.hospitalId=res.data.hospitalId;
                        this.findOne.province=res.data.province;
                        this.findOne.city=res.data.city;
                        this.findOne.zone=res.data.zone;
                        this.findOne.province=res.data.province;
                        this.findOne.pcz=res.data.province.provinceName + res.data.city.cityName+ res.data.zone.zoneName;
                        this.findOne.name=res.data.hospitalname;
                        this.findOne.connector=res.data.contactor.username;
                        this.findOne.connectorid=res.data.contactor.userinfoId;
                        this.findOne.phone=res.data.contactor.phonenumber;
                        this.findOne.rent=res.data.rent;
                        this.findOne.card=res.data.bankcard;
                        this.findOne.share=res.data.revenueshare;
                        
                        this.findOne.distributor1=res.data.distributor.username;
                        this.findOne.distributor1num=res.data.distributor.userinfoId;
                        this.findOne.depcount=res.data.departments.length;
                        this.findOne.dept=res.data.departments;
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
        //console.log('submit!');
      },
      delete1(index, row) {
        console.log("11111111111111111");
        var hospitalId = row.hospitalId;
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            this.axios({
                    headers:  {'Content-Type': 'application/x-www-form-urlencoded'},
                    method:'delete',
                    url: 'http://localhost:9000/hospital/'+hospitalId,
                    
                })
                    .then(res => {
                        //console.log("aaaaaaa");
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
         //console.log(pindex);
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
          this.HospitalSearch.city=null;
          this.HospitalSearch.zone=null;
          
        })
        .catch(err => {
          console.error(err); 
        })
            
        },
        insertfillCity(pindex){
         //console.log(pindex);
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
         //console.log(pindex);
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
          this.HospitalSearch.zone=null;
          
        })
        .catch(err => {
          console.error(err); 
        })
        },
      findDistributor(){
        this.axios({
                    headers:  {'Content-Type': 'application/x-www-form-urlencoded'},
                    method:'get',
                    url: 'http://localhost:9000/hospital/findDistributor'
                   
                })
                .then(res => {
                   this.distributors=res.data;
                  //  //console.log(this);
                   
                })
               .catch(err => {
                   console.error(err); 
               })
      },
      onSearch(){
        var currentPage = this.currentPage;
        var hospitalSearch1 = this.HospitalSearch;
        //console.log(hospitalSearch1);
        this.axios({
                    headers:  {'Content-Type': 'application/x-www-form-urlencoded'},
                    method:'post',
                    url: 'http://localhost:9000/hospital/search',
                   params: {
                      
                        name:hospitalSearch1.name,
                        distributor:hospitalSearch1.distributor,
                        value1:hospitalSearch1.value1,
                        value2:hospitalSearch1.value2,
                        share:hospitalSearch1.share,
                        province:hospitalSearch1.province,
                        city:hospitalSearch1.city,
                        zone:hospitalSearch1.zone,
                        currentPage:currentPage

                        
                    }
                })
                .then(res => {
                   //console.log(11111111);
                   this.list=res.data.list;
                   this.pageSize = res.data.pb.pageSize;
                   this.totalcount = res.data.pb.totalCount;
                   //console.log(this.pageSize);
                   //console.log(this.totalcount);
                   this.loading=false;
                   
                })
               .catch(err => {
                   console.error(err); 
               })
               
              this.HospitalSearch = this.$options.data().HospitalSearch; 
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
                    url: 'http://localhost:9000/hospital/insertSave',
                    params: {
                      
                        
                        hospitalname:myInsert.name,
                        bankcard:myInsert.bank,
                        rent:myInsert.rent,
                        revenueshare:myInsert.share,
                        // create_time
                        distributorId:myDistributor,
                        contactorId:myInsert.connector,
                        provinceId:myInsert.province,
                        cityId:myInsert.city,
                        zoneId:myInsert.zone
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
      dateFormat(row, column, cellValue, index){
        

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
                   
            },
      insertReady(){
        this.axios.get("http://localhost:9000/hospital/findInsert")
        .then(res => {
          
          this.insert.connectors=res.data.connectors;
          
          
         
          this.insert.distributor1s=res.data.distributor1s;
          
          
          
          
          
        })
        .catch(err => {
          console.error(err); 
        })
        this.flag='0';
        this.centerDialogVisible = true
      }
      
    },
    
    mounted() {
      
        
         
         this.findDistributor();
         this.findProvince();
         this.onSearch();
        
      },
      watch:{
     
      'insert.rent'(newValue,oldValue){
        //console.log(newValue+ "   "+oldValue+"  ");
        if(isNaN(newValue)||(parseInt(newValue)>20))  {
          this.insert.rent = oldValue;
          
        }
      },
      'insert.bank'(newValue,oldValue){
        //console.log(newValue+ "   "+oldValue+"  ");
        if(isNaN(newValue))  {
          this.insert.bank = oldValue;
          
        }
      }
    }
  }
</script>

<style scoped>

</style>