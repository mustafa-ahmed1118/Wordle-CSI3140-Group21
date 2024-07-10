<?php
session_start();

function startGame()
{
    $wordList = [
        "house",
        "apple",
        "bread",
        "earth",
        "beach",
        "radio",
        "river",
        "tiger",
        "green",
        "clock",
        "train",
        "shirt",
        "storm",
        "flame",
        "plane",
        "money",
        "dance",
        "music",
        "photo",
        "phone",
        "creed",
        "trial",
        "drink",
        "booze",
        "crime",
        "legal"
    ];
    $_SESSION['word'] = $wordList[array_rand($wordList)];
    $_SESSION['grid'] = array_fill(0, 6, array_fill(0, 5, ['letter' => '', 'state' => '']));
    $_SESSION['currentRow'] = 0;
    $_SESSION['currentCol'] = 0;

    echo json_encode([
        'word' => $_SESSION['word'],
        'grid' => $_SESSION['grid'],
    ]);
}

function submitGuess()
{
    $guess = $_POST['guess'];
    $currentRow = $_SESSION['currentRow'];

    if (strlen($guess) != 5) {
        echo json_encode(['error' => 'Guess must be 5 letters']);
        return;
    }

    for ($x = 0; $x < 5; $x++) {
        $letter = $guess[$x];
        $numberOfOccurrencesSecret = substr_count($_SESSION['word'], $letter);
        $numberOfOccurrencesGuess = substr_count($guess, $letter);
        $letterPosition = substr_count(substr($guess, 0, $x + 1), $letter);

        if ($numberOfOccurrencesGuess > $numberOfOccurrencesSecret && $letterPosition > $numberOfOccurrencesSecret) {
            $_SESSION['grid'][$currentRow][$x] = ['letter' => $letter, 'state' => 'empty'];
        } else {
            if ($letter === $_SESSION['word'][$x]) {
                $_SESSION['grid'][$currentRow][$x] = ['letter' => $letter, 'state' => 'right'];
            } elseif (strpos($_SESSION['word'], $letter) !== false) {
                $_SESSION['grid'][$currentRow][$x] = ['letter' => $letter, 'state' => 'wrong'];
            } else {
                $_SESSION['grid'][$currentRow][$x] = ['letter' => $letter, 'state' => 'empty'];
            }
        }
    }

    if ($guess === $_SESSION['word']) {
        echo json_encode(['result' => 'win', 'grid' => $_SESSION['grid']]);
        return;
    } elseif ($currentRow === 5) {
        echo json_encode(['result' => 'lose', 'word' => $_SESSION['word'], 'grid' => $_SESSION['grid']]);
        return;
    }

    $_SESSION['currentRow']++;
    $_SESSION['currentCol'] = 0;
    echo json_encode(['result' => 'next', 'grid' => $_SESSION['grid']]);
}

function typeLetter($letter)
{
    $currentRow = $_SESSION['currentRow'];
    $currentCol = $_SESSION['currentCol'];

    if ($currentCol < 5) {
        $_SESSION['grid'][$currentRow][$currentCol] = ['letter' => $letter, 'state' => ''];
        $_SESSION['currentCol']++;
    }

    echo json_encode([
        'grid' => $_SESSION['grid']
    ]);
}

function handleBackspace()
{
    $currentRow = $_SESSION['currentRow'];
    $currentCol = $_SESSION['currentCol'];

    if ($currentCol > 0) {
        $_SESSION['currentCol']--;
        $_SESSION['grid'][$currentRow][$_SESSION['currentCol']] = ['letter' => '', 'state' => ''];
    }

    echo json_encode([
        'grid' => $_SESSION['grid']
    ]);
}

function getGameState()
{
    echo json_encode([
        'word' => $_SESSION['word'],
        'grid' => $_SESSION['grid']
    ]);
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $action = $_POST['action'];
    if ($action == 'start_game') {
        startGame();
    } elseif ($action == 'submit_guess') {
        submitGuess();
    } elseif ($action == 'type_letter') {
        $letter = $_POST['letter'];
        typeLetter($letter);
    } elseif ($action == 'backspace') {
        handleBackspace();
    } elseif ($action == 'get_game_state') {
        getGameState();
    }
}
?>