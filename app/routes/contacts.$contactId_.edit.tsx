import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Form, useLoaderData, useNavigate } from '@remix-run/react'
import invariant from 'tiny-invariant'
import { Input, Box, Textarea, ButtonGroup } from '@chakra-ui/react'
import { getContact, updateContact } from '../data'
import NormalButton from './components/NormalButton'
import SuccessButton from './components/SuccessButton'
import { useTheme } from '@chakra-ui/react'
import MyFormControl from './components/MyFormControl'
import { redirectWithSuccess } from 'remix-toast'

export const action = async ({ params, request }: ActionFunctionArgs) => {
  invariant(params.contactId, 'Missing contactId param')
  const formData = await request.formData()
  const updates = Object.fromEntries(formData)
  //! add try catch here
  await updateContact(params.contactId, updates)
  return redirectWithSuccess(`/contacts/${params.contactId}`, '儲存成功！')
}

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
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

  const theme = useTheme()

  const height = theme.sizes[10]

  return (
    <Form id='contact-form' method='post'>
      <MyFormControl height={height} label={'Name'}>
        <Box as='div' display='flex' gap='4' h={'fit-content'}>
          <Input
            h={height}
            defaultValue={contact.first}
            aria-label='First name'
            name='first'
            type='text'
            placeholder='First'
          />
          <Input
            h={height}
            aria-label='Last name'
            defaultValue={contact.last}
            name='last'
            placeholder='Last'
            type='text'
          />
        </Box>
      </MyFormControl>
      <MyFormControl height={height} label={'Twitter'}>
        <Input
          h={height}
          defaultValue={contact.twitter}
          name='twitter'
          placeholder='@jack'
          type='text'
        />
      </MyFormControl>
      <MyFormControl height={height} label={'Avatar URL'}>
        <Input
          h={height}
          aria-label='Avatar URL'
          defaultValue={contact.avatar}
          name='avatar'
          placeholder='https://example.com/avatar.jpg'
          type='text'
        />
      </MyFormControl>
      <MyFormControl height={height} label={'Notes'}>
        <Textarea defaultValue={contact.notes} name='notes' rows={6} />
      </MyFormControl>
      <ButtonGroup display={'flex'} justifyContent={'flex-end'}>
        <SuccessButton text='Save' />
        <NormalButton onClick={() => navigate(-1)} text={'Cancel'} />
      </ButtonGroup>
    </Form>
  )
}
