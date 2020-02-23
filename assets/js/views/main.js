import connect from '../socket'

export default class MainView {
  mount() {
    // enable live view sockets on pages that need it
    connect()
  }

  unmount() {

  }
}
