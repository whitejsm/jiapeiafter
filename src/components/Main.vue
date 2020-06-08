<template>
  <div>
    <el-container style="height: 1000px; border: 1px solid #eee">
      <el-header style="text-align: right; font-size: 12px">
        <el-dropdown>
          <i class="el-icon-setting" style="margin-right: 15px"></i>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>查看</el-dropdown-item>
            <el-dropdown-item>新增</el-dropdown-item>
            <el-dropdown-item>删除</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <span>王小虎</span>
      </el-header>
      <el-container>
        <el-aside  style="width: 255px;background-color: rgb(238, 241, 246)">
          <el-menu :default-active="this.$route.path"
                   router
                   class="el-menu-vertical-demo"
                   background-color="#545c64"
                   text-color="#fff"
                   active-text-color="#fff" >
            <div v-for="permission in permissionList" index="">
              <el-submenu v-for="(childOne, childOneIndex) in permission.children" :key="childOneIndex"
                          :index="childOneIndex + ''">
                <template slot="title"><i class="el-icon-message"></i>
                  {{childOne.permissionname}}
                </template>
                <el-menu-item style="width: 250px" v-for="childTwo in childOne.children"
                                    :key="childTwo.id" :index="childTwo.url">
                  <el-menu-item>
                    <i class="el-icon-message"></i>{{childTwo.permissionname}}
                  </el-menu-item>
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

  </div>
</template>

<script>
    export default {
        data() {
            return {
              tableData: [],
                searchInput: '',
                value1: '',
                value: '',
                permissionList: null,
            }
        },
        methods: {
            handleOpen(key, keyPath) {
                console.log(key, keyPath);
            },
            handleClose(key, keyPath) {
                console.log(key, keyPath);
            },
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
            })

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
</style>
