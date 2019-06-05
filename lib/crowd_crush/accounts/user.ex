defmodule CrowdCrush.Accounts.User do
  use CrowdCrush, :schema

  import Comeonin.Bcrypt, only: [hashpwsalt: 1]

  @derive { Jason.Encoder, only: [:first_name, :last_name, :email ]}

  schema "users" do
    field :first_name, :string
    field :last_name, :string
    field :email, :string
    field :encrypted_password, :string
    field :current_password, :string, virtual: true
    field :password, :string, virtual: true
    timestamps()
  end

  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:current_password, :first_name, :last_name, :email, :password])
    |> validate_required([:first_name, :last_name, :email])
    |> generate_encrypted_password
    |> unique_constraint(:email, message: "Email already taken")
  end

  defp generate_encrypted_password(current_changeset) do
    case current_changeset do
      %Ecto.Changeset{valid?: true, changes: %{password: password}} ->
        put_change(current_changeset, :encrypted_password, hashpwsalt(password))
      _ ->
        current_changeset
    end
  end
end
