<template>
  <div>
    <el-row>
      <el-col :span="8">
        <el-input placeholder="请输入手机号码" v-model="searchInput" size="200px">
          <el-button slot="append" icon="el-icon-search"></el-button>
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

    <el-table
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column
        prop="phonenumber"
        label="手机号码"
        width="100">
      </el-table-column>
      <el-table-column
        prop="wechat"
        label="微信"
        width="100">
      </el-table-column>
      <el-table-column
        prop="gender"
        label="性别"
        width="100">
        <template slot-scope="scope">{{ scope.row.gender | genderFormat }}</template>
      </el-table-column>
      <el-table-column
        prop="isuser"
        label="用户类型"
        width="100">
        <template slot-scope="scope">{{ scope.row.isuser | userFormat }}</template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="注册时间"
        width="200">
        <template slot-scope="scope">{{ scope.row.createTime | dateFormat }}</template>
      </el-table-column>
      <el-table-column
        prop=""
        label="订单总数"
        >
      </el-table-column>
      <el-table-column
        prop=""
        label="累计消费"
        >
      </el-table-column>
      <el-table-column
        prop=""
        label="下单医院"
        >
      </el-table-column>
      <el-table-column
        prop=""
        label="操作"
        width="200">
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="1000">
    </el-pagination>
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
          sex: '0',
          level: '新用户'
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
        timeSelect:'',
        tableData: ''
      }
    },
    mounted() {
      this.axios({
        headers:  {'Content-Type': 'application/x-www-form-urlencoded'},
        method:'get',
        url: 'http://localhost:9000/getAllCustomer',
      })
        .then(res => {
          console.log(res.data);
          this.tableData = res.data.customerList;
        })
        .catch(err => {
          console.error(err);
        })
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
      }
    }
  }
</script>

<style scoped>

</style>
