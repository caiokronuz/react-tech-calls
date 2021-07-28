import { useState, useContext } from 'react';
import { FiSettings, FiUpload } from 'react-icons/fi'
import { toast } from 'react-toastify';
import firebase from '../../services/firebaseConnection';

import Header from '../../components/Header';
import Title from '../../components/Title';
import { AuthContext } from '../../contexts/auth';

import avatar from '../../assets/avatar.png'
import './styles.css';
export default function Profile() {

    const { user, setUser, storageUser, signOut } = useContext(AuthContext)

    const [name, setName] = useState(user && user.name)
    const [email] = useState(user && user.email)
    const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl)
    const [imageAvatar, setImageAvatar] = useState(null);

    function handleFile(e) {
        if (e.target.files[0]) {
            const image = e.target.files[0];

            if (image.type === 'image/jpeg' || image.type === 'image/png') {
                setImageAvatar(image);
                setAvatarUrl(URL.createObjectURL(image))
            } else {
                toast.warn("A imagem que você enviou não é válida. Tente uma imagem PNG ou JPEG")
            }
        }
    }

    async function handleUpload() {
        const currentUid = user.uid;

        await firebase.storage()
            .ref(`image/${currentUid}/${imageAvatar.name}`)
            .put(imageAvatar)
            .then(async () => {
                await firebase.storage().ref(`image/${currentUid}`)
                    .child(imageAvatar.name).getDownloadURL()
                    .then(async (url) => {
                        let urlFoto = url;
                        await firebase.firestore().collection('users')
                            .doc(currentUid)
                            .update({
                                avatarUrl: urlFoto,
                                name,
                            })
                            .then(() => {
                                let data = {
                                    ...user,
                                    avatarUrl: urlFoto,
                                    name,
                                };
                                setUser(data);
                                storageUser(data);

                                toast.success("Dados atualizados com sucesso!")
                            })
                    })
            }).catch(err => {
                toast.error("Erro! Verifique seus dados e tente novamente.")
            })
    }

    async function handleSave(e) {
        e.preventDefault();

        /*if (imageAvatar === null || name === '') {
            toast.warn("Você não pode deixar nenhum campo em branco")
            return;
        }*/

        if (imageAvatar === null && name !== '') {
            await firebase.firestore().collection('users')
                .doc(user.uid)
                .update({
                    name
                })
                .then(() => {
                    let data = {
                        ...user,
                        name,
                    };
                    setUser(data)
                    storageUser(data)

                    toast.success("Dados atualizados com sucesso!")
                })
                .catch(err => {
                    toast.error("Algo deu errado :(")
                })
        } else if (name !== '' && imageAvatar !== null) {
            handleUpload();
        } else {
            toast.warn("Você não pode deixar nenhum campo em branco")
            return;
        }
    }

    return (
        <div>
            <Header />

            <div className="content">
                <Title name="Meu perfil">
                    <FiSettings size={25} />
                </Title>

                <div className="container">
                    <form className="form-profile" onSubmit={handleSave}>
                        <label className="label-avatar">
                            <span>
                                <FiUpload color="#FFF" size={25} />
                            </span>

                            <input type="file" accept="image/*" onChange={handleFile} /><br />
                            {avatarUrl === null ?
                                <img src={avatar} width="250" height="250" alt="Foto de perfil"/>
                                :
                                <img src={avatarUrl} width="250" height="250" alt="Foto de perfil"/>
                            }
                        </label>

                        <label>Nome</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} />

                        <label>Email</label>
                        <input type="text" value={email} disabled />

                        <button type="submit">Salvar</button>
                    </form>
                </div>

                <div className="container">
                    <button className="logout-btn" onClick={signOut}>Sair</button>
                </div>

            </div>
        </div>
    )
}