import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default {
    state: {
        siteCount: [],
        groupByItem: 'Region',
        selectedTechnology: 'LTE'
    },
    mutations: {
        setSiteCount(state, siteCount) {
            state.siteCount = siteCount;
        },
        setGroupByItem(state, newGroupByItem){
            state.groupByItem = newGroupByItem;
        },
        setSelectedTechnology(state, newSelectedTechnology){
            state.selectedTechnology = newSelectedTechnology;
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
        async getsiteCounts(context) {
            try {
                const rawSiteCount = (await this._vm.$ePortal.get('/network')).data;
                const siteCount = rawSiteCount.map(
                    d => {
                        if (d['SystemID'] && d['SystemID'].startsWith('W')){
                            d['SystemID'].replace('W', 'U');
                        }
                        return d;
                    }
                )
                context.commit('setSiteCount', siteCount)
                console.log('siteCount', siteCount);
            } catch (error) {
                context.commit('showError', error);
                console.log(error);
            }
        }
    }
}

