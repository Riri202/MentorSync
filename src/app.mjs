// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();
import express from 'express';
import cors from 'cors';
import cookieSession from "cookie-session";
import routes from './routes';
import { connectToDB } from './config/db';

// TODO:  implement video call appointments too. set up appointments and use socket.io to inform mentors of new appointments
// TODO: incorperate a paid mentorship session feature

const app = express()
const port = process.env.PORT || 4000


// middlewares
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(
    cookieSession({
      name: "rita_maria-session",
      secret: process.env.COOKIE_SECRET,
      httpOnly: true
    })
  );

// routes
app.use('/', routes)

// connect to database
connectToDB()

app.listen(port, () => console.log(`free mentors server listening on port ${port}`))
