const requestKeyToMysqlKey = {
    username: "user_username",
    givenName: "user_givenname",
    familyName: "user_familyname",
    email: "user_email",
    password: "user_password",
    accountBalance:"user_accountbalance"
};

exports.requestKeyToMysqlKey = function (requestKey, done) {
    let mysqlKey = requestKeyToMysqlKey[requestKey];
    return mysqlKey;
}