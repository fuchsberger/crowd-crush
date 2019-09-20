import MainView from '../main'

export default class View extends MainView {
  mount() {
    super.mount()
    console.log('PageTest mounted')
  }

  unmount() {
    super.unmount()
    console.log('PageTest unmounted')
  }
}

