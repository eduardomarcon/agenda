import { Button, Heading, MultiStep, Text } from '@ignite-ui/react'
import { ArrowRight } from 'phosphor-react'
import { Container, Header } from '@/pages/register/styles'
import {
  ConnectBox,
  ConnectItem,
} from '@/pages/register/connect-calendar/styles'
import { signIn } from 'next-auth/react'

export default function Register() {
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
          <Button
            variant="secondary"
            size="sm"
            onClick={() => signIn('google')}
          >
            connect
            <ArrowRight />
          </Button>
        </ConnectItem>

        <Button type="submit">
          next
          <ArrowRight />
        </Button>
      </ConnectBox>
    </Container>
  )
}
