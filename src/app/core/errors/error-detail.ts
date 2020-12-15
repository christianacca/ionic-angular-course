export type ErrorDetail = Error & { detail?: string; };

export const isErrorDetail = (value: any): value is ErrorDetail => value instanceof Error && !!(value as ErrorDetail).detail;
