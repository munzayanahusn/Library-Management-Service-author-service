import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Author } from './entities/author.entity';

@Injectable()
export class AuthorService {
    constructor(
        @InjectRepository(Author)
        private readonly authorRepository: Repository<Author>,
    ){}

    findAll(): Promise<Author[]> {
        return this.authorRepository.find();
    }

    async findOne(id: string): Promise<Author> {
        const author = await this.authorRepository.findOne({ where: { id } });
        if (!author) {
            throw new NotFoundException(`Author with ID ${id} not found`);
        }
        return author;
    }

    create(author: Author): Promise<Author> {
        return this.authorRepository.save(author);
    }

    async update(id: string, author: Author): Promise<Author> {
        await this.authorRepository.update(id, author);
        return this.findOne(id);
    }

    async remove(id: string): Promise<void> {
        await this.authorRepository.delete(id);
    }
}
