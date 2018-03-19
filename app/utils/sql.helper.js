exports.getAuctionSearchSqlFromRequest = function (req) {
    let title = req.query.q;
    let categoryId = parseInt(req.query.categoryId);

    let seller = parseInt(req.query.seller);
    let bidder = parseInt(req.query.bidder);
    let winner = parseInt(req.query.winner);

    let startIndex = parseInt(req.query.startIndex);
    let limit = parseInt(req.query.count);

    /*
     * sql strcture
     *
     * 1, fields
     *       according to agreement
     * 2, where
     *       title
     *       categoryId
     *       role
     *          seller
     *          bidder
     *          winner (do not need to implement)
     *
     * 3, suffix
     *       limit
     *       offset
     *
     *
     *
     */

    // select auction_id,auction_title,auction_categoryid from auction where auction_title like '%o%' limit 6 offset 0;

    let sqlClauses = Array();

    let basicSearchSql = "SELECT\n" +
        "    distinct a.auction_id, c.category_title, a.auction_categoryid, a.auction_title, a.auction_reserveprice, a.auction_startingdate, a.auction_endingdate\n" +
        "FROM\n" +
        "    auction a\n" +
        "INNER JOIN category c ON a.auction_categoryid = c.category_id\n" +
        "INNER JOIN bid b ON a.auction_id = b.bid_auctionid";

    sqlClauses.push(basicSearchSql);

    // add where
    let whereClauses = Array();

    if (title != '' && title != null && title != undefined) {
        let titleClause = 'a.auction_title like \'%' + title + '%\'';
        whereClauses.push(titleClause);
    }

    if (categoryId > 0) {
        let categoryIdClause = 'a.auction_categoryId =' + categoryId;
        whereClauses.push(categoryIdClause);
    }

    if (seller > 0) {
        let sellerClause = 'a.auction_userid = ' + seller;
        whereClauses.push(sellerClause);
    }

    if (bidder > 0) {
        let bidderClause = 'b.bid_userid = ' + bidder;
        whereClauses.push(bidderClause);
    }

    if (startIndex > 0) {
        let startIndexClause = 'a.auction_id > ' + startIndex;
        whereClauses.push(startIndexClause);
    }

    if (whereClauses.length > 0) {
        let whereClausesSql = "WHERE " + whereClauses.join(' AND ');
        sqlClauses.push(whereClausesSql);
    }

    // add suffix
    let suffixClauses = Array();

    // default order by latest to old
    // suffixClauses.push('ORDER BY a.auction_creationdate des');

    if (limit > 0) {
        let limitClause = 'LIMIT ' + limit;
        suffixClauses.push(limitClause);
    }

    if (suffixClauses.length > 0) {
        let suffixSql = suffixClauses.join(' ');
        sqlClauses.push(suffixSql);
    }

    let sql = sqlClauses.join(' ');

    return sql;
}


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
                sqlSetString = sqlSetString.concat("'").concat(fieldValue).concat("'");
            } else {
                sqlSetString = sqlSetString.concat(fieldValue);
            }

        }
    }

    return sqlSetString;
}

exports.getAndConditions = function (fields, fieldsValues) {

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

exports.isSqlResultValid = function (result) {
    let ret = exports.isSqlResultOk(result) && !exports.isSqlResultEmpty(result);
    return ret;
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



