#!/bin/bash

# Step 1: Pull the latest changes from Git
git pull origin main

# Step 2: Rebuild Docker containers
sudo docker compose build

# Step 3: Bring up Docker Compose services
sudo docker compose up -d