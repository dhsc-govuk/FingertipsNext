type ISODateString = string;

export interface Session {
  user?: User;
  expires: ISODateString;
}

export interface User {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}
