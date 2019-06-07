# Script for populating the database. You can run it as:
# mix run priv/repo/seeds.exs

alias CrowdCrush.Repo
alias CrowdCrush.Accounts.User

%User{}
|> User.registration_changeset(%{
  username: "alex",
  credential: %{
    email: "admin@fuchsberger.us",
    password: "password"
  }
})
|> Repo.insert!
