export interface Service {
  id?: number;
  title: string;
  client_id: number;
  descripton?: string;
  users: number[];
}

export interface ServiceType {
  id?: number;
  type: string;
}
