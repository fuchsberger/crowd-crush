# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.

alias CrowdCrush.Repo
alias CrowdCrush.Accounts.User

%User{}
|> User.registration_changeset(%{
  name: "Alexander Fuchsberger",
  username: "alex",
  credential: %{
    email: "admin@fuchsberger.us",
    password: "password"
  }
})
|> Repo.insert!
