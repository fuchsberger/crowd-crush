export default {
  mounted() {

    // 1. This code loads the IFrame Player API code asynchronously.
    var tag = document.createElement('script')
    tag.src = "https://www.youtube.com/iframe_api"
    var firstScriptTag = document.getElementsByTagName('script')[0]
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)

    // 2. This function creates an <iframe> (and YouTube player) after the API code downloads.
    window.onYouTubeIframeAPIReady = () => {
      window.player = new YT.Player('player', {
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange
        }
      })
    }

    // 3. The API will call this function when the video player is ready.
    window.onPlayerReady = event => {
      // do nothing for now. let user manually start simulation
      event.target.playVideo()
    }

    /**
     * The API calls this function when the player's state changes.
     *
     * Player states:
     * -1   unstarted
     * 0    ended
     * 1    playing
     * 2    paused
     * 3    buffering
     * 5    video cued
     */
    var loaded = false;
    window.onPlayerStateChange = event => {

      // if (event.data == YT.PlayerState.PLAYING) {
      //   this.pushEvent("playing", {})
      // } else {
      //   this.pushEvent("pausing", {})
      // }

      // if (event.data == YT.PlayerState.BUFFERING && !loaded) {
      //   console.log("initial pause...")
      //   event.target.pauseVideo()
      //   event.target.seekTo(0)
      //   loaded = true

      // }
    }

    window.stopVideo = () => window.player.stopVideo()

      // attach keyboard player controls
    document.onkeypress = event => {
      switch (event.keyCode) {
        case 32:
          if (window.player.getPlayerState() == YT.PlayerState.PLAYING) window.player.pauseVideo()
          else window.player.playVideo()
      }
    }
  }
}
