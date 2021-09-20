class User
{
    userId:string;
    firstName:string;
    lastName:string;
    emailAddress:string;   
    #password:string;
    constructor(userId:string, firstName:string, lastName:string, emailAddress:string, password:string)
    {
        this.userId = userId;
        this.firstName = firstName;
        this.lastName=lastName;
        this.emailAddress = emailAddress;
        this.#password = hashIt(password);
    }

    ValidatePassword(password:string) {
        return hashIt(password) == this.#password;
    }

}

/* return the hash of a password */
function hashIt(password:string) {
    // TODO any module like crypto / npm-hash
    // This currently means we are storing passwords in plain text
    return password;
}

const userArray:User[] = [];
export {User, userArray};