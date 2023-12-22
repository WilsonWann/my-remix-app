import * as React from 'react'
import { Table, Thead, Tbody, Tr, Th, Td, chakra } from '@chakra-ui/react'
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons'
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  ColumnDef,
  SortingState,
  getSortedRowModel
} from '@tanstack/react-table'

export type DataTableProps<Data extends object> = {
  data: Data[]
  columns: ColumnDef<Data, any>[]
}
function DataTable<Data extends object>(props: DataTableProps<Data>) {
  const { data, columns } = props

  const [sorting, setSorting] = React.useState<SortingState>([])
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting
    }
  })

  return (
    <Table
      h={'100%'}
      sx={{
        position: 'relative',
        overflowX: 'hidden',
        overflowY: 'auto'
      }}
    >
      <Thead
        w={'100%'}
        sx={{
          position: 'absolute',
          top: '0',
          left: '0',
          height: '40px'
        }}
      >
        {table.getHeaderGroups().map((headerGroup) => (
          <Tr w={'inherit'} key={headerGroup.id} display={'flex'}>
            {headerGroup.headers.map((header) => {
              // see https://tanstack.com/table/v8/docs/api/core/column-def#meta to type this correctly
              const meta: any = header.column.columnDef.meta
              const title = flexRender(header.column.columnDef.header, header.getContext())
              const arrowIcon = (
                <chakra.span position={'absolute'} pl={4}>
                  {header.column.getIsSorted() ? (
                    header.column.getIsSorted() === 'desc' ? (
                      <TriangleDownIcon aria-label='sorted descending' />
                    ) : (
                      <TriangleUpIcon aria-label='sorted ascending' />
                    )
                  ) : null}
                </chakra.span>
              )
              return (
                <Th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  position={'relative'}
                  cursor={'pointer'}
                  width={'auto'}
                  fontSize={'large'}
                  sx={{
                    textAlign: 'center !important',
                    flex: meta?.flex ? meta.flex : '1 1 auto'
                  }}
                >
                  {title}
                  {arrowIcon}
                </Th>
              )
            })}
          </Tr>
        ))}
      </Thead>
      <Tbody
        w={'100%'}
        overflowX={'hidden'}
        overflowY={'auto'}
        sx={{
          position: 'absolute',
          top: '40px',
          left: '0',
          height: 'calc(100% - 40px)'
        }}
      >
        {table.getRowModel().rows.map((row) => (
          <Tr
            key={row.id}
            h={'100px'}
            display={'flex'}
            sx={{
              textAlign: 'center !important'
            }}
            _hover={{
              bg: 'gray.50'
            }}
          >
            {row.getVisibleCells().map((cell) => {
              // see https://tanstack.com/table/v8/docs/api/core/column-def#meta to type this correctly
              const meta: any = cell.column.columnDef.meta
              return (
                <Td
                  display={'flex'}
                  alignItems={'center'}
                  justifyContent={'center'}
                  h={'100%'}
                  sx={{
                    textAlign: '-webkit-center',
                    flex: meta?.flex ? meta.flex : '1 1 auto'
                  }}
                  key={cell.id}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Td>
              )
            })}
          </Tr>
        ))}
      </Tbody>
    </Table>
  )
}

export default DataTable
