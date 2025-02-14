import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import { loadConfig } from '~/utils/config/headscale';
import { loadContext } from '~/utils/config/headplane';

const context = await loadContext();
let filename: string = '/var/lib/headscale/db.sqlite';

if (context.config.read) {
  const config = await loadConfig();
    filename = config.database.sqlite.path;
}

const dbPromise = open({
  filename: filename,
  driver: sqlite3.Database,
});

export default dbPromise;
