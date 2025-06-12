import type { Role } from "@prisma/client"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      image?: string
      role: Role
    }
  }

  interface User {
    id: string
    name: string
    email: string
    role: Role
    image?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: Role
    image?: string
  }
}
