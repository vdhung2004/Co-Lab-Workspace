// src/schemas/floor.schema.ts
import { z } from "zod";

export const createFloorSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Tên floor không được để trống"),
    imageUrl: z.string().url().optional(),
    width: z.number().min(1),
    height: z.number().min(1),
  }),
});

export const updateFloorSchema = z.object({
  body: z
    .object({
      name: z.string().optional(),
      imageUrl: z.string().url().optional(),
      width: z.number().optional(),
      height: z.number().optional(),
    })
    .partial(),
});
export type CreateFloorInput = z.infer<typeof createFloorSchema>["body"];
export type UpdateFloorInput = z.infer<typeof updateFloorSchema>["body"];
