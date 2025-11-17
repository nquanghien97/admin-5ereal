import api from "../config/api";

export function uploadImages(data: FormData) {
  return api.post('/media', data)
}

export function getImages() {
  return api.get(`/media`)
}

export function deleteImage(id: number) {
  return api.delete(`/media/${id}`)
}