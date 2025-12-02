// src/middlewares/validate.middleware.ts
import { Request, Response, NextFunction } from "express";
import { ZodTypeAny, ZodError } from "zod";

export const validate =
  (schema: ZodTypeAny) => (req: Request, res: Response, next: NextFunction) => {
    try {
      // Parse toàn bộ request
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Map lỗi gọn: field + message
        const formattedErrors = error.issues.map((issue) => ({
          field: issue.path.join("."), // body.email, query.page...
          message: issue.message,
        }));

        return res.status(400).json({
          status: "error",
          message: "Dữ liệu request không hợp lệ",
          errors: formattedErrors,
        });
      }

      return next(error);
    }
  };
