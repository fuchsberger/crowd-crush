import { orderBy } from 'lodash/collection'
import { createSelector } from 'reselect'

const sortColumn = state => state.videos.sortColumn
const direction = state => state.videos.sortDirection
const videos = state => state.videos.data

const sortDirection = createSelector(
  [direction], direction => direction == 'asc' ? 'ascending' : 'descending')

const sortedVideos = createSelector([videos, sortColumn, direction],
  (videos, column, direction) => {
    if(column == 'marker_count') return orderBy(videos, v => v[column], direction)
    return orderBy(videos, v => v[column].toLowerCase(), direction)
  })

export default {
  sortColumn,
  sortDirection,
  sortedVideos
}
