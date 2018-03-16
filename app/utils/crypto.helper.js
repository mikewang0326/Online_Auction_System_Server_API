exports.createUserSalt = function () {
    return 'usersalt';
}

exports.createCryptoPassword = function (orginalPassord, salt) {
    let cryptoPassword = ''.concat(orginalPassord).concat(salt);
    return cryptoPassword;
}

exports.createUserToken = function (id) {
    let token = ''.concat(id).concat("tttttttttttttttttkkkkkkkkkkkkkkkkk");
    return token;
}



