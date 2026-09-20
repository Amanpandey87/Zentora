import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { MongoClient } from 'mongodb';
import nodemailer from 'nodemailer';
import Razorpay from 'razorpay';
import { Buffer } from 'node:buffer';
import crypto from 'node:crypto';
import { randomUUID } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

dotenv.config();

const app = express();
const port = globalThis.process?.env?.PORT || 9000;
const jwtSecret = globalThis.process?.env?.JWT_SECRET || 'zentora-development-secret';
const adminEmail = (globalThis.process?.env?.ADMIN_EMAIL || 'pandeyaman5283@gmail.com').toLowerCase();
const adminPassword = globalThis.process?.env?.ADMIN_PASSWORD || 'Pandey@123';
const otpStore = new Map();
const smtpConfigured = Boolean(
  globalThis.process?.env?.SMTP_HOST &&
  globalThis.process?.env?.SMTP_USER &&
  globalThis.process?.env?.SMTP_PASSWORD
);
const mailer = smtpConfigured ? nodemailer.createTransport({
  host: globalThis.process.env.SMTP_HOST,
  port: Number(globalThis.process.env.SMTP_PORT || 587),
  secure: Number(globalThis.process.env.SMTP_PORT || 587) === 465,
  auth: { user: globalThis.process.env.SMTP_USER, pass: globalThis.process.env.SMTP_PASSWORD },
}) : null;
const razorpayKeyId = globalThis.process?.env?.RAZORPAY_KEY_ID;
const razorpayKeySecret = globalThis.process?.env?.RAZORPAY_KEY_SECRET;
const razorpayConfigured = razorpayKeyId && razorpayKeySecret && !razorpayKeyId.startsWith('REPLACE_') && !razorpayKeySecret.startsWith('REPLACE_');
const razorpay = razorpayConfigured
  ? new Razorpay({ key_id: razorpayKeyId, key_secret: razorpayKeySecret })
  : null;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'data', 'db.json');
const mongoUri = globalThis.process?.env?.MONGODB_URI || 'mongodb://127.0.0.1:27017';
let mongoDb = null;

app.use(cors());
app.use(express.json());

function authenticate(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return failure(res, 'Authentication required', 401);
  try {
    req.user = jwt.verify(token, jwtSecret);
    return next();
  } catch {
    return failure(res, 'Invalid or expired token', 401);
  }
}

async function readDb() {
  if (mongoDb) {
    const [users, plans, projects, bids] = await Promise.all([
      mongoDb.collection('users').find().toArray(),
      mongoDb.collection('plans').find().toArray(),
      mongoDb.collection('projects').find().toArray(),
      mongoDb.collection('bids').find().toArray(),
    ]);
    return { users, plans, projects, bids };
  }
  return JSON.parse(await fs.readFile(dbPath, 'utf8'));
}

async function writeDb(db) {
  if (mongoDb) {
    await Promise.all(Object.entries(db).map(async ([collectionName, documents]) => {
      const collection = mongoDb.collection(collectionName);
      await collection.deleteMany({});
      if (documents.length) await collection.insertMany(documents);
    }));
    return;
  }
  await fs.writeFile(dbPath, JSON.stringify(db, null, 2));
}

async function connectMongo() {
  try {
    const client = new MongoClient(mongoUri, { serverSelectionTimeoutMS: 1500 });
    await client.connect();
    mongoDb = client.db(globalThis.process?.env?.MONGODB_DB || 'zentora');
    const admin = await mongoDb.collection('users').findOne({ type: 'admin' });
    const adminData = {
      _id: admin?._id || 'admin-1',
      name: 'Zentora Admin',
      email: adminEmail,
      password: await bcrypt.hash(adminPassword, 10),
      type: 'admin',
      phone: '+91 9082115064',
      location: 'India',
      bio: 'Platform administrator',
      credit: 0,
      status: true,
    };
    await mongoDb.collection('users').replaceOne(
      { type: 'admin' },
      adminData,
      { upsert: true },
    );
    const current = await readDb();
    const jsonDb = JSON.parse(await fs.readFile(dbPath, 'utf8'));
    if (!current.users.length) {
      await writeDb(jsonDb);
    } else if (!current.plans.length && jsonDb.plans.length) {
      await mongoDb.collection('plans').insertMany(jsonDb.plans);
    }
    console.log(`MongoDB connected: ${mongoDb.databaseName}`);
  } catch (error) {
    console.log(`MongoDB unavailable, using JSON fallback: ${error.message}`);
  }
}

function publicUser(user) {
  const safeUser = { ...user };
  delete safeUser.password;
  return safeUser;
}

function result(res, data, message = '') {
  return res.json({ success: true, result: data, message });
}

function failure(res, message, status = 400) {
  return res.status(status).json({ success: false, message });
}

function findUser(db, id) {
  return db.users.find((user) => user._id === id);
}

app.get('/health', (_req, res) => result(res, { status: 'ok' }));

app.post('/request-otp', async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) return failure(res, 'A valid email is required');

  const code = String(Math.floor(100000 + Math.random() * 900000));
  otpStore.set(email, { code, expiresAt: Date.now() + 10 * 60 * 1000 });

  if (!mailer) {
    console.log(`DEV OTP for ${email}: ${code}`);
    return result(res, { devOtp: code }, 'OTP generated in development mode. Add SMTP settings to server/.env for real email delivery.');
  }

  await mailer.sendMail({
    from: globalThis.process.env.SMTP_FROM || globalThis.process.env.SMTP_USER,
    to: email,
    subject: 'Your Zentora verification code',
    text: `Your Zentora OTP is ${code}. It expires in 10 minutes.`,
  });
  return result(res, null, 'OTP sent to your email');
});

app.post('/verify-otp', (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  const entry = otpStore.get(email);
  if (!entry || entry.expiresAt < Date.now() || entry.code !== String(req.body.otp || '')) {
    return failure(res, 'Invalid or expired OTP', 400);
  }
  otpStore.delete(email);
  return result(res, { verified: true }, 'Email verified successfully');
});

app.post('/register', async (req, res) => {
  const { type, name, email, password } = req.body;
  if (!['client', 'user'].includes(type) || !name || !email || !password) {
    return failure(res, 'Type, name, email and password are required');
  }

  const db = await readDb();
  if (db.users.some((user) => user.email.toLowerCase() === email.toLowerCase())) {
    return failure(res, 'An account with this email already exists');
  }

  const user = {
    _id: randomUUID(), name, email: email.toLowerCase(),
    password: await bcrypt.hash(password, 10), type,
    phone: '', location: '', bio: '', credit: type === 'user' ? 10 : 0, status: true,
  };
  db.users.push(user);
  await writeDb(db);
  return result(res, publicUser(user), 'Registration successful');
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const db = await readDb();
  const user = db.users.find((item) => item.email.toLowerCase() === String(email || '').toLowerCase());
  const validPassword = user && await bcrypt.compare(password || '', user.password).catch(() => false);
  if (!user || !validPassword) return failure(res, 'Invalid email or password', 401);
  if (!user.status) return failure(res, 'This account is inactive', 403);
  const token = jwt.sign({ id: user._id, type: user.type }, jwtSecret, { expiresIn: '7d' });
  return res.json({ success: true, result: publicUser(user), token, message: 'Login successful' });
});

app.use(authenticate);

app.get('/admin-stats', async (_req, res) => {
  const db = await readDb();
  return result(res, {
    users: db.users.filter((user) => user.type === 'user').length,
    clients: db.users.filter((user) => user.type === 'client').length,
    projects: db.projects.filter((project) => project.status !== 'closed').length,
  });
});

app.get('/admin-users-list', async (_req, res) => result((res), (await readDb()).users.filter((user) => user.type === 'user').map(publicUser)));
app.get('/admin-clients-list', async (_req, res) => result(res, (await readDb()).users.filter((user) => user.type === 'client').map(publicUser)));
app.get('/admin-project-list', async (_req, res) => result(res, (await readDb()).projects));
app.get('/admin-biding-list', async (_req, res) => {
  const db = await readDb();
  return result(res, db.bids.map((bid) => ({ ...bid, project: db.projects.find((project) => project._id === bid.projectId)?.title || '' })));
});

app.get('/admin-get-plans', async (_req, res) => result(res, (await readDb()).plans));
app.post('/admin-create-plan', async (req, res) => {
  const { name, credits, price, tagline, popular = false } = req.body;
  if (!name || !credits || !price || !tagline) return failure(res, 'All plan fields are required');
  const db = await readDb();
  const plan = { _id: randomUUID(), name, credits: Number(credits), price: Number(price), tagline, popular: Boolean(popular) };
  db.plans.push(plan);
  await writeDb(db);
  return result(res, plan, 'Plan created successfully');
});
app.delete('/admin-delete-plan/:id', async (req, res) => {
  const db = await readDb();
  db.plans = db.plans.filter((plan) => plan._id !== req.params.id);
  await writeDb(db);
  return result(res, null, 'Plan deleted successfully');
});
app.put('/admin-user-status', async (req, res) => {
  const db = await readDb();
  const user = findUser(db, req.body.userId);
  if (!user) return failure(res, 'User not found', 404);
  user.status = Boolean(req.body.status);
  await writeDb(db);
  return result(res, publicUser(user), 'User status updated');
});
app.delete('/admin-delete-user/:id', async (req, res) => {
  const db = await readDb();
  db.users = db.users.filter((user) => user._id !== req.params.id || user.type === 'admin');
  await writeDb(db);
  return result(res, null, 'User deleted successfully');
});

app.get('/client-stats', async (req, res) => {
  const db = await readDb();
  const projects = db.projects.filter((project) => project.clientId === req.query.clientId);
  return result(res, { totalProjects: projects.length, totalBids: db.bids.filter((bid) => projects.some((project) => project._id === bid.projectId)).length, totalDeals: projects.filter((project) => project.status === 'hired').length });
});
app.post('/client-post-project', async (req, res) => {
  const { clientId, title, desc, budget, duration } = req.body;
  if (!clientId || !title || !desc || !budget || !duration) return failure(res, 'All project fields are required');
  const db = await readDb();
  const project = { _id: randomUUID(), clientId, title, desc, budget: Number(budget), duration, status: 'open', createdAt: new Date().toISOString() };
  db.projects.push(project);
  await writeDb(db);
  return result(res, project, 'Project posted successfully');
});
app.get('/client-project-list', async (req, res) => result(res, (await readDb()).projects.filter((project) => project.clientId === req.query.clientId)));
app.get('/client-biding-list', async (req, res) => {
  const db = await readDb();
  return result(res, db.bids.filter((bid) => bid.projectId === req.query.projectId).map((bid) => ({ ...bid, user_name: findUser(db, bid.userId)?.name, user_email: findUser(db, bid.userId)?.email })));
});
app.put('/client-biding-action', async (req, res) => {
  const db = await readDb();
  const bid = db.bids.find((item) => item.projectId === req.body.projectId && item.userId === req.body.userId);
  if (!bid) return failure(res, 'Bid not found', 404);
  bid.status = req.body.status;
  if (req.body.status === 'accept') {
    const project = db.projects.find((item) => item._id === req.body.projectId);
    if (project) project.status = 'hired';
  }
  await writeDb(db);
  return result(res, bid, 'Bid status updated');
});

app.get('/user-stats', async (req, res) => {
  const db = await readDb();
  return result(res, { credits: findUser(db, req.query.userId)?.credit || 0, totalBids: db.bids.filter((bid) => bid.userId === req.query.userId).length, Earning: 0 });
});
app.get('/user-project-list', async (_req, res) => result(res, (await readDb()).projects.filter((project) => project.status === 'open')));
app.post('/user-create-bids', async (req, res) => {
  const { userId, projectId, amount } = req.body;
  const db = await readDb();
  const user = findUser(db, userId);
  if (!user || user.type !== 'user') return failure(res, 'Freelancer not found', 404);
  if (user.credit < 1) return failure(res, 'Not enough credits');
  if (db.bids.some((bid) => bid.userId === userId && bid.projectId === projectId)) return failure(res, 'You already placed a bid on this project');
  const bid = { _id: randomUUID(), userId, projectId, amount: Number(amount), status: 'pending', createdAt: new Date().toISOString() };
  user.credit -= 1;
  db.bids.push(bid);
  await writeDb(db);
  return result(res, bid, 'Bid placed successfully');
});
app.get('/user-get-bids', async (req, res) => {
  const db = await readDb();
  return result(res, db.bids.filter((bid) => bid.userId === req.query.userId).map((bid) => ({ ...bid, ...db.projects.find((project) => project._id === bid.projectId) })));
});
app.post('/user-purchase-plan', async (req, res) => {
  const db = await readDb();
  const user = findUser(db, req.body.userId);
  const plan = db.plans.find((item) => item._id === req.body.planId);
  if (!user || !plan) return failure(res, 'User or plan not found', 404);
  user.credit = (user.credit || 0) + plan.credits;
  await writeDb(db);
  return result(res, publicUser(user), 'Plan purchased successfully');
});

app.post('/user-create-payment-order', async (req, res) => {
  if (!razorpay) return failure(res, 'Razorpay is not configured. Add Razorpay keys to server/.env', 503);
  const db = await readDb();
  const plan = db.plans.find((item) => item._id === req.body.planId);
  if (!plan) return failure(res, 'Plan not found', 404);
  const order = await razorpay.orders.create({ amount: Number(plan.price) * 100, currency: 'INR', receipt: `plan_${plan._id}_${Date.now()}` });
  return result(res, { ...order, keyId: globalThis.process.env.RAZORPAY_KEY_ID }, 'Payment order created');
});

app.post('/user-verify-payment', async (req, res) => {
  if (!razorpay) return failure(res, 'Razorpay is not configured', 503);
  const { razorpay_order_id: orderId, razorpay_payment_id: paymentId, razorpay_signature: signature, userId, planId } = req.body;
  const expected = crypto.createHmac('sha256', globalThis.process.env.RAZORPAY_KEY_SECRET).update(`${orderId}|${paymentId}`).digest('hex');
  if (!signature || signature.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))) {
    return failure(res, 'Payment verification failed', 400);
  }
  const db = await readDb();
  const user = findUser(db, userId);
  const plan = db.plans.find((item) => item._id === planId);
  if (!user || !plan) return failure(res, 'User or plan not found', 404);
  user.credit = (user.credit || 0) + plan.credits;
  await writeDb(db);
  return result(res, publicUser(user), 'Payment successful and credits added');
});

async function updateProfile(req, res, role) {
  const db = await readDb();
  const user = findUser(db, req.body._id);
  if (!user || user.type !== role) return failure(res, 'Profile not found', 404);
  Object.assign(user, { name: req.body.name, email: req.body.email, phone: req.body.phone, location: req.body.location, bio: req.body.bio });
  if (req.body.npassword) user.password = await bcrypt.hash(req.body.npassword, 10);
  await writeDb(db);
  return result(res, publicUser(user), 'Profile updated successfully');
}
app.put('/admin-profile-update', (req, res) => updateProfile(req, res, 'admin'));
app.put('/client-profile-update', (req, res) => updateProfile(req, res, 'client'));
app.put('/user-profile-update', (req, res) => updateProfile(req, res, 'user'));

app.use((_req, res) => failure(res, 'Endpoint not found', 404));
connectMongo().finally(() => {
  app.listen(port, () => console.log(`Zentora API running on http://localhost:${port}`));
});
