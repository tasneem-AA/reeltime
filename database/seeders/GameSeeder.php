<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Game;
use App\Models\Question;

class GameSeeder extends Seeder
{
    public function run(): void
    {
        // Create Games
        $games = [
            [
                'title' => 'Emoji Challenge',
                'description' => 'Guess movies from emoji combinations',
                'game_type' => 'guess',
                'icon' => 'fa-theater-masks',
            ],
            [
                'title' => 'Character Match',
                'description' => 'Match characters to their movies',
                'game_type' => 'character',
                'icon' => 'fa-users',
            ],
            [
                'title' => 'Movie Quotes',
                'description' => 'Identify movies from famous quotes',
                'game_type' => 'quotes',
                'icon' => 'fa-quote-right',
            ],
            [
                'title' => 'Movie Scenes',
                'description' => 'Guess movies from scene descriptions',
                'game_type' => 'scenes',
                'icon' => 'fa-film',
            ],
        ];

        $createdGames = [];
        foreach ($games as $gameData) {
            $createdGames[$gameData['game_type']] = Game::create($gameData);
        }

        // Emoji Challenge Questions
        $guessQuestions = [
            [
                'question_text' => 'Which movie is represented by these emojis?',
                'emoji' => '👸🎀💖',
                'options' => json_encode(["Barbie", "White Chicks", "The Princess and the Frog", "Frozen"]),
                'correct_answer' => 'Barbie',
                'hint' => 'Life in this land is perfect until an existential crisis',
                'points' => 10,
            ],
            [
                'question_text' => 'Which movie is represented by these emojis?',
                'emoji' => '🚀🌌⏰',
                'options' => json_encode(["The Martian", "Avatar", "Interstellar", "Gravity"]),
                'correct_answer' => 'Interstellar',
                'hint' => 'Explorers travel through a wormhole to save humanity',
                'points' => 10,
            ],
            [
                'question_text' => 'Which movie is represented by these emojis?',
                'emoji' => '🤡🎈😱',
                'options' => json_encode(["IT", "The Conjuring 2", "Truth or Dare", "Split"]),
                'correct_answer' => 'IT',
                'hint' => 'Ancient evil that emerges every 27 years',
                'points' => 10,
            ],
            [
                'question_text' => 'Which movie is represented by these emojis?',
                'emoji' => '👯‍♀️👸🏼🕵️‍♀️',
                'options' => json_encode(["Barbie", "White Chicks", "Mean Girls", "Split"]),
                'correct_answer' => 'White Chicks',
                'hint' => 'FBI agents undercover as heiresses',
                'points' => 10,
            ],
            [
                'question_text' => 'Which movie is represented by these emojis?',
                'emoji' => '🦖🌴⚡',
                'options' => json_encode(["The Forest", "Avatar", "Predator: Badlands", "Jurassic World Rebirth"]),
                'correct_answer' => 'Jurassic World Rebirth',
                'hint' => 'Next chapter in the dinosaur saga',
                'points' => 10,
            ],
            [
                'question_text' => 'Which movie is represented by these emojis?',
                'emoji' => '🦸‍♂️🔴🔵',
                'options' => json_encode(["SuperMan", "Avengers", "Batman", "Iron Man"]),
                'correct_answer' => 'SuperMan',
                'hint' => 'DC universe with epic action and heart',
                'points' => 10,
            ],
            [
                'question_text' => 'Which movie is represented by these emojis?',
                'emoji' => '👺🦊🔓',
                'options' => json_encode(["Split", "Bad Guys", "Truth or Dare", "The Running Man"]),
                'correct_answer' => 'Bad Guys',
                'hint' => 'Reformed animal outlaws on a globe-trotting heist',
                'points' => 10,
            ],
            [
                'question_text' => 'Which movie is represented by these emojis?',
                'emoji' => '🔢⏰💀',
                'options' => json_encode(["Countdown", "Split", "Truth or Dare", "The Conjuring 2"]),
                'correct_answer' => 'Countdown',
                'hint' => 'Mysterious app that counts down to users\' deaths',
                'points' => 10,
            ],
        ];

        foreach ($guessQuestions as $q) {
            $createdGames['guess']->questions()->create($q);
        }

        // Character Match Questions
        $characterQuestions = [
            [
                'question_text' => 'Which movie features this character?',
                'character' => 'Pennywise',
                'options' => json_encode(["IT", "The Conjuring 2", "Black Phone2", "Truth or Dare"]),
                'correct_answer' => 'IT',
                'points' => 10,
            ],
            [
                'question_text' => 'Which movie features this character?',
                'character' => 'Cooper',
                'options' => json_encode(["The Martian", "Avatar", "Interstellar", "Gravity"]),
                'correct_answer' => 'Interstellar',
                'points' => 10,
            ],
            [
                'question_text' => 'Which movie features this character?',
                'character' => 'Kevin Wendell Crumb',
                'options' => json_encode(["Split", "IT", "Black Phone2", "The Conjuring 2"]),
                'correct_answer' => 'Split',
                'points' => 10,
            ],
            [
                'question_text' => 'Which movie features this character?',
                'character' => 'Marcus Copeland',
                'options' => json_encode(["Bad Guys", "White Chicks", "Split", "Barbie"]),
                'correct_answer' => 'White Chicks',
                'points' => 10,
            ],
            [
                'question_text' => 'Which movie features this character?',
                'character' => 'Mr. Wolf',
                'options' => json_encode(["Predator: Badlands", "White Chicks", "The Running Man", "Bad Guys"]),
                'correct_answer' => 'Bad Guys',
                'points' => 10,
            ],
            [
                'question_text' => 'Which movie features this character?',
                'character' => 'Barbie',
                'options' => json_encode(["Barbie", "White Chicks", "Mean Girls", "The Princess Diaries"]),
                'correct_answer' => 'Barbie',
                'points' => 10,
            ],
            [
                'question_text' => 'Which movie features this character?',
                'character' => 'The Grabber',
                'options' => json_encode(["IT", "Black Phone2", "The Conjuring 2", "Truth or Dare"]),
                'correct_answer' => 'Black Phone2',
                'points' => 10,
            ],
            [
                'question_text' => 'Which movie features this character?',
                'character' => 'Jake Sully',
                'options' => json_encode(["Interstellar", "Avatar", "The Martian", "Predator: Badlands"]),
                'correct_answer' => 'Avatar',
                'points' => 10,
            ],
        ];

        foreach ($characterQuestions as $q) {
            $createdGames['character']->questions()->create($q);
        }

        // Movie Quotes Questions
        $quotesQuestions = [
            [
                'question_text' => 'Which movie is this quote from?',
                'quote' => 'Life in Barbie Land is to be a perfect being in a perfect place. Unless you have a full-on existential crisis.',
                'options' => json_encode(["The Princess Diaries", "White Chicks", "Mean Girls", "Barbie"]),
                'correct_answer' => 'Barbie',
                'points' => 10,
            ],
            [
                'question_text' => 'Which movie is this quote from?',
                'quote' => 'We used to look up at the sky and wonder at our place in the stars.',
                'options' => json_encode(["Interstellar", "Avatar", "The Martian", "Gravity"]),
                'correct_answer' => 'Interstellar',
                'points' => 10,
            ],
            [
                'question_text' => 'Which movie is this quote from?',
                'quote' => 'The broken are the more evolved.',
                'options' => json_encode(["Black Phone2", "IT", "Split", "The Conjuring 2"]),
                'correct_answer' => 'Split',
                'points' => 10,
            ],
            [
                'question_text' => 'Which movie is this quote from?',
                'quote' => 'A simple game of truth or dare turns deadly for a group of friends.',
                'options' => json_encode(["Countdown", "Split", "Truth or Dare", "The Forest"]),
                'correct_answer' => 'Truth or Dare',
                'points' => 10,
            ],
            [
                'question_text' => 'Which movie is this quote from?',
                'quote' => 'The now reformed Bad Guys get dragged into a globe-trotting heist.',
                'options' => json_encode(["Bad Guys", "White Chicks", "The Running Man", "Predator: Badlands"]),
                'correct_answer' => 'Bad Guys',
                'points' => 10,
            ],
            [
                'question_text' => 'Which movie is this quote from?',
                'quote' => 'A mysterious app counts down to its users\' deaths.',
                'options' => json_encode(["Black Phone2", "Split", "Truth or Dare", "Countdown"]),
                'correct_answer' => 'Countdown',
                'points' => 10,
            ],
            [
                'question_text' => 'Which movie is this quote from?',
                'quote' => 'A young Predator outcast from his clan finds an unlikely ally.',
                'options' => json_encode(["Predator: Badlands", "Avatar", "Interstellar", "The Running Man"]),
                'correct_answer' => 'Predator: Badlands',
                'points' => 10,
            ],
            [
                'question_text' => 'Which movie is this quote from?',
                'quote' => 'Ed and Lorraine Warren investigate a terrifying haunting in north London.',
                'options' => json_encode(["IT", "The Conjuring 2", "Black Phone2", "Truth or Dare"]),
                'correct_answer' => 'The Conjuring 2',
                'points' => 10,
            ],
        ];

        foreach ($quotesQuestions as $q) {
            $createdGames['quotes']->questions()->create($q);
        }

        // Movie Scenes Questions
        $scenesQuestions = [
            [
                'question_text' => 'Which movie features this scene?',
                'scene' => 'A group of kids in a small town face their fears when an ancient evil clown returns to feed on their terror every 27 years.',
                'options' => json_encode(["Truth or Dare", "The Conjuring 2", "IT", "The Forest"]),
                'correct_answer' => 'IT',
                'points' => 10,
            ],
            [
                'question_text' => 'Which movie features this scene?',
                'scene' => 'Two FBI agents go undercover as wealthy white heiresses, leading to hilarious misunderstandings and cultural clashes.',
                'options' => json_encode(["Bad Guys", "White Chicks", "Barbie", "Split"]),
                'correct_answer' => 'White Chicks',
                'points' => 10,
            ],
            [
                'question_text' => 'Which movie features this scene?',
                'scene' => 'A team of explorers travel through a wormhole in search of a new habitable planet to save humanity from extinction.',
                'options' => json_encode(["Interstellar", "Avatar", "The Martian", "Gravity"]),
                'correct_answer' => 'Interstellar',
                'points' => 10,
            ],
            [
                'question_text' => 'Which movie features this scene?',
                'scene' => 'A perfect doll living in a perfect world suddenly starts having thoughts about death and the meaning of existence.',
                'options' => json_encode(["The Princess Diaries", "White Chicks", "Mean Girls", "Barbie"]),
                'correct_answer' => 'Barbie',
                'points' => 10,
            ],
            [
                'question_text' => 'Which movie features this scene?',
                'scene' => 'A man with 24 distinct personalities kidnaps three teenage girls, each personality having its own agenda and abilities.',
                'options' => json_encode(["IT", "Split", "Black Phone2", "The Conjuring 2"]),
                'correct_answer' => 'Split',
                'points' => 10,
            ],
            [
                'question_text' => 'Which movie features this scene?',
                'scene' => 'Reformed animal criminals are forced back into their old ways when they\'re framed for a crime they didn\'t commit.',
                'options' => json_encode(["Predator: Badlands", "White Chicks", "The Running Man", "Bad Guys"]),
                'correct_answer' => 'Bad Guys',
                'points' => 10,
            ],
            [
                'question_text' => 'Which movie features this scene?',
                'scene' => 'A marine becomes emotionally connected to the alien world of Pandora and must choose between orders and protecting his new home.',
                'options' => json_encode(["Avatar", "Interstellar", "The Martian", "Predator: Badlands"]),
                'correct_answer' => 'Avatar',
                'points' => 10,
            ],
            [
                'question_text' => 'Which movie features this scene?',
                'scene' => 'A deadly competition where contestants must survive being hunted on live television for a chance at freedom and riches.',
                'options' => json_encode(["Split", "Countdown", "Truth or Dare", "The Running Man"]),
                'correct_answer' => 'The Running Man',
                'points' => 10,
            ],
        ];

        foreach ($scenesQuestions as $q) {
            $createdGames['scenes']->questions()->create($q);
        }
    }
}

