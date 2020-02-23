import MainView from '../main'

export default class View extends MainView {
  mount() {
    super.mount()

    $('#video_url').change(e => {
      const youtubeID = this.parse(e.target.value)

      if (youtubeID) {
        // contact youtube to get aspectratio, duration, and title
        $.getJSON(`https://www.googleapis.com/youtube/v3/videos?&id=${youtubeID}&key=${window.youtubeAPIKey}&part=snippet,player,contentDetails&maxHeight=8192`, res => console.log(res))
          .fail(function (error) {
          console.log( error );
        })

        // fill forms
        $('#video_youtubeID').val(youtubeID)
      }
    })
  }

  unmount() {
    super.unmount()
  }

  parse(url){
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/
    var match = url.match(regExp);
    return (match&&match[7].length==11)? match[7] : false;
  }
}
