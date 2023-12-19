import React, { useContext, useEffect, useMemo } from 'react'
import { withEmotionCache } from '@emotion/react'
import { extendTheme, ChakraProvider, cookieStorageManagerSSR, Container } from '@chakra-ui/react'
import { ServerStyleContext, ClientStyleContext } from './context'

import type { LinksFunction, LoaderFunctionArgs } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useNavigation
} from '@remix-run/react'

import appStylesHref from './app.css'
import Sidebar from './Components/Sidebar'
import { createEmptyContact, getContacts } from './data'

export let links: LinksFunction = () => [{ rel: 'stylesheet', href: appStylesHref }]

export const action = async () => {
  const contact = await createEmptyContact()
  return redirect(`/contacts/${contact.id}/edit`)
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url)
  const q = url.searchParams.get('q')
  const contacts = await getContacts(q)
  const cookies = request.headers.get('cookie') ?? ''
  return json({ contacts, q, cookies })
}

interface DocumentProps {
  children: React.ReactNode
}

const Document = withEmotionCache(({ children }: DocumentProps, emotionCache) => {
  const serverStyleData = useContext(ServerStyleContext)
  const clientStyleData = useContext(ClientStyleContext)

  function getColorMode(cookies: string) {
    const match = cookies.match(new RegExp(`(^| )${CHAKRA_COOKIE_COLOR_KEY}=([^;]+)`))
    return match === null ? void 0 : match[2]
  }

  const navigation = useNavigation()
  const searching = navigation.location
    ? new URLSearchParams(navigation.location.search).has('q')
    : false

  const DEFAULT_COLOR_MODE: 'dark' | 'light' | null = 'light'

  const CHAKRA_COOKIE_COLOR_KEY = 'chakra-ui-color-mode'

  const { contacts, q } = useLoaderData<typeof loader>()
  let { cookies } = useLoaderData<typeof loader>()

  if (typeof document !== 'undefined') {
    cookies = document.cookie
  }

  let colorMode = useMemo(() => {
    let color = getColorMode(cookies)

    if (!color && DEFAULT_COLOR_MODE) {
      cookies += ` ${CHAKRA_COOKIE_COLOR_KEY}=${DEFAULT_COLOR_MODE}`
      color = DEFAULT_COLOR_MODE
    }

    return color
  }, [cookies])

  // Only executed on client
  useEffect(() => {
    // re-link sheet container
    emotionCache.sheet.container = document.head
    // rer-inject tags
    const tags = emotionCache.sheet.tags
    emotionCache.sheet.flush()
    tags.forEach((tag) => {
      ;(emotionCache.sheet as any)._insertTag(tag)
    })
    // reset cache to reapply global styles
    clientStyleData?.reset()
  }, [])

  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1'
        />
        <Meta />
        <Links />
        {serverStyleData?.map(({ key, ids, css }) => (
          <style
            key={key}
            data-emotion={`${key} ${ids.join(' ')}`}
            dangerouslySetInnerHTML={{ __html: css }}
          />
        ))}
      </head>
      <body
        {...(colorMode && {
          className: `chakra-ui-${colorMode}`
        })}
      >
        <ChakraProvider
          colorModeManager={cookieStorageManagerSSR(cookies)}
          theme={theme}
        >
          <Sidebar
            contacts={contacts}
            searching={searching}
            q={q}
          />
          <Container
            as='div'
            id='detail'
            m={0}
            display={'flex'}
            flexDirection={'column'}
            alignItems={'flex-start'}
            maxW={'fit-content'}
          >
            {children}
          </Container>
        </ChakraProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
})

const colors = {
  brand: {
    900: '#1a36d5',
    800: '#153e75',
    700: '#2a69ac'
  }
}

const theme = extendTheme({ colors })

export default function App() {
  return (
    <Document>
      <ChakraProvider theme={theme}>
        <Outlet />
      </ChakraProvider>
    </Document>
  )
}
