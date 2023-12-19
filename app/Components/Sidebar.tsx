import { Form, useNavigation, useSubmit } from '@remix-run/react'
import React, { useEffect } from 'react'
import { ContactRecord } from '../data'

import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  useDisclosure,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  VStack,
  StackDivider,
  Box,
  Spinner,
  Container,
  Heading,
  Text
} from '@chakra-ui/react'
import ChakraNavLink from './ChakraNavLink'
import { useTheme } from '@emotion/react'

type Props = {
  searching: boolean
  contacts: ContactRecord[]
  q: string | null
}

const Sidebar = (props: Props) => {
  const { searching, contacts, q } = props
  const submit = useSubmit()

  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = React.useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    const searchField = document.getElementById('q')
    if (searchField instanceof HTMLInputElement) {
      searchField.value = q || ''
    }
  }, [q])

  return (
    <Container
      as='div'
      id='sidebar'
    >
      <Heading as='h1'>Remix Contacts</Heading>
      <Box>
        <Form
          id='search-form'
          onChange={(event) => {
            const isFirstSearch = q === null
            submit(event.currentTarget, {
              replace: !isFirstSearch
            })
          }}
          role='search'
        >
          <Input
            id='q'
            defaultValue={q || ''}
            className={searching ? 'loading' : ''}
            aria-label='Search contacts'
            placeholder='Search'
            type='search'
            name='q'
          />
          <Spinner
            id='search-spinner'
            size='xs'
            aria-hidden
            speed={'0.6s'}
            hidden={!searching}
          />
        </Form>
        <Form method='post'>
          <Button
            colorScheme='gray'
            color='black'
            type='submit'
          >
            New
          </Button>
        </Form>
      </Box>
      <Box as='nav'>
        {contacts.length ? (
          <VStack
            as='ul'
            divider={<StackDivider borderColor='gray.200' />}
            spacing={4}
            alignItems={'flex-start'}
          >
            {contacts.map((contact) => (
              <Box
                as='li'
                h='40px'
                w={'100%'}
                key={contact.id}
              >
                <ChakraNavLink to={`contacts/${contact.id}`}>
                  {contact.first || contact.last ? (
                    <>
                      {contact.first} {contact.last}
                    </>
                  ) : (
                    <Text as='i'>No Name</Text>
                  )}{' '}
                  {contact.favorite ? <Box as='span'>★</Box> : null}
                </ChakraNavLink>
              </Box>
            ))}
          </VStack>
        ) : (
          <Box>
            <Text as='i'>No Contacts</Text>
          </Box>
        )}
      </Box>
    </Container>
  )
}

export default Sidebar
