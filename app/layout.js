import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import './globals.css'
export default function RootLayout({
  children,
}) {


  return (
    <ClerkProvider >
      <html lang="en">
        <body>
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
          {children}
            <UserButton />
          </SignedIn>
  
        </body>
      </html>
    </ClerkProvider>
  )
}