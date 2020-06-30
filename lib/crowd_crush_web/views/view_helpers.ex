defmodule CrowdCrushWeb.ViewHelpers do
  @moduledoc """
  Conveniences for all views.
  """
  use Phoenix.HTML

  import CrowdCrushWeb.ErrorHelpers, only: [error_class: 2]

  alias Phoenix.HTML.Form

  def icon(name, opts \\ [] ), do: content_tag(:i, "",
    [{:class, "icon-#{name} #{Keyword.get(opts, :class, "")}"} | Keyword.delete(opts, :class)])


  def new?(changeset), do: changeset && changeset.data.__meta__.state == :built

  # Bootstrap form fields
  def number_input(form, field, opts \\ []) do
    opts = Keyword.put(opts, :class, "form-control#{error_class(form, field)} #{Keyword.get(opts, :class, "")}")

    Form.number_input(form, field, opts ++ Form.input_validations(form, field))
  end

  def text_input(form, field, opts \\ []),
    do: Form.text_input(form, field, opts ++ Form.input_validations(form, field))

  def url_input(form, field, opts \\ []),
    do: Form.url_input(form, field, opts ++ Form.input_validations(form, field))

  def select(form, field, options, opts \\ []),
    do: Form.select(form, field, options, opts ++ Form.input_validations(form, field))
end
