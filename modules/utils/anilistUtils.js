// Util file with AniList-related functions
const axios = require('axios');
const apiUrl = 'https://graphql.anilist.co';

// Check if a given string is a valid AniList media URL
exports.isAniListUrl = (url) => {
    if (!url.startsWith("https://anilist.co/")) {
        return false;
    }
    return true;
}

// Given an AniList media URL, return the media ID
exports.getMediaId = (url) => {
    console.log(url.split("/")[4]); 
    return url.split("/")[4];
}

// Given an AniList media ID, return cover image URL
exports.getCoverImage = async (mediaId) => {
//     const query = `
//     query ($id: Int) {
//       Media(id: $id) {
//         coverImage {
//           large
//         }
//       }
//     }
//   `;
    const query = `
        query ($id: Int) {
            Media(id: $id) {
                bannerImage
            }
        }
    `;
    const variables = {
        id: parseInt(mediaId)
    };
    try {
        const res = await axios.post(apiUrl, {
            query,
            variables
        });
        // console.log(res);
        // return res.data.data.Media.coverImage.large;
        return res.data.data.Media.bannerImage;
    } catch (err) {
        console.log("FUUUUUUUUUCK-----------");
        return null;
        // console.error(err);
    }
}