import { FiX } from 'react-icons/fi'

import './styles.css';

export default function Modal({ close, content }) {
    return (
        <div className="modal">
            <div className="container">
                <button className="close" onClick={close}>
                    <FiX size={23} color="#FFF" />
                    Voltar
                </button>

                <div>
                    <h2>Detalhes do chamado</h2>

                    <div className="row">
                        <span>
                            Cliente: <i>{content.cliente}</i>
                        </span>
                    </div>

                    <div className="row">
                        <span>
                            Assunto: <i>{content.assunto}</i>
                        </span>
                        <span>
                            Cadastrado em: <i>{content.createdFormated}</i>
                        </span>
                    </div>

                    <div className="row">
                        <span>
                            Status: <i style={{ color: '#FFF', backgroundColor: content.status === 'Aberto' ? '#5cb85c' : '#999' }}>{content.status}</i>
                        </span>
                    </div>

                    {content.complemento !== '' && (
                        <>
                            <h3>Complemento</h3>
                            <p>
                                {content.complemento}
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}