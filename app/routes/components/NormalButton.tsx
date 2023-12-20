import { Button } from '@chakra-ui/react'

type Props = {
  text: string
  onClick?: () => void
}

const NormalButton = (props: Props) => {
  const { text, onClick } = props
  return (
    <Button
      colorScheme='gray'
      color='black'
      type='submit'
      onClick={onClick}
    >
      {text}
    </Button>
  )
}

export default NormalButton
