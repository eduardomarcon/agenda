import { Container, Form, FormError, Header } from '@/pages/register/styles'
import { Button, Heading, MultiStep, Text, TextInput } from '@ignite-ui/react'
import { ArrowRight } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { api } from '@/lib/axios'
import { AxiosError } from 'axios'
import { NextSeo } from 'next-seo'

const registerFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'username must have at least 3 characters' })
    .regex(/^([a-z\\-]+)$/i, {
      message: 'username must have only letters and hyphens',
    })
    .transform((value) => value.toLowerCase()),
  fullName: z
    .string()
    .min(3, { message: 'name must have at least 3 characters' }),
})

type RegisterFormData = z.infer<typeof registerFormSchema>

export default function Register() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({ resolver: zodResolver(registerFormSchema) })

  const router = useRouter()

  useEffect(() => {
    if (router.query.username) {
      setValue('username', String(router.query.username))
    }
  }, [router.query?.username, setValue])

  async function handleRegister(data: RegisterFormData) {
    try {
      await api.post('/users', {
        username: data.username,
        fullname: data.fullName,
      })

      await router.push('/register/connect-calendar')
    } catch (err) {
      if (err instanceof AxiosError && err.response?.data.message) {
        alert(err.response.data.message)
        return
      }

      console.error(err)
    }
  }

  return (
    <>
      <NextSeo title="create an account | agenda" />
      <Container>
        <Header>
          <Heading as="strong">welcome to agenda</Heading>
          <Text>we need some information to create your profile</Text>
          <MultiStep size={4} currentStep={1} />
        </Header>

        <Form as="form" onSubmit={handleSubmit(handleRegister)}>
          <label>
            <Text size="sm">username</Text>
            <TextInput
              crossOrigin={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
              prefix="m4code.com/"
              placeholder="your-username"
              {...register('username')}
            />
            {errors.username && (
              <FormError>{errors.username.message}</FormError>
            )}
          </label>
          <label>
            <Text size="sm">full name</Text>
            <TextInput
              crossOrigin={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
              placeholder="your full name"
              {...register('fullName')}
            />
            {errors.fullName && (
              <FormError>{errors.fullName.message}</FormError>
            )}
          </label>
          <Button disabled={isSubmitting}>
            next
            <ArrowRight />
          </Button>
        </Form>
      </Container>
    </>
  )
}
