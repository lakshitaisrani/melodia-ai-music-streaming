const axios = require("axios");

async function testLatency() {
    const searchUrl = "https://lrclib.net/api/search";
    const params = {
        track_name: "You Belong With Me",
        artist_name: "Taylor Swift"
    };
    
    for (let i = 1; i <= 4; i++) {
        const start = Date.now();
        try {
            console.log(`[Request ${i}] Fetching...`);
            const res = await axios.get(searchUrl, { params, timeout: 20000 });
            const duration = Date.now() - start;
            console.log(`[Request ${i}] Success. Time: ${duration}ms, Results: ${res.data.length}`);
        } catch (e) {
            const duration = Date.now() - start;
            console.error(`[Request ${i}] Failed. Time: ${duration}ms, Error: ${e.message}`);
        }
    }
}
testLatency();
