import { FormControl, FormLabel } from '@chakra-ui/react'
import React from 'react'

type Props = {
  height: string
  label: string
  children: React.ReactNode
}

function MyFormControl({ height, label, children }: Props) {
  return (
    <FormControl display='flex' flexDirection={'row'} gap={'4'}>
      <MyFormLabel height={height} label={label} />
      {children}
    </FormControl>
  )
}

export default MyFormControl

function MyFormLabel({ height, label }: { height: string; label: string }) {
  return (
    <FormLabel display={'flex'} alignItems={'flex-start'} lineHeight={height}>
      {label}
    </FormLabel>
  )
}
