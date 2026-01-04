module.exports = {
  apps: [
    {
      name: "fieldnotes", // A unique name for your application
      script: "./app.js", // Path to your main Node.js application file
      instances: 1, // Number of instances to run (e.g., "max" for all CPU cores)
      exec_mode: "cluster", // Execution mode, "cluster" for load balancing
      watch: false, // Prevents unintended restarts on DB writes
      env_production: {
        NODE_ENV: "production", // Environment variables for production
        PORT: 80,
      },
    },
  ],
};
