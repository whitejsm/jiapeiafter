<template>
    <el-container>
        <el-header style="background-color: white">
            报表 / 可视化报表
        </el-header>
        <el-container style="background-color: #E6E6E6; height: 400px;" v-show="roleId == 1 || roleId == 7">
            <el-header style="background-color: #E6E6E6">
                <span>省: </span>
                <el-select v-model="rentCondition.provinceId" placeholder="--全部省--"
                           @change="changeRentProvince">
                    <el-option :value="-1" label="全部省"></el-option>
                    <el-option
                            v-for="item in rentCondition.provinceList"
                            :key="item.provinceId"
                            :label="item.provinceName"
                            :value="item.provinceId">
                    </el-option>
                </el-select>
                <span>市: </span>
                <el-select v-model="rentCondition.cityId" placeholder="--全部市--"
                           @change="changeRentCity">
                    <el-option :value="-1" label="全部市"></el-option>
                    <el-option
                            v-for="item in rentCondition.cityList"
                            :key="item.cityId"
                            :label="item.cityName"
                            :value="item.cityId">
                    </el-option>
                </el-select>
                <span>区:</span>
                <el-select v-model="rentCondition.zoneId" placeholder="--全部区--"
                           @change="changeRentZone">
                    <el-option :value="-1" label="全部区"></el-option>
                    <el-option
                            v-for="item in rentCondition.zoneList"
                            :key="item.zoneId"
                            :label="item.zoneName"
                            :value="item.zoneId">
                    </el-option>
                </el-select>
            </el-header>
            <el-main style="width: 100%" id="rentChart">
            </el-main>
        </el-container>
        <el-container style="background-color: #E6E6E6; height: 400px; margin-top: 40px">
            <el-header style="background-color: #E6E6E6">
                <span>医院: </span>
                <el-select v-model="occupancyCondition.hospitalId" placeholder="--全部医院--"
                           @change="changeOccupancyHospital">
                    <el-option :value="-1" label="全部医院"></el-option>
                    <el-option
                            v-for="item in occupancyCondition.hospitalList"
                            :key="item.hospitalId"
                            :label="item.hospitalname"
                            :value="item.hospitalId">
                    </el-option>
                </el-select>
                <span>科室: </span>
                <el-select v-model="occupancyCondition.departmentId" placeholder="--全部科室--"
                           @change="changeOccupancyDepartment">
                    <el-option :value="-1" label="全部科室"></el-option>
                    <el-option
                            v-for="item in occupancyCondition.departmentList"
                            :key="item.departmentId"
                            :label="item.departmentname"
                            :value="item.departmentId">
                    </el-option>
                </el-select>
                <el-date-picker
                        v-model="occupancyCondition.date"
                        type="date"
                        placeholder="请选择日期"
                        :clearable="false"
                        @change="changeOccupancyDate">
                </el-date-picker>
            </el-header>
            <el-main style="width: 100%" id="occupancyChart">
            </el-main>
        </el-container>
        <el-container style="background-color: #E6E6E6; height: 400px; margin-top: 40px" v-show="roleId == 1 || roleId == 7">
            <el-container style="width: 45%">
                <el-header style="background-color: #E6E6E6">
                    <span>省: </span>
                    <el-select v-model="distributionCondition.provinceId" placeholder="--全部省--"
                               @change="changeDistributionProvince">
                        <el-option :value="-1" label="全部省"></el-option>
                        <el-option
                                v-for="item in distributionCondition.provinceList"
                                :key="item.provinceId"
                                :label="item.provinceName"
                                :value="item.provinceId">
                        </el-option>
                    </el-select>
                </el-header>
                <el-main style="width: 100%" id="distributionBarChart">

                </el-main>
            </el-container>
            <el-container style="width: 45%">
                <el-main style="width: 100%; " id="distributionMapChart">
                    <div style="width:100%; height: 370px" ref="myEchart"></div>
                </el-main>
            </el-container>
        </el-container>
    </el-container>
</template>

<script>
    import echarts from "echarts";
    import "../../node_modules/echarts/map/js/china.js";

    export default {
        name: "VisibleReport",
        data() {
            return {
                roleId: this.$store.state.roleId,
                rentCondition: {
                    provinceId: -1,
                    provinceList: null,
                    cityId: -1,
                    cityList: null,
                    zoneId: -1,
                    zoneList: null
                },
                rentData: {
                    rentList: null,
                    hospitalNameList: null
                },
                occupancyCondition: {
                    hospitalId: -1,
                    hospitalList: null,
                    departmentId: -1,
                    departmentList: null,
                    date: new Date()
                },
                occupancyData: {
                    occupancyList: null,
                    dateList: null,
                },
                distributionCondition: {
                    provinceId: -1,
                    provinceList: null
                },
                distributionData: {
                    cityNameList: null,
                    hospitalCountList: null
                },
                valueList: null
            }
        },
        mounted() {
            this.getProvinceList();
            this.drawRentLine();
            this.getHospitalList();
            this.drawOccupancyLine();
            // this.getDistributionProvinceList();
            this.drawDistributionBar();
            this.chinaConfigure();
        },
        methods: {
            async getProvinceValueList() {
                await this.axios.get("http://localhost:9000/getProvinceValueList").then(res => {
                    if (res.data.result == 'success') {
                        this.valueList = res.data.valueList;
                    }
                }).catch(err => {
                    console.error(err);
                })
            },
            async chinaConfigure() {
                await this.getProvinceValueList();
                let myChart = echarts.init(this.$refs.myEchart); //这里是为了获得容器所在位置
                window.onresize = myChart.resize;
                myChart.setOption({ // 进行相关配置
                    backgroundColor: "#E6E6E6",
                    tooltip: {}, // 鼠标移到图里面的浮动提示框
                    dataRange: {
                        show: true,
                        min: 0,
                        max: 10001,
                        text: ['High', 'Low'],
                        splitList: [
                            {start: 10001, label: '10001以上', color: '#FF6699'},
                            {start: 5001, end: 10000, label: '5001-10000', color: '#CC3300'},
                            {start: 1001, end: 5000, label: '1001-5000', color: '#F7BB37'},
                            {start: 501, end: 1000, label: '501-1000', color: '#3BAE56'},
                            {start: 101, end: 500, label: '101-500', color: '#92D050'},
                            {start: 1, end: 100, label: '1-100', color: '#3899FF'},
                            {start: 0, end: 0, label: '', color: '#BFBFBF'}
                        ],
                        realtime: true,
                        calculable: false,
                    },
                    geo: { // 这个是重点配置区
                        map: 'china', // 表示中国地图
                        roam: true,
                        label: {
                            normal: {
                                show: true, // 是否显示对应地名
                                textStyle: {
                                    color: 'rgba(0,0,0,0.4)'
                                }
                            }
                        },
                        itemStyle: {
                            normal: {
                                borderColor: 'rgba(0, 0, 0, 0.2)'
                            },
                            emphasis: {
                                areaColor: null,
                                shadowOffsetX: 0,
                                shadowOffsetY: 0,
                                shadowBlur: 20,
                                borderWidth: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    },
                    series: [{
                        type: 'scatter',
                        coordinateSystem: 'geo' // 对应上方配置
                    },
                        {
                            name: '启动次数', // 浮动框的标题
                            type: 'map',
                            geoIndex: 0,
                            data: this.valueList
                        }
                    ]
                });

                //点击事件,根据点击某个省份计算出这个省份的数据
                myChart.on('click', params => {
                    console.log(params);
                   //逻辑控制
                    this.distributionCondition.provinceId = params.data.areaCode;
                    this.drawDistributionBar();
                });
            },
            async getRentData() {
                await this.axios({
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    method: 'get',
                    url: 'http://localhost:9000/getRent',
                    params: {
                        provinceId: this.rentCondition.provinceId,
                        cityId: this.rentCondition.cityId,
                        zoneId: this.rentCondition.zoneId,
                    }
                }).then(res => {
                    if (res.data.result == 'success') {
                        this.rentData.rentList = res.data.rentDataVo.rentList;
                        this.rentData.hospitalNameList = res.data.rentDataVo.hospitalNameList;
                    }
                }).catch(err => {
                    console.error(err);
                })
            },
            async drawRentLine() {
                await this.getRentData();
                // 基于准备好的dom，初始化echarts实例
                let myChart = this.$echarts.init(document.getElementById('rentChart'))
                // 绘制图表
                myChart.setOption({
                    title: { text: '租金' },
                    tooltip: {},
                    xAxis: {
                        name: '医院名称',
                        data: this.rentData.hospitalNameList
                    },
                    yAxis: {
                        name: '租金（元）'
                    },
                    series: [{
                        name: '',
                        type: 'line',
                        data: this.rentData.rentList
                    }]
                });
            },
            changeRentProvince() {
                var obj = this.rentCondition.provinceList.find(
                    item=>{
                        return item.provinceId===this.rentCondition.provinceId //筛选出对应数据
                    }
                );
                this.rentCondition.cityList = (typeof obj !== 'undefined' ? obj.cities : null);
                this.rentCondition.cityId = -1;
                this.rentCondition.zoneList = null;
                this.rentCondition.zoneId = -1;
                this.drawRentLine();
            },
            changeRentCity() {
                var obj = this.rentCondition.cityList.find(
                    item=>{
                        return item.cityId==this.rentCondition.cityId //筛选出对应数据
                    }
                );
                this.rentCondition.zoneList = (typeof obj !== 'undefined' ? obj.zones : null);
                this.rentCondition.zoneId = -1;
                this.drawRentLine();
            },
            changeRentZone() {
                this.drawRentLine();
            },
            async getProvinceList() {
                this.axios.get(
                    "http://localhost:9000/getProvinceList"
                ).then(res => {
                    if(res.data.result == 'success') {
                        this.distributionCondition.provinceList = res.data.provinceList;
                        this.rentCondition.provinceList = res.data.provinceList;
                    }
                }).catch(err => {
                    console.error(err);
                });
                this.drawRentLine();
                this.drawDistributionBar();
            },
            getHospitalList() {
                this.axios.get(
                    "http://localhost:9000/getHospitalList"
                ).then(res => {
                    if(res.data.result == 'success') {
                        this.occupancyCondition.hospitalList = res.data.hospitalList;
                    }
                }).catch(err => {
                    console.error(err);
                })
            },
            changeOccupancyHospital() {
                var obj = this.occupancyCondition.hospitalList.find(
                    item=>{
                        return item.hospitalId==this.occupancyCondition.hospitalId //筛选出对应数据
                    }
                );
                this.occupancyCondition.departmentList = (typeof obj !== 'undefined' ? obj.departmentList : null);
                this.occupancyCondition.departmentId = -1;
                this.drawOccupancyLine();
            },
            changeOccupancyDepartment() {
                this.drawOccupancyLine();
            },
            changeOccupancyDate() {
                this.drawOccupancyLine();
            },
            async getOccupancyData() {
                await this.axios({
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    method: 'get',
                    url: 'http://localhost:9000/getOccupancy',
                    params: {
                        hospitalId: this.occupancyCondition.hospitalId,
                        departmentId: this.occupancyCondition.departmentId,
                        date: this.dateFormatWithDiagonal(this.occupancyCondition.date)
                    }
                }).then(res => {
                    if (res.data.result == 'success') {
                        this.occupancyData.occupancyList = res.data.occupancyDataVo.occupancyList;
                        this.occupancyData.dateList = res.data.occupancyDataVo.dateList;
                    }
                }).catch(err => {
                    console.error(err);
                })
            },
            async drawOccupancyLine() {
                await this.getOccupancyData();
                // 基于准备好的dom，初始化echarts实例
                let myChart = this.$echarts.init(document.getElementById('occupancyChart'))
                // 绘制图表
                myChart.setOption({
                    title: { text: '租用率' },
                    tooltip: {},
                    xAxis: {
                        name: '日期',
                        data: this.occupancyData.dateList
                    },
                    yAxis: {
                        name: '租用率（%）',
                        max: '100',
                        min: '0'
                    },
                    series: [{
                        name: '',
                        type: 'line',
                        data: this.occupancyData.occupancyList
                    }]
                });
            },
            // async getDistributionProvinceList() {
            //     this.axios.get(
            //         "http://localhost:9000/getProvinceList"
            //     ).then(res => {
            //         if(res.data.result == 'success') {
            //             this.distributionCondition.provinceList = res.data.provinceList;
            //             this.valueList = res.data.valueList;
            //         }
            //     }).catch(err => {
            //         console.error(err);
            //     });
            //     this.drawDistributionBar();
            // },
            changeDistributionProvince() {
                this.drawDistributionBar();
            },
            async getDistributionData() {
                await this.axios({
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    method: 'get',
                    url: 'http://localhost:9000/getDistribution',
                    params: {
                        provinceId: this.distributionCondition.provinceId,
                    }
                }).then(res => {
                    if (res.data.result == 'success') {
                        this.distributionCondition.cityNameList = res.data.distributionDataVo.cityNameList;
                        this.distributionCondition.hospitalCountList = res.data.distributionDataVo.hospitalCountList;
                    }
                }).catch(err => {
                    console.error(err);
                })
            },
            async drawDistributionBar() {
                await this.getDistributionData();
                // 基于准备好的dom，初始化echarts实例
                console.log(this.distributionCondition.cityNameList)
                console.log(this.distributionCondition.hospitalCountList)
                let myChart = this.$echarts.init(document.getElementById('distributionBarChart'));
                // 绘制图表
                myChart.setOption({
                    title: { text: '业务分布' },
                    tooltip: {},
                    xAxis: {
                        name: '市',
                        data: this.distributionCondition.cityNameList
                    },
                    yAxis: {
                        name: '医院数',
                        min: '0'
                    },
                    series: [{
                        name: '',
                        type: 'bar',
                        barMaxWidth: '35%',
                        data: this.distributionCondition.hospitalCountList
                    }]
                });
            },
            dateFormatWithDiagonal(dataStr) {
                var dt = new Date(dataStr);
                // yyyy-mm-dd
                var y = dt.getFullYear();
                var m = dt.getMonth() + 1;
                var d = dt.getDate();
                var hh = dt.getHours();
                var mm = dt.getMinutes();
                var ss = dt.getSeconds();
                return y + "/" + m + "/" + d + "  " + hh + ":" + mm + ":" + ss
            },
        }
    }
</script>

<style scoped>

</style>
