import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  create(createPostDto: any) {
    const { tags, ...rest } = createPostDto;
    
    if (!rest.slug && rest.title) {
      rest.slug = rest.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }
    
    return this.prisma.post.create({
      data: {
        ...rest,
        tags: tags && tags.length > 0 ? {
          connectOrCreate: tags.map((tag: string) => ({
            where: { name: tag },
            create: { name: tag }
          }))
        } : undefined
      }
    });
  }

  findAll(publishedOnly?: boolean) {
    const where = publishedOnly ? { published: true } : {};
    return this.prisma.post.findMany({
      where,
      include: { author: true, category: true, tags: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  findOne(slug: string) {
    return this.prisma.post.findUnique({
      where: { slug },
      include: { author: true, category: true, tags: true }
    });
  }

  update(id: number, updatePostDto: any) {
    const { tags, ...rest } = updatePostDto;
    return this.prisma.post.update({
      where: { id },
      data: {
        ...rest,
        tags: tags ? {
          set: [],
          connectOrCreate: tags.map((tag: string) => ({
            where: { name: tag },
            create: { name: tag }
          }))
        } : undefined
      }
    });
  }

  remove(id: number) {
    return this.prisma.post.delete({ where: { id } });
  }
}
