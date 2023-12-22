/*
 * Usage:
 *   const { alert, confirm, prompt } = useModals()
 *   alert("Hey!") // awaitable too
 *   if (await confirm("Are you sure?")) ...
 *   const result = await prompt("Enter a URL", "http://")
 */

import {
  Button,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Stack,
  Text,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Image
} from '@chakra-ui/react'
import { createContext, ReactNode, useCallback, useContext, useRef, useState } from 'react'

enum ImageModalType {
  Open
}

export type ImageModal = {
  open: (message: string | ReactNode, opts?: ImageModalOpenerProps) => Promise<boolean | null>
}

export type ImageModalOpenerProps = {
  alt?: string
  okText?: string
  icon?: ReactNode
  modalProps?: Partial<React.ComponentProps<typeof Modal>>
  okButtonProps?: Partial<React.ComponentProps<typeof Button>>
}

const defaultContext: ImageModal = {
  open() {
    throw new Error('<ModalProvider> is missing')
  }
}

const Context = createContext<ImageModal>(defaultContext)

interface AnyEvent {
  preventDefault(): void
}

export const ImageModalProvider = ({ children }: { children: ReactNode }) => {
  const [modal, setModal] = useState<ReactNode | null>(null)
  const input = useRef<HTMLInputElement>(null)
  const ok = useRef<HTMLButtonElement>(null)

  const createOpener = useCallback(
    (type: ImageModalType) =>
      (src: string, opts: ImageModalOpenerProps = {}) =>
        new Promise<boolean | string | undefined>((resolve) => {
          const handleClose = (e?: AnyEvent) => {
            e?.preventDefault()
            setModal(null)
            resolve(undefined)
          }

          const handleOK = (e?: AnyEvent) => {
            e?.preventDefault()
            setModal(null)
            resolve(true)
          }

          setModal(
            <Modal
              size={'xl'}
              isOpen={true}
              onClose={handleClose}
              isCentered={true}
              {...opts.modalProps}
            >
              <ModalOverlay />
              <ModalContent>
                <ModalBody mt={5}>
                  <Image w={'100%'} src={src} alt={opts.alt} />
                </ModalBody>
                <ModalFooter>
                  <Button onClick={handleOK} ref={ok} {...opts.okButtonProps}>
                    {opts.okText ?? 'OK'}
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          )
        }),
    [children]
  )

  return (
    <Context.Provider
      value={
        {
          open: createOpener(ImageModalType.Open)
        } as ImageModal
      }
    >
      {children}
      {modal}
    </Context.Provider>
  )
}

const useImageModal = () => useContext(Context)

export default useImageModal
