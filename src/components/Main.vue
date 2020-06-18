<template>
  <div>
    <el-container style="height: 1000px; border: 1px solid #eee">
      <el-header style="text-align: right; font-size: 12px" >
        <div style="float:left;font-size: 25px">
          佳陪后台管理系统
        </div>
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            {{this.$store.state.userName}} ({{this.$store.state.roleName}})
              <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="a">修改密码</el-dropdown-item>
            <el-dropdown-item command="b">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-container>
        <el-aside  style="width: 255px;background-color: #545c64">
          <el-menu :default-active="this.$route.path"
                   router
                   class="el-menu-vertical-demo"
                   background-color="#545c64"
                   text-color="#fff"
                   active-text-color="#fff"
                   style="border-right: 0px">
            <div v-for="(permission,i) in permissionList" index="" :key="i">
              <el-submenu v-for="(childOne, childOneIndex) in permission.children" :key="childOneIndex"
                          :index="childOneIndex + ''">
                <template slot="title"><i class="el-icon-message"></i>
                  {{childOne.permissionname}}
                </template>
                <el-menu-item style="width: 250px" v-for="childTwo in childOne.children"
                                    :key="childTwo.id" :index="childTwo.url">
<!--                  <el-menu-item>-->
                    <i class="el-icon-message"></i>{{childTwo.permissionname}}
<!--                  </el-menu-item>-->
                </el-menu-item>
              </el-submenu>
            </div>
          </el-menu>
        </el-aside>

        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
    <el-dialog title="修改密码" :visible.sync="dialogFormVisible" width="30%">
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="密码" prop="pass">
          <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
    export default {
        data() {

          var validatePass = (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请输入密码'));
            } else {
              let check = /^[a-zA-Z]{1}[a-zA-Z1-7]{5,17}$/;
              if (!check.test(value)) {
                callback(new Error('以字母开头，只能包含字母、数字，6-18位!'));
              }
              if (this.ruleForm.checkPass !== '') {
                this.$refs.ruleForm.validateField('checkPass');
              }
              callback();
            }
          };
          var validatePass2 = (rule, value, callback) => {
            let check = /^[a-zA-Z]{1}[a-zA-Z1-7]{5,17}$/;
            if (value === '') {
              callback(new Error('请再次输入密码'));
            } else if (value !== this.ruleForm.pass) {
              callback(new Error('两次输入密码不一致!'));
            } else if (!check.test(value)) {
              callback(new Error('以字母开头，只能包含字母、数字，6-18位!'));
            }
            else {
              callback();
            }
          };
            return {
                tableData: [],
                permissionList: null,
                userName:'',
              dialogFormVisible: false,
              ruleForm: {
                pass: '',
                checkPass: '',
              },
              rules: {
                pass: [
                  { validator: validatePass, trigger: 'blur' }
                ],
                checkPass: [
                  { validator: validatePass2, trigger: 'blur' }
                ],
              }
            };
        },
        methods: {
          submitForm(formName) {
            this.$refs[formName].validate((valid) => {
              if (valid) {
                this.axios({
                  headers:  {'Content-Type': 'application/x-www-form-urlencoded'},
                  method:'post',
                  url: 'http://localhost:9000/changePassword',
                  params:{
                    newPs:this.ruleForm.checkPass,
                  }
                })
                  .then(res => {
                    if(res.data==true){
                      this.logout();
                    }
                  })
                  .catch(err => {
                    console.error(err);
                  })
              } else {
                console.log('error submit!!');
                return false;
              }
            });
          },
          resetForm(formName) {
            this.$refs[formName].resetFields();
          },
            handleOpen(key, keyPath) {
                console.log(key, keyPath);
            },
            handleClose(key, keyPath) {
                console.log(key, keyPath);
            },
            handleCommand(command) {
              if(command=='a'){
                this.dialogFormVisible=true;
              }
              if (command=='b'){
                this.logout();
              }
            },
          logout(){
            console.log(this.$store.state.id);
            console.log("重置state");
            this.axios({
              headers:  {'Content-Type': 'application/x-www-form-urlencoded'},
              method:'get',
              url: 'http://localhost:9000/logout',
              params:{
                newPs:this.ruleForm.checkPass,
              }
            })
              .then(res => {
              })
              .catch(err => {
                console.error(err);
              })
            this.$store.commit('reset');
            console.log(this.$store.state.id);
            window.location.href = '/';
          }
        },
        created() {
          if (this.$store.state.id==null){
            window.location.href = '/';
          }
        },
      mounted() {
          this.axios({
            headers:  {'Content-Type': 'application/x-www-form-urlencoded'},
            method:'get',
            url: 'http://localhost:9000/getPermissions',
            params: {
              userInfoId:this.$store.state.id,
            }
          })
            .then(res => {
              console.log(res.data);
              this.permissionList = res.data.permissionList;

            })
            .catch(err => {
              console.error(err);
            });

          console.log(this.activeIndex);
          console.log(this.$route.path);
          this.activeIndex = this.$route.path.substring(1,this.$route.path.length);

        }
    }
</script>

<style>
  .el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
  }

  .el-aside {
    color: #333;
  }
  .el-dropdown-link {
    cursor: pointer;
    color: black;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>
