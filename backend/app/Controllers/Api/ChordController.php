<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\ChordModel;
use App\Models\ChordRowModel;
use CodeIgniter\HTTP\Response;

class ChordController extends BaseController
{
    protected ChordModel $chordModel;
    protected ChordRowModel $chordRowModel;

    public function __construct()
    {
        $this->chordModel = new ChordModel();
        $this->chordRowModel = new ChordRowModel();
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $chords = $this->chordModel->findAll();
        return $this->response->setJSON($chords);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store()
    {
        $rules = [
            'song_id'    => 'required|integer|is_natural',
            'note'       => 'required|string',
            'chord_name' => 'required|string',
        ];

        if (!$this->validate($rules)) {
            return $this->response
                ->setStatusCode(Response::HTTP_BAD_REQUEST)
                ->setJSON(['errors' => $this->validator->getErrors()]);
        }

        $data = [
            'song_id'    => $this->request->getVar('song_id'),
            'note'       => $this->request->getVar('note'),
            'chord_name' => $this->request->getVar('chord_name'),
        ];

        $chordId = $this->chordModel->insert($data);

        if (!$chordId) {
            return $this->response
                ->setStatusCode(Response::HTTP_INTERNAL_SERVER_ERROR)
                ->setJSON(['message' => 'Failed to create chord']);
        }

        return $this->response
            ->setStatusCode(Response::HTTP_CREATED)
            ->setJSON($this->chordModel->find($chordId));
    }

    /**
     * Display the specified resource.
     */
    public function show($id = null)
    {
        $chord = $this->chordModel->find($id);

        if (!$chord) {
            return $this->response
                ->setStatusCode(Response::HTTP_NOT_FOUND)
                ->setJSON(['message' => 'Chord not found']);
        }

        return $this->response->setJSON($chord);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update($id = null)
    {
        $chord = $this->chordModel->find($id);

        if (!$chord) {
            return $this->response
                ->setStatusCode(Response::HTTP_NOT_FOUND)
                ->setJSON(['message' => 'Chord not found']);
        }

        $rules = [
            'note'       => 'permit_empty|string',
            'chord_name' => 'permit_empty|string',
        ];

        if (!$this->validate($rules)) {
            return $this->response
                ->setStatusCode(Response::HTTP_BAD_REQUEST)
                ->setJSON(['errors' => $this->validator->getErrors()]);
        }

        $data = [];
        if ($this->request->getVar('note')) {
            $data['note'] = $this->request->getVar('note');
        }
        if ($this->request->getVar('chord_name')) {
            $data['chord_name'] = $this->request->getVar('chord_name');
        }

        $this->chordModel->update($id, $data);

        return $this->response->setJSON($this->chordModel->find($id));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function delete($id = null)
    {
        $chord = $this->chordModel->find($id);

        if (!$chord) {
            return $this->response
                ->setStatusCode(Response::HTTP_NOT_FOUND)
                ->setJSON(['message' => 'Chord not found']);
        }

        $this->chordModel->delete($id);

        return $this->response->setStatusCode(Response::HTTP_NO_CONTENT);
    }

    /**
     * Store chord row
     */
    public function storeChordRow()
    {
        $rules = [
            'song_id'   => 'required|integer|is_natural',
            'row_index' => 'required|integer',
            'chords'    => 'permit_empty|is_array',
        ];

        if (!$this->validate($rules)) {
            return $this->response
                ->setStatusCode(Response::HTTP_BAD_REQUEST)
                ->setJSON(['errors' => $this->validator->getErrors()]);
        }

        $data = [
            'song_id'   => $this->request->getVar('song_id'),
            'row_index' => $this->request->getVar('row_index'),
            'chords'    => $this->request->getVar('chords'),
        ];

        $chordRowId = $this->chordRowModel->insert($data);

        if (!$chordRowId) {
            return $this->response
                ->setStatusCode(Response::HTTP_INTERNAL_SERVER_ERROR)
                ->setJSON(['message' => 'Failed to create chord row']);
        }

        return $this->response
            ->setStatusCode(Response::HTTP_CREATED)
            ->setJSON($this->chordRowModel->find($chordRowId));
    }

    /**
     * Update chord row
     */
    public function updateChordRow($id = null)
    {
        $chordRow = $this->chordRowModel->find($id);

        if (!$chordRow) {
            return $this->response
                ->setStatusCode(Response::HTTP_NOT_FOUND)
                ->setJSON(['message' => 'Chord row not found']);
        }

        $rules = [
            'row_index' => 'permit_empty|integer',
            'chords'    => 'permit_empty|is_array',
        ];

        if (!$this->validate($rules)) {
            return $this->response
                ->setStatusCode(Response::HTTP_BAD_REQUEST)
                ->setJSON(['errors' => $this->validator->getErrors()]);
        }

        $data = [];
        if ($this->request->getVar('row_index') !== null) {
            $data['row_index'] = $this->request->getVar('row_index');
        }
        if ($this->request->getVar('chords') !== null) {
            $data['chords'] = $this->request->getVar('chords');
        }

        $this->chordRowModel->update($id, $data);

        return $this->response->setJSON($this->chordRowModel->find($id));
    }

    /**
     * Delete chord row
     */
    public function deleteChordRow($id = null)
    {
        $chordRow = $this->chordRowModel->find($id);

        if (!$chordRow) {
            return $this->response
                ->setStatusCode(Response::HTTP_NOT_FOUND)
                ->setJSON(['message' => 'Chord row not found']);
        }

        $this->chordRowModel->delete($id);

        return $this->response->setStatusCode(Response::HTTP_NO_CONTENT);
    }
}
