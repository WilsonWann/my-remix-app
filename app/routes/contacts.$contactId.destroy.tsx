import type { ActionFunctionArgs } from '@remix-run/node'
import invariant from 'tiny-invariant'

import { deleteContact } from '../data'
import { redirectWithSuccess } from 'remix-toast'

export const action = async ({ params }: ActionFunctionArgs) => {
  invariant(params.contactId, 'Missing contactId param')
  //! add try catch here
  await deleteContact(params.contactId)
  return redirectWithSuccess('/', '刪除成功！')
}
