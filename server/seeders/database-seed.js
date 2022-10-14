const db = require("../config/connection.js");
const { Picture } = require("../models/index.js");
const databaseSeeds = require("./json-photo-data.json");  

console.log(databaseSeeds);

const seedDatabase = async () => {

    for (const seed of databaseSeeds) {
        // Database model insert
        const addPicture = async (seed) => {
        try {
            await Picture.deleteMany({});
            const addPicture = await Picture.create({
            lat: seed.latitude,
            lng: seed.longitude,
            url: seed.url,
            public_id: seed.public_id,
            createdAt: seed.CreateDate,
            offsetTime: seed.OffsetTime,
            tags: seed.tags
            });
            console.log(addPicture);
        } catch (err) {
            throw err;
        };
        };
        addPicture(seed);
    };
};

db.once("open", async () => {
    try {
        seedDatabase();
    } catch (err) {
        throw err;
    }
});