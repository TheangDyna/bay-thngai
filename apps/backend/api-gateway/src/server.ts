import app from "@/src/app";
import configs from "@/src/config";

async function run() {
  try {
    app.listen(configs.port, () => {
      console.info(`API Gateway running on Port: ${configs.port}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

run();
