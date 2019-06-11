import { createSelector } from 'reselect'

const message = state => state.flash.message
const type = state => state.flash.type

const icon = createSelector(
  [ type ],
  type => {
    switch (type) {
      case 'error': return 'exclamation circle'
      case 'warning': return 'exclamation triangle'
      case 'info': return 'info circle'
      case 'success': return 'check circle'
      default: return null
    }
  }
)

const messageType = createSelector(
  [type],
  type => {
    switch (type) {
      case 'error': return { error: true }
      case 'warning': return { warning: true }
      case 'info': return { info: true }
      case 'success': return { success: true }
      default: return null
    }
  }
)

export default { icon, message, messageType }
