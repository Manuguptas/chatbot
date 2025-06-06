<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");


// enter your gemini key
$apiKey = "YOUR_GEMINI_API_KEY";
$input = json_decode(file_get_contents("php://input"), true);
$prompt = trim($input["prompt"] ?? "");

if (!$prompt) {
  echo json_encode(["success" => false, "message" => "Prompt is empty"]);
  exit;
}

$payload = [
  "contents" => [[ "parts" => [[ "text" => $prompt ]]]]
];

$ch = curl_init("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=$apiKey");
curl_setopt_array($ch, [
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_POST => true,
  CURLOPT_HTTPHEADER => ["Content-Type: application/json"],
  CURLOPT_POSTFIELDS => json_encode($payload)
]);

$response = curl_exec($ch);
$err = curl_error($ch);
curl_close($ch);

if ($err) {
  echo json_encode(["success" => false, "message" => $err]);
} else {
  $json = json_decode($response, true);
  $text = $json["candidates"][0]["content"]["parts"][0]["text"] ?? "No response";
  echo json_encode(["success" => true, "response" => $text]);
}
