export interface Pagination {
  count: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalResults: number;
}

export interface Product {
  parent_company: string;
  createdAt: string;
  description: string;
  productBrand: string;
  product_image: string;
  product_link: { [key: string]: string };
  product_name: string;
  product_num: string;
  updatedAt: string;
}

export interface IProductsResponse {
  pagination: Pagination;
  results: Product[];
}
