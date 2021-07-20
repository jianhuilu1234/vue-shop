<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>

      <!-- 角色列表 -->
      <el-table :data="rolesList" border stripe>
        <el-table-column label="明细" type="expand">
          <template slot-scope="scope">
            <!-- 一级权限 -->
            <el-row
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
              :class="{ bdbottom: true, bdtop: i1 == 0, vcenter: true }"
            >
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item1.id)"
                  >{{ item1.authName }}
                </el-tag>
              </el-col>
              <el-col :span="19">
                <el-row
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                  :class="{ bdtop: i2 != 0, vcenter: true }"
                >
                  <el-col :span="6"
                    ><el-tag
                      closable
                      type="success"
                      @close="removeRightById(scope.row, item2.id)"
                      >{{ item2.authName }}
                    </el-tag></el-col
                  >
                  <el-col :span="18">
                    <el-tag
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      type="warning"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色名称" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showEditDialog(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="removeRoleById(scope.row.id)"
              >删除</el-button
            >
            <el-button size="mini" type="warning" icon="el-icon-setting"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色的对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addRoleClosed"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="80px"
      >
        <el-form-item
          label="角色名称"
          :label-width="formLabelWidth"
          prop="roleName"
        >
          <el-input v-model="addForm.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="角色描述"
          :label-width="formLabelWidth"
          prop="roleDesc"
        >
          <el-input v-model="addForm.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑角色的对话框 -->
    <el-dialog
      title="编辑角色"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editRoleClosed"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="80px"
      >
        <el-form-item
          label="角色名称"
          :label-width="formLabelWidth"
          prop="roleName"
        >
          <el-input v-model="editForm.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="角色描述"
          :label-width="formLabelWidth"
          prop="roleDesc"
        >
          <el-input v-model="editForm.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolesList: [],
      addDialogVisible: false,
      formLabelWidth: "120px",
      addForm: {
        roleName: "",
        roleDesc: "",
      },
      addFormRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
        ],
      },
      editDialogVisible: false,
      editFormRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
        ],
      },
      editForm: {},
      rightsList: [],
    };
  },
  created() {
    this.getRolesList();
  },

  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        return this.$message.error("获取角色列表失败");
      }
      this.rolesList = res.data;
    },

    // 添加角色

    addRole() {
      this.$refs.addFormRef.validate(async (validate) => {
        if (!validate) {
          return;
        }
        const { data: res } = await this.$http.post("roles", this.addForm);
        if (res.meta.status !== 201) {
          return this.$message.error("添加角色列表失败");
        }
        this.addDialogVisible = false;
        this.getRolesList();
        this.$message.success("添加角色成功！");
      });
    },
    // 监听添加角色对话框的关闭事件
    addRoleClosed() {
      this.$refs.addFormRef.resetFields();
    },

    // 监听关闭角色对话框的关闭事件
    editRoleClosed() {
      this.$refs.editFormRef.resetFields();
    },

    async showEditDialog(id) {
      const { data: res } = await this.$http.get(`roles/${id}`);
      if (res.meta.status !== 200) {
        return this.$message.error("查询角色信息失败!");
      }
      this.editForm = res.data;
      this.editDialogVisible = true;
    },

    editRole() {
      this.$refs.editFormRef.validate(async (validate) => {
        if (!validate) {
          return;
        }
        const { data: res } = await this.$http.put(
          `roles/${this.editForm.roleId}`,
          {
            roleName: this.editForm.roleName,
            roleDesc: this.editForm.roleDesc,
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("更新角色信息失败");
        }
        this.editDialogVisible = false;
        this.getRolesList();
        this.$message.success("更新用户信息成功");
      });
    },

    removeRoleById(id) {
      this.$confirm("确认删除该角色吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(`roles/${id}`);
          if (res.meta.status !== 200) {
            return this.$message.error("删除角色失败");
          }
          this.getRolesList();
          this.$message({
            type: "success",
            message: "删除角色成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //根据ID删除角色下的权限
    removeRightById(role, rightId) {
      this.$confirm("确认删除该权限吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(
            `roles/${role.id}/rights/${rightId}`
          );
          if (res.meta.status !== 200) {
            return this.$message.error("删除权限失败");
          }
          //   this.getRolesList()  // 不建议重新获取所有角色列表，会导致页面刷新
          role.children = res.data; // 重新设置当前角色下最新的权限数据
          this.$message({
            type: "success",
            message: "删除权限成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    async showRightDialog() {
      // 获取所有权限列表
      const { data: res } = await this.$http.get(`rights/tree`);
      if (res.meta.status !== 200) {
        return this.$message.error("获取权限列表失败");
      }
      this.rightsList = res.data;
      // 获取角色下所有三级权限的ID
    },
  },
};
</script>

<style>
.el-tag {
  margin: 6px;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.bdtop {
  border-top: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>