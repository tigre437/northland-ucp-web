import { TreePine } from 'lucide-react'
import { Link } from 'react-router-dom'

/**
 * Marca provisional de Northland community.
 * Sustituir el bloque del icono por el logo oficial cuando exista:
 * <img src="/logo.svg" alt="Northland community" className="size-9" />
 */
export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5" aria-label="Northland community — inicio">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-md border border-line bg-accent-deep/25 text-accent-strong">
        <TreePine size={20} strokeWidth={1.75} />
      </span>
      {!compact && (
        <span className="leading-tight">
          <span className="block font-display text-[0.95rem] font-bold uppercase tracking-[0.08em] text-ink">
            Northland
          </span>
          <span className="block text-[0.68rem] font-medium uppercase tracking-[0.22em] text-ink-faint">
            community
          </span>
        </span>
      )}
    </Link>
  )
}
