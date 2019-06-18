import { find, orderBy } from 'lodash/collection'
import { createSelector } from 'reselect'
import { simSelectors as Sim } from '../sim'

const sortColumn = state => state.videos.sortColumn
const direction = state => state.videos.sortDirection

const videos = state => state.videos.data

const get = createSelector([videos, Sim.video_id], (videos, id) => find(videos, v => v.id == id))

const getSorted = createSelector([videos, sortColumn, direction],
  (videos, column, direction) => {
    if(['title'].includes(column)) return orderBy(videos, v => v[column].toLowerCase(), direction)
    return orderBy(videos, v => v[column], direction)
  })

const sortDirection = createSelector(
  [direction], direction => direction == 'asc' ? 'ascending' : 'descending')

export default {
  get,
  getSorted,
  sortColumn,
  sortDirection
}
