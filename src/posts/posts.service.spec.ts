import { Test, TestingModule } from '@nestjs/testing';
import { Post } from './entities/post.entity';
import { PostsService } from './posts.service';

describe('PostsService', () => {
  let service: PostsService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostsService],
    }).compile();

    service = module.get<PostsService>(PostsService);
  });

  it('should find no posts', () => {
    const result = service.findAll();
    expect(result).toEqual([]);
  });

  let id: number;
  it('creates post', () => {
    const result = service.create({
      title: 'First post!',
      content: 'Here we go!',
    });
    expect(typeof result.id).toBe('number');
    id = result.id;
  });

  it('should return created post', () => {
    const check = (post: Post) => {
      expect(post.id).toBe(id);
      expect(post.title).toBe('First post!');
      expect(post.content).toBe('Here we go!');
      expect(post.createdAt).toBeInstanceOf(Date);
      expect(post.updatedAt).toBeNull();
    };

    const all = service.findAll();
    expect(all).toHaveLength(1);
    check(all[0]);

    const one = service.findOne(id);
    check(one);
  });

  it("should not update nonexistent post", () => {
    expect(() => {
      service.update(123, {})
    }).toThrowError("No post with id 123")
  })

  it("should update post", () => {
      const result = service.update(id, {
        title: "New title!",
        content: "New content!",
      })
      expect(result.updatedAt).toBeInstanceOf(Date)
  })

  it('should return updated post', () => {
    const check = (post: Post) => {
      expect(post.id).toBe(id);
      expect(post.title).toBe('New title!');
      expect(post.content).toBe('New content!');
      expect(post.createdAt).toBeInstanceOf(Date);
      expect(post.updatedAt).toBeInstanceOf(Date);
      expect(post.updatedAt.getTime()).toBeGreaterThan(post.createdAt.getTime())
    };

    const all = service.findAll();
    expect(all).toHaveLength(1);
    check(all[0]);

    const one = service.findOne(id);
    check(one);
  });

  it('should remove post', () => {
    service.remove(id)
  })

  it('should not remove nonexistent post', () => {
    expect(() => {
      service.remove(123)
    }).toThrowError('No post with id 123')
  })

  it('should not return removed post', () => {
    const all = service.findAll();
    expect(all).toHaveLength(0)

    expect(() => {
      service.findOne(id);
    }).toThrowError(`No post with id ${id}`)
  }) 
});
