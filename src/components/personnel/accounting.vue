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
      <el-col :span="18">
        <div class="block">
          <span class="demonstration">加入日期</span>
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
    <br>
    <div>
      <el-divider content-position="left">
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="dialogAddVisible = true">添加会计</el-button>
        <el-button type="success" icon="el-icon-download" @click="downloadXls">导出报表</el-button>
        <i class="el-icon-user"></i>  会计总数:{{countAccounting}}
      </el-divider>
    </div>
    <el-table
      v-loading="loading"
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column
        prop="username"
        label="会计账号"
        width="100">
      </el-table-column>
      <el-table-column
        prop="name"
        label="会计姓名"
        >
      </el-table-column>
      <el-table-column
        prop="gender"
        label="性别"
        >
        <template slot-scope="scope">{{ scope.row.gender | genderFormat }}</template>
      </el-table-column>
      <el-table-column
        prop="phonenumber"
        label="手机号码"
        width="150">
      </el-table-column>
      <el-table-column
        prop="wechat"
        label="微信"
        width="100">
      </el-table-column>
      <el-table-column
        prop="email"
        label="电子邮箱"
        width="200">
      </el-table-column>
      <el-table-column
        prop="birth"
        label="出生日期"
        >
        <template slot-scope="scope">{{ scope.row.birth | dateFormat2 }}</template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="加入时间"
        width="200">
        <template slot-scope="scope">{{ scope.row.createTime | dateFormat }}</template>
      </el-table-column>
      <el-table-column
        prop=""
        label="操作"
        width="150">
        <template slot-scope="scope">
          <el-button type="primary"  size="small" plain @click="showUpdate(scope.row.userinfoId,scope.row.name,scope.row.phonenumber,scope.row.wechat,scope.row.email,scope.row.isdelete)">编辑信息</el-button>
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
    <el-dialog title="编辑会计信息" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="addRules" ref="updateForm">
        <el-form-item label="会计姓名" prop="name" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"
                    ></el-input>
        </el-form-item>
        <el-form-item label="会计手机号码" prop="phonenumber" :label-width="formLabelWidth">
          <el-input v-model="form.phonenumber" autocomplete="off"
                    ></el-input>
        </el-form-item>
        <el-form-item label="会计微信" prop="wechat" :label-width="formLabelWidth">
          <el-input v-model="form.wechat" autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="会计邮箱" prop="email" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="账号是否启用"  :label-width="formLabelWidth">
          <el-switch
            v-model="form.isdelete"
            active-text="禁用"
            inactive-text="启用">
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="resetPs">重置密码</el-button>
        <el-button type="primary" @click="updateValidate">保 存</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="添加会计信息" :visible.sync="dialogAddVisible">
      <el-form :model="add" :rules="addRules" ref="addForm">
        <el-form-item label="登录账户" prop="username" :label-width="formLabelWidth">
          <el-input v-model="add.username" autocomplete="off"
                    ></el-input>
        </el-form-item>
        <el-form-item label="会计姓名" prop="name" :label-width="formLabelWidth">
          <el-input v-model="add.name" autocomplete="off"
                    ></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="phonenumber" :label-width="formLabelWidth">
          <el-input v-model="add.phonenumber" autocomplete="off"
                    ></el-input>
        </el-form-item>
        <el-form-item label="微信" prop="wechat" :label-width="formLabelWidth">
          <el-input v-model="add.wechat" autocomplete="off"
                    ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email" :label-width="formLabelWidth">
          <el-input v-model="add.email" autocomplete="off"
                    ></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender" :label-width="formLabelWidth">
            <el-radio v-model="add.gender" label="1"  border size="medium">男</el-radio>
            <el-radio v-model="add.gender" label="0"  border size="medium">女</el-radio>
        </el-form-item>
        <el-form-item label="出生年月" prop="birth" :label-width="formLabelWidth">
        <el-date-picker
          v-model="add.birth"
          type="date"
          placeholder="选择日期">
        </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addValidate">添 加</el-button>
        <el-button @click="addQuit">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: "accounting",
    data() {
      return {
        loading:true,
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
        timeSelect:[new Date('2019/01/01 00:00:00' ),new Date('2022/01/01 00:00:00')],
        searchInput:'',
        tableData: '',
        countAccounting:'',
        dialogFormVisible: false,
        dialogAddVisible: false,
        add: {
          username:'',
          name: '',
          phonenumber:'',
          email:'',
          wechat:'',
          gender:'',
          birth:''
        },
        addRules: {
          username: [
            { required: true, message: '请输入账号', trigger: 'blur' },
            { min: 6, max: 15, message: '请输入6-15位字符', trigger:  ['blur', 'change'] },
            { pattern: /^[A-Za-z0-9]+$/, message: '只能输入字母和数字，不允许输入空格等特殊符号' }
          ],
          name: [
            { required: true, message: '请输入会计姓名', trigger: 'blur' },
            { min: 2, max: 5, message: '2-5位中文字符', trigger: 'blur' },
            { pattern: /^[\u4e00-\u9fa5]+$/, message: '请输入中文汉字' }

          ],
          phonenumber: [
            { required: true, message: '请输入手机号码', trigger: 'blur' },
            { min: 11, max: 11, message: '请输入正确的11位手机号码', trigger: 'blur' },

            { pattern: /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/, message: '请输入正确的手机号码格式' }
          ],
          email: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            { min: 10, max: 22, message: '限制长度为13-22位,', trigger: ['blur', 'change'] },
            { pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/, message: '请输入正确的邮箱格式,如:xxx@xx.com' }
          ],
          wechat: [
            { required: true, message: '请输入微信', trigger: 'blur' },
            { min: 6, max: 18, message: '限制长度为6-18位,', trigger: 'blur' },
            { pattern: /^[A-Za-z0-9]+$/, message: '只能输入字母和数字，不允许输入空格等特殊符号' }
          ],
          gender: [
            { required: true, message: '请选择性别', trigger: 'blur' },
          ],
          birth: [
            { required: true, message: '请选择出生日期', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 18, message: '限制长度为6-18位,', trigger: 'blur' },
            { pattern: /^[a-zA-Z]\w{5,17}$/, message: '以字母开头，只能包含字母、数字和下划线' }
          ],
        },
        form: {
          userinfoId:'',
          name: '',
          phonenumber:'',
          email:'',
          wechat:'',
          gender:'',
          isdelete:'',
        },
        formLabelWidth: '120px',
        pageNum:1,
        pageSize:15,
        total:null,
        pages:null,
      }
    },
    methods:{
      resetPs(){
        this.axios({
          headers:  {'Content-Type': 'application/x-www-form-urlencoded'},
          method:'post',
          url: 'http://localhost:9000/resetPassword',
          params:{
            userinfoId:this.form.userinfoId,
          }
        })
          .then(res => {
            this.$message({
              message: '密码重置成功！',
              type: 'success'
            });
          })
          .catch(err => {
            console.error(err);
          })
      },
      downloadXls(){
        let params = "?";
        params+="phonenumber="+this.searchInput+"&";
        params+="startTime="+new Date(this.timeSelect[0]).toLocaleDateString()+"&";
        params+="endTime="+new Date(this.timeSelect[1]).toLocaleDateString();
        console.log(params);
        window.location.href="http://localhost:9000/downloadAccount"+params;
      },
      clearAll(){
        this.timeSelect=[new Date('2019/01/01 00:00:00' ),new Date('2022/01/01 00:00:00')];
        this.searchInput=''
      },
      showUpdate(userinfoId,name,phonenumber,wechat,email,isdelete){
        this.dialogFormVisible=true;
        this.form.userinfoId=userinfoId;
        this.form.name=name;
        this.form.phonenumber=phonenumber;
        this.form.wechat=wechat;
        this.form.email=email;
        this.form.isdelete=isdelete;
      },
      updateYes(){
        this.axios({
          headers:  {'Content-Type': 'application/x-www-form-urlencoded'},
          method:'post',
          url: 'http://localhost:9000/updateAccounting',
          params:{
            userinfoId:this.form.userinfoId,
            name:this.form.name,
            phonenumber:this.form.phonenumber,
            email:this.form.email,
            wechat:this.form.wechat,
            password:this.form.password,
            isdelete:this.form.isdelete
          }
        })
          .then(res => {
            this.$message({
              message: '修改成功！',
              type: 'success'
            });
            this.dialogFormVisible=false;
            this.findAllAccounting()
          })
          .catch(err => {
            console.error(err);
          })
      },
      addValidate() {
        this.$refs.addForm.validate((validate) => {
          if (!validate) return false
          this.addOne()
        })
      },
      updateValidate(){
        this.$refs.updateForm.validate((validate) => {
          if (!validate) return false
          this.updateYes()
        })
      },
      addOne(){
        this.axios({
          headers:  {'Content-Type': 'application/x-www-form-urlencoded'},
          method:'post',
          url: 'http://localhost:9000/addAccounting',
          params:{
            username:this.add.username,
            name: this.add.name,
            phonenumber:this.add.phonenumber,
            email:this.add.email,
            wechat:this.add.wechat,
            gender:this.add.gender,
            birth:new Date(this.add.birth).toLocaleDateString(),
          }
        })
          .then(res => {
            console.log(res);
            this.$message({
              message: '数据添加成功！',
              type: 'success'
            });
            this.findAllAccounting();
            this.dialogAddVisible=false;
            this.add= {
              username:'',
              name: '',
              phonenumber:'',
              email:'',
              wechat:'',
              gender:'',
              birth:''
            }
          })
          .catch(err => {
            console.error(err);
          })

      },
      addQuit(){
        this.dialogAddVisible=false;
        this.add= {
          username:'',
            name: '',
            phonenumber:'',
            email:'',
            wechat:'',
            gender:'',
            birth:''
        }
      },
      findAllAccounting(){
        this.loading=true;
        this.axios({
          headers:  {'Content-Type': 'application/x-www-form-urlencoded'},
          method:'get',
          url: 'http://localhost:9000/getAllAccounting',
          params:{
            "pageNum":this.pageNum,
            "pageSize":this.pageSize,
            "phonenumber":this.searchInput,
            startTime:new Date(this.timeSelect[0]).toLocaleDateString(),
            endTime:new Date(this.timeSelect[1]).toLocaleDateString(),
          }
        })
          .then(res => {
            console.log(res.data);
            this.loading=false;
            this.tableData = res.data.accountingList;
            this.countAccounting = res.data.countAccounting;
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
        this.findAllAccounting();
      },
    },
    created() {
      if (this.$store.state.roleId !=2&this.$store.state.roleId !=1) {
        this.$message({
          message: '你没有相应的权限',
          type: 'warning',
        });
        this.$router.push('/Main');
      }
    },
    mounted() {
      this.findAllAccounting()
    },
    filters:{//局部过滤器
      "genderFormat":function(value){
        return value==true?'男':'女';
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
      "dateFormat2":function(dataStr) {
        var dt = new Date(dataStr);
        // yyyy-mm-dd
        var y = dt.getFullYear();
        var m = dt.getMonth() + 1;
        var d = dt.getDate();
        return y + "年" + m + "月" + d + "日"
      },

    }
  }
</script>
<style scoped>

</style>
