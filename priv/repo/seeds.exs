# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.

alias CrowdCrush.Repo
alias CrowdCrush.Accounts.User

%User{}
|> User.changeset(%{
  first_name: "Joe",
  last_name: "Doe",
  email: "joe@doe.com",
  password: "password"
})
|> Repo.insert!
