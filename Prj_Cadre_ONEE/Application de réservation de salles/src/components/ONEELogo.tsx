import oneeLogo from '../imports/ONEE-1030x200.jpg'

interface Props {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const heights: Record<string, number> = {
  xs: 20,
  sm: 28,
  md: 38,
  lg: 52,
  xl: 72,
}

export default function ONEELogo({ size = 'md', className = '' }: Props) {
  const h = heights[size]
  // Width preserves the 1030×200 aspect ratio (5.15:1)
  const w = Math.round(h * 5.15)

  return (
    <img
      src={oneeLogo}
      alt="ONEE — Office National de l'Électricité et de l'Eau Potable"
      width={w}
      height={h}
      style={{ height: h, width: 'auto', maxWidth: w, objectFit: 'contain', display: 'block' }}
      className={className}
    />
  )
}
