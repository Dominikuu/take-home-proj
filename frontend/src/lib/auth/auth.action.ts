export enum ActionType {
    REGISTER_SUCCESS = 'REGISTER_SUCCESS',
    REGISTER_FAIL = 'REGISTER_FAIL',
    LOGIN_SUCCESS = 'LOGIN_SUCCESS',
    LOGIN_FAIL = 'LOGIN_FAIL',
    LOGOUT = 'LOGOUT',
    CHECK_AUTH = 'CHECK_AUTH',
    UPDATE_PROFILE = 'UPDATE_PROFILE',
}

export function checkAuth(ssoToken: string | null) {
    const action: AuthAction = {
        type: ActionType.LOGIN_SUCCESS,
        isLoggedIn: true,
        user: {},
    };
    let jwtToken = localStorage.getItem('token') || '';
    return async (dispatch: DispatchType) => {
        if (!jwtToken) {
            //   const resp = await checkOneSsotoken({ssoToken})
            //   jwtToken = resp.data.token
            //   localStorage.setItem('token', jwtToken)

            // }
            // const {data: profile} = await getOneUserProfile();
            // action.user = {...profile, jwtToken} || {};

            dispatch(action);
        }
    };
}

export function login(user: String) {
    const action: AuthAction = {
        type: ActionType.REGISTER_SUCCESS,
        isLoggedIn: true,
        user: '',
    };

    return simulateHttpRequest(action);
}

export function logout() {
    const action: AuthAction = {
        type: ActionType.LOGOUT,
        isLoggedIn: false,
        user: null,
    };
    localStorage.removeItem('token');
    window.location.reload();
    return (dispatch: DispatchType) => {
        dispatch(action);
    };
}

export function updateProfile(profile) {
    const action: AuthAction = {
        type: ActionType.UPDATE_PROFILE,
        isLoggedIn: true,
        user: profile,
    };
    return (dispatch: DispatchType) => {
        dispatch(action);
    };
}

export function makeHttpRequest(action: AuthAction, ssoToken?: string) {
    return (dispatch: DispatchType) => {
        setTimeout(() => {
            dispatch(action);
        }, 500);
    };
}

export function simulateHttpRequest(action: AuthAction, ssoToken?: string) {
    return (dispatch: DispatchType) => {
        setTimeout(() => {
            dispatch(action);
        }, 500);
    };
}
