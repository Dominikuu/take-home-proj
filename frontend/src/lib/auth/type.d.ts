interface IArticle {
  id?: number
  title?: string
  body?: string
}

type AuthState = {
  isLoggedIn: boolean;
  user: string | null
}

type AuthAction  = {
  type: ActionType
  isLoggedIn: boolean;
  user: any | null
}

type DispatchType = (args: AuthAction) => AuthAction


