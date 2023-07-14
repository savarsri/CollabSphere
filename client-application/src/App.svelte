<script>
  import Chat from "./views/Chat.svelte";
  	import Dashboard from "./views/Dashboard.svelte";
	import LoginView from "./views/LoginView.svelte";
	let login=true;
	let view;

	const switchView = (event) => {
		login=event.detail;
		login ? view=Chat : view=Dashboard;
	}
</script>

<svelte:component this={view || Chat} on:viewChange={switchView}/>
