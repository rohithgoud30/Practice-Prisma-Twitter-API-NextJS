import prisma from '@/prisma'
import { connectToDB } from '@/utils'
import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'

export const POST = async (req: Request) => {
  try {
    const { name, email, password } = await req.json()

    if (!name && !email && !password) {
      return NextResponse.json({ error: 'Invalid Data' }, { status: 422 })
    }
    await connectToDB()
    const existingUser: any = await prisma.user.findFirst({ where: { email } })
    if (!existingUser) {
      return NextResponse.json(
        { message: 'User already registered. Please Login' },
        { status: 403 }
      )
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const users = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })
    return NextResponse.json({ users }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
