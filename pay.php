<?php

$merchantId = "27ae81f1-02aa-4c21-bc5e-11126955c0e4";
$secret = "az3nOZmY0hG8g25qMHYhBslP2N5RcW0kRopizxDfxBrgmgJhXaXpilNv0FRYHayNHG0NGJctlxiB2wgOGkxk35GnkzIPKYyJDXBd";

// берем сумму из URL
$amount = isset($_GET['amount']) ? floatval($_GET['amount']) : 100;

// данные платежа
$data = [
    "paymentMethod" => 2, // SBP QR
    "paymentDetails" => [
        "amount" => $amount,
        "currency" => "RUB"
    ],
    "description" => "Регистрация сертификата разработчика Apple Developer",
    "return" => "https://theappbox.io/success.html",
    "failedUrl" => "https://theappbox.io/fail.html",
    "payload" => "order_" . time()
];

$ch = curl_init("https://app.platega.io/transaction/process");

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);

curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Content-Type: application/json",
    "X-MerchantId: $merchantId",
    "X-Secret: $secret"
]);

curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));

$response = curl_exec($ch);

if (curl_errno($ch)) {
    die("Curl error: " . curl_error($ch));
}

curl_close($ch);

$result = json_decode($response, true);

// редирект на оплату
if (isset($result['redirect'])) {
    header("Location: " . $result['redirect']);
    exit;
}

echo "Ошибка создания платежа";
print_r($result);