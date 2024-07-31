export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{
        margin: 0,
        padding: 0,
        minHeight: '100vh',
        background: 'linear-gradient(to bottom, #ffffff 0%, #cda4f6 100%)',
        backgroundAttachment: 'fixed'
      }}>
        {children}
      </body>
    </html>
  )
}