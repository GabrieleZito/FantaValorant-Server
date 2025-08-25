const axios = require("axios");
const fs = require("fs");
const path = require("path");

exports.downloadImage = async (url, filename) => {
    try {
        const response = await axios.get(url, { responseType: "arraybuffer" });
        const filepath = path.join(__dirname, "../../public/images", filename);
        fs.writeFileSync(filepath, response.data);
        return `/public/images/${filename}`;
    } catch (error) {
        console.error("Error downloading image:", error.message);
        return null;
    }
};
