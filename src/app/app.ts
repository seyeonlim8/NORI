import express, { Request, Response } from "express";
import cors from "cors";

const app = express();
const PORT = 3099;

app.use(cors({ credentials: true, origin: "http://localhost:3000" })); //localshot:3000에 대한 cors허용
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/hello", (req: Request, res: Response) => {
  res.json({ msg: "hello from server!" });
}); 

app.listen(PORT, () => {
  console.log(`-------------SERVER LISTENING ON PORT ${PORT}-------------`);
});
