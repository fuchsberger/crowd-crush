defmodule CrowdCrushWeb.ErrorHelpers do
  @moduledoc """
  Conveniences for translating and building error messages.
  """

  use Phoenix.HTML

  @doc """
  Generates a map with all invalid fields and their first error
  """
  def error_map(changeset), do:
    Map.new(changeset.errors, fn ({k, v}) -> {k, translate_error(v)} end)

  @doc """
  Generates a form field validation class if field was found
  """
  def error_class(form, field) do
    cond do
      form.errors[field] -> " is-invalid"
      form.params[Atom.to_string(field)] -> " is-valid"
      true -> ""
    end
  end

  @doc """
  Shows the error message for a specific field or blank if none found.
  """
  def error_msg(form, field) do
    Enum.map(Keyword.get_values(form.errors, field), fn (error) ->
      translate_error(error)
    end)
  end

  @doc """
  Generates tag for inlined form input errors.
  """
  def error_tag(form, field) do
    Enum.map(Keyword.get_values(form.errors, field), fn (error) ->
      content_tag :span, translate_error(error), class: "help-block"
    end)
  end

  @doc """
  Translates an error message using gettext.
  """
  def translate_error({msg, opts}) do
    # Because error messages were defined within Ecto, we must
    # call the Gettext module passing our Gettext backend. We
    # also use the "errors" domain as translations are placed
    # in the errors.po file.
    # Ecto will pass the :count keyword if the error message is
    # meant to be pluralized.
    # On your own code and templates, depending on whether you
    # need the message to be pluralized or not, this could be
    # written simply as:
    #
    #     dngettext "errors", "1 file", "%{count} files", count
    #     dgettext "errors", "is invalid"
    #
    if count = opts[:count] do
      Gettext.dngettext(CrowdCrushWeb.Gettext, "errors", msg, msg, count, opts)
    else
      Gettext.dgettext(CrowdCrushWeb.Gettext, "errors", msg, opts)
    end
  end

  def plural(integer) do
    if integer > 1, do: true, else: false
  end

  def plural(integer, :s) do
    if integer > 1, do: "s", else: ""
  end

  def return_error(socket, message), do: {:reply, {:error, %{ error: message}}, socket}
  def return_success(socket, message), do: {:reply, {:ok, %{ success: message }}, socket}
end
