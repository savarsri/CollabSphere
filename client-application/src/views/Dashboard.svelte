<script>
  import { createTeams, joinTeam, getTeam} from "../../RESTful API/database";
  import {searchUser} from "../../RESTful API/authentication";

  let teamName, uid="63f4fcb5180330d004fca3b8", code,name;
  let searchList=[];

  function createTeam() {
    createTeams(uid,teamName,code)
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function joinTeams(){
    joinTeam(uid,code).then((data)=>{
        console.log(data);
    }).catch((error)=>{
        console.log(error);
    })
  }

  function getTeams(){
    getTeam(uid).then((data)=>{
        console.log(data);
    }).catch((error)=>{
        console.log(error);
    })
  }

  function search(){
    searchUser(name).then((data)=>{
    }).catch((error)=>{
        console.log(error);
    })
  }

  function logout() {
    api.Default_Size();
  }
</script>

<main>
    <input type="text" bind:value={teamName}>
    <input type="text" bind:value={code} placeholder="Code">
    <button on:click={getTeams}>Get Team</button>
    <button on:click={joinTeams}>Join Team</button>
    <button on:click={createTeam}>Create Team</button>
    <button on:click={logout}>Logout</button>
    <input type="text" bind:value={name} placeholder="Seach" on:input={search}>
</main>

<style>
</style>
