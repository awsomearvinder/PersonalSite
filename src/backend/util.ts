import { resolve } from "https://deno.land/std@0.76.0/path/mod.ts";

export class NotAtFront extends Error {
  constructor(message?: string) {
    super(message);
  }
}
//These should extend Error.
export class NotAtBack extends Error {
  constructor(message?: string) {
    super(message);
  }
}

export const removeFromFront = (
  front: string,
  s: string
): string | NotAtFront => {
  const index = front.length;
  if (front != s.substring(0, index)) {
    return new NotAtFront(
      `Error: Expected string '${front}' to be infront of string '${s}'`
    );
  }
  return s.substring(index, undefined);
};

//Might be an off by one error, we'll see.
export const removeFromBack = (back: string, s: string): string | NotAtBack => {
  const index = back.length - 1;
  if (s.substring(s.length - 1 - index) != back) {
    return new NotAtBack(
      `Error: Expected string '${back}' to be behind string '${s}'`
    );
  }
  return s.substr(0, s.length - 1 - index);
};

export class Unreachable extends Error {
  constructor(message?: string) {
    if (message == null) {
      message = "Unreachable code executed!";
    }
    super(message);
  }
}

export const normalizePath = (n: string) => resolve(Deno.cwd(), n);
