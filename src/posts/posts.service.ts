import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  posts: Post[] = [];

  create(createPostDto: CreatePostDto) {
    const id = Date.now();
    this.posts.push({
      id,
      title: createPostDto.title,
      content: createPostDto.content,
      createdAt: new Date(),
      updatedAt: null,
    });
    return { id };
  }

  findAll() {
    return this.posts;
  }

  findOne(id: number) {
    const post = this.posts.find((post) => post.id === id);
    if (!post) {
      throw new Error(`No post with id ${id}`);
    }
    return post
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    const post = this.findOne(id)
    const updatedAt = new Date();
    post.title = updatePostDto.title;
    post.content = updatePostDto.content;
    post.updatedAt = updatedAt;
    return { updatedAt };
  }

  remove(id: number) {
    this.findOne(id)
    this.posts = this.posts.filter(post => post.id !== id)
  }
}
