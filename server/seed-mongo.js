import { MongoClient } from 'mongodb';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uri = globalThis.process?.env?.MONGODB_URI || 'mongodb://127.0.0.1:27017';
const databaseName = globalThis.process?.env?.MONGODB_DB || 'zentora';
const dbPath = path.join(__dirname, 'data', 'db.json');
const client = new MongoClient(uri);

await client.connect();
const database = client.db(databaseName);
const seed = JSON.parse(await fs.readFile(dbPath, 'utf8'));
seed.plans = [
  { _id: 'plan-starter', name: 'STARTER', credits: 10, price: 199, tagline: 'A simple start for new freelancers', popular: false },
  { _id: 'plan-growth', name: 'GROWTH', credits: 50, price: 699, tagline: 'For freelancers growing their pipeline', popular: true },
  { _id: 'plan-pro', name: 'PRO', credits: 120, price: 1299, tagline: 'More opportunities, more flexibility', popular: false },
];
seed.projects = [
  { _id: 'project-shop', clientId: '2bb6c9ce-c871-4925-8859-2969cd02495c', title: 'Build a modern online shop', desc: 'Create a responsive ecommerce storefront with product search and checkout.', budget: 75000, duration: '4 weeks', status: 'open', createdAt: new Date().toISOString() },
  { _id: 'project-brand', clientId: '2bb6c9ce-c871-4925-8859-2969cd02495c', title: 'Refresh our brand website', desc: 'Design and build a polished marketing website for a growing business.', budget: 45000, duration: '3 weeks', status: 'open', createdAt: new Date().toISOString() },
];
seed.bids = [
  { _id: 'bid-shop', userId: '4d4fb269-95ac-45c5-878a-c20b38201208', projectId: 'project-shop', amount: 68000, status: 'pending', createdAt: new Date().toISOString() },
];

for (const [collectionName, documents] of Object.entries(seed)) {
  const collection = database.collection(collectionName);
  await collection.deleteMany({});
  if (documents.length) await collection.insertMany(documents);
}

console.log(`Seeded ${databaseName}: ${seed.users.length} users, ${seed.plans.length} plans, ${seed.projects.length} projects, ${seed.bids.length} bids`);
await client.close();