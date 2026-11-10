# Maintenance mode

Current status: disabled. The original application runs from src/bootstrap.tsx, with the database and authentication settings preserved.

To enable the maintenance screen, set MAINTENANCE_ENABLED=true in src/maintenance-config.ts, rebuild and publish. Maintenance styles load only when enabled.

To reopen, set the flag to false, remove any static maintenance shell and maintenance-critical styles from index.html, then rebuild and publish. The current index.html uses a neutral loading message.
