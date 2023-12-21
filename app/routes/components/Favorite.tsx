import type { FunctionComponent } from 'react'
import type { ContactRecord } from '../../data'
import { useFetcher } from '@remix-run/react'
import { Box } from '@chakra-ui/react'

const Favorite: FunctionComponent<{
  contact: Pick<ContactRecord, 'favorite'>
}> = ({ contact }) => {
  const fetcher = useFetcher()
  const favorite = fetcher.formData ? fetcher.formData.get('favorite') === 'true' : contact.favorite

  return (
    <fetcher.Form method='post'>
      <Box
        as='button'
        aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
        name='favorite'
        value={favorite ? 'false' : 'true'}
      >
        {favorite ? '★' : '☆'}
      </Box>
    </fetcher.Form>
  )
}

export default Favorite
