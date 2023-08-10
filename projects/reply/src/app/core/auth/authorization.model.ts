export interface Authorization {
  token: string;
  issuedAt: Date;
  lifespan: number;
}
