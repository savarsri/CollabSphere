<script>
    import { onMount } from 'svelte';
    import {searchUser} from "../../RESTful API/authentication";
    import {getChats} from "../../RESTful API/chat";
  
    let teamName, uid="6426fcc0ed69036fd8cf15e8", code,name;
    let searchList=[];
    let chats=[];
    let selectedChat , typedMessage;

    onMount(async () => {
		getChats(uid).then((data)=>{
            chats = data;
            console.log(data);
        }).catch((error)=>{
            console.log(error);
        })
	});

    function search(){
    searchUser(name).then((data)=>{
        searchList = data;
    }).catch((error)=>{
        console.log(error);
    })
  }
  
  </script>
  
  <main>
    <div id="SearchDiv">
        <div>
            <input type="text" bind:value={name} placeholder="Seach" on:input={search}>
        </div>
        <div>
            <ul>
                {#each searchList as list}
                  <li id="searchResult">
                    <span>{list.name}</span>
                    <span>{list.email}</span>
                  </li>
                {/each}
              </ul>
        </div>
    </div>
    <div id="chatArea">
        <div>
            <ul>
                {#each chats as chat}
                  <li id="searchResult">
                    <span>{chat.name}</span>
                    <span>{chat.email}</span>
                  </li>
                {/each}
              </ul>
        </div>
        <div id="chatSide">
            <div id="chatBox">

            </div>
            <div id="chatInput">
                <input type="text" bind:value={typedMessage}>
            </div>
        </div>
    </div>
  </main>
  
  <style>
    main{
        display: flex;
        flex-direction: column;
    }

    #SearchDiv{
        display: flex;
        flex-direction: row;
        margin: 2%;
    }



    #searchResult{
        display: flex;
        flex-direction: column;
        border: 5px;
        border-color: black;
    }

    #chatArea{
        display: flex;
        flex-direction: row;
        background-color: rgb(240, 240, 240);
        height: 600;
        width: 1000;
    }

    #chatSide{
        display: flex;
        flex-direction: column;
    }

    #chatBox{
        
    }


  </style>
  