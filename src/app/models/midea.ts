import { Service } from "./service";
import { User } from "./user";

export interface Midea {
  id: number;
  user_id: number;
  service_id: number;
  parent_id: number;
  type: 'folder' | 'midea';
  description: string;
  path: string;
  user?: User;
  size: number;
  service?: Service;  
  comments: Comment[];
  create_at: Date;
  updated_at: Date;
  media_type: string;
}

export interface Comment {
  id: number;
  midea_id: number;
  comment: string;
  created_at: Date;
}