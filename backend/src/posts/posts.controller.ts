import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Request, Optional } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PostsService } from './posts.service';
import { Prisma } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createPostDto: Prisma.PostUncheckedCreateInput) {
    return this.postsService.create(createPostDto);
  }

  @Get()
  findAll(@Query('all') all?: string) {
    // ?all=true only works if caller passes it explicitly (dashboard does)
    const publishedOnly = all !== 'true';
    return this.postsService.findAll(publishedOnly);
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.postsService.findOne(slug);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: Prisma.PostUncheckedUpdateInput) {
    return this.postsService.update(+id, updatePostDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }
}
