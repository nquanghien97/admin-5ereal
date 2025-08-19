import api from "../config/api";

export function login({ phoneNumber, password } : { phoneNumber: string, password: string }) {
  return api.post('/auth/login', {phoneNumber, password })
}