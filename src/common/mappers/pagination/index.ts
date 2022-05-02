import { IPaginatedType, IPaginationListData } from '@/interfaces';

export class PaginationMapper<TItem = any> {
  toPaginationList(data: IPaginationListData<TItem>): IPaginatedType<TItem> {
    const totalPages = Math.ceil(data?.totalCount / data?.page?.limit);
    const currentPage = data?.page?.number;
    const firstPage = 1;
    const lastPage = totalPages > 0 ? totalPages : totalPages;
    const hasNextPage = currentPage < lastPage;
    const hasPreviousPage = currentPage > firstPage;
    const nextPage = hasNextPage ? currentPage + 1 : lastPage;
    const previousPage = hasPreviousPage ? currentPage - 1 : firstPage;

    return {
      items: data?.items,
      totalCount: data?.totalCount,
      currentPage,
      totalPages,
      firstPage,
      lastPage,
      nextPage,
      previousPage,
      hasNextPage,
      hasPreviousPage
    };
  }
}
