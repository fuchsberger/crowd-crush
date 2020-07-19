import Modal from 'bootstrap/js/dist/modal'

export default {
  mounted() {
    this.modal = new Modal(document.getElementById('modal'), { backdrop: false })
  },

  updated(){
    if(JSON.parse(this.el.dataset.show)) this.modal.show()
    else this.modal.hide()
  }
}
