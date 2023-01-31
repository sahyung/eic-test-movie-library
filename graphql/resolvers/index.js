const userResolvers = require('./user');
const postResolvers = require('./post');
const commentResolvers = require('./comment');
const authorResolvers = require('./author');

module.exports = [
    userResolvers,
    postResolvers,
    commentResolvers,
    authorResolvers,
];
