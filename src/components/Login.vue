<template>

  <div class="login">
    <div class="bt" >
      佳陪陪护床后台管理系统
    </div>
    <div id="apppp">
      <vue-particles
        color="#dedede"
        height="700px"
        :particleOpacity="0.7"
        :particlesNumber="90"
        shapeType="circle"
        :particleSize="4"
        linesColor="#FFFFFF"
        :linesWidth="1"
        :lineLinked="true"
        :lineOpacity="1"
        :linesDistance="200"
        :moveSpeed="3"
        :hoverEffect="true"
        hoverMode="grab"
        :clickEffect="true"
        clickMode="repulse"
      >
      </vue-particles>
    </div>
    <div class="login-box">
      <div class="login-head">
        <img src="@/assets/img/1.jpg" alt="">
      </div>
      <el-form  :model="loginForm" :rules="loginRules" ref="loginForm" class="login-form">
        <el-form-item prop="username">
          <el-input prefix-icon="el-icon-user-solid"
                    v-model="loginForm.username"
                    placeholder="请输入账号"
                   ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input prefix-icon="el-icon-s-cooperation"
                    placeholder="请输入密码"
                    v-model="loginForm.password"
                    type="password"
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="loginValidate">登录</el-button>
          <el-button type="info" @click="loginFormReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
    export default {
        name: "Login",
        data () {
        return {
          loginForm: {
            username: '',
            password: ''
          },
          loginRules: {
            username: [
              { required: true, message: '请输入账号', trigger: 'blur' },
              { min: 6, max: 12, message: '请输入正确的账号格式', trigger: 'blur' }
            ],
            password: [
              { required: true, message: '请输入密码', trigger: 'blur' },
              { min: 8, max: 16, message: '请输入正确的密码格式', trigger: 'blur' }
            ]
          }
        }
      },
        methods: {
          loginFormReset () {
            this.$refs.loginForm.resetFields()
          },
          // 登录
          loginValidate () {
            this.$refs.loginForm.validate((validate) => {
              if (!validate) return false
              this.login()
            })
          },
            login() {
                //location.href="#/Main";
                this.axios({
                    headers:  {'Content-Type': 'application/x-www-form-urlencoded'},
                    method:'get',
                    url: 'http://localhost:9000/login',
                    params: {
                        uname:this.loginForm.username,
                        upass:this.loginForm.password
                    }
                })
                    .then(res => {
                        console.log(res.data.status);
                        if (res.data.status=='success'){
                          this.$store.state.id=res.data.userId;
                          this.$store.state.userName=res.data.userName;
                          this.$store.state.roleId = res.data.roleId;
                          this.$store.state.roleName = res.data.roleName;
                          this.$message({
                            message: '恭喜你登录成功！',
                            type: 'success'
                          });
                          this.$router.push('/Main');
                        }else if(res.data.status=='error'){
                          this.$message({
                            message: res.data.msg,
                            type: 'warning'
                          });
                        }
                    })
                    .catch(err => {
                        console.error(err);
                    })

            }
        }
    }

</script>

<style lang="less"  scoped>
  .login {
    overflow-y: hidden;
    padding: 0;
    margin: 0;
    height: 100%;
    background-image: linear-gradient(to bottom , #7A88FF, #7AFFAF);
  }
  .login-box {
    height: 300px;
    width: 450px;
    background-color: rgba(255,255,255,0.2);
    border-radius: 5px;
    position: absolute;
    top: 60%;
    left: 50%;
    transform: translate(-50%,-50%);
  }
  .login-head {
    width: 130px;
    height: 130px;
    border-radius: 50%;
    border: 1px solid #ddd;
    padding: 10px;
    box-shadow: 0 0 10px #ddd; /*线条阴影*/
    position: absolute;
    left: 50%;
    transform: translate(-50%,-50%);
    background-color: #eee;
    > img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
  .login-form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }
  .btns {
    display: flex;
    justify-content: flex-end;
  }
  .bt{
    font-size: 60px;
    color: beige;
    text-align: center;
    padding-top: 70px;
    z-index: 9999;
    position: absolute;
    left: 0;
    right: 0;
    -webkit-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    user-select:none;
    margin: auto;
  }
</style>
