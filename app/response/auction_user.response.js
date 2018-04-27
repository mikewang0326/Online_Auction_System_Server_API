const keyMapping = require('../../config/keymapping')

exports.createUserData = function (result, currentUserId, otherUserId) {
    if (currentUserId == otherUserId) {
        return exports.createCurrentUserData(result);
    } else {
        return exports.createOtherUserData(result);
    }

    return data
}

exports.createCurrentUserData = function (result) {
    let data = {
        'username': result[0][keyMapping.requestKeyToMysqlKey("username")],
        'givenName': result[0][keyMapping.requestKeyToMysqlKey("givenName")],
        'familyName': result[0][keyMapping.requestKeyToMysqlKey("familyName")],
        'email': result[0][keyMapping.requestKeyToMysqlKey("email")],
        'accountBalance': result[0][keyMapping.requestKeyToMysqlKey("accountBalance")],
    };

    return data
}


exports.createOtherUserData = function (result) {
    let data = {
        'username': result[0][keyMapping.requestKeyToMysqlKey("username")],
        'givenName': result[0][keyMapping.requestKeyToMysqlKey("givenName")],
        'familyName': result[0][keyMapping.requestKeyToMysqlKey("familyName")],
    };

    return data
}

exports.createAllUserData = function (result) {
    let data = Array();
    let length = result.length;
    for (let i=0; i< length; i++) {
        let item = {
            'username': result[i][keyMapping.requestKeyToMysqlKey("username")],
            'givenName': result[i][keyMapping.requestKeyToMysqlKey("givenName")],
            'familyName': result[i][keyMapping.requestKeyToMysqlKey("familyName")],
        }

        data.push(item);
    }

    return data
}



