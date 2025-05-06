export class UserEntity {
  id: number | undefined;

  username!: string;

  password: string | undefined;

  role: Role = Role.User;
}

export class NewUserEntity {
  constructor(
    public username: string,
    public password: string
  ) {}
}

export enum Role {
  User = "user",
  PremiumUser = "premium",
  Admin = "admin",
}
