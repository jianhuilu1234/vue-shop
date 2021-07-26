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
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="btnDisabled"
            @click="addDialogVisible = true"
            >添加属性</el-button
          >
          <el-table :data="paramsData" border stripe>
            <el-table-column label="明细" type="expand"></el-table-column>
            <el-table-column label="序号" type="index"></el-table-column>
            <el-table-column
              label="属性名称"
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
      </el-tabs>

      <!-- 添加对话框 -->
      <el-dialog
        :title="'添加' + title"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="addDialogClosed"
      >
        <el-form
          :model="addForm"
          :rules="addFormRules"
          ref="addFormRef"
          label-width="100px"
        >
          <el-form-item :label="title" prop="attr_name">
            <el-input v-model="addForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addParams">确 定</el-button>
        </span>
      </el-dialog>
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
      addDialogVisible: false,
      paramsData: [],
      addForm: {},
      addFormRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
        ],
      },
    };
  },
  computed: {
    cateId() {
      return this.selectedKeys.length === 3 ? this.selectedKeys[2] : null;
    },
    // 是否禁用按钮
    btnDisabled() {
      return this.selectedKeys.length === 3 ? false : true;
    },

    // 添加对话框的标题
    title() {
      return this.activeName === "many" ? "动态参数" : "静态属性";
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
    handleClick() {
      this.getParamsData();
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

      this.paramsData = res.data;
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    addParams() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) {
          return;
        }
        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName,
          }
        );
        if(res.meta.status !== 201){
          return this.$message.error('添加参数失败')
        }
        this.addDialogVisible = false
        this.getParamsData()
        this.$message.success('添加参数成功!')
      });
    },
  },
};
</script>

<style lang="less" scoped>
.cat_select {
  margin: 15px 0;
}
</style>