import CSS from '../css/app.scss'
import 'phoenix_html'
import { Socket } from "phoenix"
import LiveSocket from "phoenix_live_view"
import Hooks from './hooks'

// if we do have a crsf token (all pages except error pages)
// then connect live socket and enable various functionalities
const csrf_elm = document.querySelector("meta[name='csrf-token']")
if(csrf_elm){
  let liveSocket = new LiveSocket("/live", Socket, {
    hooks: Hooks,
    metadata: {
      click: (e, el) => ({
        x: e.offsetX / el.width,
        y: e.offsetY / el.height
      })
    },
    params: { _csrf_token: csrf_elm.getAttribute("content") }
  })
  liveSocket.connect()
}
