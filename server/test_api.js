const axios = require("axios");

async function testApi() {
    const title = "You Belong With Me";
    const artist = "Taylor Swift";

    const lrclibParams = {
        track_name: title,
        artist_name: artist || ""
    };

    let bestMatch = null;

    try {
        const searchUrl = "https://lrclib.net/api/search";
        const requestUrl = `${searchUrl}?` + new URLSearchParams(lrclibParams).toString();
        
        console.log("Fetching...", requestUrl);
        const start = Date.now();
        const lrclibRes = await axios.get(searchUrl, {
            params: lrclibParams,
            timeout: 10000
        });
        console.log(`Search returned in ${Date.now() - start}ms`);

        if (lrclibRes.data && Array.isArray(lrclibRes.data) && lrclibRes.data.length > 0) {
            const targetArtist = (artist || "").toLowerCase().trim();

            for (const track of lrclibRes.data) {
                const trackArtist = (track.artistName || "").toLowerCase().trim();
                if (targetArtist && trackArtist.includes(targetArtist)) {
                    bestMatch = track;
                    break;
                }
            }

            if (!bestMatch) {
                bestMatch = lrclibRes.data[0];
            }
        }
    } catch (searchError) {
        console.warn(`lrclib search failed (${searchError.message}). Retrying with exact match...`);
        try {
            const getUrl = "https://lrclib.net/api/get";
            const start = Date.now();
            const getRes = await axios.get(getUrl, {
                params: lrclibParams,
                timeout: 5000 
            });
            console.log(`Fallback returned in ${Date.now() - start}ms`);
            
            if (getRes.data) {
                bestMatch = getRes.data;
            }
        } catch (getError) {
            console.warn(`lrclib exact match fallback also failed: ${getError.message}`);
        }
    }

    if (bestMatch && (bestMatch.plainLyrics || bestMatch.syncedLyrics)) {
        console.log("SUCCESS! Got lyrics:");
        console.log(bestMatch.plainLyrics.substring(0, 50) + "...");
    } else {
        console.log("FAILED to find lyrics");
    }
}
testApi();
