<template>
  <div>
    <v-layout flex justify-center>
      <v-card
          class="portrait"
          img="https://cdn.vuetifyjs.com/images/cards/girl.jpg"
          height="300px"
          @contextmenu="show"
      ></v-card>
    </v-layout>

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
  </div>
</template>
<script>
export default {
  name: "ContextMenu",
  data: () => ({
    showMenu: false,
    x: 0,
    y: 0,
    items: [
      { title: 'style 1 title', menuAction: 'style 1' },
      { title: 'style 2 title', menuAction: action => { alert(action) } },
      { title: 'style 3 title', menuAction: action => { this.someFunc(action) } }
    ]
  }),

  methods: {
    menuClick (action) {
      alert("menuClick() " + action)
    },
    someFunc (action) {
      alert("someFunc() " + action)
    },
    show (e) {
      e.preventDefault()
      this.showMenu = false
      this.x = e.clientX
      this.y = e.clientY
      this.$nextTick(() => {
        this.showMenu = true
      })
    }
  }
};
</script>