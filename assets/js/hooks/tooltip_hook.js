import $ from 'jquery'

// enable tooltips in live views
export default {
  mounted() {
    $(this.el).tooltip({ html: true })
  },
  beforeUpdate() {
    $(this.el).tooltip('dispose')
  },
  updated() {
    $(this.el).tooltip({ html: true })
  },
  destroyed() {
    $(this.el).tooltip('dispose')
  }
}
