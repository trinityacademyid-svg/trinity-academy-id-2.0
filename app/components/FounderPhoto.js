'use client'
import Image from 'next/image'

export default function FounderPhoto({ src, alt }) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 800px) 220px, 260px"
      style={{ objectFit: 'contain', objectPosition: 'center' }}
      onError={(e) => { e.target.style.display = 'none' }}
    />
  )
}
