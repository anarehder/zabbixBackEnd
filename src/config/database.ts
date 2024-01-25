import dotenv from "dotenv";
import mysql from 'mysql2/promise';

dotenv.config();


export let db: mysql.Pool;
export function connectDb(): void {
    db = mysql.createPool(process.env.DATABASE_URL);
}