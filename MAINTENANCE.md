# Temporary maintenance

Both customer sites display the maintenance screen before loading authentication or application services.

The original entry point is preserved in src/bootstrap.tsx. Application source, content and credentials are unchanged. This is a temporary UI gate, not encryption or a replacement for server authorization.

To reopen this site, set MAINTENANCE_ENABLED to false in src/maintenance-config.ts, build, and publish the generated dist to this repository's gh-pages branch. Reopen both sites separately.

A full static maintenance shell and critical styles are included in index.html so the lock and message are visible even when JavaScript loads slowly. If disabling maintenance, remove the static shell and maintenance-critical style from index.html as well.
