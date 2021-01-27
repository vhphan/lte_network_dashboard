import Vue from 'vue'
import ECharts from 'vue-echarts';
import wonderland from "@/components/chartThemes/wonderland.json";

ECharts.registerTheme('wonderland', wonderland['theme'])

Vue.component('v-chart',
    () => import('vue-echarts')
)