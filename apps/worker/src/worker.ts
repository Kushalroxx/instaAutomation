import { Worker } from "bullmq";
import dotenv from "dotenv";
dotenv.config();

const connection = { host: process.env.REDIS_HOST || "127.0.0.1", port: +(process.env.REDIS_PORT || 6379) };

const worker = new Worker("inbound-events", async job => {
    console.log("Processing job", job.id, job.name, job.data);
    // TODO: process automation logic
}, { connection });

worker.on("completed", job => console.log("Job completed", job.id));
worker.on("failed", (job, err) => console.error("Job failed", job?.id, err));

console.log("Worker listening to inbound-events queue");
