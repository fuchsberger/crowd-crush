import { toSeconds, parse } from 'iso8601-duration'
import actions from "./actions"
import { start_request, complete_request } from '../loading'
import { flashOperations as Flash } from '../flash'
import { privateChannel } from '../socket'

// sync operations
const add = actions.add
const deleteAll = actions.deleteAll
const load = actions.load
const modify = actions.modify
const sort = columnName => actions.sort(columnName)

// async operations ( preceded with _ )

const create = data => {
  return (dispatch) => {
    dispatch(start_request())

    privateChannel.push('create_video', data)
      .receive('ok', res => dispatch(Flash.get(res)))
      .receive('error', res => dispatch(Flash.get(res)))
  }
}

// get updated aspect ratio and video duration from youTube
const update = (id, youtubeID) => {
  return (dispatch) => {
    dispatch(start_request())

    let xhr = new XMLHttpRequest();
    xhr.open('GET', `https://www.googleapis.com/youtube/v3/videos?&id=${youtubeID}&key=${window.youtubeAPIKey}&part=player,contentDetails&maxHeight=8192`)
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.onload = res => {
      switch(xhr.status){
        case 200:
          res = JSON.parse(res.srcElement.response)

          if(res.items.length == 0) return dispatch(Flash.error('Could not connect to YouTube. Please try again later or contact the administrator, if the issue persists.'))

          const aspectratio =  res.items[0].player.embedWidth / res.items[0].player.embedHeight
          const duration = toSeconds(parse(res.items[0].contentDetails.duration))

          privateChannel.push('update_video', { id, video: { aspectratio, duration }})
          .receive('ok', res => dispatch(Flash.get(res)))
          .receive('error', res => dispatch(Flash.get(res)))

          return dispatch(Flash.success('Video aspect ratio and duration were updated!'))

        default:
          dispatch(Flash.error('Could not connect to YouTube. Please try again later or contact the administrator, if the issue persists.'))
      }
    }
    xhr.send();
  }
}

const _deleteAll = ( ids ) => {
  return (dispatch, store) => {
    if (ids.length === 0)
      return dispatch(Flash.error('You must select at least one video first.'));
    store().session.privateChannel
      .push('delete_videos', { ids })
      .receive('error', ( res ) => dispatch(Flash.error(res.flash)));
  }
}

const _insert = ( redirect, video ) =>  {
  return (dispatch, store) => {
    store().session.privateChannel
      .push('add_video', video)
      .receive('ok', () => redirect(`/simulation/${video.youtubeID}`))
      .receive('error', ( res ) => dispatch(Flash.error(res.flash)));
  }
}

// applied in userlist for mass operations on a selection of users
export const _updateAll = (ids, changes) => {
  return (dispatch, store) => {
    if (ids.length === 0)
      return dispatch(Flash.error('You must select at least one video first.'));
    store().session.privateChannel
      .push('update_videos', { ids, changes })
      .receive('error', ( res ) => dispatch(Flash.error(res.flash)));
  }
}

export default {
  add,
  create,
  load,
  modify,
  sort,
  update,
  deleteAll,
  _deleteAll,
  _insert,
  _updateAll
};
