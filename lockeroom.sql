create database lockerr;
use lockerr;

CREATE TABLE Users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  password VARCHAR(255) NOT NULL, -- You should use encryption for password storage in a real application
  email VARCHAR(100) NOT NULL
);

CREATE TABLE MessageLobbies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  team_id INT NOT NULL,
  lobby_name VARCHAR(100) NOT NULL,
  created_by INT NOT NULL,
  created_at DATETIME NOT NULL,
  -- other relevant message lobby information...
  FOREIGN KEY (team_id) REFERENCES Teams(id),
  FOREIGN KEY (created_by) REFERENCES Users(id)
);

CREATE TABLE Messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lobby_id INT NOT NULL,
  message_text TEXT NOT NULL,
  sender_id INT NOT NULL,
  sent_at DATETIME NOT NULL,
  -- other relevant message information...
  FOREIGN KEY (lobby_id) REFERENCES MessageLobbies(id),
  FOREIGN KEY (sender_id) REFERENCES Users(id)
);

CREATE TABLE Coaches (
  id INT AUTO_INCREMENT PRIMARY KEY,
  coach_name VARCHAR(50) NOT NULL,
  coach_email VARCHAR(100) NOT NULL
  -- other relevant coach information...
);


