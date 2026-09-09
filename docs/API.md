# API

## Auth
POST /auth/login
POST /auth/register
POST /auth/logout

## Modules
GET /modules
GET /modules/{id}

## Lessons
GET /lessons/{id}

## Questions
GET /questions/random
GET /questions/module/{moduleId}

## Quiz
POST /quiz/start
POST /quiz/answer
POST /quiz/finish

## Progress
GET /progress
PATCH /progress

## Analytics
GET /analytics

## Roadmap
GET /roadmap

## AI (internal)
POST /ai/generate/questions
POST /ai/generate/lesson
