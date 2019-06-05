defmodule CrowdCrush.Service.Simulation do

  # this takes a video struct and returns parameters necessary for abs positions
  def createAbsRefs(v) do

    m0 = {v.m0_x, v.m0_y}
    mX = {v.mX_x, v.mX_y}
    mY = {v.mY_x, v.mY_y}
    mR = {v.mR_x, v.mR_y}

    line_M0_MX = getCurve m0, mX
    line_M0_MY = getCurve m0, mY
    line_MX_MR = getCurve mX, mR
    line_MY_MR = getCurve mY, mR

    a = getIntersection line_M0_MX, line_MY_MR
    b = getIntersection line_M0_MY, line_MX_MR

    # this map should contain all variables that are constant for simulation
    # and do not change with marker position
    %{
      m0: m0,
      mX: mX,
      mY: mY,
      a: a,
      b: b,
      m0_mX: getDistance(m0, mX),
      m0_mY: getDistance(m0, mY),
      mX_a: getDistance(mX, a),
      mY_b: getDistance(mY, b),
      line_M0_MX: line_M0_MX,
      line_M0_MY: line_M0_MY,
      abs_M0_MX: v.dist_x,
      abs_M0_MY: v.dist_y
    }
  end

  # calculate absolute positions
  def to_abs_coords(%{
      :m0 => m0,
      :mX => mX,
      :mY => mY,
      :a => a,
      :b => b,
      :m0_mX => m0_mX,
      :m0_mY => m0_mY,
      :mX_a => mX_a,
      :mY_b => mY_b,
      :line_M0_MX => line_M0_MX,
      :line_M0_MY => line_M0_MY,
      :abs_M0_MX => abs_M0_MX,
      :abs_M0_MY => abs_M0_MY
    }, marker)
  do
    # get PX and PY (intersections of marker coordinate with x and y axis)
    p = {Enum.at(marker, 2), Enum.at(marker, 3)}
    pX = getIntersection getCurve(b, p), line_M0_MX
    pY = getIntersection getCurve(a, p), line_M0_MY

    m0_px = getDistance m0, pX
    m0_py = getDistance m0, pY
    mX_px = getDistance mX, pX
    mY_py = getDistance mY, pY
    pX_a  = getDistance pX, a
    pY_b  = getDistance pY, b

    #                                          | example is for X coordinate
    # a = Vanishing Point   (a or b)           | A
    # b = Reference Point 1 (zero coordinate)  | M0
    # c = Reference Point 2 (x or y)           | MX
    # d = Variable Point    (marker)           | PX
    # cr = ac/ad / bc/bd (rel)                 | MX_A/PX_A / M0_MX/M0_PX
    # cr = bc/bd (abs)                         | abs_M0_MX / abs_X

    cr_X = (mX_a / pX_a) / (m0_mX / m0_px)
    cr_Y = (mY_b / pY_b) / (m0_mY / m0_py)

    abs_X = abs_M0_MX * cr_X
    abs_Y = abs_M0_MY * cr_Y

    # negate absolute coordinates if below
    # if M0_PX + M0_MX = MX_PX -> negate
    abs_X = if abs(m0_px + m0_mX - mX_px) < 0.01, do: -abs_X, else: abs_X
    abs_Y = if abs(m0_py + m0_mY - mY_py) < 0.01, do: -abs_Y, else: abs_Y

    # return agent, time, abs_x and abs_y (for csv file)
    [Enum.at(marker, 0), Enum.at(marker, 1), abs_X, abs_Y]
  end

  # calculates the distance between two points
  defp getDistance({x1, y1}, {x2, y2}) do
    :math.sqrt(:math.pow(x2-x1, 2) + :math.pow(y2-y1, 2))
  end

  # gets linear curve constants [slope (m) and y-intersept (b)]
  defp getCurve({x1, y1}, {x2, y2}) do
    m = (y2 - y1) / (x2 - x1)
    b = y1 - x1 * m
    { m , b }
  end

  # gets the point of intersection between two linear lines (functions)
  defp getIntersection({m1, b1}, {m2, b2}) do
    x = (b2 - b1) / (m1 - m2)
    y = m1 * x + b1
    { x, y }
  end
end
