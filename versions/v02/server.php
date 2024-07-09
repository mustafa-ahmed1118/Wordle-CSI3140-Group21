<?php
session_start();

header('Content-Type: application/json');

function getRandomWord() {
    $words = [
        "house", "apple", "bread", "earth", "beach",
        "radio", "river", "tiger", "green", "clock",
        "train", "shirt", "storm", "flame", "plane",
        "money", "dance", "music", "photo", "phone",
        "creed", "trial", "drink", "booze", "crime", "legal"
    ];
    return $words[array_rand($words)];
}
?>
