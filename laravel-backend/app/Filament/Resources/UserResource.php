<?php

namespace App\Filament\Resources;

use App\Filament\Resources\UserResource\Pages;
use App\Models\User;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class UserResource extends Resource
{
    protected static ?string $model = User::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedUsers;

    protected static ?string $navigationLabel = 'Users';
    protected static ?int $navigationSort = 10;

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                \Filament\Tables\Columns\TextColumn::make('id')
                    ->sortable()
                    ->searchable(),
                \Filament\Tables\Columns\TextColumn::make('name')
                    ->searchable(),
                \Filament\Tables\Columns\TextColumn::make('email')
                    ->searchable(),
                \Filament\Tables\Columns\IconColumn::make('email_verified_at')
                    ->label('Verified')
                    ->boolean()
                    ->getStateUsing(fn ($record) => $record->email_verified_at !== null),
                \Filament\Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable(),
            ])
            ->filters([
                \Filament\Tables\Filters\TrashedFilter::make(),
            ])
            ->actions([
                \Filament\Tables\Actions\EditAction::make(),
                \Filament\Tables\Actions\DeleteAction::make(),
                \Filament\Tables\Actions\ForceDeleteAction::make(),
                \Filament\Tables\Actions\RestoreAction::make(),
            ])
            ->bulkActions([
                \Filament\Tables\Actions\BulkActionGroup::make([
                    \Filament\Tables\Actions\DeleteBulkAction::make(),
                    \Filament\Tables\Actions\RestoreBulkAction::make(),
                    \Filament\Tables\Actions\ForceDeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListUsers::route('/'),
            'create' => Pages\CreateUser::route('/create'),
            'edit' => Pages\EditUser::route('/{record}/edit'),
        ];
    }
}
