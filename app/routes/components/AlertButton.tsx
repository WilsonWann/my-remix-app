import { Button } from '@chakra-ui/react'

type Props = {
  text: string
}

const AlertButton = (props: Props) => {
  const { text } = props
  return (
    <Button
      colorScheme='red'
      color='white'
      type='submit'
    >
      {text}
    </Button>
  )
}

export default AlertButton
