export interface User {
  id? : number;
  name : string;
  email : string;
  phone : string;
  cpf : string;
  cpf_cnpj: string;
  birth_date: Date;
  function: string;
  role: string;
  createdAt : string;
  updatedAt : string;

  sector?: UserSector;
  company_position?: UserPosition;
}

export interface UserPosition {
  id? : string,
  position : string
}

export interface UserSector {
  id? : number,
  sector : string
}

export interface UserCards {
  total: number;
  active: number;
  inactive: number;
}

export enum UserStatus {
	ATIVO = 'ACTIVE',
	INATIVO = 'INACTIVE',
	BLOQUEADO = 'BLOCKED',
}


export enum Positions { //Gerente/Gestor/Adm/Tiago
  Admin = 'Admin',
  Financial = 'Financial',
  Supplies = 'Supplies',
  Requester = 'Requester'
}
