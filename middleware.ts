import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const secretKey = process.env.JWT_SECRET || "super-secret-money-keeper-key-123";
const encodedKey = new TextEncoder().encode(secretKey);

const protectedRoutes = ['/dashboard', '/add-expense']  
const authRoutes = ['/login', '/register']

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.includes(path)
  const isAuthRoute = authRoutes.includes(path)

  const sessionCookie = request.cookies.get('session')?.value

  let isAuth = false;
  if (sessionCookie) {
    try {
      await jwtVerify(sessionCookie, encodedKey, { algorithms: ["HS256"] });
      isAuth = true;
    } catch (err) {
      isAuth = false;
    }
  }

  if (isProtectedRoute && !isAuth) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isAuthRoute && isAuth) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (path === '/') {
    return isAuth 
      ? NextResponse.redirect(new URL('/dashboard', request.url))
      : NextResponse.redirect(new URL('/register', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}