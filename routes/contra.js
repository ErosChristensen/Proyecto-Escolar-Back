import bcrypt from "bcrypt";
const password = "tu_contraseña";
bcrypt.hash(password, 10).then(hash => console.log(hash));