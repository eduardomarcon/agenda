import { Button, TextInput } from '@ignite-ui/react'
import { ArrowRight } from 'phosphor-react'
import { Form } from './styles'

export function ClaimUsernameForm() {
  return (
    <Form as="form">
      <TextInput size="sm" prefix="m4code.com/" placeholder="your-username" />
      <Button size="sm" type="submit">
        To claim
        <ArrowRight />
      </Button>
    </Form>
  )
}
