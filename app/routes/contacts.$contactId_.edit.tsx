import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Form, useLoaderData, useNavigate } from '@remix-run/react'
import invariant from 'tiny-invariant'

import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Box,
  Textarea,
  ButtonGroup,
  Button
} from '@chakra-ui/react'

import { getContact, updateContact } from '../data'
import NormalButton from './components/NormalButton'
import SuccessButton from './components/SuccessButton'

export const action = async ({ params, request }: ActionFunctionArgs) => {
  invariant(params.contactId, 'Missing contactId param')
  const formData = await request.formData()
  const updates = Object.fromEntries(formData)
  await updateContact(params.contactId, updates)
  return redirect(`/contacts/${params.contactId}`)
}

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.contactId, 'Missing contactId param')
  const contact = await getContact(params.contactId)
  if (!contact) {
    throw new Response('Not Found', { status: 404 })
  }
  return json({ contact })
}

export default function EditContact() {
  const { contact } = useLoaderData<typeof loader>()
  const navigate = useNavigate()

  //! px: bad design
  return (
    <Form
      id='contact-form'
      method='post'
    >
      <MyFormControl>
        <FormLabel>Name</FormLabel>
        <Box
          as='div'
          display='flex'
          gap='4'
        >
          <Input
            defaultValue={contact.first}
            aria-label='First name'
            name='first'
            type='text'
            placeholder='First'
          />
          <Input
            aria-label='Last name'
            defaultValue={contact.last}
            name='last'
            placeholder='Last'
            type='text'
          />
        </Box>
      </MyFormControl>
      <MyFormControl>
        <FormLabel>Twitter</FormLabel>
        <Input
          defaultValue={contact.twitter}
          name='twitter'
          placeholder='@jack'
          type='text'
        />
      </MyFormControl>
      <MyFormControl>
        <FormLabel>Avatar URL</FormLabel>
        <Input
          aria-label='Avatar URL'
          defaultValue={contact.avatar}
          name='avatar'
          placeholder='https://example.com/avatar.jpg'
          type='text'
        />
      </MyFormControl>
      <MyFormControl>
        <FormLabel>Notes</FormLabel>
        <Textarea
          defaultValue={contact.notes}
          name='notes'
          rows={6}
        />
      </MyFormControl>
      <ButtonGroup>
        <SuccessButton text='Save' />
        {/* <Button type='submit'>Save</Button> */}
        <NormalButton
          onClick={() => navigate(-1)}
          text={'Cancel'}
        />
      </ButtonGroup>
    </Form>
  )
}
function MyFormControl({ children }: { children: React.ReactNode }) {
  return (
    <FormControl
      display='flex'
      flexDirection={'row'}
      gap={'4'}
    >
      {children}
    </FormControl>
  )
}
