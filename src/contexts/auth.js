import { useEffect, useState, createContext } from 'react';
import firebase from '../services/firebaseConnection';
import {toast} from 'react-toastify';

export const AuthContext = createContext({});

function AuthProvider({ children }) {

    const [user, setUser] = useState(null)
    const [loadingAuth, setLoadingAuth] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        function loadStorage() {
            const storageUser = localStorage.getItem('SistemaUser')

            if (storageUser) {
                setUser(JSON.parse(storageUser))
            }

            setLoading(false)
        }
        loadStorage()
    }, [])

    //Cadastro do usuário
    async function signUp(email, password, name) {
        setLoadingAuth(true);
        await firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(async (value) => {
                let uid = value.user.uid;
                await firebase.firestore().collection('users')
                    .doc(uid).set({
                        name,
                        avatarUrl: null,
                    })
                    .then(() => {
                        let data = {
                            uid,
                            name,
                            email: value.user.email,
                            avatarUrl: null,
                        }
                        setUser(data)
                        storageUser(data)
                        setLoadingAuth(false)
                        toast.success('Cadastrado com sucesso!')
                    })
                    .catch(err => {
                        toast.error('Algum erro ocorreu no seu cadastro :( Verifique suas' + 
                        'Verifique suas informações e tente novamente!')
                        setLoadingAuth(false)
                    })
            })
            .catch(err => {
                alert(err)
            })
    }

    function storageUser(data) {
        localStorage.setItem('SistemaUser', JSON.stringify(data))
    }

    //Login do usuário
    async function signIn(email, password) {
        setLoadingAuth(true);

        await firebase.auth().signInWithEmailAndPassword(email, password)
            .then(async (value) => {
                let uid = value.user.uid;

                try {
                    const userProfile = await firebase.firestore().collection('users')
                        .doc(uid).get();

                    let data = {
                        uid,
                        name: userProfile.data().name,
                        avatarUrl: userProfile.data().avatarUrl,
                        email: value.user.email,
                    }

                    setUser(data);
                    storageUser(data);
                    setLoadingAuth(false);
                    toast.success(`Seja bem vindo de volta ${data.name}! :D`);
                }catch(err){
                    toast.error("Algo deu errado :( Verifique suas informações e tente novamente!")
                    setLoadingAuth(false);
                }

            })
            .catch(err => {
                setLoadingAuth(false)
                toast.error("Algo deu errado :( Verifique suas informações e tente novamente!")
            })
    }

    //Logout do usuário
    async function signOut() {
        await firebase.auth().signOut();
        localStorage.removeItem('SistemaUser')
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{
            signed: !!user,
            user,
            setUser,
            storageUser,
            loading,
            loadingAuth,
            signUp,
            signOut,
            signIn,
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;