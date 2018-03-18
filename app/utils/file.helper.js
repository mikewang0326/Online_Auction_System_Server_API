var fs = require("fs");
var path = require("path");

const PHOTO_DOWNLOAD_DIR_PREFIX = './download/photos/auctions/';

exports.getPhotoDownloadDir = function (auctionId) {
    let dir = PHOTO_DOWNLOAD_DIR_PREFIX + auctionId;
    return dir;
}

function createDirIfNeed (dir) {
    let ret = mkdirsSync(dir);
    return ret;

}

exports.getPhotoDownloadFile = function(auctionId, photoId) {
    let dir = exports.getPhotoDownloadDir(auctionId) + '/' + photoId + '.png';
    return dir;
}

/**
 *
 * save photo steps:
 *
 * 1, create
 */
exports.savePhoto = function (req, auctionId, photoId, done) {
    let ret = false;
    let dir = exports.getPhotoDownloadDir(auctionId);
    let filePath = exports.getPhotoDownloadFile(auctionId, photoId);
    if (createDirIfNeed(dir)) {
        // dir available
        req.pipe(fs.createWriteStream(filePath));
        ret = true;
    } else {
        // dir not available
        ret = false;
    }

    done(ret, auctionId, photoId);
}


function mkdirsSync(dirname) {
    if (fs.existsSync(dirname)) {
        return true;
    } else {
        if (mkdirsSync(path.dirname(dirname))) {
            fs.mkdirSync(dirname);
            return true;
        }
    }
}






