exports.getUpdateSetStringByFieldsAndValues = function (fields, fieldsValues) {

    let length = fields.length;

    let sqlSetString = "";

    for (let i=0; i<length; i++) {
        let field = fields[i];
        let fieldValue = fieldsValues[i];

        if (i != length -1) {
            sqlSetString = sqlSetString.concat(field).concat('=');
            if (typeof fieldValue == "string") {
                sqlSetString = sqlSetString.concat("'").concat(fieldValue).concat("',");
            } else {
                sqlSetString = sqlSetString.concat(fieldValue).concat(',');
            }

        } else {
            sqlSetString = sqlSetString.concat(field).concat('=');

            if (typeof fieldValue == "string"){
                sqlSetString = sqlSetString.concat("'").concat(field).concat("'");
            } else {
                sqlSetString = sqlSetString.concat(fieldValue);
            }

        }
    }

    return sqlSetString;
}

/**
 *
 * check sql execute result if has the error parameter
 *
 */
exports.isSqlResultOk = function (result) {
    if (null == result || result == undefined) {
        return false;
    }

    let ret = true;
    let errno = result['errno'];

    if (errno != "" && errno != undefined) {
        ret = false;
    }

    return ret;
}

/**
 *
 * check sql execute result if has the error parameter
 *
 */
exports.isSqlResultEmpty = function (result) {
    let ret = false;
    if (null == result || result == undefined || 0 == result.length) {
        ret =  true;
    }

    console.log('isSqlResultEmpty : ' + ret);
    return ret;
}



