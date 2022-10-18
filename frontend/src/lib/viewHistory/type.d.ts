interface Article {
  id?: number
  title?: string
  body?: string
}

type ViewHistoryState = {
  posts: Set<string>;
  // user: string | null
}

type ViewHistoryAction  = {
  type: ActionType
  posts?: Set<string>;
}

type ViewHistoryDispatchType = (args: ViewHistoryAction) => ViewHistoryAction


