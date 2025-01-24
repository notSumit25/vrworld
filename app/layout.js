import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
} from '@clerk/nextjs'
import './globals.css'
import HomePage from './components/HomePage';
export default function RootLayout({
  children,
}) {


  return (
    <ClerkProvider >
      <html lang="en">
        <body>
          <SignedOut>
            <HomePage />
          </SignedOut>
          <SignedIn>
          {children}
          </SignedIn>
        </body>
      </html>
    </ClerkProvider>
  )
}