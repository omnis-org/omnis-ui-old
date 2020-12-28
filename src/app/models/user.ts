export class User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  admin: boolean;
}

export class UserToken {
  token: string;
  expireAt: number;
}
