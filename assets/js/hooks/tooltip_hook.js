import Tooltip from 'bootstrap/js/dist/alert'

// enable tooltips in live views
export default {
  mounted() {
    this.tooltip = new bootstrap.Tooltip(this.el)
  },
  beforeUpdate() {
    this.tooltip.dispose()
  },
  updated() {
    this.tooltip = new bootstrap.Tooltip(this.el)
  },
  destroyed() {
    this.tooltip.dispose()
  }
}
