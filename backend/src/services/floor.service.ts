import { prisma } from "../lib/prisma";
import { CreateFloorInput, UpdateFloorInput } from "../schemas/floor.schema";

export const FloorService = {
  // Lấy danh sách floor theo workspace
  getByWorkspace: async (workspaceId: string) => {
    return prisma.floor.findMany({
      where: { workspaceId },
      include: {
        spaces: true,
      },
    });
  },

  // Lấy 1 floor
  getById: async (id: string) => {
    return prisma.floor.findUnique({
      where: { id },
      include: {
        spaces: true,
      },
    });
  },

  // Tạo floor mới
  create: async (workspaceId: string, data: CreateFloorInput) => {
    // Kiểm tra workspace tồn tại
    const exists = await prisma.workspace.findUnique({
      where: { id: workspaceId },
    });

    if (!exists) throw { status: 404, message: "Workspace không tồn tại" };

    return prisma.floor.create({
      data: {
        workspaceId,
        name: data.name,
        imageUrl: data.imageUrl,
        width: data.width,
        height: data.height,
      },
    });
  },

  // Cập nhật floor
  update: async (id: string, data: UpdateFloorInput) => {
    return prisma.floor.update({
      where: { id },
      data,
    });
  },

  // Xóa floor (phải xoá hết space)
  delete: async (id: string) => {
    await prisma.$transaction(async (tx) => {
      // Xóa images của space
      await tx.spaceImage.deleteMany({
        where: { space: { floorId: id } },
      });

      // Xóa amenities
      await tx.spaceAmenity.deleteMany({
        where: { space: { floorId: id } },
      });

      // Xóa bookingSpace
      await tx.bookingSpace.deleteMany({
        where: { space: { floorId: id } },
      });

      // Xóa space
      await tx.space.deleteMany({
        where: { floorId: id },
      });

      // Xóa floor
      await tx.floor.delete({
        where: { id },
      });
    });

    return { message: "Xóa floor thành công" };
  },
};
