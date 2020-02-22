import MainView from './main'

export default viewPath => {
  let view
  try {
    const ViewClass = require('./' + viewPath).default
    view = new ViewClass.default
  } catch (e) {
    view = new MainView
  }
  return view
}
