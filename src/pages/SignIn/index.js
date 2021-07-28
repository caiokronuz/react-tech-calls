import {useState, useContext} from 'react';
import { Link } from 'react-router-dom';
import {toast} from 'react-toastify'

import {AuthContext} from '../../contexts/auth';
import logo from '../../assets/logo.png'
import './styles.css'

export default function SignIn(){
    
    const {signIn, loadingAuth} = useContext(AuthContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function handleSubmit(e){
        e.preventDefault();
        if(email !== '' && password !== ''){
            signIn(email, password);
        }else{
            toast.error("Você não pode logar sem digitar um email ou uma senha! ;)")
        }
    }

    return(
        <div className="container-center">
            <div className="login">
                <div className="logo-area">
                    <img src={logo} alt="Logo do Sistema"/>
                </div>
                <form onSubmit={handleSubmit}>
                    <h1>Entrar</h1>
                    <input type="email" placeholder="email@email.com" value={email} onChange={e => setEmail(e.target.value)}/>
                    <input type="password" placeholder="********" value={password} onChange={e => setPassword(e.target.value)}/>
                    <button type="submit" disabled={loadingAuth}>{loadingAuth ? 'Carregando...' : 'Acessar'}</button>
                </form>
                <Link to="/register">Criar uma conta</Link>
            </div>
        </div>
    )
}