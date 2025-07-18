/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-namespace */
declare namespace Express {
  export interface Request {
    session: {
      user?: {
        _id: string;
        name: string;
        email: string;
      };
    } & import("express-session").Session;
    user: {
      _id: string;
      name: string;
      email: string;
    };
  }
}
