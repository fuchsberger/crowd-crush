// SETTINGS & CONSTANTS
export const REFRESH_INTERVAL = 40 // 25 frames per second => 40 ms

// https://developers.google.com/youtube/player_parameters
export const YOUTUBE_PLAYER_OPTS = {
  playerVars: {
    autoplay: 1,
    controls: 0,
    disablekb: 1,
    enablejsapi: 1,
    loop: 1,
    fs: 0,
    iv_load_policy: 3,
    modestbranding: 1,
    rel: 0
  }
}

// URLS
export const URL_LOGIN = '/login'
export const URL_LOGOUT = '/logout'
export const URL_REGISTER = '/register'
export const URL_RESET_PASSWORD = '/account/reset_password'
