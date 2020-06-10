<template>
  <div>
    <el-row>
      <el-col :span="8">
        <span>手机号码</span>
        <el-input placeholder="请输入手机号码" v-model="searchInput" size="200px"
                  onkeyup="this.value=this.value.replace(/[^\d]/g,'');"
                  maxlength="11">
        </el-input>
      </el-col>
    </el-row>
    <br/>
    <el-row>
      <el-col :span="8">
        <span>用户类型</span>
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
            :clearable="false"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions">
          </el-date-picker>
            <el-button type="primary" plain @click="check">查询</el-button>
            <el-button type="danger" plain @click="clearAll">清除</el-button>
        </div>
      </el-col>
    </el-row>
    <div>
      <el-divider content-position="left"><i class="el-icon-user"></i>  用户总数:{{countCustomer}}
      </el-divider>
    </div>
    <el-table
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column
        prop="name"
        label="姓名"
        width="100">
      </el-table-column>
      <el-table-column
        prop="phonenumber"
        label="手机号码"
        width="150">
      </el-table-column>
      <el-table-column
        prop="wechat"
        label="微信"
        width="150">
      </el-table-column>
      <el-table-column
        prop="gender"
        label="性别"
        width="50">
        <template slot-scope="scope">{{ scope.row.gender | genderFormat }}</template>
      </el-table-column>
      <el-table-column
        prop="isuser"
        label="用户类型"
        width="100">
        <template slot-scope="scope">{{ scope.row.isuse | userFormat }}</template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="注册时间"
        width="200">
        <template slot-scope="scope">{{ scope.row.createTime | dateFormat }}</template>
      </el-table-column>
      <el-table-column
        prop="orderCount"
        label="订单总数"
        >
      </el-table-column>
      <el-table-column
        prop="sumMoney"
        label="累计消费(元)"
        >
      </el-table-column>

      <el-table-column
        prop=""
        label="操作"
        width="200">
        <template slot-scope="scope">
          <el-button type="primary"  size="small" plain @click="showUpdate(scope.row.name,scope.row.phonenumber,scope.row.customerId,scope.row.isdelete)">编辑信息</el-button>
          <el-button type="info"  size="small" plain @click="showOrders(scope.row.customerId)">订单信息</el-button>
        </template>
      </el-table-column>

    </el-table>
    <div style="text-align: center">
      <el-pagination
        background
        layout="prev, pager, next"
        @current-change="changePageNum"
        :total="total"
        :page-count="pages"
        :page-size="pageSize"
      >
      </el-pagination>
    </div>
    <el-dialog title="编辑顾客信息" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="顾客姓名" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"
                    onkeyup="this.value=this.value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g, '');"
                    maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="顾客手机号码" :label-width="formLabelWidth">
          <el-input v-model="form.phonenumber" autocomplete="off"
                    onkeyup="this.value=this.value.replace(/[^\d]/g,'');"
                    maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="账号是否启用" :label-width="formLabelWidth">
        <el-switch
          v-model="form.status"
          active-text="禁用"
          inactive-text="启用">
        </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateYes">保 存</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="订单详情" :visible.sync="dialogTableVisible">
      <div>
        <el-divider content-position="left"><i class="el-icon-document-checked"></i>   订单总数:{{countOrders}}</el-divider>
      </div>
      <el-table :data="gridData">
        <el-table-column property="ordersId" label="订单号" width="100"></el-table-column>
        <el-table-column property="bed.department.hospital.hospitalname" label="所属医院" width="120"></el-table-column>
        <el-table-column property="bed.department.departmentname" label="所属科室"  width="100"></el-table-column>
        <el-table-column property="totalpay" label="实际支付(元)"  ></el-table-column>
        <el-table-column property="createTime" label="下单时间" width="150">
          <template slot-scope="scope">{{ scope.row.createTime | dateFormat }}</template>
        </el-table-column>
        <el-table-column property="timec" label="租用时长" width="150">
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "order",
    data() {
      return {
        sexs: [{
          sex: '1',
          label: '男'
        }, {
          sex: '0',
          label: '女'
        }],
        sex: '',
        userlevel: [{
          level: '1',
          label: '老用户'
        }, {
          level: '0',
          label: '新用户'
        }],
        level: '',
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        timeSelect:[new Date('2020/01/01 00:00:00' ),new Date('2022/01/01 00:00:00')],
        searchInput:null,
        tableData: '',
        gridData:'',
        countCustomer:'',
        dialogTableVisible: false,
        dialogFormVisible: false,
        form: {
          name: '',
          phonenumber:'',
          customerId:'',
          status:'',
        },
        formLabelWidth: '120px',
        countOrders:'',
        pageNum:1,
        pageSize:15,
        total:null,
        pages:null,
      }
    },
    methods:{
      clearAll(){
          this.timeSelect=[new Date('2020/01/01 00:00:00' ),new Date('2022/01/01 00:00:00')];
          this.level='';
          this.sex='';
          this.searchInput=''
      },
      showUpdate(name,phonenumber,customerId,isdelete){
        this.dialogFormVisible=true;
        this.form.name=name;
        this.form.phonenumber=phonenumber;
        this.form.customerId=customerId;
        this.form.status=isdelete;
      },
      showOrders(customerId){
        this.dialogTableVisible=true;
        this.axios({
          headers:  {'Content-Type': 'application/x-www-form-urlencoded'},
          method:'get',
          url: 'http://localhost:9000/findCustomerOrder',
          params:{
            customerId:customerId,
          }
        })
          .then(res => {
            console.log(res);
            this.$message({
              message: '订单数据获取成功！',
              type: 'success'
            });
            this.countOrders=res.data.countOrders;
            this.gridData=res.data.ordersList;
          })
          .catch(err => {
            console.error(err);
          })
      },
      updateYes(){
        this.axios({
          headers:  {'Content-Type': 'application/x-www-form-urlencoded'},
          method:'post',
          url: 'http://localhost:9000/updateCustomer',
          params:{
            name:this.form.name,
            phonenumber:this.form.phonenumber,
            customerId:this.form.customerId,
            isdelete:this.form.status
          }
        })
          .then(res => {
            console.log(res);
            this.$message({
              message: '数据修改成功！',
              type: 'success'
            });
            this.findAll()
          })
          .catch(err => {
            console.error(err);
          })
        this.dialogFormVisible=false;
      },
      findAll(){
        this.axios({
          headers:  {'Content-Type': 'application/x-www-form-urlencoded'},
          method:'get',
          url: 'http://localhost:9000/getAllCustomer',
          params:{
            "pageNum":this.pageNum,
            "pageSize":this.pageSize,
          }
        })
          .then(res => {
            console.log(res.data);
            this.tableData = res.data.customerList;
            this.countCustomer = res.data.countCustomer;
            this.total=res.data.pageBean.total;
            this.pages=res.data.pageBean.pages;
          })
          .catch(err => {
            console.error(err);
          })
      },
      findAllSelect(){
        this.axios({
          headers:  {'Content-Type': 'application/x-www-form-urlencoded'},
          method:'get',
          url: 'http://localhost:9000/getAllCustomerSelect',
          params:{
            "pageNum":this.pageNum,
            "pageSize":this.pageSize,
            startTime:new Date(this.timeSelect[0]).toLocaleDateString(),
            endTime:new Date(this.timeSelect[1]).toLocaleDateString(),
            "isuse":this.level,
            "gender":this.sex,
            "phonenumber":this.searchInput,
          }
        })
          .then(res => {
            console.log(res.data);
            this.tableData = res.data.customerList;
            this.countCustomer = res.data.countCustomer;
            this.total=res.data.pageBean.total;
            this.pages=res.data.pageBean.pages;
          })
          .catch(err => {
            console.error(err);
          })
      },
      changePageNum(pageNum){
        this.pageNum=pageNum;
        this.findAll();
      },
      check(){
        console.log(new Date(this.timeSelect[0]).toLocaleDateString());
        console.log(new Date(this.timeSelect[1]).toLocaleDateString());
        this.findAllSelect();
      },
    },
    mounted() {
      this.findAll()
    },
    filters:{//局部过滤器
      "genderFormat":function(value){
        return value==true?'男':'女';
      },
      "userFormat":function(value){
        return value==true?'老用户':'新用户';
      },
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
      },

    }
  }
</script>
<style scoped>

</style>
