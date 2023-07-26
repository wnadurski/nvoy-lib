// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const devConfig = {
  apiKey: 'AIzaSyCMfl7k3cPwGAs6PoJwB0vt7Ues7qU851g',
  authDomain: 'nvoy-dev.firebaseapp.com',
  projectId: 'nvoy-dev',
  storageBucket: 'nvoy-dev.appspot.com',
  messagingSenderId: '774439518862',
  appId: '1:774439518862:web:45de817d30dfdd3b47ffdf',
}

const prodConfig = {
  apiKey: 'AIzaSyDqZj-Ax-CcUq-afwpQsDnLGKa6pQssRJs',
  authDomain: 'cool-chat-d8def.firebaseapp.com',
  projectId: 'cool-chat-d8def',
  storageBucket: 'cool-chat-d8def.appspot.com',
  messagingSenderId: '11135862178',
  appId: '1:11135862178:web:b4f737e24499e59081defb',
  measurementId: 'G-NWEC8QFS83',
}

export const getFirebaseConfig = () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return globalThis.__nvoy_dev_config?.use_dev_env ? devConfig : prodConfig
}
