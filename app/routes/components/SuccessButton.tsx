import { Button } from '@chakra-ui/react'

type Props = {
  text: string
  onClick?: () => void
}

const SuccessButton = (props: Props) => {
  const { text, onClick } = props
  return (
    <Button
      bg='hsl(224, 98%, 58%)'
      _hover={{
        bg: 'hsl(224, 98%, 40%)'
      }}
      color='white'
      type='submit'
      onClick={onClick}
    >
      {text}
    </Button>
  )
}

export default SuccessButton
