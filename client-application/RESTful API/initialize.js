const appConfig = {
    apiKey: "http://localhost:3000"
}

const initializeApp = (appConfig) => {
    return appConfig.apiKey;
}

export const app = initializeApp(appConfig);