import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

/**
 * Imagen ampliable de solo lectura: clic abre un overlay a pantalla
 * completa; clic fuera, en la X o Escape cierran.
 */
export function ZoomableImage({
  src,
  alt,
  className,
}: {
  src: string
  alt: string
  className?: string
}) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Ver ${alt} en grande`}
        className="shrink-0 cursor-zoom-in rounded-[inherit]"
      >
        <img src={src} alt={alt} className={className} />
      </button>
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Cerrar"
            className="absolute right-4 top-4 rounded-full border border-white/20 bg-black/50 p-2 text-white/80 transition-colors hover:text-white"
          >
            <X size={18} />
          </button>
          <img
            src={src}
            alt={alt}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] max-w-[92vw] rounded-lg border border-white/10 object-contain shadow-2xl"
          />
        </div>
      )}
    </>
  )
}
