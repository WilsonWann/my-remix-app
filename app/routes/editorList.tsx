import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { fetchEditorList } from '~/utils/editorList.server'

import { createColumnHelper } from '@tanstack/react-table'
import DataTable from './components/DataTable'
import { Box, Image, Text } from '@chakra-ui/react'
import useImageModal from '~/hooks/useImageModal'
import { HydrationBoundary, QueryClient, dehydrate, useQuery } from '@tanstack/react-query'

export const loader = async () => {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['editorList'],
    queryFn: fetchEditorList
  })

  return json({ dehydratedState: dehydrate(queryClient) })
}

const EditorList = () => {
  const {
    data: editorList,
    isPending,
    isError,
    error
  } = useQuery({
    queryKey: ['editorList'],
    queryFn: fetchEditorList
  })

  if (isPending) {
    return <Text>Loading...</Text>
  }

  if (isError) {
    return <Text>Error: {error.message}</Text>
  }

  const columnHelper = createColumnHelper<Article>()

  const { open } = useImageModal()

  const columns = [
    columnHelper.accessor('serialNumber', {
      cell: (info) => info.getValue(),
      header: '序號',
      meta: {
        flex: 1
      }
    }),
    columnHelper.accessor('homeImagePath', {
      cell: (info) => {
        const src = info.row.original.contentImagePath
        return (
          <Image
            h={'100%'}
            w={'100px'}
            objectFit={'cover'}
            objectPosition={'center'}
            aspectRatio={'16/9'}
            src={info.getValue()}
            alt={info.row.original.altText}
            cursor={'pointer'}
            onClick={() => open(src)}
          />
        )
      },
      header: '圖片/影片',
      meta: {
        flex: 2
      }
    }),
    columnHelper.accessor('title', {
      cell: (info) => (
        <Text textAlign={'start'} w={'300px'} noOfLines={3}>
          {info.getValue()}
        </Text>
      ),
      header: '標題',
      meta: {
        flex: 3
      }
    }),
    columnHelper.accessor('pageView', {
      cell: (info) => info.getValue(),
      header: '瀏覽數',
      meta: {
        flex: 1
      }
    }),
    columnHelper.accessor('status', {
      cell: (info) => {
        const colorProps =
          info.getValue() === '已發布'
            ? 'green.500'
            : info.getValue() === '已排程'
            ? 'red.500'
            : 'gray.500'

        const getPublishDate = new Date(info.row.original.publishedAt)
        const publishDateTimeString = `${getPublishDate.toLocaleDateString(
          'en'
        )}\n${getPublishDate.toLocaleTimeString('en')}`
        const publishDate = (info.getValue() === '已發布' || info.getValue() === '已排程') && (
          <Text as={'pre'}>{publishDateTimeString}</Text>
        )

        return (
          <Box fontWeight={'bold'} color={colorProps}>
            {info.getValue()}
            {publishDate}
          </Box>
        )
      },
      header: '狀態',
      meta: {
        flex: 2
      }
    }),
    columnHelper.accessor('updatedAt', {
      cell: (info) => {
        const getUpdateDate = new Date(info.getValue())
        const updateDateTimeString = `${getUpdateDate.toLocaleDateString(
          'en'
        )}\n${getUpdateDate.toLocaleTimeString('en')}`
        return <Text as={'pre'}>{updateDateTimeString}</Text>
      },
      header: '更新日期',
      meta: {
        flex: 2
      }
    })
  ]

  return <DataTable columns={columns} data={editorList} />
}

export default EditorList
// export default function EditorListRoute() {
//   const { dehydratedState } = useLoaderData<typeof loader>()
//   return (
//     <HydrationBoundary state={dehydratedState}>
//       <EditorList />
//     </HydrationBoundary>
//   )
// }
