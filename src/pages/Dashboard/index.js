import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { format } from 'date-fns'
import { FiHome, FiPlus, FiSearch, FiEdit2 } from 'react-icons/fi';
import firebase from '../../services/firebaseConnection';

import Header from '../../components/Header';
import Title from '../../components/Title';
import Modal from '../../components/Modal';

import './styles.css';

const listRef = firebase.firestore().collection('chamados').orderBy('created', 'desc');

export default function Dashboard() {

    const [chamados, setChamados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadMore, setLoadMore] = useState(false);
    const [isEmpty, setIsEmpty] = useState(false);
    const [lastDocs, setLastDocs] = useState();

    const [showPostModal, setShowPostModal] = useState(false);
    const [detail, setDetail] = useState();

    useEffect(() => {

        async function loadChamados() {
            await listRef.limit(5)
                .get()
                .then((snapshot) => {
                    updateState(snapshot)
                })
                .catch(err => {
                    toast.error("Erro ao carregar os chamados.")
                    setLoading(false);
                    setLoadMore(false);
                })
    
            setLoading(false);
        }
    

        loadChamados();

        return () => {}

    }, [])

    async function updateState(snapshot) {
        const isCollectionEmpty = snapshot.size === 0;

        if (!isCollectionEmpty) {
            let list = [];

            snapshot.forEach(item => {
                list.push({
                    id: item.id,
                    assunto: item.data().assunto,
                    cliente: item.data().cliente,
                    clienteId: item.data().clienteId,
                    created: item.data().created,
                    createdFormated: format(item.data().created.toDate(), 'dd/MM/yyyy'),
                    status: item.data().status,
                    complemento: item.data().complemento,
                })
            })
            const lastDoc = snapshot.docs[snapshot.docs.length - 1] //Pega o ultimo documento buscado

            setChamados(chamados => [...chamados, ...list]);
            setLastDocs(lastDoc);
        } else {
            setIsEmpty(true)
        }

        setLoadMore(false)
    }

    async function handleMore(){
        setLoadMore(true);
        await listRef.startAfter(lastDocs).limit(5)
        .get()
        .then(snapshot => {
            updateState(snapshot)
        })
        .catch(err => {
            toast.error("Erro ao buscar mais chamados.")
        })
    }

    function togglePostModal(item){
        setShowPostModal(!showPostModal)
        setDetail(item);
    }

    if (loading) {
        return (
            <div>
                <Header />
                <div className="content">
                    <Title name="Chamados">
                        <FiHome size={25} />
                    </Title>

                    <div className="container dashboard">
                        <span>Buscando chamados..</span>
                    </div>

                </div>
            </div>
        )
    }

    return (
        <div>
            <Header />
            <div className="content">
                <Title name="Chamados">
                    <FiHome size={25} />
                </Title>

                {chamados.length === 0 ? (
                    <div className="container dashboard">
                        <span>Nenhum chamado registrado...</span>
                        <Link to="/new" className="new">
                            <FiPlus size={25} color="#FFF" />
                            Novo chamado
                        </Link>
                    </div>
                ) : (
                    <>
                        <Link to="/new" className="new">
                            <FiPlus size={25} color="#FFF" />
                            Novo chamado
                        </Link>

                        <table>
                            <thead>
                                <tr>
                                    <th scope="col">Cliente</th>
                                    <th scope="col">Assunto</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Cadastrado em</th>
                                    <th scope="col">#</th>
                                </tr>
                            </thead>
                            <tbody>
                                {chamados.map((item, index) => (
                                    <tr key={index}>
                                        <td data-label="Cliente">{item.cliente}</td>
                                        <td data-label="Assunto">{item.assunto}</td>
                                        <td data-label="Status">
                                            <span className="badge" style={{ backgroundColor: item.status === 'Aberto' ? '#5cb85c' : '#999' }}>{item.status}</span>
                                        </td>
                                        <td data-label="Cadastrado">{item.createdFormated}</td>
                                        <td data-label="#">
                                            <button className="action" style={{ backgroundColor: '#3583f6' }} onClick={() => togglePostModal(item)}>
                                                <FiSearch color="#FFF" size={17} />
                                            </button>
                                            <Link to={`/new/${item.id}`} className="action" style={{ backgroundColor: '#f6a935' }}>
                                                <FiEdit2 color="#FFF" size={17} />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {loadMore && <h3 style={{textAlign: 'center', marginTop: 13}}>Buscando dados...</h3>}
                        {!loadMore && !isEmpty && <button className="btn-more" onClick={handleMore}>Buscar mais</button>}
                    </>
                )}
            </div>

            {showPostModal&& (
                <Modal
                    content={detail}
                    close={togglePostModal}
                />
            )}

        </div>

    )
}