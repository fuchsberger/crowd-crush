import { createSelector } from 'reselect'

const username = state => state.user
const isAuthenticated = createSelector([username], username => username != null)

export default { isAuthenticated, username }
