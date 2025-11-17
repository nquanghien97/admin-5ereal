import api from "../config/api";
import type { CreateProjectDTO } from "../entities/projects";

export function getAllProjects({ page, pageSize, search } : { page?: number, pageSize?: number, search?: string}) {
  const params = new URLSearchParams();
  if (page) params.append('page', page.toString());
  if (pageSize) params.append('pageSize', pageSize.toString());
  if (search) params.append('search', search.toString());
  return api.get(`/projects?${params.toString()}`)
}

export function createProjects(data: CreateProjectDTO) {
  return api.post('/projects', data)
}

export function getProjects(id: number) {
  return api.get(`/projects/${id}`)
}

export function updateProjects(id: number, data: CreateProjectDTO) {
  return api.put(`/projects/${id}`, data)
}

export function deleteProjects(id: number) {
  return api.delete(`/projects/${id}`)
}

