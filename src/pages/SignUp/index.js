import {useState, useContext} from 'react';
import { Link } from 'react-router-dom';

import {AuthContext} from '../../contexts/auth';
import logo from '../../assets/logo.png'
import '../SignIn/styles.css'

export default function SignUp(){
    
    const {signUp, loadingAuth} = useContext(AuthContext)

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function handleSubmit(e){
        e.preventDefault();
        if(email !== '' && password !== '' && nome !== ''){
            signUp(email, password, nome);
        }else{
            alert("Preencha os dados corretamente.")
        }
    }

    return(
        <div className="container-center">
            <div className="login">
                <div className="logo-area">
                    <img src={logo} alt="Logo do Sistema"/>
                </div>
                <form onSubmit={handleSubmit}>
                    <h1>Cadastrar uma conta</h1>
                    <input type="text" placeholder="Nome completo" value={nome} onChange={e => setNome(e.target.value)}/>
                    <input type="email" placeholder="email@email.com" value={email} onChange={e => setEmail(e.target.value)}/>
                    <input type="password" placeholder="********" value={password} onChange={e => setPassword(e.target.value)}/>
                    <button type="submit" disabled={loadingAuth}>{loadingAuth ? 'Carregando...' : 'Cadastrar'}</button>
                </form>
                <Link to="/">Já tem uma conta?</Link>
            </div>
        </div>
    )
}