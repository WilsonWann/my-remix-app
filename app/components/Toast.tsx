import { LinksFunction } from '@remix-run/node'
import React, { useEffect } from 'react'
import { ToastContainer, toast as notify } from 'react-toastify'
import toastStyles from 'react-toastify/dist/ReactToastify.css'

export let links: LinksFunction = () => [{ rel: 'stylesheet', href: toastStyles }]

type Props = {
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
}

const Toast = (props: Props) => {
  const { message, type } = props

  // Hook to show the toasts
  useEffect(() => {
    if (type === 'error') {
      notify.error(message)
    }
    if (type === 'success') {
      notify.success(message)
    }
  }, [message, type])

  // return (
  //   <ToastContainer
  //     position={'bottom-center'}
  //     autoClose={5000}
  //     hideProgressBar={false}
  //     pauseOnHover
  //     theme={'light'}
  //   />
  // )
}

export default Toast
