defmodule CrowdCrush.Accounts do
  @moduledoc """
  The Accounts context.
  """

  import Ecto.Query, warn: false

  alias CrowdCrush.Repo
  alias CrowdCrush.Accounts.{Credential, User}

  def get_user(id), do: Repo.get(User, id)
  def get_user_with_credential(id), do: Repo.preload(get_user(id), [:credential])

  def get_user_by_email(email) do
    from(u in User, join: c in assoc(u, :credential), where: c.email == ^email)
    |> Repo.one()
    |> Repo.preload(:credential)
  end

  def authenticate_by_email_and_pass(email, given_pass) do
    user = get_user_by_email(email)
    cond do
      user && Pbkdf2.verify_pass(given_pass, user.credential.password_hash) ->
        {:ok, user}
      user ->
        {:error, :unauthorized}
      true ->
        Pbkdf2.no_user_verify()
        {:error, :not_found}
    end
  end

  def update_user(id, changes) do
    Repo.get(User, id)
    |> User.changeset(changes)
    |> Repo.update()
  end

  def update_credential(%Credential{} = credential, attrs) do
    credential
    |> Credential.changeset(attrs)
    |> Repo.update()
  end
end
