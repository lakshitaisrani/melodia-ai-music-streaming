const axios = require("axios");

async function test() {
    const title = "You Belong With Me";
    const artist = "Taylor Swift";
    const duration = 231; // example duration, or we test without it

    const lrclibParams = {
        track_name: title,
        artist_name: artist || ""
    };
    
    // if (duration) lrclibParams.duration = duration;

    console.log("================ DEBUG: LRCLIB REQUEST ================");
    console.log("lrclibParams being sent:", JSON.stringify(lrclibParams, null, 2));

    const searchUrl = "https://lrclib.net/api/search";
    const requestUrl = `${searchUrl}?` + new URLSearchParams(lrclibParams).toString();
    console.log(`[lrclib Request URL] GET ${requestUrl}`);

    try {
        const lrclibRes = await axios.get(searchUrl, {
            params: lrclibParams,
            timeout: 5000
        });
        
        console.log("================ DEBUG: LRCLIB RESPONSE ================");
        console.log("Number of results:", lrclibRes.data.length);
        console.log("First result:", lrclibRes.data[0]);
    } catch (e) {
        console.error("Error:", e.response ? e.response.data : e.message);
    }
}
test();
