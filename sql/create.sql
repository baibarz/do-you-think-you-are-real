DROP TABLE IF EXISTS Questions;
CREATE TABLE Questions
(
    Id SERIAL PRIMARY KEY,
    Question TEXT
);

DROP TABLE IF EXISTS Answers;
CREATE TABLE Answers
(
    Id SERIAL PRIMARY KEY,
    QuestionId integer NOT NULL,
    Answer TEXT,
    UserId integer NOT NULL
);

DROP TABLE IF EXISTS Users;
CREATE TABLE Users
(
    Id SERIAL PRIMARY KEY,
    Name TEXT
);

INSERT INTO Questions (Id, Question) 
	VALUES 
		(0, 'Who are you'), 
		(1, 'Do you think you are real');