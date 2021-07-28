import { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import { FiPlusCircle } from 'react-icons/fi'
import { AuthContext } from '../../contexts/auth';
import firebase from '../../services/firebaseConnection';
import { useHistory, useParams } from 'react-router-dom'

import Header from '../../components/Header'
import Title from '../../components/Title'

import './styles.css';
export default function New() {
    const { id } = useParams();
    const history = useHistory();

    const [loadCustomers, setLoadCustomers] = useState(true)
    const [customers, setCustomers] = useState([])
    const [customerSelected, setCustomerSelected] = useState(0)

    const [assunto, setAssunto] = useState("Suporte")
    const [status, setStatus] = useState('Aberto');
    const [complemento, setComplemento] = useState('');

    const [idCustomer, setIdCustomer] = useState(false);

    const { user } = useContext(AuthContext);

    useEffect(() => {

        async function loadId(lista) {
            await firebase.firestore().collection('chamados').doc(id)
                .get()
                .then(snapshot => {
                    setAssunto(snapshot.data().assunto)
                    setStatus(snapshot.data().status)
                    setComplemento(snapshot.data().complemento)

                    let index = lista.findIndex(item => item.id === snapshot.data().clienteId);
                    setCustomerSelected(index);
                    setIdCustomer(true);
                })
                .catch(err => {
                    toast.error("Chamado não existe")
                })
        }


        async function loadCustomers() {
            await firebase.firestore().collection('customers')
                .get()
                .then((snapshot) => {
                    let lista = [];
                    snapshot.forEach(doc => {
                        lista.push({
                            id: doc.id,
                            nomeFantasia: doc.data().nomeFantasia
                        })
                    })

                    if (lista.length === 0) {
                        toast.warn("Nenhum cliente encontrado.")
                        setCustomers([{ id: '1', nomeFantasia: 'FREELA' }])
                        setLoadCustomers(false)
                        return;
                    }

                    setCustomers(lista);
                    setLoadCustomers(false)

                    if (id) {
                        loadId(lista)
                    }
                })
                .catch(err => {
                    toast.error("Erro ao carregar os clientes")
                    setLoadCustomers(false)
                    setCustomers([{ id: '1', nomeFantasia: '' }])
                })
        }

        loadCustomers()
    }, [id])

    async function handleRegister(e) {
        e.preventDefault();

        if(idCustomer){
            await firebase.firestore().collection('chamados')
            .doc(id)
            .update({
                cliente: customers[customerSelected].nomeFantasia,
                clienteId: customers[customerSelected].id,
                assunto,
                status,
                complemento,
                userId: user.uid,
            })
            .then(() => {
                toast.success("Chamado atualizado com sucesso!")
                setCustomerSelected(0);
                setComplemento('');
                history.push('/dashboard')
            })
            .catch(() => {
                toast.error("Erro ao atualizar o chamado!")
            })

            return;
        }


        await firebase.firestore().collection('chamados')
            .add({
                created: new Date(),
                cliente: customers[customerSelected].nomeFantasia,
                clienteId: customers[customerSelected].id,
                assunto,
                status,
                complemento,
                userId: user.uid,
            })
            .then(() => {
                setComplemento('');
                setCustomerSelected(0);

                toast.success("Chamado salvo com sucesso!")
            })
            .catch(err => {
                toast.error("Erro ao salvar chamado.")
            })
    }

    return (
        <div>
            <Header />
            <div className="content">
                <Title name="Novo chamado">
                    <FiPlusCircle size={25} />
                </Title>
                <div className="container">
                    <form className="form-profile" onSubmit={handleRegister}>
                        <label>Clientes</label>
                        {loadCustomers ? (
                            <input type="text" disabled value="Carregando clientes..." />
                        ) : (
                            <select value={customerSelected} onChange={e => setCustomerSelected(e.target.value)}>
                                {customers.map((item, index) => (
                                    <option key={item.id} value={index}>{item.nomeFantasia}</option>
                                ))}
                            </select>
                        )}

                        <label>Assunto</label>
                        <select value={assunto} onChange={e => setAssunto(e.target.value)}>
                            <option value="Suporte">Suporte</option>
                            <option value="Visita técnica">Visita técnica</option>
                            <option value="Financeiro">Financeiro</option>
                        </select>

                        <label>Status</label>
                        <div className="status">
                            <input
                                type="radio"
                                name="radio"
                                value="Aberto"
                                checked={status === "Aberto"}
                                onChange={e => setStatus(e.target.value)}
                            />
                            <span>Em aberto</span>

                            <input
                                type="radio"
                                name="radio"
                                value="Progresso"
                                checked={status === "Progresso"}
                                onChange={e => setStatus(e.target.value)}
                            />
                            <span>Em progresso</span>

                            <input
                                type="radio"
                                name="radio"
                                value="Atendido"
                                checked={status === "Atendido"}
                                onChange={e => setStatus(e.target.value)}
                            />
                            <span>Atendido</span>
                        </div>

                        <label>Complemento</label>
                        <textarea
                            type="text"
                            placeholder="Descreva seu problema (opcional)"
                            value={complemento}
                            onChange={e => setComplemento(e.target.value)}
                        />

                        <button type="submit">Salvar</button>

                    </form>
                </div>
            </div>
        </div>
    )
}