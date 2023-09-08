export const responseHandler = (
  message = 'success', payload?: { [key: string]: any } | any[]
): { 
  success: boolean; message: string; data: any 
} => {
  return {
    success: true,
    message,
    data: payload || null
  }
};
  
export const paginateResponseHandler = ({
  message = 'success',
  paginate,
  ...data
}: {
  message?: string;
  count: number;
  rows: { [key: string]: any }[];
  paginate: {
    offset: number;
    skip: number;
    page: number;
    limit: number;
    href: () => any;
    hasNextPages: (pageCount: number) => any;
    getArrayPages: (limit: number, pageCount: number, page: number) => any;
  };
}): {
  success: boolean;
  message: string;
  data: {
    metaData: {
      page: number;
      perPage: number;
      pageCount: number;
      totalCount: number;
      hasPreviousPages: boolean;
      hasNextPages: boolean;
      links: { number: number; url: string }[];
    };
    records: { [key: string]: any }[];
  };
} => {
  const pageCount = Math.ceil(data.count / paginate.limit);
  
  return {
    success: true,
    message,
    data: {
      metaData: {
        page: paginate.page,
        perPage: paginate.limit,
        pageCount,
        totalCount: data.count,
        hasPreviousPages: paginate.page > 1,
        hasNextPages: paginate.hasNextPages(pageCount),
        links: paginate.getArrayPages(paginate.limit, pageCount, paginate.page)
      },
      records: data.rows
    }
  }
};
