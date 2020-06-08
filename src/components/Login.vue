<template>
  <div class="login">
    <div class="login-box">
      <div class="login-head">
        <img src="@/assets/img/1.jpg" alt="">
      </div>
      <el-form  class="login-form">
        <el-form-item prop="username">
          <el-input prefix-icon="iconfont icon-user"
                    v-model="loginForm.username"
                    placeholder="请输入账号"
                   ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input prefix-icon="iconfont icon-3702mima"
                    placeholder="请输入密码"
                    v-model="loginForm.password"
                    type="password"></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" >登录</el-button>
          <el-button type="info" >重置</el-button>
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
              { required: true, message: '请输入工号', trigger: 'blur' },
              { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
            ],
            password: [
              { required: true, message: '请输入密码', trigger: 'blur' },
              { min: 4, max: 16, message: '长度在 4 到 16 个字符', trigger: 'blur' }
            ]
          }
        }
      },
    }
</script>

<style lang="less"  scoped>
  .login {
    background-color: #2b4b6b;
    height: 100%;
  }
  .login-box {
    height: 300px;
    width: 450px;
    background-color: #fff;
    border-radius: 5px;
    position: absolute;
    top: 50%;
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
</style>
