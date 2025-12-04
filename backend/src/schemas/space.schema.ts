import { z } from "zod";

const SpaceTypeEnum = z.enum(["desk", "meeting_room"]);
const SpaceStatusEnum = z.enum(["available", "maintenance"]);
const SortDirection = z.enum(["asc", "desc"]).default("desc");

// --- CREATE ---
export const createSpaceSchema = z.object({
  // Tham số floorId sẽ nằm trong params/path, nên không cần trong body
  body: z.object({
    // floorId: z.string().min(1, "Floor ID là bắt buộc"), // Đã chuyển sang params
    name: z.string().min(1, "Tên không gian là bắt buộc"),
    type: SpaceTypeEnum,
    capacity: z.number().min(1, "Sức chứa tối thiểu là 1"),
    priceHourly: z.number().min(0, "Giá phải là số không âm"),
    description: z.string(),
    status: SpaceStatusEnum.default("available"),
    positionX: z.number().optional(),
    positionY: z.number().optional(),
    images: z.array(z.string().url()).optional(),
    amenities: z
      .array(
        z.object({
          id: z.string(),
          quantity: z.number().min(1).default(1),
        })
      )
      .optional(),
  }),
  params: z.object({
    floorId: z.string().min(1, "Floor ID là bắt buộc"),
  }),
});

// --- UPDATE ---
export const updateSpaceSchema = z.object({
  body: z
    .object({
      floorId: z.string().optional(), // Cho phép chuyển Space sang Floor khác
      name: z.string().optional(),
      type: SpaceTypeEnum.optional(),
      capacity: z.number().optional(),
      priceHourly: z.number().optional(),
      description: z.string().optional(),
      status: SpaceStatusEnum.optional(),
      positionX: z.number().optional(),
      positionY: z.number().optional(),
      images: z.array(z.string().url()).optional(),
      amenities: z
        .array(
          z.object({
            id: z.string(),
            quantity: z.number().min(1).optional(),
          })
        )
        .optional(),
    })
    .partial(),
  params: z.object({
    id: z.string().min(1, "Space ID là bắt buộc"),
  }),
});

export const getDeleteSpaceSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Space ID là bắt buộc"),
  }),
});

export const listSpaceSchema = z.object({
  params: z.object({
    floorId: z.string().min(1, "Floor ID là bắt buộc"),
  }),
});

export type CreateSpaceInput = z.infer<typeof createSpaceSchema>["body"];
export type UpdateSpaceInput = z.infer<typeof updateSpaceSchema>["body"];
export type GetDeleteSpaceParams = z.infer<
  typeof getDeleteSpaceSchema
>["params"];
export type ListSpaceParams = z.infer<typeof listSpaceSchema>["params"];
