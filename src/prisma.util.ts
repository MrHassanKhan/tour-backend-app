export const PRISMA_QUERY_INTERPRETATION_ERROR = "P2016";
export const PRISMA_RECORD_NOT_FOUND = "RecordNotFound";

export function isRecordNotFoundError(error: unknown): boolean {
  return (
    error instanceof Error &&
    "code" in error &&
    error.code === PRISMA_QUERY_INTERPRETATION_ERROR &&
    error.message.includes(PRISMA_RECORD_NOT_FOUND)
  );
}

export async function transformStringFieldUpdateInput<
  T extends undefined | string | { set?: string }
>(input: T, transform: (input: string) => Promise<string>): Promise<T> {
  if (typeof input === "object" && typeof input?.set === "string") {
    return { set: await transform(input.set) } as T;
  }
  if (typeof input === "object") {
    if (typeof input.set === "string") {
      return { set: await transform(input.set) } as T;
    }
    return input;
  }
  if (typeof input === "string") {
    return (await transform(input)) as T;
  }
  return input;
}

// create a function for uuid generation
export function generateUuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}