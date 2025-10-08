DOCKER MYSQL DB:
Database will populate with some mock data, and run locally

No other integration currently

SETUP:
1. Install Docker desktop
3. Enable WSL if prompted
2. Restart computer -> docker should be running in the system tray

COMMANDS:
While inside /backend:
    To start database (will populate if it hasnt been yet) run `docker compose up -d`
    To stop the database `docker compose down`
    To stop the database and remove data in it `docker compose down -v`
    To check docker running `docker ps`
    To access MySQL `docker exec -it manage-petro-mysql mysql -u mp_app -p devpass manage_petro`
