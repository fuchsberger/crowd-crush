const isAuthenticated = (state) => (state.session.currentUser != null)
const isInitialized = (state) =>
  (state.session.publicChannel && state.session.publicChannel.state == 'joined')

export default {
  isAuthenticated,
  isInitialized
};
