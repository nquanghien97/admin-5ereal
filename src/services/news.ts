import api from "../config/api";

export function getAllNews({ page, pageSize, search } : { page?: number, pageSize?: number, search?: string}) {
  const params = new URLSearchParams();
  if (page) params.append('page', page.toString());
  if (pageSize) params.append('pageSize', pageSize.toString());
  if (search) params.append('search', search.toString());
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

export function uploadImageNews(data: FormData) {
  return api.post('/upload-images-news', data)
}

