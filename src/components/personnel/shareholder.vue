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
        <span>人员角色</span>
        <el-select v-model="role" clearable  placeholder="请选择人员角色">
          <el-option
            v-for="item in userlevel"
            :key="item.level"
            :label="item.label"
            :value="item.level">
          </el-option>
        </el-select>
      </el-col>
    </el-row>
    <br/>
    <el-row>
      <el-col :span="18">
        <div class="block">
          <span class="demonstration">创建日期</span>
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
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="dialogAddVisible = true">添加人员</el-button>
        <el-button type="success" icon="el-icon-download" @click="downloadXls">导出报表</el-button>
        <i class="el-icon-user"></i>  人员总数:{{countShareholder}}
      </el-divider>
    </div>
    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="手机号码">
              <span>{{ props.row.phonenumber }}</span>
            </el-form-item>
            <el-form-item label="微信">
              <span>{{ props.row.wechat }}</span>
            </el-form-item>
            <el-form-item label="电子邮箱">
              <span>{{ props.row.email }}</span>
            </el-form-item>
            <el-form-item label="出生日期">
              <span>{{ props.row.birth | dateFormat2  }}</span>
            </el-form-item>
            <el-form-item label="创建时间">
              <span>{{ props.row.createTime | dateFormat  }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        prop="username"
        label="人员账号"
        width="100">
      </el-table-column>
      <el-table-column
        prop="name"
        label="人员姓名"
        width="100"
      >
      </el-table-column>
      <el-table-column
        prop="roles[0].rolename"
        label="人员角色"
        width="70"
      >
      </el-table-column>
      <el-table-column
        prop="gender"
        label="性别"
        width="70"
      >
        <template slot-scope="scope">{{ scope.row.gender | genderFormat }}</template>
      </el-table-column>
      <el-table-column
        prop="shareholder.shareholderMoeny"
        label="投资金额(万元)"
      >
        <template slot-scope="scope">{{ scope.row.shareholder | moneyFormat }}</template>
      </el-table-column>
      <el-table-column
        label="收益分成"
      >
        <template slot-scope="scope">{{ scope.row.shareholder | killFormat }}</template>
      </el-table-column>
      <el-table-column
        prop="shareholder.shareholderBankcard"
        label="银行卡号"
      >
        <template slot-scope="scope">{{ scope.row.shareholder | cardFormat }}</template>
      </el-table-column>
      <el-table-column
        prop="shareholder.shareholderTime"
        label="入伙时间"
      >
        <template slot-scope="scope">{{ scope.row.shareholder | dateFormat3 }}</template>
      </el-table-column>
      <el-table-column
        prop=""
        label="操作"
        width="200">
        <template slot-scope="scope">
          <el-button type="primary"  size="small" plain @click="showUpdate(scope.row)">编辑信息</el-button>
          <el-button type="success"  size="small" plain @click="showTable(scope.row.userinfoId,scope.row.roles[0].rolename)">负责医院</el-button>
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
    <el-dialog title="编辑人员信息" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="addRules" ref="updateForm">
        <el-form-item label="人员姓名" prop="name" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="人员手机号码" prop="phonenumber" :label-width="formLabelWidth">
          <el-input v-model="form.phonenumber" autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="人员微信" prop="wechat" :label-width="formLabelWidth">
          <el-input v-model="form.wechat" autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="人员邮箱" prop="email" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色切换"  :label-width="formLabelWidth">
          <el-switch
            v-model="form.level"
            active-text="分销商"
            inactive-text="股东">
          </el-switch>
        </el-form-item>
        <el-form-item label="账号是否启用"  :label-width="formLabelWidth">
          <el-switch
            v-model="form.isdelete"
            active-text="禁用"
            inactive-text="启用">
          </el-switch>
        </el-form-item>
        <el-form-item label="投资金额"  :label-width="formLabelWidth" >
        <el-input v-model="form.shareholder.shareholderMoeny" autocomplete="off" style="width: 300px"
                  onkeyup="this.value=this.value.replace(/[^0-9]\D*$/,'');"
                  maxlength="20"
        ></el-input><span style="font-size: 12px;color: red">注:单位(万元)</span>
        </el-form-item>
        <el-form-item label="股东分成"  :label-width="formLabelWidth" >
          <el-input v-model="form.shareholder.shareholderRevenueshare" autocomplete="off" style="width: 300px"
                    onkeyup="this.value=this.value.replace(/[^0-9]\D*$/,'');"
                    maxlength="20"
          ></el-input>
          <span style="font-size: 12px;color: red">注:例:输入10=>10%</span>
        </el-form-item>
        <el-form-item label="银行卡号"  :label-width="formLabelWidth" >
          <el-input v-model="form.shareholder.shareholderBankcard" autocomplete="off" style="width: 300px"
                    onkeyup="this.value=this.value.replace(/[^0-9]\D*$/,'');"
                    maxlength="20"
          ></el-input><span style="font-size: 12px;color: red"></span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="resetPs">重置密码</el-button>
        <el-button type="primary" @click="updateValidate">保 存</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="添加人员信息" :visible.sync="dialogAddVisible">
      <el-form :model="add" :rules="addRules" ref="addForm">
        <el-form-item label="登录账户" prop="username" :label-width="formLabelWidth">
          <el-input v-model="add.username" autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="人员姓名" prop="name" :label-width="formLabelWidth">
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
        <el-form-item label="人员角色" prop="level" :label-width="formLabelWidth">
          <el-radio v-model="add.level" label="1"  border size="medium">股东</el-radio>
          <el-radio v-model="add.level" label="0"  border size="medium">分销商</el-radio>
        </el-form-item>
        <el-form-item label="出生年月" prop="birth" :label-width="formLabelWidth">
          <el-date-picker
            v-model="add.birth"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="入伙时间" :label-width="formLabelWidth">
          <el-date-picker
            v-model="add.rbirth"
            type="date"
            placeholder="选择日期">
          </el-date-picker><span style="font-size: 12px;color: red">注:仅添加股东角色选择有效</span>
        </el-form-item>
        <el-form-item label="投资金额"  :label-width="formLabelWidth" >
          <el-input v-model="add.money" autocomplete="off" style="width: 300px"
                    onkeyup="this.value=this.value.replace(/[^0-9]\D*$/,'');"
                    maxlength="20"
          ></el-input><span style="font-size: 12px;color: red">注:仅添加股东角色输入有效,单位(万元)</span>
        </el-form-item>
        <el-form-item label="股东分成"  :label-width="formLabelWidth" >
          <el-input v-model="add.share" autocomplete="off" style="width: 300px"
                    onkeyup="this.value=this.value.replace(/[^0-9]\D*$/,'');"
                    maxlength="20"
          ></el-input>
          <span style="font-size: 12px;color: red">注:仅添加股东角色输入有效,例:输入10=>10%</span>
        </el-form-item>
        <el-form-item label="银行卡号"  :label-width="formLabelWidth" >
          <el-input v-model="add.card" autocomplete="off" style="width: 300px"
                    onkeyup="this.value=this.value.replace(/[^0-9]\D*$/,'');"
                    maxlength="20"
          ></el-input><span style="font-size: 12px;color: red">注:仅添加股东角色输入有效</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addValidate">添 加</el-button>
        <el-button @click="addQuit">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="负责医院" :visible.sync="dialogTableVisible">
      <div>
        <el-divider content-position="left"><i class="el-icon-document-checked"></i>   医院总数:{{countHospital}}</el-divider>
      </div>
      <el-table :data="gridData">
        <el-table-column property="createTime" label="时间">
          <template slot-scope="scope">{{ scope.row.createTime | dateFormat }}</template>
        </el-table-column>
        <el-table-column property="hospitalname" label="医院"  ></el-table-column>
        <el-table-column property="userInfo.name" label="医院对接人"  ></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "shareholder",
    data() {
      return {
        userlevel: [{
          level: '1',
          label: '股东'
        }, {
          level: '0',
          label: '分销商'
        }],
        role: '',
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
        countShareholder:'',
        countHospital:'',
        gridData:'',
        dialogFormVisible: false,
        dialogTableVisible:false,
        dialogAddVisible: false,
        add: {
          username:'',
          name: '',
          phonenumber:'',
          email:'',
          wechat:'',
          gender:'',
          birth:'',
          level:'',
          rbirth:'',
          money:'',
          share:'',
          card:'',
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
          level: [
            { required: true, message: '请选择人员类型', trigger: 'blur' }
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
          level:'',
          shareholder:''
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
        params+="role="+this.role+"&";
        params+="startTime="+new Date(this.timeSelect[0]).toLocaleDateString()+"&";
        params+="endTime="+new Date(this.timeSelect[1]).toLocaleDateString();
        console.log(params);
        window.location.href="http://localhost:9000/downloadShareholder"+params;
      },
      showTable(userinfoId,rolename){
        if (rolename=='股东'){
          this.$message.error('股东不负责医院');
        }else if(rolename=='分销商'){
          this.axios({
            headers:  {'Content-Type': 'application/x-www-form-urlencoded'},
            method:'post',
            url: 'http://localhost:9000/showInvestment',
            params:{
              userinfoId:userinfoId,
            }
          })
            .then(res => {
              this.$message({
                message: '数据获取成功！',
                type: 'success'
              });
              this.dialogTableVisible=true;
              this.countHospital=res.data.countHospital;
              this.gridData=res.data.hospitalList;
              console.log(this.gridData);
            })
            .catch(err => {
              console.error(err);
            })
        }
      },
      clearAll(){
        this.timeSelect=[new Date('2019/01/01 00:00:00' ),new Date('2022/01/01 00:00:00')];
        this.searchInput='';
        this.role='';
      },
      showUpdate(row){
        console.log(row.roles[0].rolename);
        this.dialogFormVisible=true;
        this.form.userinfoId=row.userinfoId;
        this.form.name=row.name;
        this.form.phonenumber=row.phonenumber;
        this.form.wechat=row.wechat;
        this.form.email=row.email;
        this.form.isdelete=row.isdelete;
        if(row.roles[0].rolename=='股东'){
          this.form.level=true;
        }else if(row.roles[0].rolename=='分销商'){
          this.form.level=false;
        }
        this.form.shareholder=row.shareholder;
        console.log(this.form.level);
      },
      updateYes(){
        this.axios({
          headers:  {'Content-Type': 'application/x-www-form-urlencoded'},
          method:'post',
          url: 'http://localhost:9000/updateShareholder',
          params:{
            userinfoId:this.form.userinfoId,
            name:this.form.name,
            phonenumber:this.form.phonenumber,
            email:this.form.email,
            wechat:this.form.wechat,
            password:this.form.password,
            isdelete:this.form.isdelete,
            level:this.form.level,
            shareholderRevenueshare:this.form.shareholder.shareholderRevenueshare,
            shareholderTime:new Date(this.form.shareholder.shareholderTime).toLocaleDateString(),
            shareholderBankcard:this.form.shareholder.shareholderBankcard,
            shareholderMoeny:this.form.shareholder.shareholderMoeny,
          }
        })
          .then(res => {
            this.$message({
              message: '修改成功！',
              type: 'success'
            });
            this.dialogFormVisible=false;
            this.findAllShareholder()
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
          url: 'http://localhost:9000/addShareholder',
          params:{
            username:this.add.username,
            name: this.add.name,
            phonenumber:this.add.phonenumber,
            email:this.add.email,
            wechat:this.add.wechat,
            gender:this.add.gender,
            birth:new Date(this.add.birth).toLocaleDateString(),
            level:this.add.level,
            shareholderTime:new Date(this.add.rbirth).toLocaleDateString(),
            shareholderMoeny:this.add.money,
            shareholderRevenueshare:this.add.share,
            shareholderBankcard:this.add.card
          }
        })
          .then(res => {
            console.log(res);
            this.$message({
              message: '数据添加成功！',
              type: 'success'
            });
            this.findAllShareholder();
            this.dialogAddVisible=false;
            this.addClear();
          })
          .catch(err => {
            console.error(err);
          })

      },
      addClear(){
        this.add= {
          username:'',
          name: '',
          phonenumber:'',
          email:'',
          wechat:'',
          gender:'',
          birth:'',
          rbirth:'',
          money:'',
          share:'',
          card:''
        }
      },
      addQuit(){
        this.dialogAddVisible=false;
        this.addClear();
      },
      findAllShareholder(){
        this.loading=true;
        this.axios({
          headers:  {'Content-Type': 'application/x-www-form-urlencoded'},
          method:'get',
          url: 'http://localhost:9000/getAllShareholder',
          params:{
            "pageNum":this.pageNum,
            "pageSize":this.pageSize,
            "phonenumber":this.searchInput,
            role:this.role,
            startTime:new Date(this.timeSelect[0]).toLocaleDateString(),
            endTime:new Date(this.timeSelect[1]).toLocaleDateString(),

          }
        })
          .then(res => {
            console.log(res.data);
            this.loading=false;
            this.tableData = res.data.shareholderList;
            this.countShareholder = res.data.countShareholder;
            this.total=res.data.pageBean.total;
            this.pages=res.data.pageBean.pages;
            console.log(this.tableData);
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
        this.findAllShareholder();
      },
    },
    mounted() {
      this.findAllShareholder()
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
      dateFormat3:function(dataStr) {
        if (dataStr.shareholderTime==null){
          return "无"
        }
        var dt = new Date(dataStr.shareholderTime);
        // yyyy-mm-dd
        var y = dt.getFullYear();
        var m = dt.getMonth() + 1;
        var d = dt.getDate();
        return y + "年" + m + "月" + d + "日"
      },
      "moneyFormat":function (data) {
        if(data.shareholderMoeny==null){
          return "无"
        }
        return data.shareholderMoeny+"￥"
      },
      "cardFormat":function (data) {
        if(data.shareholderBankcard==null){
          return "无"
        }
        return data.shareholderBankcard
      },
      "killFormat":function (data) {
        if(data.shareholderRevenueshare==null){
          return "无"
        }
          return data.shareholderRevenueshare+"%"
      }

    }
  }
</script>
<style scoped>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }

</style>
