import {app} from "../RESTful API/initialize";

export async function getChats(uid){
    let URL = app+'/api/chat/chats';
    const res = await fetch(URL,{
        method: 'POST',
        body:{
            uid: uid
        },
        // headers: {
        //         'Content-Type': 'application/json'
        //     }
    });

    if(!res.ok){
        const  error = await res.json();
        return Promise.reject(error);
    }

    const data = await res.json();
    return data;
}

export async function getMessages(chatId){
    let URL = app+`/api/message/${chatId}`;
    const res = await fetch(URL,{method: 'GET',});

    if(!res.ok){
        const  error = await res.json();
        return Promise.reject(error);
    }

    const data = await res.json();
    return data;
}

export async function sendMessage(uid,newMessage,selectedChatId){
    let URL = app+'/api/chat/chats';
    const res = await fetch(URL,{
        method: 'POST',
        body:{
            uid: uid,
            message: newMessage,
            chatId: selectedChatId
        },
        headers: {
                'Content-Type': 'application/json'
            }
    });

    if(!res.ok){
        const  error = await res.json();
        return Promise.reject(error);
    }

    const data = await res.json();
    return data;
}