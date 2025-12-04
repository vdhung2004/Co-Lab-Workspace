import { prisma } from "../lib/prisma";
import { CreateSpaceInput, UpdateSpaceInput } from "../schemas/space.schema";
export interface GetSpaceOptions {
  workspaceId?: string;
  floorId?: string;
  type?: string;
  status?: string;
  keyword?: string;
  minPrice?: number;
  maxPrice?: number;
  capacity?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export const SpaceService = {
  // Lấy danh sách space theo tầng
  getByFloorId: async (floorId: string) => {
    return prisma.space.findMany({
      where: { floorId },
      include: {
        images: true,
        amenities: {
          include: { amenity: true },
        },
      },
    });
  },
  // Lấy danh sách space của tất cả các tầng trong workspace
  getAll: async (opts: GetSpaceOptions = {}) => {
    const {
      workspaceId,
      floorId,
      type,
      status,
      keyword,
      minPrice,
      maxPrice,
      capacity,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = opts;

    const where: any = {};

    // Lọc theo Floor
    if (floorId) where.floorId = floorId;

    // Lọc theo Workspace (qua Floor)
    if (workspaceId) {
      where.floor = {
        workspaceId: workspaceId,
      };
    }

    if (type) where.type = type;
    if (status) where.status = status;
    if (capacity) where.capacity = { gte: capacity };

    if (minPrice || maxPrice) {
      where.priceHourly = {};
      if (minPrice) where.priceHourly.gte = minPrice;
      if (maxPrice) where.priceHourly.lte = maxPrice;
    }

    if (keyword) {
      where.OR = [
        { name: { contains: keyword, mode: "insensitive" } },
        { description: { contains: keyword, mode: "insensitive" } },
      ];
    }

    const total = await prisma.space.count({ where }); // (Dòng này đúng)

    const spaces = await prisma.space.findMany({
      where: where, // ⬅️ SỬA LẠI: Dùng biến 'where' đã xây dựng
      include: {
        floor: {
          include: {
            workspace: true,
          },
        },
        images: true,
        amenities: {
          include: { amenity: true },
        },
      },
      orderBy: { [sortBy]: sortOrder },
    });

    return { total, spaces };
  },
  // getAll: async (workspaceId: string) => {
  //   return prisma.space.findMany({
  //     where: { floor: { workspaceId } },
  //     include: {
  //       images: true,
  //       amenities: {
  //         include: { amenity: true },
  //       },
  //     },
  //   });
  // },

  // Lấy space theo ID
  getById: async (id: string) => {
    return prisma.space.findUnique({
      where: { id },
      include: {
        images: true,
        amenities: {
          include: { amenity: true },
        },
      },
    });
  },

  // Tạo space
  create: async (floorId: string, data: CreateSpaceInput) => {
    const floor = await prisma.floor.findUnique({
      where: { id: floorId },
    });
    if (!floor) throw { status: 404, message: "Floor không tồn tại" };

    return prisma.space.create({
      data: {
        floorId,
        name: data.name,
        type: data.type,
        capacity: data.capacity,
        priceHourly: data.priceHourly,
        description: data.description,
        status: data.status,
        positionX: data.positionX,
        positionY: data.positionY,
        images: {
          create: (data.images || []).map((url) => ({ url })),
        },
        amenities: {
          create: (data.amenities || []).map((a) => ({
            amenityId: a.id,
            quantity: a.quantity || 1,
          })),
        },
      },
      include: {
        images: true,
        amenities: true,
      },
    });
  },

  // Cập nhật space
  update: async (id: string, data: UpdateSpaceInput) => {
    return prisma.space.update({
      where: { id },
      data: {
        floorId: data.floorId,
        name: data.name,
        type: data.type,
        capacity: data.capacity,
        priceHourly: data.priceHourly,
        description: data.description,
        status: data.status,
        positionX: data.positionX,
        positionY: data.positionY,
        amenities: data.amenities
          ? {
              deleteMany: {},
              create: data.amenities.map((a) => ({
                amenityId: a.id,
                quantity: a.quantity || 1,
              })),
            }
          : undefined,
        images: data.images
          ? {
              deleteMany: {},
              create: data.images.map((url) => ({ url })),
            }
          : undefined,
      },
      include: {
        images: true,
        amenities: true,
      },
    });
  },

  // Xóa space
  delete: async (id: string) => {
    // Kiểm tra booking liên quan
    const bookingCount = await prisma.bookingSpace.count({
      where: { spaceId: id },
    });

    if (bookingCount > 0)
      throw {
        status: 400,
        message: "Không thể xóa space vì có booking liên quan",
      };

    await prisma.$transaction(async (tx) => {
      await tx.spaceImage.deleteMany({ where: { spaceId: id } });
      await tx.spaceAmenity.deleteMany({ where: { spaceId: id } });
      await tx.space.delete({ where: { id } });
    });

    return { message: "Xóa space thành công" };
  },
};
