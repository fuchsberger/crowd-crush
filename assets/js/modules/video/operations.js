import actions from "./actions"
import { start_request } from '../loading'
import { flashOperations as Flash } from '../flash'
import { privateChannel } from '../socket'

// sync operations
const add = actions.add
const deleteAll = actions.deleteAll
const load = actions.load
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
  sort,
  deleteAll,
  _deleteAll,
  _insert,
  _updateAll
};
