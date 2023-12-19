import { Button } from '@chakra-ui/react'

type Props = {
  text: string
}

const SuccessButton = (props: Props) => {
  const { text } = props
  return (
    <Button
      bg='hsl(224, 98%, 58%)'
      _hover={{
        bg: 'hsl(224, 98%, 40%)'
      }}
      color='white'
      type='submit'
    >
      {text}
    </Button>
  )
}

export default SuccessButton
