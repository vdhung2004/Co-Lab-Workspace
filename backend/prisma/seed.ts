import { Decimal } from "@prisma/client/runtime/client";
import {
  PrismaClient,
  UserRole,
  UserStatus,
  WorkspaceStatus,
  FloorStatus,
  SpaceType,
  SpaceStatus,
  BookingStatus,
  PaymentProvider,
  PaymentStatus,
  RefundStatus,
} from "../src/generated/prisma/client";
import { adapter } from "../src/lib/prisma";

const prisma = new PrismaClient({ adapter });

// Hàm tiện ích để tạo ngày giờ ngẫu nhiên trong 6 tháng (quá khứ và tương lai)
const getRandomDate = (
  startMonthsAgo: number,
  endMonthsFuture: number
): Date => {
  const now = new Date();
  const start = new Date(
    now.getFullYear(),
    now.getMonth() - startMonthsAgo,
    now.getDate()
  );
  const end = new Date(
    now.getFullYear(),
    now.getMonth() + endMonthsFuture,
    now.getDate()
  );

  const randomTime =
    start.getTime() + Math.random() * (end.getTime() - start.getTime());
  const randomDate = new Date(randomTime);

  // Làm tròn đến giờ gần nhất để mô phỏng booking
  randomDate.setMinutes(0, 0, 0);
  return randomDate;
};

async function main() {
  console.log("--- BẮT ĐẦU SEEDING DỮ LIỆU VỚI ID DẠNG UUID ---");

  // --- 1. USERS ---
  const ADMIN_COUNT = 2;
  const CUSTOMER_COUNT = 50;
  const USERS_TO_CREATE = ADMIN_COUNT + CUSTOMER_COUNT;

  const createdUsers: any[] = [];

  // 1.1. Tạo Admin
  for (let i = 1; i <= ADMIN_COUNT; i++) {
    const user = await prisma.user.create({
      data: {
        // ID được tạo tự động (UUID)
        fullName: `Admin ${i}`,
        email: `admin${i}@colab.com`,
        phone: `090100000${i}`,
        passwordHash: `hashed_admin_password_${i}`,
        role: UserRole.admin,
        status: UserStatus.active,
        verified: true,
      },
    });
    createdUsers.push(user);
  }

  // 1.2. Tạo Customer
  for (let i = ADMIN_COUNT + 1; i <= USERS_TO_CREATE; i++) {
    const user = await prisma.user.create({
      data: {
        fullName: `Khách hàng ${i}`,
        email: `customer${i}@email.com`,
        phone: `09020000${i}`,
        passwordHash: `hashed_customer_password_${i}`,
        role: UserRole.customer,
        status: UserStatus.active,
        verified: true,
      },
    });
    createdUsers.push(user);
  }

  const userAdmin = createdUsers[0];
  const customers = createdUsers.slice(ADMIN_COUNT);
  console.log(`✅ 1. Đã tạo ${USERS_TO_CREATE} Users (ID là UUID)`);

  // --- 2. AMENITIES ---
  const amenitiesData = [
    { name: "Wifi tốc độ cao", icon: "wifi" },
    { name: "Máy chiếu", icon: "projector" },
    { name: "Ổ cắm điện", icon: "socket" },
    { name: "Cà phê & trà", icon: "coffee" },
    { name: "Bảng trắng", icon: "whiteboard" },
  ];

  const amenities = await Promise.all(
    amenitiesData.map((data) =>
      prisma.amenity.create({
        data: data,
      })
    )
  );
  const amenityWifi = amenities[0];
  const amenityProjector = amenities[1];
  const amenitySocket = amenities[2];
  console.log(`✅ 2. Đã tạo ${amenities.length} Amenities`);

  // --- 3. WORKSPACES ---
  const workspace1 = await prisma.workspace.create({
    data: {
      name: "SaiGon Central Hub",
      address: "100 Lê Duẩn, Quận 1, TP.HCM",
      description: "Không gian làm việc chung cao cấp.",
      latitude: 10.7801,
      longitude: 106.7032,
      status: WorkspaceStatus.active,
      images: {
        create: [
          { url: "https://images.colab.vn/ws/sg_main1.jpg" },
          { url: "https://images.colab.vn/ws/sg_main2.jpg" },
        ],
      },
    },
  });
  console.log(`✅ 3. Đã tạo 1 Workspace`);

  // --- 4. FLOORS ---
  const floor1 = await prisma.floor.create({
    data: {
      workspaceId: workspace1.id,
      name: "Tầng 1 - Coworking",
      imageUrl: "https://images.colab.vn/floor/map_f1.png",
      status: FloorStatus.active,
      width: 500,
      height: 300,
    },
  });
  console.log(`✅ 4. Đã tạo 1 Floor`);

  // --- 5. SPACES (20 Spaces) ---
  const SPACE_COUNT = 20;
  const createdSpaces: any[] = [];

  for (let i = 1; i <= SPACE_COUNT; i++) {
    const isMeetingRoom = i % 5 === 0;

    const space = await prisma.space.create({
      data: {
        floorId: floor1.id, // FK là UUID
        name: isMeetingRoom ? `Meeting M${i}` : `Desk D${i}`,
        type: isMeetingRoom ? SpaceType.meeting_room : SpaceType.desk,
        capacity: isMeetingRoom ? 8 : 1,
        priceHourly: isMeetingRoom
          ? new Decimal(300000.0)
          : new Decimal(25000.0),
        description: isMeetingRoom
          ? "Phòng họp tiêu chuẩn"
          : "Bàn làm việc cá nhân",
        status: i % 10 === 0 ? SpaceStatus.maintenance : SpaceStatus.available,
        positionX: (i % 5) * 50 + 10,
        positionY: Math.floor(i / 5) * 60 + 10,

        // Tạo liên kết SpaceAmenity (sử dụng ID là UUID của Amenity)
        amenities: {
          create: [
            { amenityId: amenityWifi.id, quantity: 1 },
            { amenityId: amenitySocket.id, quantity: 1 },
            ...(isMeetingRoom
              ? [{ amenityId: amenityProjector.id, quantity: 1 }]
              : []),
          ],
        },
        images: {
          create: [{ url: `https://images.colab.vn/space/img_${i}_1.jpg` }],
        },
      },
    });
    createdSpaces.push(space);
  }
  const availableSpaces = createdSpaces.filter(
    (s) => s.status === SpaceStatus.available
  );
  console.log(`✅ 5. Đã tạo ${SPACE_COUNT} Spaces`);

  // --- 6. BOOKINGS (150 Bookings) ---
  const BOOKING_COUNT = 150;

  for (let i = 0; i < BOOKING_COUNT; i++) {
    const randomCustomer =
      customers[Math.floor(Math.random() * customers.length)];
    const randomSpace =
      availableSpaces[Math.floor(Math.random() * availableSpaces.length)];

    // Đảm bảo thời gian hợp lý và EndTime > StartTime
    const startTime = getRandomDate(6, 6);
    const endTime = new Date(
      startTime.getTime() + (Math.random() * 3 + 1) * 60 * 60 * 1000
    ); // 1-4 tiếng sau

    let status: BookingStatus;
    if (new Date() > endTime) {
      status =
        Math.random() < 0.8 ? BookingStatus.completed : BookingStatus.cancelled;
    } else {
      status =
        Math.random() < 0.9 ? BookingStatus.confirmed : BookingStatus.pending;
    }

    const price = randomSpace.priceHourly.mul(
      new Decimal((endTime.getTime() - startTime.getTime()) / (60 * 60 * 1000))
    );

    await prisma.booking.create({
      data: {
        userId: randomCustomer.id, // FK là UUID
        bookerEmail: randomCustomer.email,
        bookerPhone: randomCustomer.phone,
        bookerFullname: randomCustomer.fullName,
        startTime: startTime,
        endTime: endTime,
        status: status,
        // Tạo liên kết BookingSpace (sử dụng ID là UUID của Space)
        spaces: {
          create: [{ spaceId: randomSpace.id }],
        },

        // Tạo Payment/Refund nếu confirmed/completed
        ...(status !== BookingStatus.pending &&
          status !== BookingStatus.cancelled && {
            payment: {
              create: {
                provider:
                  i % 2 === 0 ? PaymentProvider.momo : PaymentProvider.cash,
                amount: price,
                transactionCode: `TRANS-${i}-${Date.now()}`,
                status: PaymentStatus.success,

                // Tạo Refund ngẫu nhiên cho một số giao dịch (10%)
                ...(Math.random() < 0.1 && {
                  refund: {
                    create: {
                      processedBy: userAdmin.id, // FK là UUID
                      refundAmount: price.mul(new Decimal(0.5)),
                      refundRate: 50,
                      reason: "Khách hàng hủy bỏ sát giờ.",
                      status: RefundStatus.success,
                    },
                  },
                }),
              },
            },
          }),
      },
    });
  }
  console.log(`✅ 6. Đã tạo ${BOOKING_COUNT} Bookings`);
}

// async function deleteData() {
//   console.log('--- BẮT ĐẦU XÓA DỮ LIỆU CŨ ---');

//   // Xóa các bảng con (bảng transaction và N-M) trước
//   await prisma.refund.deleteMany();
//   await prisma.payment.deleteMany();
//   await prisma.bookingSpace.deleteMany();
//   await prisma.booking.deleteMany();

//   // Xóa các bảng sản phẩm và liên kết N-M
//   await prisma.spaceAmenity.deleteMany();
//   await prisma.spaceImage.deleteMany();
//   await prisma.space.deleteMany();

//   // Xóa các bảng cấu trúc
//   await prisma.floor.deleteMany();
//   await prisma.workspaceImage.deleteMany();
//   await prisma.workspace.deleteMany();

//   // Xóa các bảng danh mục và người dùng (bảng cha)
//   await prisma.amenity.deleteMany();
//   await prisma.user.deleteMany();

//   console.log('✅ Dữ liệu cũ đã được xóa thành công.');
// }

// async function main() {

//   await deleteData();

// }

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log("\n--- SEEDING HOÀN TẤT ---");
  });
