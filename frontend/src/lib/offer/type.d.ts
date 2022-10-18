


interface Offer {
  id?: number
  title?: string
  body?: string
}

type OfferState = {
  offer: Offer[];
  // user: string | null
}

type OfferAction  = {
  type: ActionType
  offer?: Offer[];
}

type OfferDispatchType = (args: OfferAction) => OfferAction


