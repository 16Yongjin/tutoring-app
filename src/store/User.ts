import { makeObservable, observable } from 'mobx'
import { RootStore } from './Root'

export class UserStore {
  rootStore: RootStore
  token: string | null = null

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore
    makeObservable(this, {
      token: observable,
    })
  }
}
