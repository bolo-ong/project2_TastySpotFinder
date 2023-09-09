import { UserType } from "../models/User";

declare global {
  namespace Express {
    export interface User extends UserType {}
  }
}
