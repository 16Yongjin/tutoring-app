import { MaterialStore } from './Material'
import { UserStore } from './User'

export class RootStore {
  userStore: UserStore
  materialStore: MaterialStore

  constructor() {
    this.userStore = new UserStore(this)
    this.materialStore = new MaterialStore(this)
  }
}
