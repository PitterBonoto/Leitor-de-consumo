import express from "express";
import uploadRoute from "./routes/uploadRoute";
import confirmRoute from "./routes/confirmRoute";
import listRoute from "./routes/listRoute";

const app = express();
app.use(express.json());

app.use("/", uploadRoute);
app.use("/", confirmRoute);
app.use("/", listRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
