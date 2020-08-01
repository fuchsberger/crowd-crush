import Tooltip from 'bootstrap/js/src/tooltip'

export default {

  mounted() {
    this.tooltip = new Tooltip(document.querySelector('body'), {
      selector: `#${this.el.id}`,
      trigger: 'hover focus',
      sanitize: false,
    })
  },

  beforeDestroy(){
    this.tooltip.dispose()
  }
}
