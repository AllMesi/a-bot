@echo off
git add .
git commit -m "%*"
git push origin HEAD:main