// Action Types
const LOAD = 'crowd-crush/userList/LOAD';
const REMOVE = 'crowd-crush/userList/REMOVE';

// Reducer
export default (state = null, {type, users}) => {
  switch (type) {
    case LOAD:
      return state ? {...state, ...users} : { ...users }

    case REMOVE:
      let nState = { ...state };
      users.forEach(id => { delete nState[id] })
      return nState;

    default: return state;
  }
}

// Sync Actions
export const loadUsers = users => ({ type: LOAD, users });
export const removeUsers = users => ({ type: REMOVE, users });

// Async Actions
export const deleteUsers = ids => {
  return (dispatch, store) => {
    if (ids.length === 0)
      return dispatch(error('You must select at least one user first.'));
    store().api.adminChannel
      .push('delete_users', { ids })
      .receive('error', res => dispatch(error(res.flash)));
  }
}

// applied in userlist for mass operations on a selection of users
export const updateUsers = (ids, changes) => {
  return (dispatch, store) => {
    if (ids.length === 0)
      return dispatch(error('You must select at least one user first.'));
    store().api.adminChannel
      .push('update_users', { ids, changes })
      .receive('error', res => dispatch(error(res.flash)));
  }
}