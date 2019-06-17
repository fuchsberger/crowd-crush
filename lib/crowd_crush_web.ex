defmodule CrowdCrushWeb do
  @moduledoc """
  A module that keeps using definitions for controllers,
  views and so on.

  This can be used in your application as:

      use CrowdCrushWeb, :controller
      use CrowdCrushWeb, :view

  The definitions below will be executed for every view,
  controller, etc, so keep them short and clean, focused
  on imports, uses and aliases.

  Do NOT define functions inside the quoted expressions
  below.
  """

  def controller do
    quote do
      use Phoenix.Controller, namespace: CrowdCrushWeb

      import Plug.Conn
      import CrowdCrushWeb.Gettext

      alias CrowdCrushWeb.Router.Helpers, as: Routes

      require Logger
    end
  end

  def view do
    quote do
      use Phoenix.HTML
      use Phoenix.View, root: "lib/crowd_crush_web/templates", namespace: CrowdCrushWeb

      import CrowdCrushWeb.{ErrorHelpers, Gettext}

      alias CrowdCrushWeb.Router.Helpers, as: Routes

      require Logger
    end
  end

  def router do
    quote do
      use Phoenix.Router

      import Plug.Conn
      import Phoenix.Controller
    end
  end

  def channel do
    quote do
      use Phoenix.Channel

      import CrowdCrushWeb.{ErrorHelpers, Gettext}

      alias Phoenix.View
      alias CrowdCrushWeb.Endpoint

      require Logger
    end
  end

  @doc """
  When used, dispatch to the appropriate controller/view/etc.
  """
  defmacro __using__(which) when is_atom(which), do: apply(__MODULE__, which, [])
end
