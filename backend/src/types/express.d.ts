// src/types/express.d.ts
import { DecodedUserPayLoad } from "./auth.t";

declare module "express" {
  interface Request {
    user?: DecodedUserPayLoad; // Thêm thuộc tính 'user'
  }
}
