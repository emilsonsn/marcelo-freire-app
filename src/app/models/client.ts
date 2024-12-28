export interface Client {
  id?: number;
  name: string;
  surname?: string;
  email: string;
  cpf_cnpj: string;
  phone: number;
  url?: string;
  gender?: string;
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
}
