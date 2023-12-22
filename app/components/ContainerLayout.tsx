import { Container, useTheme } from '@chakra-ui/react'
import React from 'react'

type Props = {
  children: React.ReactNode
}

const ContainerLayout = (props: Props) => {
  const theme = useTheme()

  const { children } = props
  return (
    <Container
      as='div'
      id='detail'
      m={0}
      display={'flex'}
      flexDirection={'column'}
      alignItems={'flex-start'}
      maxW={`calc(100vw - ${theme.styles.global.body.sidebarWidth})`}
      maxH={'100vh'}
      overflow={'hidden'}
    >
      {children}
    </Container>
  )
}

export default ContainerLayout
