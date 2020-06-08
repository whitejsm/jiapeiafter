<template>
    <div>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入订单号" v-model="searchInput" size="200px">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <br/>
      <el-row>
        <el-col :span="8">
          <span>所属医院</span>
          <el-select v-model="value" placeholder="--全部医院--">
            <!--                                <el-option-->
            <!--                                        v-for="item in options"-->
            <!--                                        :key="item.value"-->
            <!--                                        :label="item.label"-->
            <!--                                        :value="item.value">-->
            <!--                                </el-option>-->
          </el-select>
        </el-col>
        <el-col :span="8">
          <span>所属科室</span>
          <el-select v-model="value" placeholder="--全部科室--">
            <!--                                <el-option-->
            <!--                                        v-for="item in options"-->
            <!--                                        :key="item.value"-->
            <!--                                        :label="item.label"-->
            <!--                                        :value="item.value">-->
            <!--                                </el-option>-->
          </el-select>
        </el-col>
      </el-row>
      <br/>
      <el-row>
        <el-col :span="8">
          <span>订单状态</span>
          <el-select v-model="value" placeholder="--订单状态--">
            <!--                                <el-option-->
            <!--                                        v-for="item in options"-->
            <!--                                        :key="item.value"-->
            <!--                                        :label="item.label"-->
            <!--                                        :value="item.value">-->
            <!--                                </el-option>-->
          </el-select>
        </el-col>
      </el-row>
      <br/>
      <el-row>
        <el-col :span="18">
          <span>下单日期</span>
          <el-date-picker
            v-model="value1"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
          <el-button type="small">确认</el-button>
          <el-button type="small">清除</el-button>
        </el-col>
      </el-row>
      <br/>
      <el-table :data="tableData" border>
        <el-table-column prop="date" label="日期" width="140">
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="120">
        </el-table-column>
        <el-table-column prop="address" label="地址">
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="1000">
      </el-pagination>
    </div>
</template>

<script>
    export default {
        name: "order"
    }
</script>

<style scoped>

</style>
