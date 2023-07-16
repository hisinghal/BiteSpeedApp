import start from './start.js';

import sqlite3 from "sqlite3";
import { open } from "sqlite";

const { PORT = 8080 } = process.env;

const dbPromise = open({
    filename: "bitespeed.db",
    driver: sqlite3.Database,
});

const setup = async () => {
    const db = await dbPromise;
    await db.migrate();
    start.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`);
    });
};

setup();

export {
    dbPromise
};