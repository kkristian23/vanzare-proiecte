declare namespace Cloudflare {
  interface Env {
    /** Optional binding; getDb reports a clear error when it is not configured. */
    DB?: D1Database;
  }
}
