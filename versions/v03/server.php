<?php
session_start();

function startGame()
{
    $dbconn = new mysqli("127.0.0.1", "root", "--", "wordle_game", 3306);
    if ($dbconn->connect_error) {
        echo json_encode(["error" => "Connection failed: " . $dbconn->connect_error]);
        exit;
    }
    $result = $dbconn->query("SELECT word FROM wordlist ORDER BY RAND() LIMIT 1");
    if (!$result) {
        echo json_encode(["error" => "Query failed: " . $dbconn->error]);
        exit;
    }
    $row = $result->fetch_assoc();
    $word = $row['word'] ?? null;
    if (!$word) {
        echo json_encode(["error" => "No word found"]);
        exit;
    }

    $_SESSION['word'] = $word;
    $_SESSION['grid'] = array_fill(0, 6, array_fill(0, 5, ['letter' => '', 'state' => '']));
    $_SESSION['currentRow'] = 0;
    $_SESSION['currentCol'] = 0;

    $sql2 = "SELECT Name, Score FROM Leaderboard";
    $result2 = $dbconn->query($sql2);
    unset($_SESSION["scoreboard"]);
    $_SESSION["scoreboard"][] = $result2->fetch_all();

    if (!isset($_SESSION['name'])) {
        $_SESSION['name'] = strval($_POST['name']);
    }

    if (!isset($_SESSION['streak'])) {
        $_SESSION['streak'] = 0;
    }
    if (!isset($_SESSION['streakValues'])) {
        $_SESSION['streakValues'] = [];
    }

    if (isset($_SESSION['resetStreakOnReload']) && $_SESSION['resetStreakOnReload'] === true) {
        $_SESSION['resetStreakOnReload'] = false;
    }

    echo json_encode([
        'word' => $_SESSION['word'],
        'grid' => $_SESSION['grid'],
        'streak' => $_SESSION['streak'],
        'streakValues' => $_SESSION['streakValues'],
        'scoreboard' => $_SESSION['scoreboard']
    ]);
}

function submitGuess()
{
    $dbconn = new mysqli("127.0.0.1", "root", "juswan07?", "wordle_game", 3306);
    $guess = $_POST['guess'] ?? '';
    $currentRow = $_SESSION['currentRow'] ?? 0;

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
        $_SESSION['streak']++;
        echo json_encode(['result' => 'win', 'grid' => $_SESSION['grid']]);
        return;
    } elseif ($currentRow === 5) {
        if ($_SESSION['streak'] > 0) {
            $_SESSION['streakValues'][] = $_SESSION['streak'];
            $_SESSION['streak'] = 0;
        }
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

    echo json_encode(['grid' => $_SESSION['grid']]);
}

function handleBackspace()
{
    $currentRow = $_SESSION['currentRow'];
    $currentCol = $_SESSION['currentCol'];

    if ($currentCol > 0) {
        $_SESSION['currentCol']--;
        $_SESSION['grid'][$currentRow][$_SESSION['currentCol']] = ['letter' => '', 'state' => ''];
    }

    echo json_encode(['grid' => $_SESSION['grid']]);
}

function getGameState()
{
    echo json_encode([
        'word' => $_SESSION['word'],
        'grid' => $_SESSION['grid'],
        'streak' => $_SESSION['streak']
    ]);
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $action = $_POST['action'] ?? '';
    if ($action == 'start_game') {
        if (isset($_SESSION['streak'])) {
            $_SESSION['resetStreakOnReload'] = true;
        }
        startGame();
    } elseif ($action == 'submit_guess') {
        submitGuess();
    } elseif ($action == 'type_letter') {
        $letter = $_POST['letter'] ?? '';
        typeLetter($letter);
    } elseif ($action == 'backspace') {
        handleBackspace();
    } elseif ($action == 'get_game_state') {
        getGameState();
    }
}
?>
