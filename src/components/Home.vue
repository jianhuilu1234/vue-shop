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
      <el-aside :width="isCollapse ? '64px': '200px'">
        <div class="toggle-button" @click="isCollapse=!isCollapse">|||</div>
        <el-menu
          :default-active="$route.path"
          class="el-menu-vertical-demo"
          unique-opened
          router
          :collapse="isCollapse" :collapse-transition="false"
        >
          <el-submenu
            :index="item.id + ''"
            v-for="item in menuList"
            :key="item.id"
          >
            <template slot="title">
              <i :class="iconObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
            >
              <i class="el-icon-menu"></i>
              {{ subItem.authName }}
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主体 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      userInfo: null,
      menuList: [],
      // 图标样式对象
      iconObj: {
        201: "iconfont icon-shouye",
        125: "iconfont icon-users",
        103: "iconfont icon-tijikongjian",
        101: "iconfont icon-shangpin",
        102: "iconfont icon-danju",
      },
      isCollapse: false,
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
.el-aside {
  .el-menu {
    border-right: 0;
    .iconfont {
      margin-right: 10px;
    }
  }

  .toggle-button {
    background: #60779d;
    font-size: 10px;
    line-height: 24px;
    text-align: center;
    color: white;
    letter-spacing: 0.2rem;
    cursor: pointer;
  }
}
.el-main{
    background: #eaedf1;
}
</style>