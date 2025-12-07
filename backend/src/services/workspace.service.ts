// src/service/workspace.service.ts
import { Prisma } from "../generated/prisma/client";
import { prisma } from "../lib/prisma";
import { IWorkspace } from "../schemas/workspace.schema";

interface GetAllOptions {
  page?: number;
  limit?: number;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export const WorkspaceService = {
  // Lấy tất cả workspaces với phân trang, lọc và sắp xếp
  getAll: async (options: GetAllOptions = {}) => {
    const {
      page = 1,
      limit = 10,
      status,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = options;

    const where: any = {};
    if (status) where.status = status;

    const total = await prisma.workspace.count({ where });

    const workspaces = await prisma.workspace.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        floors: true,
        images: true,
      },
    });

    return { total, page, limit, workspaces };
  },
  // Lấy workspace theo ID
  getById: async (id: string) => {
    const workspace = await prisma.workspace.findUnique({
      where: { id },
      include: { floors: true, images: true },
    });
    console.log("Fetched workspace:", workspace);
    return workspace;
  },
  // Tạo mới workspace
  create: async (data: IWorkspace & { images?: string[] }) => {
    const workspace = await prisma.workspace.create({
      data: {
        name: data.name,
        address: data.address,
        description: data.description,
        latitude: data.latitude,
        longitude: data.longitude,
        status: data.status,
        images: {
          create: data.images?.map((url) => ({ url })) || [],
        },
      },
      include: { images: true },
    });
    return workspace;
  },
  // Cập nhật workspace
  update: async (id: string, data: Prisma.WorkspaceUpdateInput) => {
    const workspace = await prisma.workspace.update({
      where: { id },
      data: data,
      include: { images: true },
    });
    return workspace;
  },
  // Xóa workspace
  delete: async (id: string) => {
    // 1. Kiểm tra workspace có tồn tại không
    const workspace = await prisma.workspace.findUnique({
      where: { id },
    });

    if (!workspace) {
      throw { status: 404, message: "Workspace không tồn tại" };
    }

    // 3. Xoá theo THỨ TỰ AN TOÀN
    await prisma.$transaction(async (tx) => {
      // =============================
      //  3.5 Xóa floors
      // =============================
      await tx.floor.deleteMany({
        where: { workspaceId: id },
      });

      // =============================
      //  3.6 Xóa workspace cuối cùng
      // =============================
      await tx.workspace.delete({
        where: { id: id },
      });
    });

    return { message: "Xóa workspace thành công" };
  },
  // Thêm hình ảnh cho workspace
  addImage: async (workspaceId: string, url: string) => {
    return prisma.workspaceImage.create({
      data: { url, workspaceId },
    });
  },
  // Cập nhật hình ảnh workspace
  updateImage: async (imageId: string, url: string) => {
    return prisma.workspaceImage.update({
      where: { id: imageId },
      data: { url },
    });
  },
  // Xóa hình ảnh workspace
  deleteImage: async (imageId: string) => {
    return prisma.workspaceImage.delete({
      where: { id: imageId },
    });
  },
};
