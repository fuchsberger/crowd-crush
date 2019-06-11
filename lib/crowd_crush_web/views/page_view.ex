defmodule CrowdCrushWeb.PageView do
  use CrowdCrushWeb, :view

  def debug, do: Application.get_env(:crowd_crush, :env) === :dev

  def get_flash(conn), do: raw Jason.encode!(Phoenix.Controller.get_flash(conn))

  def expose(key, value) do
    cond do
      is_nil(value) -> "window.#{key} = null;\n"
      is_boolean(value) -> "window.#{key} = #{value};\n"
      is_number(value) -> "window.#{key} = #{value};\n"
      is_bitstring(value) -> raw("window.#{key} = \"#{value}\";\n")
      true -> ""
    end
  end
end
