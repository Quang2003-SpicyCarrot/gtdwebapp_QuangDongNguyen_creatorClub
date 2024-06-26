import { Prisma, PrismaClient } from "@prisma/client";
import { NextResponse, type NextRequest } from "next/server";

const handler = async (req: NextRequest, res: NextResponse) => {
  if (process.env.E2E !== "true") {
    throw new Error("This endpoint is only available in E2E mode");
  }

  const prisma = new PrismaClient();

  // erase every single table
  const modelNames = Prisma.dmmf.datamodel.models.map((model) => model.name);
  for (const modelName of modelNames) {
    // handle async stuff
    await (prisma as Any)[modelName].deleteMany();
  }

  // seed users
  await prisma.user.create({
    data: {
      id: "1",
      name: "Test User",
      email: "test@user.com",
      image: "image.png",
      emailVerified: new Date(),
    },
  });

  return NextResponse.json({
    message: "Database Seeded",
  });
};

export { handler as GET, handler as POST };
