import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

import { AuthorService } from './author.service';
import { Author } from './entities/author.entity';
import { LogsService } from 'src/logs/logs.service';

@ApiTags('author')
@Controller('author')
export class AuthorController {
    constructor(
        private readonly authorService: AuthorService,
        private readonly logsService: LogsService
    ) {}

    @ApiOperation({ summary: 'Get all authors' })
    @Get()
    findAll(): Promise<Author[]> {
        return this.authorService.findAll();
    }

    @ApiOperation({ summary: 'Get an author by ID' })
    @ApiParam({ name: 'id', required: true })
    @Get(':id')
    findOne(id: string): Promise<Author> {
        return this.authorService.findOne(id);
    }

    @ApiOperation({ summary: 'Create an author' })
    @ApiBody({ type: Author })
    @Post()
    async create(@Body() author: Author) {
        const createdAuthor = await this.authorService.create(author);
        await this.logsService.createLog('create', 'author', createdAuthor.id);
        return createdAuthor;
    }

    @ApiOperation({ summary: 'Update an author by ID' })
    @ApiParam({ name: 'id', required: true })
    @ApiBody({ type: Author })
    @Patch(':id')
    async update(@Body() author: Author, @Param('id') id: string) {
        const updatedAuthor = await this.authorService.update(id, author);
        await this.logsService.createLog('update', 'author', updatedAuthor.id);
        return updatedAuthor;
    }

    @ApiOperation({ summary: 'Delete an author by ID' })
    @ApiParam({ name: 'id', required: true })
    @Delete(':id')
    async remove(@Param('id') id: string) {
        await this.authorService.remove(id);
        await this.logsService.createLog('delete', 'author', id);
    }
}
