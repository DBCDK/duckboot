const {OP_CLIENT, OP_SECRET, OP_URI, AUTH_URI, PORT} = process.env;
const config = {OP_CLIENT, OP_SECRET, OP_URI, AUTH_URI, PORT};

Object.keys(config).forEach(key =>{
 if(!config[key]) {
   throw new Error(`${key} is not set`);
 }
});

export default config;