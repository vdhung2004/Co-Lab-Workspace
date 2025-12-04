// src/schemas/amenity.schema.ts
import { z } from "zod";

export const createAmenitySchema = z.object({
  body: z.object({
    name: z.string().min(2, "Tên tiện ích quá ngắn"),
    icon: z.string().url("Icon phải là URL hợp lệ").optional(),
    description: z.string().optional(),
  }),
});

export const updateAmenitySchema = z.object({
  body: z
    .object({
      name: z.string().optional(),
      icon: z.string().url().optional(),
      description: z.string().optional(),
    })
    .partial(),
});
export type CreateAmenityInput = z.infer<typeof createAmenitySchema>["body"];
export type UpdateAmenityInput = z.infer<typeof updateAmenitySchema>["body"];
