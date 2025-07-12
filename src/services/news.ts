import api from "../config/api";

export function getAllNews({ page, pageSize, title } : { page?: number, pageSize?: number, title?: string}) {
  const params = new URLSearchParams();
  if (page) params.append('page', page.toString());
  if (pageSize) params.append('pageSize', pageSize.toString());
  if (title) params.append('title', title.toString());
  return api.get(`/news?${params.toString()}`)
}

export function createNews(data: FormData) {
  return api.post('news', data)
}

export function getNews(id: number) {
  return api.get(`/news/${id}`)
}

export function updateNews(id: number, data: FormData) {
  return api.put(`/news/${id}`, data)
}

export function deleteNews(id: number) {
  return api.delete(`/news/${id}`)
} 

