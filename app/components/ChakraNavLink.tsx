import React from 'react'
import { NavLink as RemixRouterLink } from '@remix-run/react'
import { Link as ChakraLink } from '@chakra-ui/react'

type Props = {
  to: string
  isExternal?: boolean
  children: React.ReactNode
}
const ChakraNavLink = (props: Props) => {
  const { to, isExternal = false, children } = props
  return (
    <ChakraLink
      as={RemixRouterLink}
      isExternal={isExternal}
      to={to}
      _activeLink={{
        bg: 'hsl(224, 98%, 58%)',
        color: 'white'
      }}
    >
      {children}
    </ChakraLink>
  )
}

export default ChakraNavLink
