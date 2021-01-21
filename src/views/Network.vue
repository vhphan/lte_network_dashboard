<template>
  <div>
    <v-row>
      <v-col
          class="d-flex"
          cols="12"
          sm="4"
      >
        <v-select
            class="pt-3"
            :items="groupByItems"
            v-model="groupByItem"
            label="Group By"
            outlined
        ></v-select>

      </v-col>
      <v-col
          class="d-flex"
          cols="12"
          sm="4">
        <v-select
            class="pt-3"
            :items="technologies"
            v-model="selectedTechnology"
            label="Select Technology"
            outlined
        >

        </v-select>
      </v-col>
    </v-row>
    <v-row class="m-1" v-if="groupByItem==='Region'">
      <site-count-bar-chart v-for="region in regions" :key="region"
                            :chart-data="siteCount"
                            :selected-region="region"
                            :selected-technology="selectedTechnology.charAt(0)"
                            :max-of-x="maxCount"
                            @chart-clicked="chartClicked"
                            :class="chartClass"


      />
    </v-row>

    <v-row class="m-1" v-if="groupByItem==='SystemID'">
      <site-count-bar-chart-generic v-for="layer in layers[this.selectedTechnology]" :key="layer"
                                    :chart-data="siteCount"
                                    :group-by-measure="groupByItem"
                                    :selected-measure="layer"
                                    :selected-technology="selectedTechnology.charAt(0)"
                                    :max-of-x="maxCount"
                                    @chart-clicked="chartClicked"
                                    :class="chartClass"


      />

    </v-row>
  </div>
</template>

<script>
import {mapGetters, mapState} from "vuex";
import SiteCountBarChart from "@/components/SiteCountBarChart";
import SiteCountBarChartGeneric from "@/components/SiteCountBarChartGeneric";

export default {
  components: {SiteCountBarChart, SiteCountBarChartGeneric},

  name: "Network",
  created() {
    this.$store.dispatch('getsiteCounts')
  },
  data() {
    return {
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
          siteCount: state => state.edb.siteCount,
          // groupByItem: state => state.edb.groupByItem,
        }
    ),
    maxCount() {
      let groupSiteCount = this.siteCount.filter(d => {
            if (this.groupByItem === 'Region') {
              return this.regions.includes(d['Region']) && d['SystemID'] && this.layers[this.selectedTechnology].includes(d['SystemID'])
            }
            if (this.groupByItem === 'SystemID') {
              return d['SystemID'] && this.layers[this.selectedTechnology].includes(d['SystemID'])
            }
          }
      )
      console.log(groupSiteCount);
      let maxCount = 1.2 * groupSiteCount.reduce((max, p) => p['SiteCount'] > max ? p['SiteCount'] : max, 0);
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