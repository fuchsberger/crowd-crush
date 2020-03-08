defmodule CrowdCrushWeb.ViewHelpers do
  @moduledoc """
  Conveniences for all views.
  """
  use Phoenix.HTML

  alias Phoenix.HTML.Form

  def icon(name, opts \\ [] ), do: content_tag(:i, "",
    [{:class, "icon-#{name} #{Keyword.get(opts, :class, "")}"} | Keyword.delete(opts, :class)])


  def text_input(form, field, opts \\ []),
    do: Form.text_input(form, field, opts ++ Form.input_validations(form, field))

  def url_input(form, field, opts \\ []),
    do: Form.url_input(form, field, opts ++ Form.input_validations(form, field))

  def select(form, field, options, opts \\ []),
    do: Form.select(form, field, options, opts ++ Form.input_validations(form, field))
end
