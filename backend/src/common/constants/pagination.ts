/**
 * Default number of records returned per page for all paginated endpoints.
 * Example: if DEFAULT_PAGE_SIZE = 10, each API request will return 10 items.
 * Client can request different pages using: ?page=1, ?page=2, etc.
 */
export const DEFAULT_PAGE_SIZE = 10;

export const DAILY_BID_LIMIT = 10;

export interface PaginationParams {
  page: number; 
  take: number;
  skip: number; 
}

export function getPaginationParams(page: number = 1): PaginationParams {
  const take = DEFAULT_PAGE_SIZE; 

  const safePage = Math.max(1, page);

  // Calculate how many records to skip before fetching the next set of results
  const skip = (safePage - 1) * take;

  return { page: safePage, take, skip };
}