-- /db/seed.sql
-- Seed data for Language Learning Adventure (PostgreSQL)

BEGIN;

-- USERS
INSERT INTO "user" (user_id, email, display_name, created_at) VALUES
  (1, 'jaxon@example.com', 'Jaxon', NOW() - INTERVAL '10 days'),
  (2, 'emma@example.com',  'Emma',  NOW() - INTERVAL '8 days');

-- STREAKS (optional 1:1)
INSERT INTO user_streak (user_id, streak_count, last_activity_date) VALUES
  (1, 4, CURRENT_DATE),
  (2, 1, CURRENT_DATE - INTERVAL '1 day');

-- WORDS
INSERT INTO word (word_id, term, definition, phonetic, audio_url) VALUES
  (1, 'application', 'A formal request or a software program used for a purpose.', 'ap-li-KAY-shun', NULL),
  (2, 'employee',    'A person who works for an organization in return for payment.', 'em-PLOY-ee', NULL),
  (3, 'schedule',    'A plan for carrying out a process or procedure, giving lists of intended events and times.', 'SKED-jool', NULL),
  (4, 'persist',     'To continue to exist; in data, to be saved and remain after closing an app.', 'per-SIST', NULL),
  (5, 'adventure',   'An unusual and exciting experience or activity.', 'ad-VEN-cher', NULL);

-- USER WORD PROGRESS
-- (This table is great for your “one working button”)
INSERT INTO user_word_progress (user_word_id, user_id, word_id, status, times_seen, last_seen_at) VALUES
  (1, 1, 1, 'learning', 2, NOW() - INTERVAL '2 days'),
  (2, 1, 2, 'new',      0, NULL),
  (3, 1, 3, 'mastered', 6, NOW() - INTERVAL '1 day'),
  (4, 2, 1, 'new',      0, NULL),
  (5, 2, 5, 'learning', 1, NOW() - INTERVAL '3 days');

-- PASSAGES
INSERT INTO passage (passage_id, title, body_text, reading_level, audio_url) VALUES
  (1, 'A Busy Day', 
   'Today I have a busy schedule. I open my application and review my tasks. I want my progress to persist after I close the app.',
   1,
   NULL),
  (2, 'At Work',
   'An employee works with a team. They finish a project and celebrate. Learning new words makes work easier.',
   2,
   NULL);

-- PASSAGE WORD (junction)
INSERT INTO passage_word (passage_word_id, passage_id, word_id) VALUES
  (1, 1, 1), -- application
  (2, 1, 3), -- schedule
  (3, 1, 4), -- persist
  (4, 2, 2), -- employee
  (5, 2, 5); -- adventure (just to link it somewhere)

-- USER READING PROGRESS
INSERT INTO user_reading_progress (user_reading_id, user_id, passage_id, percent_complete, completed_at) VALUES
  (1, 1, 1, 80, NULL),
  (2, 1, 2, 100, NOW() - INTERVAL '5 days'),
  (3, 2, 1, 20, NULL);

-- ADVENTURE
INSERT INTO adventure (adventure_id, name, description) VALUES
  (1, 'The Market Quest', 'Practice simple choices and vocabulary in a short text adventure.');

-- SCENES
INSERT INTO scene (scene_id, adventure_id, prompt_text, image_url, is_end) VALUES
  (1, 1, 'You enter a lively market. A vendor greets you and offers two items. What do you do?', NULL, FALSE),
  (2, 1, 'You choose the fruit. The vendor smiles and teaches you a new word: "employee".', NULL, FALSE),
  (3, 1, 'You choose the bread. You learn the word "application" from a sign at the stall.', NULL, FALSE),
  (4, 1, 'You thank the vendor and continue your adventure another day.', NULL, TRUE);

-- CHOICES (branching)
INSERT INTO choice (choice_id, scene_id, choice_text, next_scene_id) VALUES
  (1, 1, 'Buy fruit', 2),
  (2, 1, 'Buy bread', 3),
  (3, 2, 'Continue walking', 4),
  (4, 3, 'Continue walking', 4);

-- USER ADVENTURE STATE
INSERT INTO user_adventure_state (user_adventure_id, user_id, adventure_id, current_scene_id, last_updated_at) VALUES
  (1, 1, 1, 1, NOW() - INTERVAL '1 day'),
  (2, 2, 1, 2, NOW() - INTERVAL '2 days');

COMMIT;