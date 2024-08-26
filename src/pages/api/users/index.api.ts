import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'

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

  return res.status(200).json(user)
}
