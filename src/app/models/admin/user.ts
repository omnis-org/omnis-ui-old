export class User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  roleId: number;
}

export class UserToken {
  token: string;
  expireAt: number;
}
