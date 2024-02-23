// Util file with VNDB-related functions
const axios = require('axios');
const apiUrl = 'https://api.vndb.org/kana/vn';

// Check if a given string is a valid VNDB media URL
exports.isVndbUrl = (url) => {
    if (!url.startsWith("https://vndb.org/v")) {
        return false;
    }
    return true;
}

// Given a VNDB media URL, return the media ID
exports.getVndbMediaId = (url) => {
    return url.split("/")[3];
}

// Given a VNDB media ID, return cover image URL
exports.getVndbCoverImage = async (id) => {
    try {
        const res = await axios.post(apiUrl, {
            'filters': ['id', '=', id],
            'fields': 'image.url',
        },
        {
            headers: {
                'Content-Type': 'application/json',
            }
        })
        return res.data.results[0].image.url;
    } catch (err) {
        console.error(err);
        console.log('no');
        return null;
    }
}