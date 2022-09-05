
const fs = require('fs');
const path = require('path');
const avatarsPath = path.join(__dirname, "../../public/images/avatars/");
const uuid = require('uuid');


/////////una vez ande todo probar con THIS, en lugar de User !!!!
const User = {
    fileName: './src/data/usersDB.json',
    getAll: () => {
        return JSON.parse(fs.readFileSync(User.fileName, 'utf-8')); //leer el archivo completo
    },
    findAll: () => {
        return User.getAll(); //devuelve el array de users
    },
    findByPk: (id) => {
        const users = User.findAll(); //obtengo todos para despues filtrar
        return users.find(user => user.id === id); //devuelve el user con el id que se pasa
    },
    findByField: (field, text) => {
        const users = User.findAll();
        return users.find(user => user[field] == text); 
    },
    // generateId: () => {  PARA GENERAR UN ID SIN EL UUID
    //     let users = User.findAll();
    //     let lastUser = users[users.length - 1];
    //     if (lastUser) {
    //         return lastUser.id + 1;
    //     }
    //     return 1;
    // },
    create: (userData) => {
       // console.log('pasando por create model user');
        const users = User.findAll();
        let newUser = {
            id: uuid.v4(),
            ...userData //toda la info que llega
        }
        //console.log(userData.file);
        users.push(newUser);
        fs.writeFileSync(User.fileName, JSON.stringify(users, null, ' '));
        return newUser;
        
    }, //REVISAR EL EDIT! 
    edit: (userData) => {
        const users = User.findAll();
        let Index = users.findIndex(user => user.id === userData.id);
        //let userToEdit = User.findByPk(userData.id);
            userToEdit.name = userData.name;
            userToEdit.email = userData.email;
            userToEdit.password = userData.password;
            userToEdit.avatar = userData.avatar;
            fs.writeFileSync(User.fileName, JSON.stringify(users, null, ' '));
            return userToEdit;
    },

    // update: (userData) => {
    //     const users = User.findAll();
    //     const index = users.findIndex(user => user.id === userData.id);
    //     users[index] = userData;
    //     fs.writeFileSync(User.fileName, JSON.stringify(users, null, ' '));
    //     return true;
    // },
    delete: (id) => {
        const users = User.findAll();
        let imgToDelete = users.find((e) => e.id == id).avatar;

        // const index = users.findIndex(user => user.id === id);
        // users.splice(index, 1);
        //ELIMINAR LA IMAGEN DEL AVATAR SI SE ELIMINARA EL USER
        // try {
        //     fs.unlinkSync(`${avatarsPath}${imgToDelete}`);
        // } catch (error) {
        //     console.log('error al eliminar el archivo ', error);
        // }
        const finalUsers = users.filter(user => user.id !== id);
        fs.writeFileSync(User.fileName, JSON.stringify(finalUsers, null, ' '));
        return true;
    }
}
module.exports = User;
//console.log(User.findByPk(2)); 
//console.log(User.findByField('email', "pako_cesare@hotmail.com"));
//console.log(User.create({name: 'pancho', last_name: 'cesare'}));
//console.log(User.delete(2));
