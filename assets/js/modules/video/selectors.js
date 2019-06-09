import { sortBy } from 'lodash/collection'
// import { createSelector } from 'reselect'

const loading = state => state.videos.data == null
const sortColumn = state => state.videos.sortColumn
const sortDirection = state => state.videos.sortDirection

const videos = state => {
  let videos = sortBy(state.videos.data, [state.videos.sortColumn])
  if(state.videos.sortDirection === 'descending') videos.reverse()
  return videos
}

// videos are stored as an object. this function transforms them into an array
export const listAll = ( videos )  => (
  videos ? Object.keys(videos).map(i => ({ ...videos[i], id: i })) : null
);

export default {
  loading,
  sortColumn,
  sortDirection,
  videos
}
