"use server";

import { cookies } from "next/headers";

export async function setCookies(cookiesData: string[]) {
  const cookieStore = await cookies();
  const cookieList = Array.isArray(cookiesData) ? cookiesData : [cookiesData];

  cookieList.forEach((cookie) => {
    const [nameValue, ...attributes] = cookie.split(";").map((s) => s.trim());
    const [name, value] = nameValue.split("=");

    const options: any = { path: "/" };
    attributes.forEach((attr) => {
      const [key, val] = attr.split("=");
      const lowerKey = key.toLowerCase();
      if (lowerKey === "max-age") options.maxAge = parseInt(val);
      else if (lowerKey === "expires") options.expires = new Date(val);
      else if (lowerKey === "path") options.path = val;
      else if (lowerKey === "domain") options.domain = val;
      else if (lowerKey === "secure") options.secure = true;
      else if (lowerKey === "httponly") options.httpOnly = true;
      else if (lowerKey === "samesite") options.sameSite = val as any;
    });

    cookieStore.set(name, value, options);
  });
}

export async function getCookies(name?: string) {
  const cookieStore = await cookies();

  if (name) {
    return cookieStore.get(name)?.value ?? null;
  }

  const allCookies: Record<string, string> = {};

  cookieStore.getAll().forEach((cookie) => {
    allCookies[cookie.name] = cookie.value;
  });

  return allCookies;
}

export async function clearCookies(name?: string) {
  const cookieStore = await cookies();

  if (name) {
    cookieStore.delete(name);
    return true;
  }

  const all = cookieStore.getAll();
  all.forEach((cookie) => {
    cookieStore.delete(cookie.name);
  });

  return true;
}
