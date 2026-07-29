export type ApiResponse<T> = {
  data: T;
  message?: string;
};

export type ActionResult<T = undefined> =
  | {
      ok: true;
      data?: T;
      message?: string;
    }
  | {
      ok: false;
      error: string;
    };
