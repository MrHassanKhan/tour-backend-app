export interface ITokenPayload {
  id: string;
  phoneNumber: string;
  password: string;
}

export interface ITokenService {
  createToken: ({ id, phoneNumber, password }: ITokenPayload) => Promise<string>;
}
