import { Heading, Text } from '@ignite-ui/react'
import Image from 'next/image'
import { Calendar, Container, Hero } from '@/pages/home/styles'

import calendarImage from '../../assets/calendar.png'
import { ClaimUsernameForm } from '@/pages/home/components/ClaimUsernameForm'
import { NextSeo } from 'next-seo'

export default function Home() {
  return (
    <>
      <NextSeo
        title="easier schedule | agenda"
        description="connect your calendar and let people schedule a meeting with you"
      />

      <Container>
        <Hero>
          <Heading as="h1" size="4xl">
            easier schedule
          </Heading>
          <Text size="xl">
            connect your calendar and let people schedule a meeting with you
          </Text>

          <ClaimUsernameForm />
        </Hero>

        <Calendar>
          <Image
            src={calendarImage}
            height={400}
            quality={100}
            priority
            alt="Calendário simbolizando aplicação em funcionamento"
          />
        </Calendar>
      </Container>
    </>
  )
}
