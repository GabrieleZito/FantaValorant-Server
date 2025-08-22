const axios = require("axios");
const fs = require("fs");
const path = require("path");

exports.downloadImage = async () => {
    try {
        console.log("prova");
        const url = "https://liquipedia.net/commons/images/thumb/a/ae/VCT_Champions_icon_allmode.png/370px-VCT_Champions_icon_allmode.png";
        const filename = "prova.png";
        // Axios handles binary data well with responseType
        const response = await axios.get(url, { responseType: "arraybuffer" });

        // Create subfolder if it doesn't exist
        const filepath = path.join(__dirname, "public/images/tournaments", filename);
        fs.writeFileSync(filepath, response.data);
        res.json(`/images/${filename}`);
    } catch (error) {
        console.error("Error downloading image:", error.message);
        return null;
    }
};
