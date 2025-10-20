export interface Article {
  id: number;
  code: string;
  title: string;
  description: string;
  category: string;
  punishment: string;
}

export interface Document {
  id: number;
  title: string;
  category: string;
  code: string;
  description: string;
}

export interface Deadline {
  id: string;
  title: string;
  date: string;
  article: string;
  priority: 'high' | 'medium' | 'low';
}

export const ARTICLES_API = 'https://functions.poehali.dev/548d9cd5-f7d1-4b22-9d02-284a5b6a60a6';
export const DOCUMENTS_API = 'https://functions.poehali.dev/6d698c6a-0961-4d17-9256-332c35b53aeb';
