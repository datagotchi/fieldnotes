module.exports = {
  apps: [
    {
      name: "fieldnotes", // A unique name for your application
      script: "./app.js", // Path to your main Node.js application file
      instances: 1, // Number of instances to run (e.g., "max" for all CPU cores)
      exec_mode: "cluster", // Execution mode, "cluster" for load balancing
      watch: true, // Restart the app on file changes (useful for development)
      ignore_watch: ["node_modules"], // Files/directories to ignore when watching
      env_production: {
        NODE_ENV: "production", // Environment variables for production
        PORT: 80,
      },
    },
  ],
};
