
export const getErrorType = (error) =>
  (error instanceof URIError && "badRequest") ||
  (error instanceof Deno.errors.NotFound && "notFound")