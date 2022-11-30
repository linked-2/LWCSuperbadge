// const user = {
//     name: 'Jon Smith', 
//     email: 'jsmith@gmail.com', 
//     title: 'Sales Diretor'
// };
// exports.user = user;

class User {
    constructor(name, email, title){
        this.name = name;
        this.email = email;
        this.title = title;
    }

    displayDetails(){
        console.log(`Name: ${this.name}, Email: ${this.email}, Title: ${this.title}`);
    }
}
module.exports = User;