defmodule CrowdCrush.Accounts do

  alias CrowdCrush.Repo
  alias CrowdCrush.Accounts.User
  alias CrowdCrushWeb.UserView

  def get_user(id) do
    Repo.get(User, id)
  end

  def get_user_by_email(email) do
    Repo.get_by(User, [email: email])
  end

  def render_me(user) do
    Phoenix.View.render(UserView, "me.json", user)
  end

  def render_user(user) do
    Phoenix.View.render(UserView, "user.json", user)
  end

  def update_user(user, changes) do
    Repo.update(User.changeset(user, changes))
  end

  def validate_password(user, password) do
    Comeonin.Bcrypt.checkpw(password, user.encrypted_password)
  end
end