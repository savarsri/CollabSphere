import {app} from "../RESTful API/initialize";

export async function loginWithEmailPassword (email,password) {
    const URL = app+"/api/auth/login";
        const res = await fetch(URL, {
            method: 'POST',
            body: JSON.stringify({
                email,
                password,
            }),
            headers: {
                    'Content-Type': 'application/json'
                }
        });

        if(!res.ok){
            const  error = await res.json();
            return Promise.reject(error);
        }

        const data = await res.json();
        const error = data;
        switch(data.code){
            case 200:
                return data;
            case 401:
                return Promise.reject(error);
            case 404:
                return Promise.reject(error);
            default:
                return Promise.reject(error);
        }
}

export async function searchUser(search){
    let URL = app+`/api/auth/searchUsers?search=${search}`;
    const res = await fetch(URL,{
        method: 'GET',
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