import { Form, NavLink, useNavigation, useSubmit } from '@remix-run/react'
import React, { useEffect } from 'react'
import { ContactRecord } from '../data'

import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton
} from '@chakra-ui/react'

type Props = {
  children: React.ReactNode
  contacts: ContactRecord[]
  q: string | null
}

const Sidebar = (props: Props) => {
  const { children, contacts, q } = props

  const navigation = useNavigation()
  const submit = useSubmit()
  const searching = navigation.location && new URLSearchParams(navigation.location.search).has('q')

  useEffect(() => {
    const searchField = document.getElementById('q')
    if (searchField instanceof HTMLInputElement) {
      searchField.value = q || ''
    }
  }, [q])

  return (
    <>
      <div id='sidebar'>
        <h1>Remix Contacts</h1>
        <div>
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
            <input
              id='q'
              defaultValue={q || ''}
              className={searching ? 'loading' : ''}
              aria-label='Search contacts'
              placeholder='Search'
              type='search'
              name='q'
            />
            <div
              id='search-spinner'
              aria-hidden
              hidden={!searching}
            />
          </Form>
          <Form method='post'>
            <button type='submit'>New</button>
          </Form>
        </div>
        <nav>
          {contacts.length ? (
            <ul>
              {contacts.map((contact) => (
                <li key={contact.id}>
                  <NavLink
                    className={({ isActive, isPending }) =>
                      isActive ? 'active' : isPending ? 'pending' : ''
                    }
                    to={`contacts/${contact.id}`}
                  >
                    {contact.first || contact.last ? (
                      <>
                        {contact.first} {contact.last}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}{' '}
                    {contact.favorite ? <span>★</span> : null}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No Contacts</i>
            </p>
          )}
        </nav>
      </div>
      <div
        className={navigation.state === 'loading' && !searching ? 'loading' : ''}
        id='detail'
      >
        {children}
      </div>
    </>
  )
}

export default Sidebar
