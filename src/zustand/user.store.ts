import type { UserEntity } from "../entities/user";
import { getMe } from "../services/users";
import { create } from "zustand";
import Cookies from "js-cookie";
import { parseJwt } from "../utils/parseJwt";

interface UserStoreType {
  me: UserEntity | null
  getMe: () => Promise<void>
  setMe: (user: UserEntity | ((prev: UserEntity | null) => UserEntity) | null) => void
}

export const useUserStore = create<UserStoreType>()((set) => ({
  me: null,
  getMe: async () => {
    try {
      const token = Cookies.get('accessToken');
      const dataParse = parseJwt(token || '')
      if(dataParse.userId) {
        const res = await getMe()
        set({ me: res.data.user })
      }
    } catch (err) {
      console.log(err)
    }
  },
  setMe: (me) =>
    set(state => ({
      me: typeof me === 'function'? me(state.me) : me,
    }))
}))