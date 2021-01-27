<template>
  <v-container class="col-12 mx-0 px-2 py-0"
  >
    <v-card
        class="col-12"
    >
      <v-list-item two-line>
        <v-list-item-content>
          <v-list-item-title class="headline">
            {{ this.selectedMeasure }}
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
          @contextmenu="showContext"
      />
    </v-card>
    <v-menu
        v-model="showMenu"
        :position-x="x"
        :position-y="y"
        absolute
        offset-y
    >
      <v-list>
        <v-list-item
            v-for="(item, index) in items"
            :key="index"
            @click="item.menuAction(item.title)"

        >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>

    </v-menu>

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
  name: "CellCountBarChart",
  computed: {
    percentTotalSites() {
      return (100 * this.totalSites / this.grandTotalSites).toFixed(1);
    },
    grandTotalSites() {
      let rawData = this.chartData.filter(d => {
            return (d[this.groupByMeasure] && d['SystemID'] && d['SystemID'].startsWith(this.selectedTechnology))
          }
      );
      let barData = this.rowsUnpack(rawData, this.countColumn);
      return barData.reduce(function (a, b) {
        return a + b;
      }, 0);
    },
    totalSites() {
      let rawData = this.chartData.filter(d => {
            return (d[this.groupByMeasure] === this.selectedMeasure && d['SystemID'] && d['SystemID'].startsWith(this.selectedTechnology))
          }
      );
      let barData = this.rowsUnpack(rawData, this.countColumn);
      return barData.reduce(function (a, b) {
        return a + b;
      }, 0);
    },
    chartOptions() {

      let rawData = this.chartData.filter(d => {
            return (d[this.groupByMeasure] === this.selectedMeasure && d['SystemID'] && d['SystemID'].startsWith(this.selectedTechnology))
          }
      );
      let measureData;
      let context = this;
      switch (this.groupByMeasure) {
        case 'Layer':
          context.sortOrder = ['CENTRAL', 'EASTERN', 'SABAH', 'SARAWAK'];
          context.sortKey = 'Region';
          break;
        case 'Region':
          context.sortOrder = ['L9', 'L18', 'L21', 'L26'];
          context.sortKey = 'SystemID';
          break;
        default:
          context.sortOrder = false;
          // code block
      }
      if (context.sortOrder.length) {
        measureData = rawData.sort(function (a, b) {
          return context.sortOrder.indexOf(a[context.sortKey]) - context.sortOrder.indexOf(b[context.sortKey]);
        });
      } else {
        measureData = rawData;
      }
      let categoryKey;
      if (this.groupByMeasure === 'SystemID') {
        categoryKey = 'Region';
      }
      if (this.groupByMeasure === 'Region') {
        categoryKey = 'SystemID';
      }
      let categories = this.rowsUnpack(measureData, categoryKey);
      let barData = this.rowsUnpack(measureData, this.countColumn);


      return {
        title: {
          top: 30,
          text: this.selectedMeasure,
          subtext: '',
          x: 'center',
          textStyle: {
            fontSize: 18
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
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
          data: categories
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
    selectedMeasure: String,
    selectedTechnology: String,
    maxOfX: Number,
    groupByMeasure: String,
    countColumn: {type: String, default: 'CellCount'}
  },
  created() {
    ECharts['connect']('radiance');
  },
  methods: {
    chartClickedDefault(params) {
      this.$emit('chart-clicked', params);
    },
    chartContextMenu(params) {
      console.log('context', params);
    },
    showContext (params) {
      console.log(params);
      let e = params.event.event;
      e.preventDefault()
      this.showMenu = false
      this.x = e.clientX
      this.y = e.clientY
      this.$nextTick(() => {
        this.showMenu = true
      })
    }
  }
  ,
  data() {
    return {
      sortOrder: [],
      sortKey: '',
      showMenu: false,
      x: 0,
      y: 0,
      items: [
        {title: 'style 1 title', menuAction:  action => {
            alert(action);
          }},
        {
          title: 'style 2 title', menuAction: action => {
            alert(action);
          }
        },
        {
          title: 'style 3 title', menuAction: action => {
            alert(action)
          }
        }
      ]

    }
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