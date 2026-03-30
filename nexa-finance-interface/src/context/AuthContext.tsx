import {
  signOut as firebaseSignOut,
  onAuthStateChanged,
  signInWithPopup,
} from "firebase/auth";
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { firebaseAuth, googleAuthProvider } from "../config/firebase";
import type { AuthState } from "../types/Auth";

interface AuthContextProps {
  authState: AuthState;
  signWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

//cria o contexto
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

//disponibiliza o contexto
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    error: null,
    loading: false,
  });

  useEffect(() => {
    //função que fica de olho no signWithGoogle e signOut
    const unsubscribe = onAuthStateChanged(
      firebaseAuth,
      (user) => {
        if (user) {
          setAuthState({
            user: {
              displayName: user.displayName,
              email: user.email,
              photoURL: user.photoURL,
              uid: user.uid,
            },
            error: null,
            loading: false,
          });
        } else {
          setAuthState({ user: null, error: null, loading: false });
        }
      },
      (error) => {
        console.error("Erro na autenticação.");
        setAuthState({ user: null, error: error.message, loading: false });
      },
    );

    //serve para a função onAuthStateChanged não ficar em looping,
    //caso de duvida, conferir na documentação do react.
    return () => unsubscribe();
  }, []);

  const signWithGoogle = async (): Promise<void> => {
    setAuthState((prev) => ({
      ...prev,
      loading: true,
    }));

    try {
      await signInWithPopup(firebaseAuth, googleAuthProvider);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao tentar logar.";

      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
    }
  };

  const signOut = async (): Promise<void> => {
    setAuthState((prev) => ({
      ...prev,
      loading: true,
    }));

    try {
      await firebaseSignOut(firebaseAuth);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao tentar logar.";
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
    }
  };

  return (
    <AuthContext.Provider value={{ authState, signWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

//usado por outras partes para acessar o contexto
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("O useAuth deve ser usado dentro de um AuthProvider");
  }

  return context;
};
