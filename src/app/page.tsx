import { Reducer, useReducer } from 'react';
import { Header } from '@/Header';
import { Main } from '@/Main';
import { authenticate, User } from '@/api/authenticate';
import { authorize } from '@/api/authorize';

type State = {
  user: undefined | User,
  permissions: undefined | string[],
  loading: boolean,
};

type Action =
 {
  type: "authenticate",
 } | {
  type: "authenticated",
  user: User | undefined,
 } | {
  type: "authorize",
 } | {
  type: "authorized",
  permissions: string[],
};

const initialState: State = {
  user: undefined,
  permissions: undefined,
  loading: false,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
  case "authenticate":
    return { ...state, loading: true };
  case "authenticated":
    return { ...state, loading: false, user: action.user };
  case "authorize":
    return { ...state, loading: true };
  case "authorized":
    return {
      ...state,
      loading: false,
      permissions: action.permissions,
    };
  default:
    return state;
  }
}

export default function Home() {
const [{ user, permissions, loading }, dispatch] = useReducer<Reducer<State, Action>>(reducer, initialState);

async function handleSignInClick() {
  dispatch({ type: "authenticate" });

  const authenticatedUser = await authenticate();

  dispatch({
    type: "authenticated",
    user: authenticatedUser,
  });

  if (authenticatedUser !== undefined) {
    dispatch({ type: "authorize" });
    const authorizedPermissions = await authorize(
      authenticatedUser.id
    );
    
    dispatch({
      type: "authorized",
      permissions: authorizedPermissions,
    });
  }
 }

return (
    <div className="max-w-7xl mx-auto px-4">
      <Header
        user={user}
        onSignInClick={handleSignInClick}
        loading={loading}
      />

      <Main user={user} permissions={permissions} />
    </div>
  );
}
