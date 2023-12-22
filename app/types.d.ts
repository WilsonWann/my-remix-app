type Tag = {
  _id: string;
  name: string;
  sitemapUrl: string;
}

type Category = {
  _id: string;
  name: string;
  sitemapUrl: string;
}

type Article = {
  _id: string;
  serialNumber: number;
  headTitle: string;
  headKeyword: string;
  headDescription: string;
  title: string;
  categories: Category;
  manualUrl: string;
  altText: string;
  tags: Tag[];
  pageView: number;
  topSorting: null | any; // Replace 'any' with the actual type if needed
  hidden: boolean;
  recommendSorting: null | any; // Replace 'any' with the actual type if needed
  popularSorting: null | any; // Replace 'any' with the actual type if needed
  homeImagePath: string;
  contentImagePath: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  originalUrl: string;
  draft: boolean;
  status: string;
  publishedAt: string;
  sitemapUrl: string;
}


type EditorListResponse = {
  data: Article[],
  totalCount: number,
  totalPages: number,
  limit: number,
  currentPage: number,
}