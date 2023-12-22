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
import Sidebar from './components/Sidebar'
import { createEmptyContact, getContacts } from './data'

import { getToast } from 'remix-toast'
import { ToastContainer, toast as notify } from 'react-toastify'
import toastStyles from 'react-toastify/dist/ReactToastify.css'
import { ModalProvider } from './hooks/useModals'
import ContainerLayout from './components/ContainerLayout'
import { ImageModalProvider } from './hooks/useImageModal'

export let links: LinksFunction = () => [
  { rel: 'stylesheet', href: appStylesHref },
  { rel: 'stylesheet', href: toastStyles }
]

export const action = async () => {
  //! add try catch here
  const contact = await createEmptyContact()
  return redirect(`/contacts/${contact.id}/edit`)
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // Extracts the toast from the request
  const { toast, headers } = await getToast(request)
  const url = new URL(request.url)
  const q = url.searchParams.get('q')
  const contacts = await getContacts(q)
  const cookies = request.headers.get('cookie') ?? ''
  // Important to pass in the headers so the toast is cleared properly
  return json({ contacts, q, cookies, toast }, { headers })
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

  const { toast } = useLoaderData<typeof loader>()

  useEffect(() => {
    if (!toast) return
    if (toast.type === 'error') {
      notify.error(toast.message)
    }
    if (toast.type === 'success') {
      notify.success(toast.message)
    }
    if (toast.type === 'info') {
      notify.info(toast.message)
    }
    if (toast.type === 'warning') {
      notify.warn(toast.message)
    }
  }, [toast])

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
        <meta name='viewport' content='width=device-width, initial-scale=1' />
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
        <ToastContainer
          position={'bottom-center'}
          autoClose={1500}
          hideProgressBar={false}
          theme={'light'}
        />
        <ChakraProvider colorModeManager={cookieStorageManagerSSR(cookies)} theme={theme}>
          <Sidebar contacts={contacts} searching={searching} q={q} />
          <ContainerLayout>{children}</ContainerLayout>
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

const styles = {
  global: {
    body: {
      sidebarWidth: '22rem'
    }
  }
}

const theme = extendTheme({ colors, styles })

export default function Root() {
  return (
    <Document>
      <ChakraProvider theme={theme}>
        <ModalProvider>
          <ImageModalProvider>
            <Outlet />
          </ImageModalProvider>
        </ModalProvider>
      </ChakraProvider>
    </Document>
  )
}
