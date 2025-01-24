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
  console.log(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

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