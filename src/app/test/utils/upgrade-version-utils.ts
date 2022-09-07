export const userMessages = `
SELECT users.name,messages.title,messages.body FROM users
 INNER JOIN messages ON users.id = messages.userid
 WHERE users.id = ?;
`;

