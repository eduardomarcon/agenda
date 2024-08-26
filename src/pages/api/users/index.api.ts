import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import { setCookie } from 'nookies'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    res.status(405).end()
  }

  const { username, fullname } = req.body

  const userExists = await prisma.user.findUnique({
    where: { username },
  })
  if (userExists) {
    res.status(400).json({ message: 'username already taken' })
  }

  const user = await prisma.user.create({
    data: {
      username,
      fullname,
    },
  })

  setCookie({ res }, '@m4code:userId', user.id, {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })

  return res.status(200).json(user)
}
