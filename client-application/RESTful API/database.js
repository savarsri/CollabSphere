import {app} from "../RESTful API/initialize";

export async function createTeams(uid,name,code){
    const URL = app+"/api/teams/createTeams"
    const res = await fetch(URL, {
        method: 'POST',
        body: JSON.stringify({
            name,
            uid,
            code,
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
    return data;
}

export async function joinTeam(uid,code){
    const URL = app+"/api/teams/joinTeam";
    const res = await fetch(URL,{
        method: 'POST',
        body: JSON.stringify({
            uid,
            code,
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
    return data;
}

export async function getTeam(uid){
    const URL = app+"/api/teams/getTeams";
    const res = await fetch(URL,{
        method: 'POST',
        body: JSON.stringify({
            uid,
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
    return data;
}