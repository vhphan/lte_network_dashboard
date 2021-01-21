<template>
  <div>
    <v-treeview :items="items">
      <template slot="label" slot-scope="props">
        <router-link :to="props.item.to" v-if="props.item.to">{{ props.item.name }}</router-link>
        <span v-else>{{ props.item.name }}</span>
      </template>
    </v-treeview>
  </div>
</template>

<script>

export default {
  name: "TreeView",
  props: {items: Object}
}

</script>

<style scoped>

</style>