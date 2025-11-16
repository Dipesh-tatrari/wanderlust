
async function geocode(query) {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;
        const res = await fetch(url, { headers: { "User-Agent": "DemoApp" } });
        return await res.json();
        };

module.exports = {geocode};