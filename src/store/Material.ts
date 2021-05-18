import { RootStore } from './Root'

export class MaterialStore {
  rootStore: RootStore

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore
  }
}
