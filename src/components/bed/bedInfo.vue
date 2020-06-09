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
        <span>请：</span>
        <el-select v-model="level" clearable  placeholder="请选择用户类型">
          <el-option
                  v-for="item in userlevel"
                  :key="item.level"
                  :label="item.label"
                  :value="item.level">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="8">
        <span>性别</span>
        <el-select v-model="sex" clearable  placeholder="请选择用户性别">
          <el-option
                  v-for="item in sexs"
                  :key="item.sex"
                  :label="item.label"
                  :value="item.sex">
          </el-option>
        </el-select>
      </el-col>
    </el-row>
    <br/>
    <el-row>
      <el-col :span="18">
        <div class="block">
          <span class="demonstration">注册日期</span>
          <el-date-picker
            v-model="timeSelect"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions">
          </el-date-picker>
          <el-button type="small">确认</el-button>
          <el-button type="small">清除</el-button>
        </div>
      </el-col>
    </el-row>
    <br/>


    <el-button type="danger" icon="el-icon-edit" circle @click="delChecked()">删除选中</el-button>
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
              
            <span>{{ props.row.createTime }}</span>
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
            <el-button type="primary" icon="el-icon-edit" circle @click="details(scope.row.bedId)"></el-button>
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
            :total="total"
            :page-count="pages">
        </el-pagination>
        
        每页显示
        <select name="" id="" v-model="pageSize" @change="findAll()">
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="15">15</option>
        </select>
        条
    </div></center>
    
   
</div>
</template>
<script>

export default {
    name:"bedInfo",
    data(){
       return {
            bedId:"",
            tableData:null,
            selectedIDs: [],
            pageNum:1,
            pageSize:15,
            total:null,
            pages:null
        }
    },
    mounted() {
        this.findAll();
    },
    methods:{
        init(){
            this.selectedIDs=[];
        },
        findAll(){
          this.axios({
                method:'get',
                url: "/bed/findAll",
                params: {
                    "pageNum":this.pageNum,
                    "pageSize":this.pageSize,
                }
            })
            .then(res => {
                console.log(res);
                this.tableData=res.data.bedList;
                this.total=res.data.pageBean.totol;
                this.pages=res.data.pageBean.pages;
            })
            .catch(err => {
                console.error(err); 
            })
        },

        show(id){
            console.log(id)
        },

        details(bedId){
            this.axios({
                method:'get',
                url: "/bed/findOne",
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

        disable(bedId){
            this.axios({
                method:'get',
                url: "/bed/disable",
                params: {
                    "bedId":bedId
                }
            })
            .then(res => {
                console.log(res.data.result+"  "+res.data.msg)
                this.$message({
                    message:res.data.msg,
                    type:'success'
                });
            })
            .catch(err => {
                console.error(err); 
            })
        },


        delChecked(){
            for(let i=0;i<this.$refs.multipleTable.selection.length;i++){
                this.selectedIDs.push(this.$refs.multipleTable.selection[i].bedId)
            }
            for(let i=0;i<this.selectedIDs.length;i++){
                console.log(this.selectedIDs[i])
            }
            console.log(this.selectedIDs);
            this.axios.post("/bed/showCheckedBedId",this.selectedIDs)
            .then(res => {
                console.log(res.data.result+"  "+res.data.msg)
            })
            .catch(err => {
                console.error(err); 
            })
            this.init();
        },
        changePageNum(pageNum){
            this.pageNum=pageNum;
            this.findAll();
        },
        
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