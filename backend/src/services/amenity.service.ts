// src/services/amenity.service.ts
import { prisma } from "../lib/prisma";

export const AmenityService = {
  getAll: async () => {
    return prisma.amenity.findMany({
      orderBy: { createdAt: "desc" },
    });
  },

  getById: async (id: string) => {
    const item = await prisma.amenity.findUnique({ where: { id } });
    if (!item) throw { status: 404, message: "Amenity không tồn tại" };
    return item;
  },

  create: async (data: any) => {
    return prisma.amenity.create({
      data,
    });
  },

  update: async (id: string, data: any) => {
    const existing = await prisma.amenity.findUnique({ where: { id } });
    if (!existing) throw { status: 404, message: "Amenity không tồn tại" };

    return prisma.amenity.update({
      where: { id },
      data,
    });
  },

  delete: async (id: string) => {
    const existing = await prisma.amenity.findUnique({ where: { id } });
    if (!existing) throw { status: 404, message: "Amenity không tồn tại" };

    // Kiểm tra amenity có đang được gán cho space nào không
    const count = await prisma.spaceAmenity.count({
      where: { amenityId: id },
    });

    if (count > 0) {
      throw {
        status: 400,
        message: "Không thể xóa vì đang được sử dụng bởi Space",
      };
    }

    await prisma.amenity.delete({ where: { id } });

    return { message: "Xóa amenity thành công" };
  },
};
