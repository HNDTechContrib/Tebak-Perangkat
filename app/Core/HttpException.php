<?php
namespace App\Core;

use RuntimeException;

// Dilempar controller untuk membatalkan request dengan pesan error (mirip abort() di Laravel).
// Router menangkapnya lalu mengirim {"error": "..."} dengan kode HTTP yang sesuai.
class HttpException extends RuntimeException
{
    public function __construct(string $message, public int $status = 400)
    {
        parent::__construct($message);
    }
}
