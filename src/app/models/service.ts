import { Client } from "./client";
import { User } from "./user";

export interface Service {
  id?: number;
  title: string;
  client_id: number;
  descripton?: string;
  users: User[];
  client?: Client;
  status: ServiceStatus;
}


export enum ServiceStatus {
  Pending = "Pending",
  Deliver = "Deliver",
}

export interface ServiceType {
  id?: number;
  type: string;
}
