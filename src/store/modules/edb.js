import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default {
    state: {
        cellCount: [],
        siteCount: [],
        groupByItem: 'Region',
        selectedTechnology: 'LTE',
        countType: 'Cell'
    },
    mutations: {
        setCellCount(state, cellCount) {
            state.cellCount = cellCount;
        },
        setSiteCount(state, siteCount) {
            state.siteCount = siteCount;
        },
        setGroupByItem(state, newGroupByItem){
            state.groupByItem = newGroupByItem;
        },
        setSelectedTechnology(state, newSelectedTechnology){
            state.selectedTechnology = newSelectedTechnology;
        },
        setSelectedCountType(state, newSelectedCountType){
            state.countType = newSelectedCountType;
        },

    },
    getters: {},
    actions: {
        setGroupByItem(context, newGroupByItem){
            context.commit('setGroupByItem', newGroupByItem);
        },
        setSelectedTechnology(context, newSelectedTechnology){
            context.commit('setSelectedTechnology', newSelectedTechnology);
        },
        setSelectedCountType(context, newSelectedCountType){
            context.commit('setSelectedCountType', newSelectedCountType);
        },
        async getCellCounts(context) {
            try {
                const rawCellCount = (await this._vm.$ePortal.get('/network')).data;
                const cellCount = rawCellCount.map(
                    d => {
                        if (d['SystemID'] && d['SystemID'].startsWith('W')){
                            d['SystemID'].replace('W', 'U');
                        }
                        return d;
                    }
                )
                context.commit('setCellCount', cellCount)
            } catch (error) {
                context.commit('showError', error);
                console.log(error);
            }
        },
         async getSiteCounts(context) {
            try {
                const rawCellCount = (await this._vm.$ePortal.get('/network/site')).data;
                const siteCount = rawCellCount.map(
                    d => {
                        if (d['SystemID'] && d['SystemID'].startsWith('W')){
                            d['SystemID'].replace('W', 'U');
                        }
                        return d;
                    }
                )
                context.commit('setSiteCount', siteCount)
            } catch (error) {
                context.commit('showError', error);
                console.log(error);
            }
        }
    }
}

