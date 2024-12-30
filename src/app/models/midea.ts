import { Service } from "./service";
import { User } from "./user";

export interface Midea {
  id: number;
  user_id: number;
  service_id: number;
  description: string;
  path: string;
  user?: User;
  service?: Service;
}
