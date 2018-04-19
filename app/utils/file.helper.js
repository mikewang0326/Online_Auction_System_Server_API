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
    photoId = 1; // make code simper, do not create increment photoId
    let dir = exports.getPhotoDownloadDir(auctionId) + '/' + photoId + '.jpeg';
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

exports.deletePhotosForSpecificAuction = function (auctionId, done) {
    let ret = false;
    let auctionDir = exports.getPhotoDownloadDir(auctionId);

    if (deleteDir(auctionDir)) {
        ret = true;
    }

    done(ret);
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

function deleteDir(path) {
    let ret = false;
    var files = [];
    if(fs.existsSync(path)) {
        files = fs.readdirSync(path);
        files.forEach(function(file, index) {
            var curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()) { // recurse
                deleteall(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
        ret = true;
    }

    return ret;
};


/**
 * {
 *   "ext": "jpg",
 *  "mime": "image/jpeg"
 * }
 */
exports.getImageType = function (path) {
    let imageType = "unknow";
    if (path.endsWith(".jpeg")) {
        imageType = "jpeg";
    } else if (path.endsWith(".png")) {
        imageType = "png";
    }
    return imageType;
}

exports.getImageImmeType = function (path) {
    let immeType = "unknow";
    if (path.endsWith(".jpeg")) {
        immeType = "image/jpeg";
    } else if (path.endsWith(".png")) {
        immeType = "image/png";
    }
    return immeType;
}








