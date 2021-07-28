import {useState} from 'react';
import { FiUser } from 'react-icons/fi';
import { toast } from 'react-toastify';
import firebase from '../../services/firebaseConnection';

import Header from '../../components/Header'; 
import Title from '../../components/Title';

import './styles.css';

export default function Customers(){

    const [nomeFantasia, setNomeFantasia] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [endereco, setEndereco] = useState('');

    async function handleSubmit(e){
        e.preventDefault();
        if(nomeFantasia !== '' && cnpj !== '' && endereco !== ''){
            await firebase.firestore().collection('customers')
                .add({
                    nomeFantasia,
                    cnpj,
                    endereco,
                })
                .then(() => {
                    setNomeFantasia('')
                    setCnpj('')
                    setEndereco('')
                    toast.success("Cliente cadastrado com sucesso!")
                })
                .catch(err => {
                    toast.error("Algum erro ocorreu!")
                })
        }else{
            toast.warn("Nenhum campo pode ficar em branco.")
        }
    }

    return(
        <div>
            <Header />
            <div className="content">
                <Title name="Clientes">
                    <FiUser size={25}/>
                </Title>

                <div className="container">
                    <form className="form-profile customers" onSubmit={handleSubmit}>
                        <label>Nome fantasia</label>
                        <input type="text" value={nomeFantasia} placeholder="Nome da empresa" onChange={e => setNomeFantasia(e.target.value)}/>

                        <label>CNPJ</label>
                        <input type="text" value={cnpj} placeholder="CNPJ da empresa" onChange={e => setCnpj(e.target.value)}/>

                        <label>Endereço</label>
                        <input type="text" value={endereco} placeholder="Endereço da empresa" onChange={e => setEndereco(e.target.value)}/>

                        <button type="submit">Cadastrar</button>
                    </form>
                </div>
            </div>
        </div>
    )
}