import getConfig from "@root/config";
import { getConnectionManager } from "typeorm";
import path from "path";
import { Claimer } from "@root/entity/Claimer";
import { getClaimers } from "@root/config/apps";

const config = getConfig();

const connectionManager = getConnectionManager();
connectionManager.create({
  type: "mysql",
  host: config.dbHost,
  port: 3306,
  username: "root",
  password: config.dbPassword,
  database: config.dbName,
  entities: [
    path.join(__dirname, "../entity/**/*.js"),
    path.join(__dirname, "../entity/**/*.ts"),
  ],
  migrations: [
    path.join(__dirname, "../migration/**/*.js"),
    path.join(__dirname, "../migration/**/*.ts"),
  ],
  migrationsRun: true,
});

export const getDatabase = () => connectionManager.get();

export const startDatabase = async () => {
  const db = getDatabase();

  try {
    await db.connect();
  } catch {
    await startDatabase();
  }

  // Seed Apps
  const claimerRepo = db.getRepository(Claimer);
  await claimerRepo.save(getClaimers());
};

export const endDatabase = async () => {
  const db = getDatabase();
  await db.close();
};
