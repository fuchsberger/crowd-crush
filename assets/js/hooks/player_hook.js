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
    function onPlayerReady(event) {
      event.target.playVideo()
    }

    // 4. The API calls this function when the player's state changes.
    //    The function indicates that when playing a video (state=1),
    //    the player should play for six seconds and then stop.
    var done = false;
    function onPlayerStateChange(event) {
      console.log(YT.PlayerState.PLAYING)
      if (event.data == YT.PlayerState.PLAYING && !done) {
        // event.target.pauseVideo()
        // setTimeout(stopVideo, 6000);
        // done = true;
        // console.log("Paused")
      }
    }

    window.stopVideo = () => window.player.stopVideo()
  }
}
