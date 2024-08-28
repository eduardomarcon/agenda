import { Button, Heading, MultiStep, Text } from '@ignite-ui/react'
import { ArrowRight, Check } from 'phosphor-react'
import { Container, Header } from '@/pages/register/styles'
import {
  AuthError,
  ConnectBox,
  ConnectItem,
} from '@/pages/register/connect-calendar/styles'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

export default function Register() {
  const session = useSession()
  const router = useRouter()
  const hasAuthError = !!router.query.error
  const isSignedId = session.status === 'authenticated'

  async function handleConnectCalendar() {
    await signIn('google')
  }

  return (
    <Container>
      <Header>
        <Heading as="strong">connect your calendar!</Heading>
        <Text>
          connect your calendar to automatically check busy times and new events
          as they are scheduled
        </Text>

        <MultiStep size={4} currentStep={2} />
      </Header>

      <ConnectBox>
        <ConnectItem>
          <Text>google calendar</Text>
          {isSignedId ? (
            <Button size="sm" disabled>
              connected
              <Check />
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleConnectCalendar}
            >
              connect
              <ArrowRight />
            </Button>
          )}
        </ConnectItem>

        {hasAuthError && (
          <AuthError size="sm">
            failed to connect to Google, please check if you have enabled google
            calendar access permissions
          </AuthError>
        )}

        <Button type="submit" disabled={!isSignedId}>
          next
          <ArrowRight />
        </Button>
      </ConnectBox>
    </Container>
  )
}
