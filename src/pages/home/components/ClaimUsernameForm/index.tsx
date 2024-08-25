import { Button, TextInput, Text } from '@ignite-ui/react'
import { ArrowRight } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form, FormAnnotation } from './styles'
import { zodResolver } from '@hookform/resolvers/zod'

const claimUsernameFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'username must have at least 3 characters' })
    .regex(/^([a-z\\-]+)$/i, {
      message: 'username must have only letters and hyphens',
    })
    .transform((value) => value.toLowerCase()),
})

type ClaimUsernameFormData = z.infer<typeof claimUsernameFormSchema>

export function ClaimUsernameForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClaimUsernameFormData>({
    resolver: zodResolver(claimUsernameFormSchema),
  })

  async function handleClaimUsername(data: ClaimUsernameFormData) {
    console.log(data)
  }

  return (
    <>
      <Form as="form" onSubmit={handleSubmit(handleClaimUsername)}>
        <TextInput
          size="sm"
          prefix="m4code.com/"
          placeholder="your-username"
          {...register('username')}
        />
        <Button size="sm" type="submit">
          To claim
          <ArrowRight />
        </Button>
      </Form>

      <FormAnnotation>
        <Text size="sm">
          {errors.username ? errors.username.message : null}
        </Text>
      </FormAnnotation>
    </>
  )
}
