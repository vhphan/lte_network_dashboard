<template>
  <div>
    <v-row>
      <v-col
          class="d-flex ma-0 px-0 pb-0"
          cols="12"
          sm="4">
        <v-select
            class="pb-0"
            :items="['Cell', 'Site']"
            v-model="countType"
            label="Count of"
            outlined
        >

        </v-select>
      </v-col>
      <v-col
          class="d-flex ma-0 px-0 pb-0"
          cols="12"
          sm="4"

      >
        <v-select
            class="ba-0"
            :items="groupByItems"
            v-model="groupByItem"
            label="Group By"
            outlined
        ></v-select>

      </v-col>
      <v-col
          class="d-flex ma-0 px-0 pb-0"
          cols="12"
          sm="4">
        <v-select
            class="pb-0"
            :items="technologies"
            v-model="selectedTechnology"
            label="Select Technology"
            outlined
        >

        </v-select>
      </v-col>
    </v-row>

    <v-row class="mb-1 mt-0" v-if="groupByItem==='Region' && $route.params.type==='chart'" >
      <cell-count-bar-chart-generic v-for="region in regions" :key="region"
                                    :chart-data="chartData"
                                    :group-by-measure="groupByItem"
                                    :selected-measure="region"
                                    :selected-technology="selectedTechnology.charAt(0)"
                                    :max-of-x="maxCount"
                                    @chart-clicked="chartClicked"
                                    :class="chartClass"
                                    :count-column="countColumnName"


      />
    </v-row>
    <v-row class="mb-1 mt-0" v-if="groupByItem==='SystemID' && $route.params.type==='chart'">
      <cell-count-bar-chart-generic v-for="layer in layers[this.selectedTechnology]" :key="layer"
                                    :chart-data="chartData"
                                    :group-by-measure="groupByItem"
                                    :selected-measure="layer"
                                    :selected-technology="selectedTechnology.charAt(0)"
                                    :max-of-x="maxCount"
                                    @chart-clicked="chartClicked"
                                    :class="chartClass"
                                    :count-column="countColumnName"


      />
    </v-row>

    <v-row justify="center" v-if="$route.params.type==='table'">
      <v-col class="pa-10 col-10 ">

        <tabulator-table
            :table-data="tableData"
            :table-columns="tableColumns"
            :table-options="tableOptions"
        >

        </tabulator-table>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import {mapGetters, mapState} from "vuex";
import CellCountBarChartGeneric from "@/components/CellCountBarChartGeneric";
import TabulatorTable from "@/components/TabulatorTable";

export default {
  components: {CellCountBarChartGeneric, TabulatorTable},

  name: "Network",
  created() {

  },
  data() {
    return {
      tableOptions: {
        reactiveData: true,
        rowClickMenu: [
          {
            label: "<i class='fas fa-chart-line'></i> View Charts",
            action: function (e, row) {
              console.log(e, row);
              // router.push('/chart', function () {
              //   context.$store.dispatch('setSelectedCoin', selectedCoin);
              // });
            }
          },
          {
            label: "<i class='fas fa-chart-area'></i> View Markets",
            action: function (e, row) {
              console.log(e, row);
            }
          },
          {
            separator: true,
          },
          {
            label: "<i class='fas fa-chart-bar'></i> View Historical Data",
            action: function (e, row) {
              console.log(e, row);
            }
          },
        ],
        layout: "fitColumns",
        pagination: "local",
        paginationSize: 20,
        height: '90vh',

        rowClick: function (e, row) { //trigger an alert message when the row is clicked
          console.log("Row click callback " + row.getData().name + " Clicked!!!!");
        },

      },
      regions: ['CENTRAL', 'EASTERN', 'SABAH', 'SARAWAK'],
      layers: {
        'LTE': ['L9', 'L18', 'L21', 'L26'],
        'UMTS': ['U9', 'U21',],
        'GSM': ['G9', 'G18',],
      },
      technologies: ['LTE', 'UMTS', 'GSM',],
      groupByItems: ['Region', 'SystemID',],
    }
  },
  computed: {
    tableData() {
      return this.chartData.filter((d) => {
        for (const value of Object.values(d)) {
          if (value === null) {
            return false;
          }
        }
        return true;
      })
    },
    tableColumns() {
      let countArray = this.rowsUnpack(this.tableData, this.countColumnName);
      let maxCountForTable = countArray.reduce(function (a, b) {
        return Math.max(a, b);
      });
      let countColumnName = `${this.countType}Count`;
      let columns = [
        'Region',
        'Technology',
        'SystemID',
        countColumnName
      ];

      return columns.map(function (d) {
        let otherInfo = {};
        let sorter = 'string';
        let headerInfo = {headerFilterPlaceholder: "Filter..",};
        let formatter = function (cell) {
          // console.log(cell, formatterParams, onRendered);
          let cellValue = cell.getValue();

          if (cellValue)
            return cellValue;
          return 'All'
        }

        if (d.includes('Count')) {
          sorter = 'number';
          otherInfo = {
            formatter: 'progress',
            formatterParams: {
              min: 0,
              max: 1.1 * maxCountForTable,
              color: ["green", "orange", "red"],
              legendColor: "#000000",
              legendAlign: "center",
              legend: true
            }

          };
          headerInfo = {
            headerFilter: 'input',
            headerFilterPlaceholder: 'Minimum',
            headerFilterFunc: '>=',
          }

        }
        return {
          title: d,
          field: d,
          formatter: formatter,
          headerFilter: true,
          ...headerInfo, ...otherInfo,
          sorter: sorter,
          dataFiltered: function (filters, rows) {
            //filters - array of filters currently applied
            //rows - array of row components that pass the filters
            console.log(filters, rows);
          },


        }
      })
    },

    chartData() {
      if (this.countType === 'Cell') {
        return this.cellCount;
      }
      if (this.countType === 'Site') {
        return this.siteCount;
      }
      return [];
    },

    chartsPerRow() {
      if (this.groupByItem === 'SystemID') {
        return this.layers[this.selectedTechnology].length;
      }
      return this.regions.length;
    },
    chartClass() {
      return `col-md-${12 / this.chartsPerRow} col-sm-${12 * 2 / this.chartsPerRow}`
    },

    ...mapState(
        {
          cellCount: state => state.edb.cellCount,
          // groupByItem: state => state.edb.groupByItem,
          siteCount: state => state.edb.siteCount,
        }
    ),
    countColumnName() {
      return `${this.countType}Count`;
    },
    maxCount() {
      let groupCellCount = this.chartData.filter(d => {
            if (this.groupByItem === 'Region') {
              return this.regions.includes(d['Region']) && d['SystemID'] && this.layers[this.selectedTechnology].includes(d['SystemID'])
            }
            if (this.groupByItem === 'SystemID') {
              return d['SystemID'] && this.layers[this.selectedTechnology].includes(d['SystemID'])
            }
          }
      )
      let maxCount = 1.2 * groupCellCount.reduce((max, p) => p[this.countColumnName] > max ? p[this.countColumnName] : max, 0);
      return Math.ceil(maxCount / 100) * 100;
    },
    ...mapGetters({}
    ),
    selectedTechnology: {
      get() {
        return this.$store.state.edb.selectedTechnology;
      },
      set(newSelectedTechnology) {
        this.$store.dispatch('setSelectedTechnology', newSelectedTechnology);
      }
    },
    countType: {
      get() {
        return this.$store.state.edb.countType;
      },
      set(newCountType) {
        this.$store.dispatch('setSelectedCountType', newCountType);
      }
    },
    groupByItem: {
      get() {
        return this.$store.state.edb.groupByItem;
      },
      set(newGroupByItem) {
        this.$store.dispatch('setGroupByItem', newGroupByItem);
      }
    }
  },

  methods: {
    chartClicked(event, value) {
      console.log('event', event);
      console.log('value', value);
    }
  }
}

</script>

<style scoped>

</style>