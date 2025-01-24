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
  console.log(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

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