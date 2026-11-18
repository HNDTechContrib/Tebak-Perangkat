<?php
namespace App\Controllers;

use App\Core\DB;
use App\Services\QuestionImporter;
use App\Services\TemplateGenerator;
use Throwable;

// Halaman web dan API untuk mengimpor dan mengekspor bank soal via Excel.
class ImportController extends Controller
{
    // GET /import
    public function index(): string
    {
        $deviceCount = (int) DB::value("SELECT COUNT(*) FROM devices WHERE is_active = 1");
        $abbrCount = (int) DB::value("SELECT COUNT(*) FROM abbreviations WHERE is_active = 1");
        $categories = DB::select("SELECT category, COUNT(*) as total FROM devices WHERE is_active = 1 GROUP BY category ORDER BY category ASC");

        return view('import', [
            'deviceCount' => $deviceCount,
            'abbrCount'   => $abbrCount,
            'categories'  => $categories,
        ]);
    }

    // GET /import/template
    public function template(): string
    {
        $tmpFile = tempnam(sys_get_temp_dir(), 'tpl_') . '.xlsx';
        TemplateGenerator::createTemplate($tmpFile);

        if (ob_get_level()) ob_end_clean();
        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header('Content-Disposition: attachment; filename="template_soal_tebak_perangkat.xlsx"');
        header('Content-Length: ' . filesize($tmpFile));
        header('Cache-Control: max-age=0, must-revalidate');
        header('Pragma: public');
        readfile($tmpFile);
        @unlink($tmpFile);
        exit;
    }

    // GET /import/export
    public function export(): string
    {
        $tmpFile = tempnam(sys_get_temp_dir(), 'exp_') . '.xlsx';
        TemplateGenerator::exportCurrentQuestions($tmpFile);

        if (ob_get_level()) ob_end_clean();
        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header('Content-Disposition: attachment; filename="soal_tebak_perangkat_' . date('Ymd_His') . '.xlsx"');
        header('Content-Length: ' . filesize($tmpFile));
        header('Cache-Control: max-age=0, must-revalidate');
        header('Pragma: public');
        readfile($tmpFile);
        @unlink($tmpFile);
        exit;
    }

    // POST /api/import
    public function upload(): array
    {
        if (empty($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
            $this->fail('Pilih file Excel (.xlsx) atau CSV (.csv) untuk diunggah.');
        }

        $tmpName = $_FILES['file']['tmp_name'];
        $origName = $_FILES['file']['name'];
        $ext = strtolower(pathinfo($origName, PATHINFO_EXTENSION));

        if (!in_array($ext, ['xlsx', 'csv'], true)) {
            $this->fail('Hanya file berekstensi .xlsx atau .csv yang didukung.');
        }

        $mode = ($_POST['mode'] ?? 'upsert') === 'replace' ? 'replace' : 'upsert';

        // Pindahkan sementara dengan ekstensi aslinya agar ExcelReader mengenali formatnya
        $dest = tempnam(sys_get_temp_dir(), 'up_') . '.' . $ext;
        if (!move_uploaded_file($tmpName, $dest)) {
            $this->fail('Gagal menyimpan file upload sementara.');
        }

        try {
            $res = QuestionImporter::importFile($dest, $mode);
            @unlink($dest);
            return ['ok' => true, 'result' => $res];
        } catch (Throwable $e) {
            @unlink($dest);
            $this->fail($e->getMessage());
        }
    }
}
