// this takes a video object and adds properties A and B
// (intersections between rectangle paralells)
export const addCoordRefPoints = video => {
  if(!video) return video;

  const { m0_x, m0_y, mX_x, mX_y, mY_x, mY_y, mR_x, mR_y, ...rest } = video
  const M0 = { x : m0_x, y : m0_y }
  const MX = { x : mX_x, y : mX_y }
  const MY = { x : mY_x, y : mY_y }
  const MR = { x : mR_x, y : mR_y }
  const line_M0_MX = getCurve(M0, MX);
  const line_M0_MY= getCurve(M0, MY);
  const line_MX_MR= getCurve(MX, MR);
  const line_MY_MR = getCurve(MY, MR);
  const A = getIntersection(line_M0_MX, line_MY_MR);
  const B = getIntersection(line_M0_MY, line_MX_MR);
  const M0_MX = getDistance(M0, MX);
  const M0_MY = getDistance(M0, MY);
  const M0_A = getDistance(M0, A);
  const M0_B = getDistance(M0, B);
  const MX_A = getDistance(MX, A);
  const MY_B = getDistance(MY, B);
  return {
    ...rest,
    M0, MX, MY, MR, A, B,
    line_M0_MX, line_M0_MY,
    M0_MX, M0_MY, M0_A, M0_B, MX_A, MY_B
  };
}

// calculates the distance between two points
export function getDistance(A, B) {
  return Math.sqrt((B.x - A.x)**2 + (B.y - A.y)**2);
}

// gets linear curve constants [slope (k) and y-intersept (c)]
export function getCurve(A, B) {
  const k = (B.y - A.y) / (B.x - A.x);
  const c = A.y - A.x * k;
  return { k, c };
}

// gets the point of interesction between two linear lines (functions)
export function getIntersection(A, B) {
  const x = (B.c - A.c) / (A.k - B.k);
  const y = A.k * x + A.c;
  return { x, y };
}

export function round(number, digits = 2){
  return Math.round(number * 10**2) / 10**2
}