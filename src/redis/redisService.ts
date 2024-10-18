import express from "express";
import axios from "axios";
import * as Redis from "redis";

const client = Redis.createClient();
client.on('error', (err) => console.log('Redis Client Error', err));
client.connect();

export async function setCache(key: string, value: string, expire: number) {
    await client.setEx(key, expire, value);
}

export async function getCache(key: string) {
    const value = await client.get(key);
    return value ? JSON.parse(value) : null;
}

export async function deleteCache(key: string) {
    await client.del(key);
}