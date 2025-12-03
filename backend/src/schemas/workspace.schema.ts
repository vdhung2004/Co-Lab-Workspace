import { z } from "zod";
export const workspaceSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    address: z.string().min(5),
    description: z.string(),
    latitude: z.number(),
    longitude: z.number(),
    status: z.enum(["active", "inactive"]),
    images: z.array(z.string().url()).optional(),
  }),
});
export type IWorkspace = z.infer<typeof workspaceSchema>["body"];
