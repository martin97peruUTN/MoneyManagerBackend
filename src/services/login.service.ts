const users = [
    {
        username: 'martin97peru',
        password: 'test123'
    },
    {
        username: 'martin97peru2',
        password: 'test456'
    }
];

export const jwtLoginService = (username: String) => {
    //TODO Search on DB
    const user = users.find((user) => user.username === username)
    return user
}

export const homepageService = () => {
    return "Homepage"
}