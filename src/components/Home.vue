<template>
  <el-container>
    <!-- 头部 -->
    <el-header>
      <div class="left">
        <img src="../assets/imgs/shop.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <div class="right">
        <span>欢迎您: {{ userInfo.username }}</span>
        <el-button type="danger" size="mini" @click="logout">退出</el-button>
      </div>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">
        <el-menu default-active="2" class="el-menu-vertical-demo">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>导航一</span>
            </template>
            <el-menu-item index="1-1">选项1</el-menu-item>
            <el-menu-item index="1-2">选项2</el-menu-item>
            <el-menu-item index="1-3">选项3</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主体 -->
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      userInfo: null,
    };
  },
  created() {
    this.userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    this.getMenuList();
  },
  methods: {
    logout() {
      this.$confirm("确定退出登录吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          sessionStorage.clear();
          this.$router.push("/login");
        })
        .catch(() => {});
    },
    async getMenuList() {
      const { data: res } = await this.$http.get("menus");
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      this.menuList = res.data;
      console.log(this.menuList);
    },
  },
};
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
}

.el-header {
  background: url("../assets/imgs/header_bg.gif") repeat-x center;
  height: 50px !important;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;

  .left {
    display: flex;
    align-items: center;
    img {
      width: 40px;
      margin-right: 20px;
    }
    span {
      font-size: 20px;
    }
  }
  .right {
    span {
      margin-right: 10px;
    }
  }
}
</style>