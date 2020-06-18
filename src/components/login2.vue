<template>
  <div class="homepage-hero-module">
    <div class="video-container">
      <div :style="fixStyle" class="filter">
        <div class="login">
          <div class="login-box">
            <div class="login-head">
              佳陪陪护床
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
                          type="password"></el-input>
              </el-form-item>
              <el-form-item class="btns">
                <el-button type="primary"  @click="loginValidate">登录</el-button>
                <el-button type="info" @click="loginFormReset">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
      <video :style="fixStyle" autoplay loop class="fillWidth" v-on:canplay="canplay">
        <source src="../assets/mp4/25.mp4" type="video/mp4"/>
        浏览器不支持 video 标签，建议升级浏览器。
        <source src="../assets/mp4/25.mp4" type="video/webm"/>
        浏览器不支持 video 标签，建议升级浏览器。
      </video>
      <div class="poster hidden" v-if="!vedioCanPlay">
        <img :style="fixStyle" src="../assets/mp4/25.mp4" alt="">
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: "login2",
      data() {
        return {
          vedioCanPlay: false,
          fixStyle: '',
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
        canplay() {
          this.vedioCanPlay = true
        },
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
      },
      mounted: function() {
        window.onresize = () => {
          const windowWidth = document.body.clientWidth
          const windowHeight = document.body.clientHeight
          const windowAspectRatio = windowHeight / windowWidth
          let videoWidth
          let videoHeight
          if (windowAspectRatio < 0.5625) {
            videoWidth = windowWidth
            videoHeight = videoWidth * 0.5625
            this.fixStyle = {
              height: windowWidth * 0.5625 + 'px',
              width: windowWidth + 'px',
              'margin-bottom': (windowHeight - videoHeight) / 2 + 'px',
              'margin-left': 'initial'
            }
          } else {
            videoHeight = windowHeight
            videoWidth = videoHeight / 0.5625
            this.fixStyle = {
              height: windowHeight + 'px',
              width: windowHeight / 0.5625 + 'px',
              'margin-left': (windowWidth - videoWidth) / 2 + 'px',
              'margin-bottom': 'initial'
            }
          }
        }
        window.onresize()
      }
    }
</script>

<style scoped>
  .homepage-hero-module,
  .video-container {
    position: relative;
    height: 100vh;
    overflow: hidden;
  }

  .video-container .poster img,
  .video-container video {
    z-index: 0;
    position: absolute;
  }

  .video-container .filter {
    z-index: 1;
    position: absolute;
    background: rgba(0, 0, 0, 0.1);
  }

  .login {
    height: 100%;
  }
  .login-box {
    height: 300px;
    width: 400px;
    background-color: rgba(255,255,255,0.2);
    border-radius: 5px;
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%,-50%);
  }
  .login-head {
    text-align:center;
    margin-top: 35px;
    font-size: 40px;
    font-weight: bold;
    font-family: "喜鹊聚珍体 regular";
    color: darkcyan;
    -webkit-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    user-select:none;
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

</style>

