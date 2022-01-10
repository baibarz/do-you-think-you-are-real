DROP TABLE IF EXISTS "Answers";
CREATE TABLE "Answers"
(
    "Id" SERIAL PRIMARY KEY,
    "Answer" TEXT
);

DROP TABLE IF EXISTS "Questions";
CREATE TABLE "Questions"
(
    "Id" SERIAL PRIMARY KEY,
    "Question" TEXT
);

DROP TABLE IF EXISTS "QuestionsHaveAnswers";
CREATE TABLE "QuestionsHaveAnswers"
(
    "Id" SERIAL PRIMARY KEY,
    "QuestionId" integer NOT NULL,
    "AnswerId" integer NOT NULL,
    "UserId" integer NOT NULL
);

DROP TABLE IF EXISTS "Users";
CREATE TABLE "Users"
(
    "Id" SERIAL PRIMARY KEY,
    "Name" TEXT
);

INSERT INTO "Questions" ("Question") VALUES ('Who are you?'), ('Do you think you are real?');