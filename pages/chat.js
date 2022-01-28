import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React from 'react';
import appConfig from '../config.json';
import { createClient } from '@supabase/supabase-js';
import { AiOutlineClose } from "react-icons/ai";
import { IconContext } from 'react-icons/lib';   // Criar um botão de excluir as mensagens
import { useRouter } from 'next/router';
import { ButtonSendSticker } from '../src/components/ButtonSendSticker';

// Local das informações do supabase: settings -> API
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzMwNzc0MSwiZXhwIjoxOTU4ODgzNzQxfQ.MD-QD63froYSlC1SmIFdTtxI3NfRUnGg9JNXDJc4Rnc';
const SUPABASE_URL = 'https://lobdmuxpmoyjklzgtwgo.supabase.co';
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function escutaMensagensEmTempoReal(adicionaMensagem) {
    return supabaseClient
      .from('mensagens')
      .on('INSERT', (respostaLive) => {
        adicionaMensagem(respostaLive.new);
      })
      .subscribe();
}

export default function ChatPage() {
    const roteamento = useRouter();
    const usuarioLogado = roteamento.query.username;
    const [mensagem, setMensagem] = React.useState('');
    const [listaDeMensagens, setListaDeMensagens] = React.useState([]);
  
    React.useEffect(() => {
        supabaseClient
            .from('mensagens')
            .select('*')
            .order('id', { ascending: false })
            .then(({ data }) => {
            // console.log('Dados da consulta:', data);
            setListaDeMensagens(data);
            });
    
        const subscription = escutaMensagensEmTempoReal((novaMensagem) => {
            console.log('Nova mensagem:', novaMensagem);
            console.log('listaDeMensagens:', listaDeMensagens);
            // Quero reusar um valor de referencia (objeto/array) 
            // Passar uma função pro setState
    
            // setListaDeMensagens([
            //     novaMensagem,
            //     ...listaDeMensagens
            // ])
            setListaDeMensagens((valorAtualDaLista) => {
            console.log('valorAtualDaLista:', valorAtualDaLista);
            return [
                novaMensagem,
                ...valorAtualDaLista,
            ]
            });
        });
    
        return () => {
            subscription.unsubscribe();
        }
    }, []);

    function HandleNovaMensagem(novaMensagem) {
        const mensagem = {
            // id: listaDeMensagens.length + 1,
            de: usuarioLogado,
            texto: novaMensagem,
        };
      
          supabaseClient
            .from('mensagens')
            .insert([
              // Tem que ser um objeto com os MESMOS CAMPOS que você escreveu no supabase
              mensagem
            ])
            .then(({ data }) => {
              console.log('Criando mensagem: ', data);
            });
      
            setMensagem('');
    }
    return (
        <Box
            styleSheet={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: appConfig.theme.colors.primary[200],
                //backgroundImage: `url(https://virtualbackgrounds.site/wp-content/uploads/2020/08/the-matrix-digital-rain.jpg)`,
                backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
                color: appConfig.theme.colors.neutrals['000']
            }}
        >
            <Box
                styleSheet={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                    borderRadius: '5px',
                    backgroundColor: appConfig.theme.colors.blue[300],
                    height: '100%',
                    maxWidth: '95%',
                    maxHeight: '95vh',
                    padding: '32px',
                }}
            >
                <Header />
                <Box
                    styleSheet={{
                        position: 'relative',
                        display: 'flex',
                        flex: 1,
                        height: '80%',
                        backgroundColor: appConfig.theme.colors.blue[200],
                        flexDirection: 'column',
                        borderRadius: '5px',
                        padding: '16px',
                    }}
                >
                    <MessageList mensagens={listaDeMensagens}/>
                    {/*listaDeMensagens.map((mensagemAtual) => {
                        console.log(mensagemAtual.id)
                        return (
                            <li> {mensagemAtual.de}: {mensagemAtual.texto} </li>
                        )
                    })*/}

                    <Box
                        as="form"
                        styleSheet={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <TextField
                            value={mensagem}
                            onChange={(event) => {
                                //console.log(event)
                                const valor = event.target.value;
                                setMensagem(valor);
                            }}
                            onKeyPress={(event) => {
                                //if(event.code === "Enter"){ console.log("Apertou enter!")}
                                if(event.key === "Enter"){ 
                                    event.preventDefault();
                                    //console.log(event); 
                                    event.preventDefault();
                                    if(mensagem.length > 0){
                                        HandleNovaMensagem(mensagem);
                                    } 
                                }
                            }}
                            placeholder="Insira sua mensagem aqui..."
                            type="textarea"
                            styleSheet={{
                                width: '100%',
                                border: '0',
                                resize: 'none',
                                borderRadius: '5px',
                                padding: '6px 8px',
                                backgroundColor: appConfig.theme.colors.blue[300],
                                marginRight: '12px',
                                color: appConfig.theme.colors.neutrals[200],
                            }}
                        />
                        {/* CallBack */}
                        <ButtonSendSticker
                        onStickerClick={(sticker) => {
                            // console.log('[USANDO O COMPONENTE] Salva esse sticker no banco', sticker);
                            HandleNovaMensagem(':sticker: ' + sticker);
                        }} />
                        <Box
                        styleSheet={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            margin: '10px',
                            maxWidth: '50px',
                            maxHeight: '100%',
                        }} 
                        >
                            <Button
                                onClick={(event) => {
                                    event.preventDefault();
                                    if(mensagem.length > 0){
                                        HandleNovaMensagem(mensagem);
                                    } 
                                }}
                                type='submit'
                                label='Ok'
                                fullWidth
                                buttonColors={{
                                    contrastColor: appConfig.theme.colors.neutrals["000"],
                                    mainColor: appConfig.theme.colors.primary[800],
                                    mainColorLight: appConfig.theme.colors.primary[400],
                                    mainColorStrong: appConfig.theme.colors.primary[600],
                                }}
                            />
                    </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

function Header() {
    return (
        <>
            <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                <Text variant='heading5'>
                    Chat
                </Text>
                <Button
                    label='Logout'
                    href="/"
                    buttonColors={{
                        contrastColor: appConfig.theme.colors.neutrals["000"],
                        mainColor: 'tomato',
                        mainColorLight: appConfig.theme.colors.primary[500],
                        mainColorStrong: 'rgb(255, 69, 71)',
                    }}
                />
            </Box>
        </>
    )
}

function MessageList(props) {
    console.log(props);
    return (
        <Box
            tag="ul"
            styleSheet={{
                overflow: 'hidden scroll',
                display: 'flex',
                flexDirection: 'column-reverse',
                flex: 1,
                color: appConfig.theme.colors.neutrals["000"],
                marginBottom: '16px',
            }}
        >
            {props.mensagens.map((mensagem) => {
                //
                return (
                    <Text
                        key={mensagem.id}
                        tag="li"
                        styleSheet={{
                            borderRadius: '5px',
                            padding: '6px 15px 6px 15px',
                            marginBottom: '16px',
                            marginRight: '20px',
                            borderRadius: '15px',
                            hover: {
                                backgroundColor: appConfig.theme.colors.blue[100],
                            }
                    }}
                >
                    <Box
                        styleSheet={{
                            marginBottom: '8px',
                        }}
                    >
                        <Image
                            styleSheet={{
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                display: 'inline-block',
                                marginRight: '8px',
                            }}
                            src={`https://github.com/${mensagem.de}.png`}
                        />
                        <Text tag="strong" styleSheet={{color: 'rgba(255,255,255,0.6)'}}>
                            {mensagem.de}
                        </Text>
                        <Text
                            styleSheet={{
                                fontSize: '10px',
                                marginLeft: '8px',
                                marginRight: '15px',
                                color: appConfig.theme.colors.neutrals[300],
                            }}
                            tag="span"
                        >
                            {(new Date().toLocaleDateString())}
                        </Text>
                        <IconContext.Provider
                            value={{color: 'rgba(255,115,115,0.6)', size: '14px'}}
                        >
                            <AiOutlineClose 
                                onClick={(event) => {
                                    //
                                }}
                            />
                        </IconContext.Provider>
                    </Box>
                    {/*mensagem.texto.startsWith(':sticker:').toString()*/}
                    {mensagem.texto.startsWith(':sticker:')
                    ? (
                        <Image src={mensagem.texto.replace(':sticker:', '')}
                            styleSheet={{
                                maxWidth: '250px',
                            }}
                        />
                    )
                    : (
                        mensagem.texto
                    )}
                    {/*mensagem.texto*/}
                </Text>
                );
            })}
        </Box>
    )
}