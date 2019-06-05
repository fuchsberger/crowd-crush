import { getCurve, getDistance, getIntersection } from '../utils/simulation';

// Actions
const MOVE_MOUSE = 'crowd-crush/ui/MOVE_MOUSE';
const RESIZE = 'crowd-crush/ui/RESIZE';

// Helpers
const calcScreen = aspectratio => {
  // get screen size, acount for navbars on top and bottom
  const h = window.innerHeight - 55 * 2;
  const w = window.innerWidth;

  // calculate device class and size
  let screen, size
  if      (w < 576)   { screen = 'xs'; size = 0 } // Phones (Portrait)
  else if (w < 768)   { screen = 'sm'; size = 1 } // Phones (Landscape)
  else if (w < 992)   { screen = 'md'; size = 2 } // Tablets
  else if (w < 1200)  { screen = 'lg'; size = 3 } // Desktop
  /* default: */ else { screen = 'xl'; size = 4 } // Large Desktop

  let horizontal = 0;
  let vertical = 0;

  // calculate horizontal or vertical offset if video aspectratio is given
  if(aspectratio){
    if (w / h > aspectratio) horizontal = (w - aspectratio * h) / 2;
    else vertical = (h - w / aspectratio) / 2;
  }

  return {
    offset_X: parseInt(horizontal, 10),
    offset_Y: parseInt(vertical, 10),
    height: h,
    screen,
    size,
    width: w
  };
}

// Reducer
const initialState = {
  abs_X: null,
  abs_y: null,
  mouse_X: null,
  mouse_Y: null,
  ...calcScreen()
};

export default function reducer(state = initialState, { type, ...params }) {
  switch (type) {

    case MOVE_MOUSE:

      const { offset_X, offset_Y, height, width } = state;

      const P = {
        x : (params.x - offset_X) / (width - 2 * offset_X),
        y : (params.y - 55 - offset_Y) / (height - 2 * offset_Y)
      }

      // deactivate mouse coordinates out of screen
      if (params.out || P.x < 0 || P.x > 1 || P.y < 0 || P.y > 1)
        return {
          ...state,
          abs_X: null,
          abs_Y: null,
          mouse_X: null,
          mouse_Y: null
        };

      const {
        M0, MX, MY, MR, A, B, dist_x, dist_y,
        M0_MX, M0_MY, M0_A, M0_B, MX_A, MY_B,
        line_M0_MX, line_M0_MY
      } = params.video;

      // calculate absolute positions

      const line_P_A = getCurve(A, P);
      const line_P_B = getCurve(B, P);
      const PX = getIntersection(line_P_B, line_M0_MX);
      const PY = getIntersection(line_P_A, line_M0_MY);

      const M0_PX = getDistance(M0, PX)
      const M0_PY = getDistance(M0, PY)
      const MX_PX = getDistance(MX, PX)
      const MY_PY = getDistance(MY, PY)
      const PX_A = getDistance(PX, A)
      const PY_B = getDistance(PY, B)
      /**                                         | example is for X coordinate
       * a = Vanishing Point   (a or b)           | A
       * b = Reference Point 1 (zero coordinate)  | M0
       * c = Reference Point 2 (x or y)           | MX
       * d = Variable Point    (marker)           | PX
       * cr = ac/ad / bc/bd (rel)                 | MX_A/PX_A / M0_MX/M0_PX
       * cr = bc/bd (abs)                         | abs_M0_MX / abs_X
      **/ 

      const CR_X = (MX_A / PX_A) / (M0_MX / M0_PX)
      const CR_Y = (MY_B / PY_B) / (M0_MY / M0_PY)

      const abs_M0_MX = dist_x
      const abs_M0_MY = dist_y
      let abs_X = abs_M0_MX * CR_X
      let abs_Y = abs_M0_MY * CR_Y

      // negate absolute coordinates if below
      // if M0_PX + M0_MX = MX_PX -> negate
      if(Math.abs(M0_PX + M0_MX - MX_PX) < 0.01 ) abs_X = -abs_X;
      if(Math.abs(M0_PY + M0_MY - MY_PY) < 0.01 ) abs_Y = -abs_Y;

      return {
        ...state,
        abs_X,
        abs_Y,
        mouse_X: P.x,
        mouse_Y: P.y
      };

    case RESIZE:
      return {
        ...state,
        ...calcScreen(params.aspectratio)
      };

    default:
      return state;
  }
}

// Action Creators
export const moveMouse = (e, video, out = false) => ({
  type: MOVE_MOUSE,
  out,
  x: e.clientX,
  y: e.clientY,
  video
});

// Side Effects
export const resize = () => {
  return (dispatch, store) => {
    const state = store()
    const aspectratio =
      (state.simulation.video_id && state.videoList)
      ? state.videoList[state.simulation.video_id].aspectratio
      : null
    return dispatch({ type: RESIZE, aspectratio });
  }
}