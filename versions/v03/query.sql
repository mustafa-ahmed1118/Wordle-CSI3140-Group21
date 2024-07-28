-- Connect to the wordle_game database
\c wordle_game

-- Create Leaderboard table
CREATE TABLE Leaderboard (
    EntryID int PRIMARY KEY,
    Name varchar(255) NOT NULL,
    Score int
); 

-- Create WordList table
CREATE TABLE WordList (
    WordID int PRIMARY KEY,
    Word varchar(255) NOT NULL
); 

INSERT INTO WordList (WordID, Word) VALUES
(1, 'house'), (2, 'apple'), (3, 'bread'), (4, 'earth'), (5, 'beach'),
(6, 'radio'), (7, 'river'), (8, 'tiger'), (9, 'green'), (10, 'clock'),
(11, 'train'), (12, 'shirt'), (13, 'storm'), (14, 'flame'), (15, 'plane'),
(16, 'money'), (17, 'dance'), (18, 'music'), (19, 'photo'), (20, 'phone'),
(21, 'creed'), (22, 'trial'), (23, 'drink'), (24, 'booze'), (25, 'crime'),
(26, 'legal');
