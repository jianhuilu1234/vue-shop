<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>
      <el-row class="cat_select">
        <el-col>
          <span>选择商品分类: </span>
          <el-cascader
            v-model="selectedKeys"
            :options="cateList"
            :props="selectProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="btnDisabled"
            @click="addDialogVisible = true"
            >添加参数</el-button
          >
          <el-table :data="paramsData" border stripe>
            <el-table-column label="明细" type="expand"></el-table-column>
            <el-table-column label="序号" type="index"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="removeParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="mini">配置管理</el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getCateList();
  },
  data() {
    return {
      selectedKeys: [],
      selectProps: {
        expandTrigger: "hover",
        label: "cat_name",
        value: "cat_id",
        children: "children",
      },
      cateList: [],
      activeName: "many",
      btnDisabled: true,
      addDialogVisible: true,
      paramsData: [],
    };
  },
  computed: {
    cateId() {
      return this.selectedKeys.length === 3 ? this.selectedKeys[2] : null;
    },
  },
  methods: {
    handleChange() {
      this.getParamsData();
    },
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类失败");
      }
      this.cateList = res.data;
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },

    async getParamsData() {
      // 判断是否选中三级分类，如果未选中，则要重新选择
      if (this.selectedKeys.length !== 3) {
        this.selectedKeys = [];
        this.paramsData = [];
        return;
      }

      // 根据所选分类，获取动态参数或静态属性
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: {
            sel: this.activeName,
          },
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("获取参数列表失败");
      }

      console.log(res.data);
    },
  },
};
</script>

<style lang="less" scoped>
.cat_select {
  margin: 15px 0;
}
</style>