'use server'

import bcrypt from 'bcryptjs'
import type * as z from 'zod'

import { getUserByEmail, getUserById } from '@/data/user'
import { currentUser } from '@/lib/auth'
import { sendVerificationEmail } from '@/lib/mail'
import { generateVerificationToken } from '@/lib/tokens'
import type { SettingsSchema } from '@/schemas'
import { db } from '@/lib/db'
// import { update } from '@/auth'

export const settings = async (values: z.infer<typeof SettingsSchema>) => {
  try {
    const user = await currentUser()

    if (!user) {
      return { error: 'Unauthorized' }
    }

    const dbUser = await getUserById(user.id as string)

    if (!dbUser) {
      return { error: 'Unauthorized' }
    }

    if (user.isOAuth) {
      values.email = undefined
      values.password = undefined
      values.newPassword = undefined
      values.isTwoFactorEnabled = undefined
    }

    if (values.email && values.email !== user.email) {
      const existingUser = await getUserByEmail(values.email as string)

      if (existingUser && existingUser.id !== user.id) {
        return { error: 'Email already in use!' }
      }

      const verificationToken = await generateVerificationToken(
        values.email as string,
      )

      await sendVerificationEmail(
        verificationToken.email,
        verificationToken.token,
      )

      return { success: 'Verification email sent' }
    }

    if (values.password && values.newPassword && dbUser.password) {
      const passwordsMatch = await bcrypt.compare(
        values.password as string,
        dbUser.password,
      )

      if (!passwordsMatch) {
        return { error: 'Invalid password!' }
      }

      const hashedPassword = await bcrypt.hash(values.newPassword as string, 10)
      values.password = hashedPassword
      values.newPassword = undefined
    }

    // const updatedUser = await db.user.update({
    await db.user.update({
      where: {
        id: dbUser.id,
      },
      data: {
        ...values,
      },
    })

    // update({
    //   user: {
    //     name: updatedUser.name,
    //     email: updatedUser.email,
    //     isTwoFactorEnabled: updatedUser.isTwoFactorEnabled,
    //     role: updatedUser.role,
    //   },
    // })

    return { success: 'Settings Updated!' }
  } catch (error) {
    console.log({ ERROR: error })
  }
}
