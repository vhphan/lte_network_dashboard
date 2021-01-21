<template>
  <v-container class="col-12 mx-0 px-2"
  >
    <v-card
        class="col-12"
    >
      <v-list-item two-line>
        <v-list-item-content>
          <v-list-item-title class="headline">
            {{ this.selectedRegion }}
          </v-list-item-title>
          <v-list-item-subtitle>Total Number of Sites</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-card-text class="py-0">
        <v-row align="center">
          <v-col
              class="display-1"
              cols="12"
          >
            {{ this.totalSites }}
          </v-col>
        </v-row>
        <v-progress-linear
            :value="this.percentTotalSites"
            :buffer-value="100"
            height="25"
        >
          <strong> {{ (this.percentTotalSites) }}%</strong>
        </v-progress-linear>
      </v-card-text>
    </v-card>
    <v-card class="col-12">
      <v-chart
          class="myCharts col-12 pa-0 ma-0"
          :options="this.chartOptions"
          autoresize
          theme="wonderland"
          group="radiance"
          @click="chartClickedDefault"
      />
    </v-card>
  </v-container>
</template>

<script>
import ECharts from 'vue-echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/polar';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/title'
import wonderland from '@/components/chartThemes/wonderland.json';

ECharts.registerTheme('wonderland', wonderland['theme'])

export default {
  components: {
    'v-chart': ECharts
  },
  name: "SiteCountBarChart",
  computed: {
    percentTotalSites() {
      return (100 * this.totalSites / this.grandTotalSites).toFixed(1);
    },
    grandTotalSites() {
      let rawRegionData = this.chartData.filter(d => {
            return (d['Region'] && d['SystemID'] && d['SystemID'].startsWith(this.selectedTechnology))
          }
      );
      let barData = this.rowsUnpack(rawRegionData, 'SiteCount');
      return barData.reduce(function (a, b) {
        return a + b;
      }, 0);
    },

    totalSites() {
      let rawRegionData = this.chartData.filter(d => {
            return (d['Region'] === this.selectedRegion && d['SystemID'] && d['SystemID'].startsWith(this.selectedTechnology))
          }
      );
      let barData = this.rowsUnpack(rawRegionData, 'SiteCount');
      return barData.reduce(function (a, b) {
        return a + b;
      }, 0);
    },
    chartOptions() {

      let rawRegionData = this.chartData.filter(d => {
            return (d['Region'] === this.selectedRegion && d['SystemID'] && d['SystemID'].startsWith(this.selectedTechnology))
          }
      );

      let sortOrder = ['L9', 'L18', 'L21', 'L26'];
      let regionData = rawRegionData.sort(function (a, b) {
        return sortOrder.indexOf(a['SystemID']) - sortOrder.indexOf(b['SystemID']);
      });

      let technology = this.rowsUnpack(regionData, 'SystemID');
      let barData = this.rowsUnpack(regionData, 'SiteCount');


      return {
        // backgroundColor: '#eaecf1',
        title: {
          top: 30,
          text: this.selectedRegion,
          subtext: '',
          x: 'center',
          textStyle: {
            fontSize: 18
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          },
          show: true,
          formatter: function (params) {
            return params[0].name + ', ' + params[0].value
          },
        },

        grid: {
          top: '25%',
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          max: this.maxOfX
          // max: function () {
          //   return this.maxOfX;
          // }
        },
        yAxis: {
          type: 'category',
          data: technology
        },
        series: [
          {
            name: 'Site Count',
            type: 'bar',
            label: {
              show: true,
              position: 'right',
            },
            data: barData
          },
        ],
      }
    },
  },
  props: {
    chartData: Array,
    selectedRegion: String,
    selectedTechnology: String,
    maxOfX: Number,
  },
  created() {
    ECharts['connect']('radiance');
  },
  methods: {
    chartClickedDefault(params) {
      this.$emit('chart-clicked', params);
    }
  }
  ,
  data() {
    return {}
  }
}
</script>

<style scoped>
.myCharts {
  /*width: 100%;*/
  /*height: 100%;*/
  border: red 1px solid;
}
</style>