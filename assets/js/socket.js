import {Socket} from "phoenix"
import LiveSocket from "phoenix_live_view"

const connect = () => {
  let csrfToken = $("meta[name='csrf-token']").attr("content")
  let liveSocket = new LiveSocket("/live", Socket, {params: {_csrf_token: csrfToken}})
  liveSocket.connect()
}

export default connect
