<script>
  import { loginWithEmailPassword } from "../../RESTful API/authentication";
  import { createEventDispatcher } from "svelte";

  let email, password;

  const dispatch = createEventDispatcher();

  const viewChange = () => {
    dispatch("viewChange", false);
  };

  function login() {
    loginWithEmailPassword(email, password)
      .then((data) => {
        console.log(data);
        viewChange();
        api.Maximize();
      })
      .catch((error) => {
        console.log(error);
      });
  }
</script>

<main>
  <div class="LoginBox">
    <img src="CompanyLogo.png" alt="LOGO">
    <input type="email" placeholder="E-mail" bind:value={email} />
    <input type="password" placeholder="Password" bind:value={password} />
    <button on:click={login}>Login</button>
  </div>
  
  <svg version="1.1" xmlns="http://www.w3.org/2000/svg"
		xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="100%" height="100%" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice">
		<defs>
			<linearGradient id="bg">
				<stop offset="0%" style="stop-color:rgba(255, 87, 87, 0.76)"></stop>
				<stop offset="50%" style="stop-color:rgba(255, 87, 87, 0.76)"></stop>
				<stop offset="100%" style="stop-color:rgba(255, 87, 87, 0.76)"></stop>
			</linearGradient>
			<path id="wave" fill="url(#bg)" d="M-363.852,502.589c0,0,236.988-41.997,505.475,0
	s371.981,38.998,575.971,0s293.985-39.278,505.474,5.859s493.475,48.368,716.963-4.995v560.106H-363.852V502.589z" />
		</defs>
		<g>
			<use xlink:href='#wave' opacity="0">
				<animateTransform
          attributeName="transform"
          attributeType="XML"
          type="translate"
          dur="10s"
          calcMode="spline"
          values="270 230; -334 180; 270 230"
          keyTimes="0; .5; 1"
          keySplines="0.42, 0, 0.58, 1.0;0.42, 0, 0.58, 1.0"
          repeatCount="indefinite" />
			</use>
			<use xlink:href='#wave' opacity=".6">
				<animateTransform
          attributeName="transform"
          attributeType="XML"
          type="translate"
          dur="8s"
          calcMode="spline"
          values="-270 230;243 220;-270 230"
          keyTimes="0; .6; 1"
          keySplines="0.42, 0, 0.58, 1.0;0.42, 0, 0.58, 1.0"
          repeatCount="indefinite" />
			</use>
			<use xlink:href='#wave' opacty=".9">
				<animateTransform
          attributeName="transform"
          attributeType="XML"
          type="translate"
          dur="6s"
          calcMode="spline"
          values="0 230;-140 200;0 230"
          keyTimes="0; .4; 1"
          keySplines="0.42, 0, 0.58, 1.0;0.42, 0, 0.58, 1.0"
          repeatCount="indefinite" />
			</use>
		</g>
	</svg>
  
</main>

<style>
  main {
    display: flex;
   
    flex-direction: column;
    justify-content: center;  
    align-items: center;
    
    
    
  }
  input{
    position: relative;
    width: 90%;
   border-radius: 5px;
   font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
 button{
 
    border-radius: 5px;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
 }
 img{
  width: 80%;
 }

   .LoginBox {
    display: flex;
    margin-top: 10%;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    backdrop-filter: blur(16px) saturate(200%);
    -webkit-backdrop-filter: blur(16px) saturate(200%);
    background-color: rgba(248, 211, 211, 0.76);
    border-radius: 12px;
   max-width: 30%;
    padding: 1%;
  }


  div > input {
    max-width: 300px;
  }

  div > button {
    max-width: 300px;
  }

	svg {
		position: absolute;
    z-index: -1;
		top: 0;
		left: 0;
    width: 100%;
    height: 100%;
		box-sizing: border-box;
		display: block;
		background-color: #871515;
    background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.86), #ffffff);
	}

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
    img{
      width: 90%;
    }
  }
</style>
