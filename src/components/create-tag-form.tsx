import { Check, Loader2, X } from 'lucide-react'
import { Button } from './ui/button'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import * as Dialog from '@radix-ui/react-dialog'
import { toast } from 'sonner'

const createTagSchema = z.object({
  title: z.string().min(3, { message: 'Minimum 3 characters.' }),
})

type CreateTagFormData = z.infer<typeof createTagSchema>

function getSlugFromString(input: string): string {
  return input
    .normalize('NFD') // normalize accented characters
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // remove non-alphanumeric characters
    .replace(/\s+/g, '-') // replace spaces with hyphens
}

export function CreateTagForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<CreateTagFormData>({
    resolver: zodResolver(createTagSchema),
  })

  const slug = watch('title') ? getSlugFromString(watch('title')) : ''

  async function createTag({ title }: CreateTagFormData) {
    // delay 2s
    await new Promise((resolve) => setTimeout(resolve, 2000))

    await fetch('http://localhost:3333/tags', {
      method: 'POST',
      body: JSON.stringify({
        title,
        slug,
        amountOfVideos: 0,
      }),
    })

    toast.success('Tag created!')
  }

  return (
    <form onSubmit={handleSubmit(createTag)} className="w-full space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium" htmlFor="title">
          Tag name
        </label>
        <input
          {...register('title')}
          id="title"
          type="text"
          className="w-full rounded-lg border border-zinc-800 bg-zinc-900/20 px-3 py-2.5 text-sm"
        />

        {errors.title && (
          <p className="text-sm text-red-400">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium" htmlFor="slug">
          Slug
        </label>
        <input
          id="slug"
          type="text"
          readOnly
          value={slug}
          className="w-full rounded-lg border border-zinc-800 bg-zinc-900/20 px-3 py-2.5 text-sm"
        />
      </div>

      <div className="flex items-center justify-end gap-2">
        <Dialog.Close asChild>
          <Button>
            <X className="size-3" />
            Cancel
          </Button>
        </Dialog.Close>

        <Button
          disabled={isSubmitting}
          className="bg-teal-400 text-teal-950"
          type="submit"
        >
          {isSubmitting ? (
            <Loader2 className="size-3 animate-spin" />
          ) : (
            <Check className="size-3" />
          )}
          Save
        </Button>
      </div>
    </form>
  )
}
