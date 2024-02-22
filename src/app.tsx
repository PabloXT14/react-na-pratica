import { FileDown, Filter, MoreHorizontal, Plus, Search } from 'lucide-react'
import { Header } from './components/header'
import { Tabs } from './components/tabs'
import { Button } from './components/ui/button'
import { Control, Input } from './components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './components/ui/table'
import { Pagination } from './components/pagination'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { FormEvent, useState } from 'react'

export interface Tag {
  title: string
  slug: string
  amountOfVideos: number
  id: string
}

export interface TagResponse {
  first: number
  prev: number | null
  next: number
  last: number
  pages: number
  items: number
  data: Tag[]
}

export function App() {
  const [searchParams, setSearchParams] = useSearchParams()

  const urlFilter = searchParams.get('filter') ?? ''
  const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1

  const [filter, setFilter] = useState(urlFilter)

  const { data: tagResponse, isLoading } = useQuery<TagResponse>({
    queryKey: ['get-tags', page, urlFilter],
    queryFn: async () => {
      const response = await fetch(
        `http://localhost:3333/tags?_page=${page}&_per_page=10&title=${urlFilter}`,
      )
      const data = await response.json()

      return data
    },
    placeholderData: keepPreviousData,
  })

  if (isLoading) {
    return null
  }

  function handleFilter(event: FormEvent) {
    event.preventDefault()

    setSearchParams((params) => {
      params.set('page', '1')
      params.set('filter', filter)

      return params
    })
  }

  return (
    <div className="space-y-8 py-10">
      <div>
        <Header />
        <Tabs />
      </div>

      <main className="mx-auto max-w-6xl space-y-5">
        {/* Content Heading */}
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold">Tags</h1>
          <Button variant="primary">
            <Plus className="size-3" />
            Create new
          </Button>
        </div>

        {/* Content Search */}
        <div className="flex items-center justify-between">
          <form onSubmit={handleFilter} className="flex items-center gap-3">
            <Input variant="filter">
              <Search className="size-3" />
              <Control
                placeholder="Search tags..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </Input>

            <Button>
              <Filter className="size-3" />
              Filtrar
            </Button>
          </form>

          <Button>
            <FileDown className="size-3" />
            Export
          </Button>
        </div>

        {/* Content List */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Tag</TableHead>
              <TableHead>Amount of videos</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tagResponse?.data.map((tag) => (
              <TableRow key={tag.id}>
                <TableCell></TableCell>
                <TableCell>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium">{tag.title}</span>
                    <span className="text-xs text-zinc-500">{tag.id}</span>
                  </div>
                </TableCell>
                <TableCell>{tag.amountOfVideos} vídeo(s)</TableCell>
                <TableCell className="text-right">
                  <Button size="icon">
                    <MoreHorizontal className="size-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        {tagResponse && (
          <Pagination
            pages={tagResponse.pages}
            items={tagResponse.items}
            page={page}
          />
        )}
      </main>
    </div>
  )
}
