<?php

namespace App\Filament\Resources\Chords\Pages;

use App\Filament\Resources\Chords\ChordResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditChord extends EditRecord
{
    protected static string $resource = ChordResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
