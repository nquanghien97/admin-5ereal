import api from "../config/api";

export function getUsers({ page, pageSize, search }: { page?: number, pageSize?: number, search?: string }) {
  const params = new URLSearchParams();
  if (page) params.append('page', page.toString());
  if (pageSize) params.append('pageSize', pageSize.toString());
  if (search) params.append('search', search.toString());
  return api.get(`/users?${params.toString()}`)
}

export function createUser({ phoneNumber, fullName, password } : { phoneNumber: string, fullName: string, password: string }) {
  return api.post('/users', { phoneNumber, fullName, password })
}

export function updateUser({ id, fullName } : { id: number, fullName?: string }) {
  return api.put(`/users/${id}`, { fullName })
}

export function deleteUser(id: number) {
  return api.delete(`/users/${id}`)
}

export function changePassword({ id, password } : { id: number, password: string }) {
  return api.put(`/change-password-user`, { password, userId: id })
}

export function getMe() {
  return api.get('/me')
}

export function assignUser({ id, assignUserId } : { id: number, assignUserId: number }) {
  return api.post(`/assign-user/${id}`, { assignUserId })
}