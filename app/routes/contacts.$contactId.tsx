import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import invariant from 'tiny-invariant'
import { json } from '@remix-run/node'
import { Form, useLoaderData, useSubmit } from '@remix-run/react'

import { getContact, updateContact } from '../data'
import { Box, ButtonGroup, Container, Heading, Image } from '@chakra-ui/react'
import ChakraNavLink from '../components/ChakraNavLink'
import NormalButton from './components/NormalButton'
import AlertButton from './components/AlertButton'
import Favorite from './components/Favorite'
import useModals from '../hooks/useModals'
import { FormEvent } from 'react'

export const action = async ({ params, request }: ActionFunctionArgs) => {
  invariant(params.contactId, 'Missing contactId param')
  const formData = await request.formData()
  return updateContact(params.contactId, {
    favorite: formData.get('favorite') === 'true'
  })
}

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.contactId, 'Missing contactId param')
  const contact = await getContact(params.contactId)
  if (!contact) {
    throw new Response('Not Found', { status: 404 })
  }
  return json({ contact })
}

export default function Contact() {
  const { contact } = useLoaderData<typeof loader>()

  const submit = useSubmit()
  const { confirm } = useModals()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const response = await confirm('Are you sure you want to delete this contact?')
    if (!response) return
    submit({ contactId: contact.id }, { action: 'destroy', method: 'DELETE' })
  }

  return (
    <Container id='contact' gap='4' p={0}>
      <Box as='div'>
        <Image
          alt={`${contact.first} ${contact.last} avatar`}
          key={contact.avatar}
          src={contact.avatar}
        />
      </Box>

      <Box as='div'>
        <Heading as='h1' noOfLines={1}>
          {contact.first || contact.last ? (
            <>
              {contact.first} {contact.last}
            </>
          ) : (
            <i>No Name</i>
          )}{' '}
          <Favorite contact={contact} />
        </Heading>

        {contact.twitter ? (
          <Box as='p'>
            <ChakraNavLink isExternal={true} to={`https://twitter.com/${contact.twitter}`}>
              {contact.twitter}
            </ChakraNavLink>
          </Box>
        ) : null}

        {contact.notes ? <Box as='p'>{contact.notes}</Box> : null}

        <ButtonGroup gap='4'>
          <Form action='edit'>
            <NormalButton text='Edit' />
          </Form>

          <Form action='destroy' method='post' onSubmit={handleSubmit}>
            <AlertButton text='Delete' />
          </Form>
        </ButtonGroup>
      </Box>
    </Container>
  )
}
