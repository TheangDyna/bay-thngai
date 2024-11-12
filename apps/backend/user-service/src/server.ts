import app from "@/src/app";
import configs from "@/src/config";
import connectToMongoDB from "./database/connection";

async function run() {
  try {
    await connectToMongoDB();
    app.listen(configs.port, () => {
      console.info(`User Service running on Port: ${configs.port}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

run();
