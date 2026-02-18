import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { headersDefault } from "./common/axiosClient";

//let idx = 0;

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const pathname = url.pathname;
  const token = request.cookies.get("token")?.value ?? "";

  if (!token) {
    if (pathname === "/") {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/", request.url));
  }

  let statusCode = 0;
  // token valido = 0
  // token invalido = 1

  //idx++;

  const fetchUrl = process.env.NEXT_PUBLIC_API_URL + "/auth/check-token";

  //console.log({ idx, url: request.url, fetchUrl });

  const data = await (
    await fetch(fetchUrl, {
      method: "POST",
      headers: {
        ...headersDefault,
        Authorization: `Bearer ${token}`,
      },
    })
  ).json();

  statusCode = data.statusCode || 0;

  // Token valido
  if (statusCode === 0) {
    //console.log("token valido ************");

    if (pathname === "/") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  } else {
    //console.log("token invalido ************");

    const searchParams = url.searchParams;
    if (searchParams.has("token")) {
      searchParams.delete("token");
      url.search = searchParams.toString();
      return NextResponse.redirect(new URL(url.pathname, request.url));
    }

    // Token invalido
    if (pathname === "/") {
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|service-worker|sw|manifest|icon|push-notifications).*)",
  ],
};
