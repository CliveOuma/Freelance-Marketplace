/**
 * Default number of records returned per page for all paginated endpoints.
 * Example: if DEFAULT_PAGE_SIZE = 10, each API request will return 10 items.
 * Client can request different pages using: ?page=1, ?page=2, etc.
 */
export const DEFAULT_PAGE_SIZE = 10;

//Maximum number of bids a writer is allowed to place per day.
export const DAILY_BID_LIMIT = 10;

export interface PaginationParams {
  page: number; 
  take: number;
  skip: number; 
}

export function getPaginationParams(page: number = 1): PaginationParams {
  const take = DEFAULT_PAGE_SIZE; // fixed page size (limit)

  // Ensure page is never less than 1
  const safePage = Math.max(1, page);

  // Calculate how many records to skip before fetching the next set
  // For page 1: skip = (1 - 1) * 10 = 0
  const skip = (safePage - 1) * take;

  // Return all pagination parameters to be used in DB queries
  return { page: safePage, take, skip };
}