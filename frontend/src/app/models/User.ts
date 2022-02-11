/**
 * this model specifies the format to exchange a user with the backend
 */
export class User{
  constructor(
    public _id: string,
    public employee_id: number,
    public username: string,
    public firstname: string,
    public lastname: string,
    public email: string,
    public isAdmin: boolean,
    public role: string
  ) {  }
}
