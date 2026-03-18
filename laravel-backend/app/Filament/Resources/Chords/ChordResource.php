<?php

namespace App\Filament\Resources\Chords;

use App\Filament\Resources\Chords\Pages\CreateChord;
use App\Filament\Resources\Chords\Pages\EditChord;
use App\Filament\Resources\Chords\Pages\ListChords;
use App\Filament\Resources\Chords\Schemas\ChordForm;
use App\Filament\Resources\Chords\Tables\ChordsTable;
use App\Models\Chord;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class ChordResource extends Resource
{
    protected static ?string $model = Chord::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return ChordForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return ChordsTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListChords::route('/'),
            'create' => CreateChord::route('/create'),
            'edit' => EditChord::route('/{record}/edit'),
        ];
    }
}
