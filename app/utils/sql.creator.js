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