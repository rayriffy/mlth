export interface Idol {
  id: number
  name: string
  icons: string[]
  cards: Card[]
}

export interface Card {
  id: number
  name: string
  icon: string
  images: {
    beforeAwaken: string[]
    afterAwaken: string[]
  }
}
