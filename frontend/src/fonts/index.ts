import localFont from 'next/font/local'

const sfPro = localFont({
  src: [
    {
      path: './sf-pro-display/regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './sf-pro-display/semibold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: './sf-pro-display/bold.woff',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-sf-pro',
})

const satoshi = localFont({
  src: [
    { path: './satoshi/regular.woff2', weight: '400' },
    { path: './satoshi/medium.woff2', weight: '500 600' },
    { path: './satoshi/bold.woff2', weight: '700 900' },
  ],
  variable: '--font-satoshi',
  display: 'swap',
})
const spaceMono = localFont({
  src: './satoshi/mono.woff2',
  variable: '--font-space-mono',
  display: 'swap',
})
export { sfPro, satoshi, spaceMono }
